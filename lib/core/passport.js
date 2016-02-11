/**
 * Created by amitava on 09/02/16.
 */
var config = require('config');
var _ = require('lodash');

import { ALLOWED_ACCOUNTS } from '../../client/scripts/constants';


module.exports = function(deps){
    var passport = require('passport');
    var Strategy = require('passport-facebook').Strategy;

    passport.use(new Strategy({
        clientID: config.get('auth.fb.clientId'),
        clientSecret: config.get('auth.fb.clientSecret'),
        callbackURL: 'http://dev.careerraft.com:3000/auth/facebook/callback',
        profileFields: ["id","displayName", "first_name","emails", "last_name","picture.width(200).height(200)"]
    }, function(accessToken, refreshToken, profile, cb){
        var User = deps.models.User;

        User.findOne({oauthID: profile.id}, (err, user) => {
            if(err){
                cb(err);
            }else if(!err && user !== null) {
                cb(null, user);
            }else {
                var email = _.get(profile, 'emails[0].value', '');

                if(ALLOWED_ACCOUNTS.indexOf(email) === -1)
                    return cb(new Error('Unauthorized email address'));

                user = new User({
                    name: profile.displayName,
                    oauthID: profile.id,
                    email: email,
                    photo: _.get(profile, 'photos[0].value')
                });

                user.save().then(
                    res => cb(null, res),
                    e => cb(e)
                )
            }
        });
    }));

    passport.serializeUser(function(user, cb) {
        cb(null, user._id);
    });

    passport.deserializeUser(function(id, cb) {
        var User = deps.models.User;
        User.findById(id).lean().exec(cb);
    });

    return passport;
};