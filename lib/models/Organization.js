var mongoose = require('mongoose');
var Schema = mongoose.Schema;

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

        /*
        Description text
         */
        description: {
            type: String,
            required: true
        },
        /*
        Institute address
         */
        address: {
            line1: String,
            line2: String,
            locality: String,
            city: String,
            state: String,
            pincode: Number,
            loc: {
                type: [Number], //longitude, latitude.
                index: '2d'
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
            type: String
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
            enum: ['individual', 'organization'],
            default: 'organization'
        },

        /*
        If it's a branch, then parent ID
         */
        parent_id: {
            type: ObjId,
            ref: model,
            default: null
        },

        /*
        Phone numners
         */
        telephones: [{number: String, name: String}],

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

        categories: [{
            name: String,
            category: {ref: 'Category', type: ObjId},
            _id: false
        }],

        courses: [
            {
                _id: false,
                name: String,
                course: {type: ObjId, ref: 'Course'}
            }
        ],

        subjects: [
            {
                _id: false,
                name: String,
                subject: {type: ObjId, ref: 'Subject'}
            }
        ]

    }, {timestamps: true});

    /*
    Text search index
     */
    orgSchema.index({
        name: 'text',
        description: 'text',
        'categories.name': 'text',
        'courses.name': 'text',
        'subjects.name': 'text'
    }, {
        name: 'organization search index',
        weights: {name: 10, description: 5, 'categories.name': 10, 'courses.name': 10, 'subjects.name': 10}
    });

    return mongoose.model(model, orgSchema);

};