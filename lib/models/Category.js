var mongoose = require('mongoose');
var ObjId = mongoose.Schema.Types.ObjectId;

module.exports = function (deps) {
  var categorySchema = mongoose.Schema({
      name: {
          type: String,
          required: true
      },


  });

  return mongoose.model('Category', categorySchema);
};