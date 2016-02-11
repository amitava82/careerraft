var mongoose = require('mongoose');
var ObjId = mongoose.Schema.Types.ObjectId;

import LANGUAGES from '../../client/scripts/constants';

/**
 * EXAMPLE
 Engineering Stream
 Medical Stream
 Commerce Stream
 Humanity Stream
 */

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
        }

    });

    return mongoose.model(model, courseSchema);
};