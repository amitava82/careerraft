/**
 * Created by amitava on 17/04/16.
 */

require("babel-register");
var async = require('async');
var _ = require('lodash');

process.env['NODE_CONFIG_DIR'] = '../config';

var config = require('config');


var deps = {
    config: config
};

var libs = require('../lib')(deps);

module.exports = function(callback){
    async.eachSeries([
        'log',
        'mongodb',
        'elastic',
        //'app',
        //'nodemailer'
    ], function(item, done){
        var fn = require('../lib/core/'+item)(deps);

        if(_.isFunction(fn)){
            fn(function (err, result) {
                if(err) return done(err);

                deps[item] = result;
                done(null, result);

            })
        }else {
            process.nextTick(function(){
                deps[item] = fn;
                done(null, fn);
            });
        }

    }, function (err, results) {
        if(err){
            console.log(err);
            process.exit(1);
        }

        callback(null, deps);

    });
};




