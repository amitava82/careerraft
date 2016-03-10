/**
 * Created by amitava on 08/02/16.
 */

var Sendgrid  = require('sendgrid');
var uuid = require('uuid');
var Promise = require('bluebird');
var _ = require('lodash');

module.exports = function(deps){

    var sendgrid = Sendgrid(deps.config.get('sendGrid'));

    return {

        oauthCallback: function(req, res, next){
            var returnUrl = req.session.return;
            if(returnUrl){
                delete req.session.return;
            }else{
                returnUrl = '/';
            }

            deps.passport.authenticate(req.params.module, {
                successRedirect: returnUrl,
                failureRedirect: '/login' }
            )(req, res, next)
        },

        /*
        Local strategy
         */
        login: function(req, res, next){
            req.session.return = req.query.return;
            deps.passport.authenticate(req.params.module, {scope: ['email']}, function(err, user,info){
                if(err){
                    deps.middleware.apiError(err, req, res);
                }else if(!user){
                    deps.middleware.apiError(new Error(info.message), req, res);
                }else{
                    req.login(user, loginErr => {
                        if (loginErr) {
                            return next(loginErr);
                        }
                        return res.send(user);
                    });
                }
            })(req, res, next);
        },

        logout: function(req, res){
            req.logout();
            res.redirect('/');
        },

        signup: function (req, res, next) {

            deps.models.User.count({email: req.body.email})
                .then(
                count => {
                    if(count > 0) throw new Error('An account with the email address exists');
                    return Promise.resolve();
                })
                .then(() => deps.models.User.createInvite(req.body))
                .then(
                    id => {
                        var grid = new sendgrid.Email({
                            to: req.body.email,
                            from: 'donotreplay@careerraft.com',
                            fromname: 'Careerraft',
                            subject: 'Confirm your Careerraft account',
                            html: ' ',
                            text: ' '
                        });

                        grid.setFilters({
                            templates: {
                                settings: {
                                    enable: 1,
                                    template_id: '649cfe4b-769c-44e5-b550-83aedf64f4a0'
                                }
                            }
                        });

                        grid.setSubstitutions({
                            '-code-': [id]
                        });

                        return sendgrid.send(grid, function (err) {
                            if(err) deps.log.error(err);
                        });
                    }
                )
                .then(
                    r => res.send('OK'),
                    e => deps.middleware.apiError(e, req, res)
                )
        },

        validate: function(req, res, next){
            var key = 'signup:' + req.params.code;

            deps.redis.get(key, function(err, data){
                if(err) return next(err);

                if(!data){
                    return res.status(400).redirect('/signup/error?code=NotFound');
                }

                var u = JSON.parse(data);

                deps.models.User.signup(u).then(
                    u => {
                        deps.redis.expire(key, 0, _.noop);
                        const user = u.toObject();
                        delete user.password;
                        delete user.salt;
                        req.login(user, loginErr => {
                            if (loginErr) {
                                return next(loginErr);
                            }
                            return res.redirect('/');
                        });
                    },
                    e => res.status(400).redirect('/signup/error?message='+e.message)
                )
            });
        },

        sendResetMail: function (req, res, next) {
            var id = uuid();
            var key = 'reset:'+ id;
            var template = 'c71c7556-677c-453a-9452-6baa05e0749b';

            deps.redis.set(key, req.body.email, function(err){
                if(err) return next(err);

                deps.redis.expire(key, 86400);

                var grid = new sendgrid.Email({
                    to: req.body.email,
                    from: 'donotreplay@careerraft.com',
                    fromname: 'Careerraft',
                    subject: 'Password reset',
                    html: ' ',
                    text: ' '
                });

                grid.setFilters({
                    templates: {
                        settings: {
                            enable: 1,
                            template_id: template
                        }
                    }
                });

                grid.setSubstitutions({
                    '-code-': [id]
                });

                return sendgrid.send(grid, function (err) {
                    if(err) return next(err);

                    res.send('OK');
                });

            })
        },

        resetPassword: function(req, res, next){
            var code = req.params.code;
            deps.redis.get('reset:'+code, function (err, email) {
                if(!email)  return renderError(res, Error('Invalid request. Reset request has been expired.'));

                deps.models.User.findOne({email: email}).then(
                    user => {
                        req.session._csrf = code;
                        res.render('reset-password', {title: 'Reset password - Careerraft', data: { code: code}})
                    }
                ).onReject(
                    e => renderError(res, e)
                )
            })
        },

        updatePassword: function(req, res){
            var code = req.session && req.session._csrf;
            if(!req.body.csrf || req.body.csrf !== code){
                return renderError(res, new Error('Invalid CSRF'))
            }

            if(!req.body.password || req.body.password !== req.body.confirmPassword)
                return res.render('reset-password', {title: 'Reset password - Careerraft', data: {code: code, error: 'Password do not match'}});

            deps.redis.get('reset:'+code, function (err, email) {
                if(!email) return renderError(res, new Error('Invalid request'));

                deps.models.User.updatePassword(email, req.body.password).then(
                    () => {
                        deps.redis.expire('reset:'+code, 0);
                        res.render('reset-password', {data: {success: true}, title: 'Reset password - Careerraft'});
                    },
                    e => renderError(res, e)
                )
            });
        }
    }
};

function renderError(res, e){
    res.render('error', {error: e.message, title: 'Error - Careerraft'})
}