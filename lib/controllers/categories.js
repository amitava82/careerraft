var _ = require('lodash');

module.exports = function (deps) {

    var Category = deps.models.Category;

    var crud = require('../helpers/crud')({
        Model: Category
    });

    return _.extend({}, crud, {

    });
};