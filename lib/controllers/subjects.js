/**
 * Created by amitava on 11/02/16.
 */
var _ = require('lodash');

module.exports = function (deps) {
    var Subject = deps.models.Subject;
    var apiError = deps.middleware.apiError;

    var crud = require('../helpers/crud')({
        Model: Subject,
        populate: 'category course'
    });

    return _.extend({}, crud, {

        list: function(req, res){
            const query = {...req.query};

            //search regx for name only
            if(query.name) query.name = new RegExp(query.name, 'i');

            deps.models.Subject.find({...query}).populate('course', 'name')
                .exec().then(
                subs => res.send(subs),
                err => res.status(500).send(err)
            )
        }
    });
};