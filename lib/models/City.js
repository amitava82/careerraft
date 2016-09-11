/**
 * Created by amitava on 29/03/16.
 */
var mongoose = require('mongoose');
var ObjId = mongoose.Schema.Types.ObjectId;
var createId = require('../helpers/create-id');

module.exports = function (deps) {

  const model = 'City';

    var citySchema = mongoose.Schema({
        _id: String,

        name: {
            type: String,
            required: true
        },

        state: {
            type: String,
            required: true
        },

        country: {
            type: String,
            required: true,
            default: 'IN'
        },

        location: {
            type: [Number], //longitude, latitude.
            index: '2dsphere'
        }
    });

    citySchema.statics.create = function(data){
        data._id = createId(data.name);
        var Model = this.model(model);
        return new Model(data).save();
    };
};