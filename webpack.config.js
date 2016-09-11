var webpack = require('webpack');
var path = require('path');
var autoprefixer = require('autoprefixer');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var projectRoot = process.env.PWD; // Absolute path to the project root
var resolveRoot = path.join(projectRoot, 'node_modules'); // project root/node_modules
var publicPath = './build/public';


var envPlugin = new webpack.DefinePlugin({
    __DEV__: JSON.stringify(JSON.parse(process.env.DEVELOP || 'true')),
    __PROD__: JSON.stringify(JSON.parse(process.env.PRODUCTION || 'true')),
    __CLIENT__: true,
    __SERVER__: false
});
var extractCSS = new ExtractTextPlugin('app.css');
var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('vendors', 'vendor.js');
var env = new webpack.DefinePlugin({'process.env.NODE_ENV': JSON.stringify('production')});

var plugins = [commonsPlugin, extractCSS];

if(process.env.NODE_ENV == 'production'){
    plugins.push(new webpack.optimize.OccurenceOrderPlugin());
    plugins.push(new webpack.optimize.DedupePlugin());
    plugins.push(new webpack.optimize.UglifyJsPlugin({
        compressor: { warnings: false }
    }));
    plugins.push(env);
}

module.exports = {
    entry: {
        app: path.resolve(__dirname, 'client/scripts/client.js'),
        vendors: ['react', 'react-router', 'superagent', 'redux-thunk', 'history', 'lodash', 'scroll-behavior', 'qs',
            'redux','react-router-redux', 'react-addons-update', 'redux-form', 'react-geosuggest',
            'react-bootstrap', 'react-router-bootstrap', 'react-select', 'react-helmet']
    },
    //devtool: 'source-map',
    output: {
        filename: '[name].js',
        chunkFilename: '[id].chunk.js',
        path: publicPath,
        publicPath: '/static/'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: [resolveRoot],
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', "stage-1", 'react'],
                    plugins: ["transform-decorators-legacy"]
                }
            },
            {
                test: /\.scss$|\.css$/,
                loader: extractCSS.extract('style', ['css', 'postcss', 'sass'])
            },
            {
                test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
                loader: "url?limit=10000&mimetype=application/font-woff"
            }, {
                test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
                loader: "url?limit=10000&mimetype=application/font-woff"
            }, {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                loader: "url?limit=10000&mimetype=application/octet-stream"
            }, {
                test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                loader: "file"
            }, {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                loader: "url?limit=10000&mimetype=image/svg+xml"
            }
        ]
    },
    resolve: {
        root: [
            resolveRoot,
            path.join(__dirname, 'node_modules')
        ],
        // you can now require('file') instead of require('file.coffee')
        extensions: ['', '.js', '.json']
    },
    plugins: plugins,
    modulesDirectories: [
        'node_modules'
    ]
};
