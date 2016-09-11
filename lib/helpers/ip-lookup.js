/**
 * Created by amitava on 31/03/16.
 */
var request = require('request');
var _ = require('lodash');

module.exports = function (ip, callback) {
    request.get({url: `https://freegeoip.net/json/${ip}`, json: true},
        function (err, r, body) {
            if (err || !_.isObject(body)){
                callback(err || new Error(body))
            }else
                callback(err, body);
        });
};