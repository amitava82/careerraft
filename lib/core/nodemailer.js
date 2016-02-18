/**
 * Created by amitava on 18/02/16.
 */
var nodemailer = require('nodemailer');

var mandrillTransport = require('nodemailer-mandrill-transport');
var transport = nodemailer.createTransport(mandrillTransport({
    auth: {
        apiKey: 'xOzSbagjpBd4urFTHJrcQQ'
    }
}));

module.exports = function(deps){
    return function(cb){
        cb(null, transport);
    }
};