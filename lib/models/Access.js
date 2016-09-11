/**
 * Created by amitava on 29/04/16.
 */
var mongoose = require('mongoose');
var Promise = require('bluebird');
var Schema = mongoose.Schema;
var _ = require('lodash');
var URLSlugs = require('mongoose-url-slugs');
var shortid = require('shortid');
var ObjId = Schema.Types.ObjectId;

module.exports = function (deps) {
    var model = "Access";
    
    var accessSchema = Schema({

        object_type: String,

        object_id: String,

        user_id: ObjId,

        role: String
    });

    return mongoose.model(model, accessSchema);
};