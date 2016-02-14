var mongoose = require('mongoose');
var ObjId = mongoose.Schema.Types.ObjectId;

//import LANGUAGES from '../../client/scripts/constants';

/**
 * EXAMPLE
 Hindi
 English
 Informatics Practices
 Multimedia and Web Technology
 Engineering Graphics
 Physical Education
 Computer Science
 Environmental Education
 Political Science
 Art
 * Subject can exists without course
 */
module.exports = function (deps) {

    const model = 'Subject';

    var subjectSchema = mongoose.Schema({
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
            ref: 'Category',
            required: true
        },

        course: {
            type: ObjId,
            ref: 'Course'
        },

        tags: [String]

    });

    subjectSchema.index({
        name: 'text',
        description: 'text',
        tags: 'text'
    }, {
        name: 'subject text search'
    });

    return mongoose.model(model, subjectSchema);
};