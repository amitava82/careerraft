/**
 * Created by amitava on 17/04/16.
 */
var elastic = require('../lib/core/elastic')({});
var Promise = require('bluebird');
var _ = require('lodash');

var settings = require('../lib/elasticsearch/settings');
var profileSchema = require('../lib/elasticsearch/schemas/profile');
var courseSchema = require('../lib/elasticsearch/schemas/course');
var subjectSchema = require('../lib/elasticsearch/schemas/subject');

var INDEX = 'raft';

var INDEXBODY = {
    settings: settings,
    mappings: _.extend({}, profileSchema, courseSchema, subjectSchema)
};


elastic(function(err, client){
    if(client){
        client.indices.exists({index: INDEX}).then(
            function(r){
                if(r){
                    return client.indices.delete({index: INDEX});
                    
                }else{
                    return true
                }
            }
        ).then(function () {
            console.log('**creating index**');

            return client.indices.create({
                index: INDEX,
                body: INDEXBODY
            });

        })

    }else{
        console.log(err)
    }
});