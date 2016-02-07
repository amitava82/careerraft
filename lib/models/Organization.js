var mongoose = require('mongoose');
var ObjId = mongoose.Schema.Types.ObjectId;

module.exports = function(deps){

    const model = 'Organization';

    var orgSchema = mongoose.Schema({
        name: {
            type: String,
            required: true
        },

        address: {
            line1: String,
            line2: String,
            Locality: String,
            City: String,
            State: String,
            pincode: Number,
            loc: {
                type: [Number],
                index: '2d'
            }
        },

        logo: {
            type: String,
            required: false
        },

        banner: {
            type: String
        },

        website: {
            type: String,
            required: false
        },

        email: {
            type: String,
            required: true
        },

        type: {
            type: String,
            required: true,
            enum: ['individual', 'organization'],
            default: 'organization'
        },

        parent: {
            type: ObjId,
            ref: model,
            default: null
        },

        telephones: [{number: String, name: String}],

        estd: {
            type: Number
        },

        student_count: Number,

        faculty_count: Number,

        business_hour: {
            days: [],
            hours: {
                start: Number,
                end: Number
            }
        }

    }, {timestamps: true});

    return mongoose.model(model, orgSchema);

};