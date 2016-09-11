/**
 * Created by amitava on 01/05/16.
 */
var mongoose = require('mongoose');
var ObjId = mongoose.Schema.Types.ObjectId;
var passwordHelper = require('../helpers/password');
var Promise = require('bluebird');
var uuid = require('uuid');
var _ = require('lodash');

module.exports = function (deps) {

    var providerSchema = mongoose.Schema({

        name: String,

        logo: String,
        
        description: {
            type: String,
            required: false
        },
        
        short_description: {
            type: String,
            required: false
        },

        kind: {
            type: String,
            enum: ['TUTOR', 'INST'],
            required: true
        },

        status: {
            type: String,
            enum: ['pending', 'rejected', 'active'],
            required: true,
            default: 'pending'
        },
        
        website: String,
        
        hq: String
    });

    return mongoose.model('Provider', providerSchema);
};