/**
 * Created by amitava on 10/02/16.
 */
var mongoose = require('mongoose');
var ObjId = mongoose.Schema.Types.ObjectId;

module.exports = function (deps) {

    const model = 'User';

    var userSchema = mongoose.Schema({
        name: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true
        },

        oauthID: {
            type: String,
            required: true
        },

        photo: {
            type: String
        },

        org: {
            type: ObjId
        }

    });

    return mongoose.model(model, userSchema);
};