/**
 * Created by amitava on 07/02/16.
 */
var _ = require("lodash");
var Promise = require("bluebird");
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

const SEARCH_RADIUS = 100;

module.exports = function(deps){
    
    return {
        suggestions: function (req, res, next) {
            var models = deps.models;
            var Course = models.Course;

            var query = req.query.q.split(' ').reduce((memo, i) => {
                const q = i.trim();
                if(q){
                    memo.push({displayname: {$regex: q, $options: 'i'}});
                }
                return memo;
            }, []);
            
            if(query.length === 0){
                query.push({displayname: {$regex: '', $options: 'i'}})
            }

            Course.aggregate([
                {$lookup: {
                    from: 'subjects',
                    localField: '_id',
                    foreignField: 'course',
                    as: 'subjects'
                }},
                {
                    $project: {
                        _id: '$_id',
                        course: '$name',
                        slug: '$slug',
                        subjects: {
                            $map: {
                                input: "$subjects",
                                as: "sub",
                                in: { _id: '$$sub._id', name: '$$sub.name', displayname: {$concat: [ '$name', ' (', "$$sub.name", ')' ] }, type: { $literal: 'SUBJECT' }, slug: '$slug'}
                            }
                        }
                    }
                },
                {
                    $project: {
                        _id: false,
                        items: {$concatArrays: [[{_id: '$_id', slug: '$slug', displayname: '$course', type: { $literal: 'COURSE' }}], '$subjects']}
                    }
                },
                {
                    $unwind: '$items'
                },
                {
                    $project: {
                        _id: '$items._id',
                        slug: '$items.slug',
                        type: '$items.type',
                        displayname: '$items.displayname',
                        name: '$items.name'
                    }
                },
                {
                    $match: {$or: query}
                },
                {
                    $limit: Number(req.query.limit) || 10
                }
            ]).exec().then(
                r => res.send(r),
                e => next(e)
            );
        },

        search: function (req, res, next) {
            var SummaryDoc = deps.models.SummaryDoc;
            var query = req.query;
            let {
                    subject_id,
                    category = [],
                    course = [],
                    subject = [],
                    q = '',
                    page = 1, limit = 10, loc = {}, radius = SEARCH_RADIUS} = query;

            page = page && _.isFinite(Number(page)) ? page : 1;
            limit = limit && _.isFinite(Number(limit)) ? limit : 10;

            var location = [];
            var sort = { $sort:{score: {$meta: 'textScore'}}};

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


            if(!q){
                delete $match['$text'];
                sort = { $sort: {createdAt: -1}};
            }

            if(!subject_id) delete $match['subjects.subject_id'];

            if(location.length !=2){
                delete $match['address.loc'];
            }else{
                sort = {$sort: {'address.loc': -1}}
            }


            //defaults
            var _search = [
                {
                    $match: $match
                },
                {
                    $project: {
                        '_id': 1,
                        'name': 1,
                        'description': 1,
                        'subjects': 1,
                        'address': 1,
                        'url_slug': 1,
                        'createdAt': 1,
                        score : {$meta: 'textScore'}
                    }
                },
                sort,
                { $skip: (page - 1) * limit },
                { $limit: limit}
            ];

            SummaryDoc.aggregate(_search).exec().then(
                r => res.send(r),
                e => next(e, req, res)
            )
        },

        filters: function(req, res, next){
            var location = [];
            let {
                subject_id,
                category = [],
                course = [],
                subject = [],
                q = '',
                loc = {}, radius = SEARCH_RADIUS} = req.query;


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
                e => next(e, req, res)
            )
        }
    }
};