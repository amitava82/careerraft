var _ = require('lodash');

module.exports = function (deps) {
    var Course = deps.models.Course;

    return {
        create: function(req, res){
            var course = new Course(req.body);

            course.save().then(
                doc => res.send(doc),
                err => res.send(err)
            )
        },

        list: function (req, res) {
            Course.find({}).populate('category').then(
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