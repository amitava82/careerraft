/**
 * Created by amitava on 09/03/16.
 */
var _ = require('lodash');

module.exports = function (deps) {
    var User = deps.models.User;
    var apiError = deps.middleware.apiError;

    return {
        addToList: function (req, res) {
            User.findByIdAndUpdate(req.user._id, {
                $addToSet: {saved_items: req.body.id}
            }, {new: true, select: 'saved_items'}).populate('saved_items', 'name url_slug').then(
                r => res.send(r.saved_items),
                e => apiError(e, req, res)
            )
        },

        removeFromList: function (req, res) {
            User.findByIdAndUpdate(req.user._id, {
                $pull: {saved_items: req.params.id}
            }, {new: true, select: 'saved_items'}).populate('saved_items', 'name url_slug').then(
                r => res.send(r.saved_items),
                e => apiError(e, req, res)
            )
        },

        getSavedList: function (req, res) {
            User.findById(req.user._id, {saved_items: 1}).populate('saved_items', 'name url_slug').lean().then(
                r => res.send(_.get(r, 'saved_items', [])),
                e => apiError(e, req, res)
            )
        },
        
        /*
            Create a institute profile for a user
         */
        createProfile: function (req, res, next) {

            var newOrg = _.extend({}, req.body, {
                active: false,
                created_by: req.user._id
            });

            var org = new deps.models.Organization(newOrg);

            User.findById(req.user._id).then(
                u => {
                    if(u.org) throw new Error('User already has a profile.')
                }
            ).then(org.save)
             .then(
                r => User.findByIdAndUpdate(req.user._id, {org: r.id})
                    .then(() => r)
            ).then(
                r => res.send(r),
                e => next(e)
            )
        }
    }
};