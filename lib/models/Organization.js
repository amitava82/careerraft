var mongoose = require('mongoose');
var Promise = require('bluebird');
var Schema = mongoose.Schema;
var _ = require('lodash');
var URLSlugs = require('mongoose-url-slugs');

var ObjId = Schema.Types.ObjectId;

module.exports = function(deps){

    const model = 'Organization';

    var orgSchema = Schema({
        /*
        Institute name
         */
        name: {
            type: String,
            required: true
        },

        name_lower: String,
        /*
        Description text
         */
        description: {
            type: String,
            required: true
        },

        url_slug: {
            type: String,
            required: true,
            unique: true,
            index: true
        },

        short_description: {
            type: String,
            required: true
        },
        /*
        Institute address
         */
        address: {
            line1: {type: String, required: true},
            line2: String,
            locality: {type: String, required: true},
            city: {type: String, required: true, index: 1},
            state: {type: String, required: true},
            pincode: {type: Number, required: true},
            loc: {
                type: [Number], //longitude, latitude.
                index: '2dsphere'
            }
        },

        /*
        optional logo
         */
        logo: {
            type: String,
            required: false
        },

        /*
        optional banner image
         */
        banner: {
            type: String,
            required: false
        },

        /*
        website url
         */
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

        /*
        Type of institute. Need to work on this
         */
        type: {
            type: String,
            required: true,
            enum: ['individual', 'institute'],
            default: 'institute'
        },

        /*
        If it's a branch, then parent ID
         */
        parent_id: {
            type: ObjId,
            ref: model,
            default: null,
            index: 1
        },

        branches: [
            {
                type: ObjId,
                ref: model,
                index: {unique: true, dropDups: true}
            }
        ],

        /*
        Phone numners
         */
        telephones: [{number: String, name: String, _id: false}],

        /*
        Established Year
         */
        estd: {
            type: Number
        },

        /*
        Student count
         */
        student_count: Number,

        /*
        faculty count
         */
        faculty_count: Number,

        /*
        operational hour and days. Need to restructure
         */
        business_hour: {
            days: [],
            hours: {
                start: Number,
                end: Number
            }
        },

        subjects: [
            {
                _id: false,
                subject: {
                    type:  String,
                    required: true,
                    ref: 'Subject'
                },
                name: {
                    type: String,
                    required: true
                }
            }
        ],

        /*
        Metadata for SEO or ranking in site
         */
        seo: {
            tags: []
        },

        //TODO
        views: Number,

        created_by: {
            type: ObjId,
            ref: 'User',
            required: true
        },

        active: {
            type: Boolean,
            required: true,
            default: true
        }



    }, {timestamps: true});

    /*
    Text search index
     */
    //orgSchema.index({
    //    name: 'text',
    //    description: 'text',
    //    'subjects.name': 'text',
    //    'subjects.category': 'text',
    //    'subjects.course': 'text',
    //    'seo.tags': 'text'
    //}, {
    //    name: 'organization search index',
    //    weights: {name: 5, description: 5, 'categories.name': 5, 'courses.name': 5, 'subjects.name': 5, 'seo.tags': 10}
    //});

    orgSchema.statics.assignSubjects = function(id, data){
        var self = this;
        return new Promise(function(resolve, reject){
            var subject = data.subjects[0];

            //if(!subject) return reject(new Error('Subject not provided'));

            var Subject = deps.models.Subject;
            Subject.find({_id: {$in: data.subjects}})
                .lean().exec().then(subs => {
                    var subjects = subs.map(i => {
                        return {
                            name: i.name,
                            subject: i._id
                        }
                    });

                    return self.findByIdAndUpdate(id, {
                        subjects: subjects
                    }, {new: true}).exec();

                })
                .then(r => {

                    //Add summary doc
                    mongoose.models['SummaryDoc'].insert(r._id).then(
                        _.noop,
                        e => deps.log.error(e)
                    );
                    resolve(r);

                }, reject);
        });
    };

    orgSchema.statics.createBranch = function(parent, data){
        var self = this;


        return self.findById(parent).lean()
            .then(createFromParent);

        function createFromParent(source){

            if(source.parent_id) throw new Error('Parent is a branch organization.');

            var newOrg = _.extend(
                _.pick(source,
                ['name', 'description', 'email', 'short_description', 'logo', 'banner', 'business_hour', 'subjects']),
                data,
                {parent_id: parent}
            );

            return new self(newOrg).save();
        }

    };

    //orgSchema.statics
    orgSchema.pre('save', function (next) {
       this.name_lower = this.name.toLowerCase();
        next();
    });

    //Create summary doc after save
    orgSchema.post('save', function(doc) {
        mongoose.models['SummaryDoc'].insert(doc._id);
    });

    //delete summary doc on delete
    orgSchema.post('remove', function(doc) {
        mongoose.models['SummaryDoc'].findByIdAndRemove(doc._id);
    });

    orgSchema.plugin(URLSlugs('name address.locality', {field: 'url_slug'}));

    return mongoose.model(model, orgSchema);

};