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
                type: [Number]
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
        }

    }, {timestamps: true});

    /*
     Text search index
     */
    summarySchema.index({
        name: 'text',
        description: 'text',
        'subjects.name': 'text',
        'subjects.category': 'text',
        'subjects.course': 'text',
        'seo.tags': 'text'
    }, {
        name: 'organization search index',
        weights: {name: 5, description: 5, 'categories.name': 5, 'courses.name': 5, 'subjects.name': 5, 'seo.tags': 10}
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
                                description: doc.description,
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