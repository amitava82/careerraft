var redis = require("redis");
var async = require('async');
var config = require('config');
var routes = require('./api');
var _  = require('lodash');

require("babel-register");

global.__CLIENT__ = false;
global.__SERVER__ = true;

var client = redis.createClient({
    socket_keepalive: true
});

var deps = {
    basedir: __dirname,
    config: config,
    routes: routes,
    log: null,
    server: null,
    mongodb: null,
    passport: null,
    redis: client
};

deps.passport = require('./lib/core/passport')(deps);


require('./lib')(deps);

async.eachSeries([
    'log',
    'mongodb',
    'app'
], function(item, done){
    var fn = require('./lib/core/'+item)(deps);

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

    deps.app.listen(config.get('ui.port'), function () {
        console.log('app running on: ', config.get('ui.port'));
    });
});

