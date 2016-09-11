/**
 * Created by amitava on 28/04/16.
 */
var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');
var Promise = require('bluebird');
var Schema = mongoose.Schema;
var _ = require('lodash');
var URLSlugs = require('mongoose-url-slugs');
var shortId = require('shortid');
var util = require('util');


var ObjId = Schema.Types.ObjectId;

var populate = [
    ['courses.course', '-description'],
    ['provider'],
    ['courses.subjects', '-description'],
    ['courses.course.category', '-description']
];

module.exports = function (deps) {

    var elasticHelper = require('../elasticsearch')(deps);
    

    var options = { discriminatorKey: 'kind', collection: 'profiles' };

    var courseSchema = Schema({
        course: {
            type: String,
            ref: 'Course',
            required: true
        },
        description: {
            type: String,
            max: 4000
        },
        subjects: [{
            type: String,
            ref: 'Subject',
            index: {unique: true, dropDups: true}
        }]
        
    }, {_id: false});
    
    var profileSchema = Schema({

        _id: {
            type: String,
            unique: true,
            default: shortId.generate
        },

        name: String,

        description: {
            type: String,
            required: false
        },

        short_description: {
            type: String,
            required: false
        },

        provider: {
            type: ObjId,
            ref: 'Provider',
            required: true,
            index: true
        },

        url_slug: {
            type: String,
            required: true,
            unique: true,
            index: true
        },

        address: {
            line1: {type: String, required: true},
            line2: String,
            locality: {type: String, required: true},
            city: {type: String, required: true, index: 1},
            state: {type: String, required: true},
            pincode: {type: Number, required: true},
            loc: {
                type: [Number], //longitude, latitude.
            }
        },

        website: {
            type: String,
            required: false
        },

        /*
         contact official email
         */
        email: {
            type: String,
            required: true
        },

        telephones: [{number: String, name: String, _id: false}],

        courses: [courseSchema],

        views: {
            type: Number,
            default: 0
        }
    }, options);


    var tutorSchema = profileSchema.extend({
        //experience in years as tutor
        experience: Number,

        //education qualifications
        education: [],

        home_tuition: Boolean

    });

    tutorSchema.plugin(URLSlugs('name address.locality', {field: 'url_slug'}));


    /*
        pre save validation.
        Tutor should have user account kind TUTOR
        AND can have only one profile
     */
    tutorSchema.pre('save', function (next) {
        var doc = this,
        model = doc.constructor;

        mongoose.models.Provider.findOne({_id: doc.provider, kind: 'TUTOR'})
            .then(
                u => {
                    if(!u) throw new Error('Provider not found.');
                }
            )
            .then(() => model.count({provider: doc.provider}))
            .then(
                r => {
                    if (r > 0) {
                        throw new Error('Provider type not allowed to have multiple profile.');
                    }
                }
            )
            .then(next, next);

    });

    tutorSchema.post('save', doc => elasticHelper.createProfileIndex(doc._id));

    var instituteSchema = profileSchema.extend({
        //this is the main branch
        master: {
            type: Boolean,
            default: false
        }
    });

    instituteSchema.plugin(URLSlugs('name address.locality', {field: 'url_slug'}));

    /*
        institute pre save validation.
     */
    instituteSchema.pre('save', function (next) {
        var doc = this,
            model = doc.constructor;

        mongoose.models.Provider.findOne({_id: doc.provider, kind: 'INST'})
            .then(
                u => {
                    if(!u) throw new Error('Provider not found.');
                }
            )
            .then(next, next);

    });

    instituteSchema.post('save', doc => elasticHelper.createProfileIndex(doc._id));

    var Profile = mongoose.model('Profile', profileSchema);

    var Tutor = mongoose.model('TUTOR', tutorSchema);

    var Institute = mongoose.model('INST', instituteSchema);
    
    Profile.Tutor = Tutor;
    Profile.Institute = Institute;

    return Profile;
};