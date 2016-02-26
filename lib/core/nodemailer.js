/**
 * Created by amitava on 18/02/16.
 */
var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');
var transport = nodemailer.createTransport(sgTransport
({
    auth: {
        api_key: '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'
    }
}));

module.exports = function(deps){
    return function(cb){
        cb(null, transport);
    }
};