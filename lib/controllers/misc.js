/**
 * Created by amitava on 08/02/16.
 */

var Sitemap = require('../helpers/sitemap');

module.exports = function(deps){

    var sitemap = Sitemap(deps);

    return {

        sendMail: function(req, res){
            var data = req.body;
            deps.nodemailer.sendMail({
                from: data.email,
                to: 'saha.amitava@careerraft.com, aloha@careerraft.com',
                subject: 'Web contact from Careerraft',
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
        }
    }
};
