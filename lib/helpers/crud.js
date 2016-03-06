/**
 * Created by amitava on 17/02/16.
 */
var apiError = require('../middleware/apiError')();
var _ = require('lodash');
var mongoose = require('mongoose');

module.exports = function (options) {

    var populate = options.populate;
    var Model = options.Model;

    return {
        create: function(req, res, next){
            var promise = null;
            if(Model.create){
                promise = Model.create(req.body);
            }else{
                promise = new Model(req.body);
            }
            promise.then(
                doc => res.send(doc),
                err => apiError(err, req, res)
            )
        },

        list: function (req, res) {
            const query = req.query;
            if(query.name) query.name = new RegExp(query.name, 'i');
            Model.find({...req.query}).exec().then(
                docs => res.send(docs),
                err => res.status(500).send(err)
            )
        },

        get: function (req, res) {

            var query = Model.findById(req.params.id);

            if(mongoose.Types.ObjectId.isValid(req.params.id) === false){
                query = Model.findOne({url_slug: req.params.id});
            }

            if(populate){
                if(_.isArray(populate)){
                    populate.forEach(p => {
                        _.isArray(p) ? query.populate.apply(query, p) : query.populate(p);

                    });
                }else
                    query.populate(populate);

            }
            query.then(
                doc => res.send(doc),
                err => res.status(500).send(err)
            )
        },

        update: function(req, res){
            var query = Model.findByIdAndUpdate(req.params.id, req.body, {new: true});
            if(populate){
                query.populate(populate);
            }
            query.exec().then(
                (doc) => res.send(doc),
                err => apiError(err, req, res)
            )
        },

        delete: function (req, res) {
            Model.findByIdAndRemove(req.params.id).then(
                () => res.send('OK'),
                err => apiError(err, req, res)
            )
        }
    };
};