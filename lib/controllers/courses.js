var _ = require('lodash');

module.exports = function (deps) {
    var Course = deps.models.Course;
    var apiError = deps.middleware.apiError;

    var crud = require('../helpers/crud')({
        Model: Course,
        populate: 'category'
    });

    return _.extend({}, crud, {

    });
};