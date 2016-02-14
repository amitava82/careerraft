var mongoose = require('mongoose');
var ObjId = mongoose.Schema.Types.ObjectId;
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

      name: {
          type: String,
          required: true
      },

      description: {
          type: String,
          required: true
      },

      tags: [String]

    });

    categorySchema.index({
        name: 'text',
        description: 'text',
        tags: 'text'
    }, {
        name: 'category text search'
    });

    var m = mongoose.model(model, categorySchema);
    return m;
};