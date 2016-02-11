var _ = require('lodash');

module.exports = function (deps) {
    var Course = deps.models.Course;
    var apiError = deps.middleware.apiError;
    return {
        create: function(req, res){
            var course = new Course(req.body);

            course.save().then(
                doc => res.send(doc),
                err => apiError(err, req, res)
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

        },

        delete: function (req, res) {
            Course.findByIdAndRemove(req.params.id).then(
                () => res.send('OK'),
                err => apiError(err, req, res)
            )
        }
    }
};