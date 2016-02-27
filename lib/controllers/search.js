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
            var SummaryDoc = deps.models.SummaryDoc;
            var query = req.query;
            let {
                    subject_id,
                    category = [],
                    course = [],
                    subject = [],
                    q = '',
                    page = 1, limit = 10, loc = {}, radius = 50} = query;

            page = page && _.isFinite(Number(page)) ? page : 1;
            limit = limit && _.isFinite(Number(limit)) ? limit : 10;

            var location = [];

            if(loc.lng && loc.lat){
                location[0] = Number(loc.lng);
                location[1] = Number(loc.lat);
            }

            var $match = {
                $text: { $search: q },
                ['subjects.subject_id']: new RegExp(subject_id, 'i'),
                ['address.loc']: {$geoWithin:  {$centerSphere: [location, radius/6378]}}
            };

            if(category.length){
                $match['subjects.category'] = {$in: category}
            }
            if(course.length){
                $match['subjects.course'] = {$in: course}
            }
            if(subject.length){
                $match['subjects.subject'] = {$in: subject}
            }



            if(!q) delete $match['$text'];
            if(!subject_id) delete $match['subjects.subject_id'];
            if(location.length !=2) delete $match['address.loc'];


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
                        'subjects': 1,
                        'address': 1,
                        score : {$meta: 'textScore'}
                    }
                },
                { $sort:{score: {$meta: 'textScore'}}},
                { $skip: (page - 1) * limit },
                { $limit: limit}
            ];

            SummaryDoc.aggregate(_search).exec().then(
                r => res.send(r),
                e => apiError(e, req, res)
            )
        },

        filters: function(req, res){
            var location = [];
            let {
                subject_id,
                category = [],
                course = [],
                subject = [],
                q = '',
                loc = {}, radius = 50} = req.query;


            if(loc.lng && loc.lat){
                location[0] = Number(loc.lng);
                location[1] = Number(loc.lat);
            }
            var $match = {
                $text: { $search: q },
                ['subjects.subject_id']: new RegExp(subject_id, 'i'),
                ['address.loc']: {$geoWithin:  {$centerSphere: [location, radius/6378]}}
            };

            if(category.length){
                $match['subjects.category'] = {$in: category}
            }
            if(course.length){
                $match['subjects.course'] = {$in: course}
            }
            if(subject.length){
                $match['subjects.subject'] = {$in: subject}
            }



            if(!q) delete $match['$text'];
            if(!subject_id) delete $match['subjects.subject_id'];
            if(location.length !=2) delete $match['address.loc'];

            deps.models.SummaryDoc.aggregate([
                {
                    $match: $match
                },
                {
                    $unwind: '$subjects'
                },
                {
                    $group: {
                        _id: null,
                        courses: {$addToSet: '$subjects.course'},
                        categories: {$addToSet: '$subjects.category'},
                        subjects: {$addToSet: '$subjects.subject'}
                    }
                }
            ]).exec().then(
                r => res.send(r[0]),
                e => apiError(e, req, res)
            )
        }
    }
};