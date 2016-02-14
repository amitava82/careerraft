/**
 * Created by amitava on 11/02/16.
 */
var _ = require('lodash');

module.exports = function (deps) {
    var Subject = deps.models.Subject;
    var apiError = deps.middleware.apiError;

    return {
        create: function(req, res, next){
            var subject = new Subject(req.body);

            subject.save().then(
                doc => res.send(doc),
                err => apiError(err, req, res)
            )
        },

        list: function (req, res) {
            Subject.find(req.query).then(
                docs => res.send(docs),
                err => apiError(err, req, res)
            )
        },

        get: function (req, res) {

        },

        update: function(req, res){

        }
    }
};