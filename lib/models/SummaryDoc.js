/**
 * Created by amitava on 25/02/16.
 */
var mongoose = require('mongoose');
var Promise = require('bluebird');
var Schema = mongoose.Schema;
var _ = require('lodash');

var ObjId = Schema.Types.ObjectId;

module.exports = function(deps){

    const model = 'SummaryDoc';

    var summarySchema = Schema({
        /*
         Institute name
         */
        name: {
            type: String
        },

        description: {
            type: String
        },

        short_description: {
            type: String
        },

        url_slug: String,

        /*
         Institute address
         */
        address: {
            line1: {type: String, required: true},
            line2: String,
            locality: {type: String, required: true},
            city: {type: String, required: true},
            state: {type: String, required: true},
            pincode: {type: Number, required: true},
            loc: {
                type: [Number], //longitude, latitude.
                index: '2dsphere'
            }
        },
        /*
         Type of institute. Need to work on this
         */
        type: {
            type: String,
            enum: ['individual', 'institute'],
            default: 'institute'
        },

        /*
         If it's a branch, then parent ID
         */
        parent_id: {
            type: ObjId,
            ref: model,
            default: null
        },

        subjects: [
            {
                _id: false,
                subject_id: String,
                subject: String,
                course: String,
                category: String
            }
        ],

        /*
         Metadata for SEO or ranking in site
         */
        seo: {
            tags: []
        },

        active: {
            type: Boolean,
            required: true,
            default: 1
        }

    }, {timestamps: true});

    /*
     Text search index
     */
    summarySchema.index({
        name: 'text',
        description: 'text',
        short_description: 'text',
        'subjects.subject': 'text',
        'subjects.category': 'text',
        'subjects.course': 'text',
        'seo.tags': 'text'
    }, {
        name: 'organization search index',
        weights: {name: 5, description: 5, short_description: 5, 'subjects.subject': 5, 'subjects.category': 5, 'subjects.course': 5, 'seo.tags': 10}
    });

    var populate = {
        path: 'subjects.subject',
        model: 'Subject',
        populate: {path: 'course', model: 'Course'}
    };

    summarySchema.statics.insert = function(id){
        var self = this;
        return new Promise(function(resolve, reject){
            mongoose.models['Organization'].findById(id).populate(populate).lean().then(
                doc => {
                    self.populate(doc.subjects, {
                        path: 'subject.category',
                        model: 'Category'
                    }).then(
                        r => {
                            var subs = _.reduce(r, function(memo, s){
                                memo.push({
                                    subject: s.subject.name,
                                    subject_id: s.subject._id,
                                    course: s.subject.course.name,
                                    category: s.subject.category.name
                                });
                                return memo;
                            }, []);

                            var _new = {
                                name: doc.name,
                                url_slug: doc.url_slug,
                                description: doc.description,
                                short_description: doc.short_description,
                                address: doc.address,
                                type: doc.type,
                                parent_id: doc.parent_id,
                                subjects: subs

                            };

                            return self.update({_id: id}, {$set: _new}, {upsert: true, overwrite: true, new: true}).then(resolve, reject);
                        }
                    )
                },
                reject
            )
        });
    };

    return mongoose.model(model, summarySchema);

};