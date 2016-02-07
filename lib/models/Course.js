var mongoose = require('mongoose');
var ObjId = mongoose.Schema.Types.ObjectId;

import LANGUAGES from '../../client/scripts/constants';

module.exports = function (deps) {

    const model = 'Course';

    var courseSchema = mongoose.Schema({
        name: {
            type: String,
            required: true
        },

        description: {
            type: String,
            required: true
        },

        category: {
            type: ObjId,
            ref: 'Category'
        },

        languages: {
            type: [String],
            enum: LANGUAGES,
            required: true
        }


    });

    return mongoose.model(model, courseSchema);
};