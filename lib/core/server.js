var express = require('express');
var compression = require('compression');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var _ = require('lodash');
var path = require('path');
var favicon = require('serve-favicon');

module.exports = function (dependencies, callback) {
    var app = express();

    app.use(compression());

    app.use(favicon(dependencies.basedir + '/client/favicon.ico'));

    app.use('/static', express.static(path.join(dependencies.basedir, "build/public")));
    app.use('/static', express.static(path.join(dependencies.basedir, "build/public/lib/font-awesome")));
    app.use('/static', function(req, res) {
        res.sendStatus(404);
    });
    app.use('/', express.static(path.join(dependencies.basedir, 'client/static')));

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(cookieParser());

    app.get('/ping', function(req, res){
        res.send('OK');
    });

    _.each(dependencies.routes, function (data, key) {
        var middleware = data.middleware || [];
        _.each(data.routes, function (route) {
            Array.prototype.push.apply(middleware, route.middleware || []);
            var path = route.path,
                method = route.method,
                handler  = route.handler,
                middlewarefn = [];

            _.reduce(middleware, function (memo, middlewareName) {
                var fn = dependencies.middleware[middlewareName];
                if(_.isFunction(fn) && _.indexOf(middlewarefn, fn) === -1) memo.push(fn);
                return memo;
            }, middlewarefn);

            handler = dependencies.controllers[key][handler];

            if(!_.isFunction(handler)) throw new Error('Controller function not defined: ' + key + ' ' + handler);

            app[method].call(app, path, middlewarefn, handler);
        });
    });

    app.get('/api/*', function (req, res) {
        res.status(404).send(new Error('Invalid route'));
    });

    var client = require('../../client/scripts/server')(dependencies, app, _.noop);

    callback(null, app);
};