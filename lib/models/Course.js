var mongoose = require('mongoose');
var ObjId = mongoose.Schema.Types.ObjectId;
var createId = require('../helpers/create-id');

//import LANGUAGES from '../../client/scripts/constants';

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

        slug: String,

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

    courseSchema.index({
        name: 'text',
        description: 'text',
        tags: 'text'
    }, {
        name: 'course text search'
    });

    courseSchema.statics.create = function(data){
        data._id = data.category+':'+createId(data.name);
        data.slug = data._id;
        data.tags = data.tags ? data.tags.split(',') : [];
        var Model = this.model(model);
        return new Model(data).save();
    };

    return mongoose.model(model, courseSchema);
};