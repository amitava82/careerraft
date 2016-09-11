/**
 * Created by amitava on 15/04/16.
 */

var mongoose = require('mongoose');
var ObjId = mongoose.Schema.Types.ObjectId;
var createId = require('../helpers/create-id');
var async = require('async');
var _ = require('lodash');

module.exports = function (deps) {

    const model = 'Ads';

    var adsSchema = mongoose.Schema({

        client_id: String,

        name: {
            type: String,
            required: true,
            index: 1
        },
        
        keywords: [],

        banner_url: String,

        target_url: String,

        total_impressions: {
            type: Number,
            default: 0
        },

        total_clicks: {
            type: Number,
            default: 0
        },

        expires_on: Date,

        /*
            Rules to determine when to stop the ad.
            Any one of the condition satisfy to true will stop the ad.
            Example 1: [{total_impressions: 1000}, {total_clicks: 50000}] //any one pass
            Example 2: [{total_impressions: 1000, total_clicks: 50000}] //both should pass
            Example 3: [{expires_on: "12-12-2016"}]
         */
        stop_rules: [],

        active: {
            type: Boolean,
            default: false
        },
        
        target_cities: [],

        weight: {
            type: Number,
            default: 1
        },

        position: {
            type: String,
            enum: ['top', 'right', 'between'],
            required: true
        },

        ad_type: {
            type: String,
            enum: ['text', 'image'],
            required: true
        }

    }, {timestamps: true});

    adsSchema.index({
        keywords: 'text'
    });

    adsSchema.statics.incrImpression = function(adId){
        adId = _.isArray(adId) ? adId : [adId];
        return this.update({_id: {$in: adId}}, {
            $inc: {total_impressions: 1}
        }, {multi: true}).exec();
    };

    adsSchema.statics.incrClick = function(adId){
        return this.model(model).findByIdAndUpdate(adId, {
            $inc: {total_clicks: 1}
        }).exec();
    };

    /*
    ad rotation logic.
    it should find relevant ads
    it should increase impression
    it should disable if stop rule pass.
     */
    adsSchema.statics.getAds = function(keywords, query, options){
        var AdsModel = this.model(model);
        options = options || {};

        var q = {
            $text: {
                $search: keywords
            },
            active: true
        };

        _.extend(q, query);

        delete q.q;

        return AdsModel.find(q,{ score: { $meta: "textScore" } }).sort({ score: { $meta: "textScore" } }).limit(options.limit || 5).exec().then(
            r => {
                if(r.length){
                    var ids = _.reduce(r, (memo, i) => {
                        memo.push(i._id);
                        return memo;
                    }, []);
                    AdsModel.incrImpression(ids);
                }

                return _.reduce(r, (memo, i ) => {
                    memo.push({_id: i._id, banner: i.banner_url, target: i.target_url});
                    return memo;
                }, []);
            }
        )
    };

    return mongoose.model(model, adsSchema);
};