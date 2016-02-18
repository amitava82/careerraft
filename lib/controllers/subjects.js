/**
 * Created by amitava on 11/02/16.
 */
var _ = require('lodash');

module.exports = function (deps) {
    var Subject = deps.models.Subject;
    var apiError = deps.middleware.apiError;

    var crud = require('../helpers/crud')({
        Model: Subject,
        populate: 'category course'
    });

    return _.extend({}, crud, {

    });
};