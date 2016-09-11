/**
 * Created by amitava on 29/03/16.
 * 
 */
var mongoose = require('mongoose');
var ObjId = mongoose.Schema.Types.ObjectId;
var createId = require('../helpers/create-id');

module.exports = function (deps) {

    const model = 'Collection';

    var collectionSchema = mongoose.Schema({

        name: {
            type: String,
            required: true
        },

        description: {
            type: String,
            required: true
        },
        
        institutes: [
            {
                type: ObjId,
                ref: 'Organization',
                index: {unique: true, dropDups: true}
            }
        ],

        city: {
            type: ObjId,
            ref: 'City',
            required: true
        },

        image_url: String
        
    });
};