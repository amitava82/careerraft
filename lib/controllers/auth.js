/**
 * Created by amitava on 08/02/16.
 */

module.exports = function(deps){

    return {

        oauthCallback: [deps.passport.authenticate('facebook', { successRedirect: '/',
            failureRedirect: '/login' })],

        login: [
            deps.passport.authenticate('facebook', {scope: ['email']})
        ],

        logout: function(req, res){
            req.logout();
            res.redirect('/');
        }
    }
};