/**
 * Created by amitava on 11/03/16.
 */
import mongoose from 'mongoose';

module.exports = function (deps) {

    return function(req, res, next){

        if (mongoose.Types.ObjectId.isValid(req.params.id) === false) {
            deps.models.Organization.findOne({url_slug: req.params.id}).select('_id').lean()
                .then(
                    r => res.redirect('/api/institutes/'+r._id),
                    e => next()
                )
        }else
            next();
    };
};