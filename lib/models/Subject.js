var mongoose = require('mongoose');
var ObjId = mongoose.Schema.Types.ObjectId;
var createId = require('../helpers/create-id');
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

        _id: String,

        name: {
            type: String,
            required: true
        },

        description: {
            type: String,
            required: true
        },

        category: {
            type: String,
            ref: 'Category',
            required: true
        },

        course: {
            type: String,
            ref: 'Course',
            required: true
        },

        tags: [String],

        created_by: {
            type: ObjId,
            ref: 'User',
            required: true
        },

        active: {
            type: Boolean,
            required: true,
            default: 1
        }

    }, {_id: false});

    subjectSchema.index({
        name: 'text',
        description: 'text',
        tags: 'text'
    }, {
        name: 'subject text search'
    });

    subjectSchema.statics.create = function(data){
        data._id =  data.course + ':' +createId(data.name);
        data.slug = data._id.replace(':', '-');
        data.tags = data.tags ? data.tags.split(',') : [];
        var Model = this.model(model);
        return new Model(data).save();
    };

    return mongoose.model(model, subjectSchema);
};