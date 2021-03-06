var express = require('express');
var compression = require('compression');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var _ = require('lodash');
var path = require('path');
var favicon = require('serve-favicon');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var engine = require('ejs-mate');

module.exports = function (dependencies, callback) {

    var app = express();

    app.use(compression());

    app.engine('ejs', engine);

    app.use(favicon(dependencies.basedir + '/client/favicon.ico'));

    app.use('/static', express.static(path.join(dependencies.basedir, "build/public")));
    app.use('/static', express.static(path.join(dependencies.basedir, "build/public/lib/font-awesome")));
    app.use('/static', function(req, res) {
        res.sendStatus(404);
    });
    app.use('/', express.static(path.join(dependencies.basedir, 'client/static')));

    app.set('views', path.resolve(dependencies.basedir, 'views'));
    app.set('view engine', 'ejs');

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(cookieParser());

    app.use(session({
        store: new RedisStore({
            client: dependencies.redis,
            ttl: dependencies.config.get('session.ttl')
        }),
        secret: 'Something',
        resave: true,
        saveUninitialized: true,
        cookie: dependencies.config.get('session.cookie'),
        name: dependencies.config.get('session.name')
    }));

    app.use(dependencies.passport.initialize());
    app.use(dependencies.passport.session());


    //delete cache buster
    app.use(function (req, res, next) {
       delete req.query._;
        next();
    });

    _.each(dependencies.routes, function (data, key) {
        var middleware = data.middleware || [];
        _.each(data.routes, function (route) {
            var path = route.path,
                method = route.method,
                handler  = route.handler,
                role = route.role,
                _middlewares = [],
                middlewarefn = [];

            //first check for role definition
            if(role){
                var hasRole = dependencies.middleware.hasRole(role);
                middlewarefn.push(hasRole);
            }

            //common route middleware
            Array.prototype.push.apply(_middlewares, middleware || []);
            //route middleware
            Array.prototype.push.apply(_middlewares, route.middleware || []);

            _.reduce(_middlewares, function (memo, middlewareName) {
                var fn = dependencies.middleware[middlewareName];
                if(_.isFunction(fn) && _.indexOf(middlewarefn, fn) === -1) memo.push(fn);
                return memo;
            }, middlewarefn);

            handler = dependencies.controllers[key][handler];

            if(_.isArray(handler)){
                Array.prototype.push.apply(middlewarefn, handler);
            }else if(_.isFunction(handler)){
                middlewarefn.push(handler);
            }else {
                throw new Error('Controller function not defined: ' + key + ' ' + handler);
            }

            app[method].call(app, path, middlewarefn, handler);
        });
    });

    app.use(dependencies.middleware.apiError);

    app.all('/api/*', function (req, res) {
        res.status(404).send('Invalid route');
    });

    function logErrors(err, req, res, next) {
        dependencies.log.error(err);
        next();
    }

    app.all("*", logErrors);

    var client = require('../../client/scripts/server')(dependencies, app, _.noop);

    callback(null, app);
};