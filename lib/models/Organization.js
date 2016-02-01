var mongoose = require('mongoose');
var ObjId = mongoose.Schema.Types.ObjectId;

module.exports = function(deps){

    const model = 'Organization';

    var orgSchema = mongoose.Schema({
        name: {
            type: String,
            required: true
        },

        logo: {
            type: String,
            required: false
        },

        url: {
            type: String,
            required: false
        },

        type: {
            type: String,
            required: true,
            enum: ['individual', 'organization'],
            default: ['organization']
        },

        parent: {
            type: ObjId,
            ref: model,
            default: null
        },

        loc: {
            type: [Number],
            index: '2d'
        },

        telephones: [{number: String, name: String}],

        courses: [],



    }, {timestamps: true});

    return mongoose.model(model, orgSchema);

};