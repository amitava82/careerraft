/**
 * Created by amitava on 07/02/16.
 */
var _ = require("lodash");
var Promise = require("bluebird");
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

const SEARCH_RADIUS = 100;

module.exports = function(deps){
    var apiError = deps.middleware.apiError;

    return {
        suggestions: function (req, res, next) {
            var models = deps.models;
            var Course = models.Course;
            var q = req.query.q;

            var agg = [
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
                }
            ];

            if(q){
                var query = q.split(' ').reduce((memo, i) => {
                    const q = i.trim();
                    if(q){
                        memo.push({displayname: {$regex: q, $options: 'i'}});
                    }
                    return memo;
                }, []);

                agg.push(
                    {
                        $match: {$or: query}
                    }
                )
            }

            agg.push({
                $limit: Number(req.query.limit) || 10
            });

            Course.aggregate(agg).exec().then(
                r => res.send(r),
                e => next(e)
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
                e => apiError(e, req, res)
            )
        },


        /*
            sort by: relevance, distance
         */
        elastic_search: function (req, res, next) {
            var client = deps.elastic;

            let {offset = 0, limit = 10, sort, q, lat, lng, radius = 100, courses, category, locality, kind}  = req.query;

            courses = courses && courses.split('~') || [];
            var _fields = [ "name", "description", "courses.*", "short_description" ];

            var dummyquery = {

                "query": {
                    "bool": {
                        "must": {
                            "query_string": {
                                "query": "xyz",
                                "fields": ["name", "description", "courses.*"]
                            }
                        },
                        "filter": [
                            {
                                "and": [
                                    {"term": {"status": "pending"}},
                                    {"terms": { "courses.name.raw": ["SAP", "IIT-JAM", "Cosmetology"]}}]

                            },
                            {
                                "geo_distance" : {
                                    "distance" : "100km",
                                    "location" : [77,13]
                                }
                            }

                        ]
                    }
                },
                "aggs": {
                    "courses": {
                        "filter": { "and": [ { "terms": { "courses.name.raw": ["SAP", "Cosmetology"] } } ] },
                        "aggs": {
                            "courses": {
                                "terms": {
                                    "field": "courses.name.raw"
                                }
                            }
                        }
                    }
                },
                "from": 0,
                "sort":
                {
                    "_geo_distance" : {
                        "location" : [77, 13],
                        "order" : "asc",
                        "unit" : "km",
                        "mode" : "min",
                        "distance_type" : "sloppy_arc"
                    }
                }

            };

            var aggs = {
                "locality": {
                    terms: {
                        "field": "address.locality.raw",
                        "order" : { "_term" : "asc" }
                    },
                    "meta": {"filter": "single"}
                },
                "courses": {
                    terms: {
                        "field": "courses.name.raw",
                        "order" : { "_term" : "asc" }
                    },
                    "meta": {"filter": "multiple"}
                },
                "kind": {
                    terms: {
                        "field": "kind",
                        "order" : { "_term" : "asc" }
                    },
                    "meta": {"filter": "single"}
                },
                "categories": {
                    terms: {
                        "field": "courses.category.raw",
                        "order" : { "_term" : "asc" }
                    },
                    "meta": {"filter": "single"}
                }
            };

            var _query = {
                query: {
                    bool: {
                        must: {},
                        should: {},
                        filter: [{
                            "and": [
                                {"term": {"status": "pending"}}
                            ]

                        }]
                    }
                },
                from: offset,
                size: limit,
                aggs: aggs
            };

            //set query string query
            if(q){
                _.set(_query, 'query.bool.must.query_string', {
                    query: q,
                    fields: ["name", "description^2", "courses.name^6", "courses.category^4"]
                });
            }

            //filter
            if(courses.length){
                _query.query.bool.filter[0].and.push({
                    "terms": { "courses.name.raw": courses }
                });
            }

            if(category){
                _query.query.bool.filter[0].and.push({
                    "term": { "courses.category.raw": category }
                });
            }

            if(locality){
                _query.query.bool.filter[0].and.push({
                    "term": { "address.locality.raw": locality }
                });
            }
            
            if(kind){
                _query.query.bool.filter[0].and.push({
                    "term": { "kind": kind }
                });
            }

            if(lat && lng){
                _query.query.bool.filter.push(
                    {
                        "geo_distance": {
                            "distance": radius+"km",
                            "location": [Number(lng), Number(lat)]
                        }
                    }
                )
            }


            if(sort == 'distance' && lng && lat){
                _query.sort = [
                    {
                        "_geo_distance" : {
                            "location" : [Number(lng), Number(lat)],
                            "order" : "asc",
                            "unit" : "km",
                            "mode" : "min",
                            "distance_type" : "sloppy_arc"
                        }
                    }
                ];
            }

            client.search({
                index: 'raft',
                type: 'profile',
                body: _query
            }).then(
                r => {
                    res.send({
                        count: r.hits.total,
                        offset: _query.from,
                        limit: _query.size,
                        results: _.map(r.hits.hits, i=> _.extend(i._source, {_id: i._id, _distance: _.get(i, 'sort[0]')})),
                        aggs: r.aggregations
                    })
                },
                next
            )
        }
    }
};
