var async = require('async');
var config = require('config');
var routes = require('./api');
var _  = require('lodash');

require("babel-register");

var deps = {
    basedir: __dirname,
    config: config,
    routes: routes,
    log: null,
    server: null,
    mongodb: null
};

require('./lib')(deps);

async.eachSeries([
    'log',
    'mongodb',
    'app'
], function(item, done){
    var fn = require('./lib/core/'+item)(deps);
    fn(function (err, result) {
        if(err) return done(err);

        deps[item] = result;
        done(null, result);

    })
}, function (err, results) {
    if(err){
        console.log(err);
        process.exit(1);
    }

    deps.app.listen(config.get('ui.port'), function () {
        console.log('app running on: ', config.get('ui.port'));
    });
});

