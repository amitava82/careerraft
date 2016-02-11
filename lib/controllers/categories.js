var _ = require('lodash');

module.exports = function (deps) {
    var Category = deps.models.Category;
    var apiError = deps.middleware.apiError;

    return {
        create: function(req, res, next){
            var category = new Category(req.body);

            category.save().then(
                doc => res.send(doc),
                err => apiError(err, req, res)
            )
        },

        list: function (req, res) {
            Category.find({}).then(
                docs => res.send(docs),
                err => res.status(500).send(err)
            )
        },

        get: function (req, res) {

        },

        update: function(req, res){

        },

        delete: function (req, res) {
            Category.findByIdAndRemove(req.params.id).then(
                () => res.send('OK'),
                err => apiError(err, req, res)
            )
        }
    }
};