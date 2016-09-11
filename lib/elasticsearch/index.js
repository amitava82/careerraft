/**
 * Created by amitava on 05/05/16.
 */

var _ = require('lodash');
var async = require('async');

module.exports = function (deps) {

    var populate = [
        ['courses.course', '-description'],
        ['provider'],
        ['courses.subjects', '-description']
    ];

    var KINDS = {
        INST: 'Institute',
        TUTOR: 'Tutor'
    };

    return {
        createProfileIndex: function(docId){
            return deps.models.Profile.findById(docId).populate(populate)
                .exec()
                .then(
                    r => deps.models.Profile.populate(r, {path: 'courses.course.category', model: 'Category'})
                ).then(
                    r => {
                            var elasticClient = deps.elastic;
                            return elasticClient.update({
                                index: 'raft',
                                type: 'profile',
                                id: docId,
                                body: {
                                    doc: {
                                        name: r.provider.name,
                                        description: r.provider.description,
                                        short_description: r.provider.short_description,
                                        url_slug: r.url_slug,
                                        address: r.address,
                                        location: r.address.loc,
                                        kind: KINDS[r.kind],
                                        provider_id: r.provider._id,
                                        courses: _.map(r.courses, function(d){
                                            return {
                                                course_id: d.course._id,
                                                name: d.course.name,
                                                category: d.course.category.name,
                                                category_id: d.course.category._id
    
                                            }
                                        }),
                                        status: r.provider.status,
                                        experience: r.experience
                                    },
                                    doc_as_upsert: true
                                }
                            });
                        }
                )
        },

        createProfileIndexBulk: function(ids, cb){
            cb = _.isFunction(cb) ? cb : _.noop;
            var self = this;
            async.eachLimit(ids, 10, function(id, callback){
                var p = self.createProfileIndex(id);
                p.then(
                    () => {
                        console.log("index: " + id);
                        callback();
                    },
                    e => {
                        deps.log.error(e);
                        callback();
                    }
                )
            }, function(err){
                cb(err);
            })
        }
    }
};