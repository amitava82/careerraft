var mongoose = require('mongoose');
var ObjId = mongoose.Schema.Types.ObjectId;

import LANGUAGES from '../../client/scripts/constants';

module.exports = function (deps) {

    const model = 'Subject';

    var subjectSchema = mongoose.Schema({
        name: {
            type: String,
            required: true
        },

        course: {
            type: String
        }

    });

    return mongoose.model(model, subjectSchema);
};