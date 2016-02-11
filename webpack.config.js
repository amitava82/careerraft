var webpack = require('webpack');
var path = require('path');

var projectRoot = process.env.PWD; // Absolute path to the project root
var resolveRoot = path.join(projectRoot, 'node_modules'); // project root/node_modules


var envPlugin = new webpack.DefinePlugin({
    __DEV__: JSON.stringify(JSON.parse(process.env.DEVELOP || 'true')),
    __PROD__: JSON.stringify(JSON.parse(process.env.PRODUCTION || 'true')),
    __CLIENT__: true,
    __SERVER__: false
});

var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('vendors', 'vendor.js');

module.exports = {
    entry: {
        app: path.resolve(__dirname, 'client/scripts/client.js'),
        vendors: ['react', 'react-router', 'superagent', 'redux-thunk', 'history',
            'redux', 'redux-actions', 'react-router-redux', 'react-addons-update', 'redux-form']
    },
    //devtool: 'source-map',
    output: {
        filename: 'bundle.js',
        path: './build/public'
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
    plugins: [commonsPlugin],
    modulesDirectories: [
        'node_modules'
    ]
};
