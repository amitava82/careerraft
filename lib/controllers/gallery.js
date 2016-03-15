/**
 * Created by amitava on 14/03/16.
 */
var _ = require('lodash');
var request = require('request');

module.exports = function (deps) {

    var galleryServer = deps.config.get('gallery.host');

    function getUserOrg(req, res, next){
        deps.models.User.findOne({_id: req.user._id}).populate('org', 'url_slug').lean().then(
            user => {
                if(!user) return deps.middleware.apiError(new Error('User not found'));

                if(!user.org && user.role !== 'ADMIN') return deps.middleware.apiError(new Error('User not associated with any org'));

                req.instance.user = user;
                next();
            },
            e => deps.middleware.apiError(e, req, res, next)
        )
    }

    var _key = deps.config.get('gallery_key');

    var baseRequest = request.defaults({
        headers: {'x-token': _key}
    });

    return {
        list: function(req, res, next){
            const orgId = req.params.org;

            const options = {
                url: galleryServer + orgId
            };
            req.pipe(baseRequest.get(options, function(err){
                if(err)
                    deps.middleware.apiError(err, req, res, next);
            })).pipe(res);
        },

        show: function (req, res, next) {
            const orgId = req.params.org;

            const options = {
                url: galleryServer + orgId + '/' + req.params.file
            };
            req.pipe(baseRequest.get(options, function(err){
                if(err)
                    deps.middleware.apiError(err, req, res, next);
            })).pipe(res);

        },

        save: [
            getUserOrg,
            function (req, res, next) {
                const orgId = req.params.org;

                const options = {
                    url: galleryServer,
                    headers: {
                        'x-upload-dir': `/${orgId}`
                    }
                };
                req.pipe(baseRequest.post(options, function(err){
                    if(err)
                        deps.middleware.apiError(err, req, res, next);
                })).pipe(res);
            }
        ],

        delete: function (req, res, next) {
            const orgId = req.params.org;

            const options = {
                url: galleryServer + orgId + '/' + req.params.file
            };

            baseRequest.del(options, function(err, resp){
                if(err)
                    deps.middleware.apiError(err, req, res, next);
                else res.send(resp.body);
            });
        }


    }
};
