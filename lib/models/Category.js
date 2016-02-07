var mongoose = require('mongoose');
var ObjId = mongoose.Schema.Types.ObjectId;

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
      }

    });

    return mongoose.model(model, categorySchema);
};