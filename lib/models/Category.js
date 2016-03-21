var mongoose = require('mongoose');
var ObjId = mongoose.Schema.Types.ObjectId;
var createId = require('../helpers/create-id');
/**
 * EXAMPLE DATA
 * Pre-School
 1st - 5th
 6th - 8th
 9th - 10th
 11th - 12th
 Engineering Entrance
 Medical Entrance
 MBA Entrance
 Civil Service Examination
 Professional training
 Commerce Classes
 Engineering Classes
 Language Classes
 Hobby Classes
 Others
 Bachelor Classes
 */
module.exports = function (deps) {

    const model = 'Category';

    var categorySchema = mongoose.Schema({

        _id: String,

        name: {
            type: String,
            required: true
        },

        description: {
            type: String,
            required: true
        },

        tags: [String],

        slug: String,

        rank: {
            type: Number,
            unique: true
        },

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

    }, { _id: false });

    categorySchema.index({
        name: 'text',
        description: 'text',
        tags: 'text'
    }, {
        name: 'category text search'
    });

    categorySchema.statics.create = function(data){
        data._id = createId(data.name);
        data.slug = data._id;
        data.tags = data.tags ? data.tags.split(',') : [];
        var Model = this.model(model);
        return new Model(data).save();
    };

    return mongoose.model(model, categorySchema);
};