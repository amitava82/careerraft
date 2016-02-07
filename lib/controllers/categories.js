var _ = require('lodash');

module.exports = function (deps) {
    var Category = deps.models.Category;

    return {
        create: function(req, res){
            var category = new Category(req.body);

            category.save().then(
                doc => res.send(doc),
                err => res.send(err)
            )
        },

        list: function (req, res) {
            Category.find({}).then(
                docs => res.send(docs),
                err => res.send(err)
            )
        },

        get: function (req, res) {

        },

        update: function(req, res){

        }
    }
};