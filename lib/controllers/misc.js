/**
 * Created by amitava on 08/02/16.
 */

var Sitemap = require('../helpers/sitemap');
var async = require('async');
var _ = require('lodash');
var Promise = require('bluebird');

var Api = require('../../client/scripts/helpers/api').default;


module.exports = function(deps){

    var sitemap = Sitemap(deps);

    return {

        sendMail: function(req, res){
            var data = req.body;
            deps.nodemailer.sendMail({
                from: data.email,
                to: 'amitava82@gmail.com, go@educationalley.in',
                subject: 'Web contact from Education Alley',
                html: `
                    <div>
                        <p>Following information has been submitted from the form:</p>
                        <p>Name: ${data.name}</p>
                        <p>Email: ${data.email}</p>
                        <p>Phone: ${data.telephone}</p>
                        <p>Message: ${data.message}</p>
                    </div>
                    `
            }, function(err, info) {
                if (err) {
                    res.status(400).send({_error: 'Error sending email', message: err.message});
                } else {
                    res.send('OK')
                }
            });
        },

        renderTerms: function (req, res) {
            res.render('terms', {title: 'Terms & Conditions'});
        },

        renderPrivacy: function (req, res) {
            res.render('privacy', {title: 'Privacy policy'})
        },

        sitemap: function(req, res){

            sitemap.generateInstitutesSitemap().then(
                map => {
                    res.header('Content-Type', 'application/xml');
                    res.send( map.toString() );
                },
                e => res.status(500)
            )
        },

        /*
        Multi request handler
         */
        multiRequest: function (req, res, next) {

            var api = new Api(req, deps.config.get('api'));

            var tasks = _.reduce(req.body, (memo, url) => {
                var p = api.get(url);
                memo.push(p);
                return memo;
            }, []);

            Promise.all(tasks).then(
                (...r) => res.send(...r),
                e => next(e)
            );

        }
    }
};
