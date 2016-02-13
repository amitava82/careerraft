/**
 * Created by amitava on 07/02/16.
 */
var _ = require("lodash");
var Promise = require("bluebird");
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

module.exports = function(deps){
    var apiError = deps.middleware.apiError;

    return {
        suggestion: function (req, res) {
            var models = deps.models;
            var Org = models.Organization;
            var Category = models.Category;
            var Course = models.Course;
            var Subject = models.Subject;

            var query = req.query;
            var loc = req.query.location;

            if(loc){
                loc = [loc.lng, loc. lat];
            }

            Promise.all([
                Org.find({
                    name: new RegExp(query.query, 'i')
                }).where('address.loc').near(loc).limit(3).exec(),
                Category.find({
                    name: new RegExp(query.query, 'i')
                }).limit(3).exec(),
                Course.find({
                    name: new RegExp(query.query, 'i')
                }).limit(3).exec(),
                Subject.find({
                    name: new RegExp(query.query, 'i')
                }).limit(3).exec()
            ]).then(
                ([institutes, categories, courses]) => res.send({institutes, categories, courses}),
                err => res.status(500).send(err)
            );
        },

        search: function (req, res) {
            var Organization = deps.models.Organization;
            var query = req.query;
            const {category, term = '', page = 1, limit = 20, loc = [], radius = 50} = query;

            var $match = {
                $text: { $search: term },
                ['categories.category']: ObjectId(category),
                ['address.loc']: {$geoWithin:  {$centerSphere: [loc, radius/6371]}}
            };

            if(!term) delete $match['$text'];
            if(!category) delete $match['categories.category'];
            if(loc.length !=2) delete $match['address.loc'];


            //defaults
            var _search = [
                {
                    $match: $match
                },
                {
                    $project: {
                        '_id': 1,
                        'name': 1,
                        'description': {$substr: ["$description", 0, 300]},
                        'categories': 1,
                        'courses': 1,
                        'categoryDoc': 1,
                        'address': 1,
                        score : {$meta: 'textScore'}
                    }
                },
                { $sort:{score: {$meta: 'textScore'}}},
                { $skip: (page - 1) * limit },
                { $limit: limit}
            ];

            Organization.aggregate(_search).exec().then(
                r => res.send(r),
                e => apiError(e, req, res)
            )
        }
    }
};