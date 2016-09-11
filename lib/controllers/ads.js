/**
 * Created by amitava on 15/04/16.
 */
var _ = require('lodash');

module.exports = function(deps){
    
    var AdsModel = deps.models.Ads;
    
    return {
        
        create: function(req, res, next){
            var ad = new AdsModel(req.body);
            ad.save().then(
                r => res.send(r),
                e => next(e, req, res)
            )
        },
        
        list: function(req, res, next){
            AdsModel.find({}).then(
                r => res.send(r),
                e => next(e, req, res)
            )
        },
        
        get: function(req, res, next){
            AdsModel.findById(req.params.id).then(
                r => res.send(r),
                e => next(e, req, res)
            )
        },

        update: function(req, res, next){
            AdsModel.findByIdAndUpdate(req.params.id, req.body).exec().then(
                r => res.send(r),
                e => next(e, req, res)
            )
        },

        delete: function(req, res, next){

        },

        findAds: function(req, res, next){
            AdsModel.getAds(req.query.q, req.query).then(
                r => res.send(r),
                e => next(e, req, res)
            )
        },

        adForward: function(req, res, next){
            AdsModel.incrClick(req.params.id).then(
                r => res.send(r.target_url)
            )
        }
    }
};