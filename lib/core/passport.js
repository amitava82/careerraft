/**
 * Created by amitava on 09/02/16.
 */
var config = require('config');
var _ = require('lodash');
var url = require('url');
var passwordHelper = require('../helpers/password');

const SESSION_ITEMS = '';

module.exports = function(deps){
    var passport = require('passport');
    var FacebookStrategy = require('passport-facebook').Strategy;
    var GoogleStrategy = require('passport-google-oauth20').Strategy;
    var LocalStrategy = require('passport-local').Strategy;

    function callbackUrl(module){
        var port = deps.config.get('ui.port');
        return url.format({
            hostname: deps.config.get('ui.host'),
            port:  (port == 80 || port == 443) ? "" : deps.config.get('ui.port'),
            protocol: deps.config.get('ui.protocol'),
            pathname: 'auth/'+module+'/callback'
        });
    }

    function _callback(accessToken, refreshToken, profile, cb){
        var User = deps.models.User;
        var email = _.get(profile, 'emails[0].value', '');
        var oauthId = profile.id;
        var photo = _.get(profile, 'photos[0].value');

        User.findOne({$or: [{oauthID: oauthId},{email: email}]}, (err, user) => {
            if(err){
                cb(err);
            }else if(!err && user !== null) {
                //We are updating profile pic if it's available and has changed.
                if(photo && (user.photo !== photo)){
                        user.photo = photo;
                        user.save(function(err){
                            if(err) return cb(err);
                            cb(null, user);
                        });
                }else{
                    cb(null, user);
                }
            } else {
                User.signup({
                    name: profile.displayName,
                    oauthID: oauthId,
                    email: email,
                    photo: photo
                }).then(
                    res => cb(null, res),
                    e => cb(e)
                );
            }
        });
    }

    passport.use(new FacebookStrategy({
        clientID: config.get('auth.fb.clientId'),
        clientSecret: config.get('auth.fb.clientSecret'),
        callbackURL: callbackUrl('facebook'),
        profileFields: ["id","displayName", "first_name","emails", "last_name","picture.width(200).height(200)"]
    }, _callback));

    passport.use(new GoogleStrategy({
            clientID: config.get('auth.google.clientId'),
            clientSecret: config.get('auth.google.clientSecret'),
            callbackURL: callbackUrl('google')
        }, _callback));

    passport.use(new LocalStrategy({usernameField: 'email', passwordField: 'password'},
       function(email, password, done){

           deps.models.User.findOne({email: email}).select('+password +salt').lean().then(
               user => {
                   if(!user){
                       return done(null, false, { message: 'Incorrect username or password.' });
                   }

                   var p = passwordHelper.encryptPassword(password, user.salt);

                   if(p.password !== user.password){
                       return done(null, false, { message: 'Incorrect username or password.' });
                   }
                    delete user.password;
                    delete user.salt;
                   return done(null, user);
               },
               e => {
                   if (e) { return done(e); }
               }
           )
       }
    ));

    passport.serializeUser(function(user, cb) {
        cb(null, user._id);
    });

    passport.deserializeUser(function(id, cb) {
        var User = deps.models.User;
        User.findById(id).lean().exec(cb);
    });

    return passport;
};