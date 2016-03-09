/**
 * Created by amitava on 08/03/16.
 */
var crypto = require("crypto");
var _ = require('lodash');


module.exports = {
    encryptPassword: function(password, salt){
        if (!salt) {
            salt = this.randomString(12);
        }
        if(!password){
            password = this.randomString(5);
        }
        var enc = crypto.createHmac('sha1', salt).update(password).digest('base64');
        return {password: enc, salt: salt};
    },

    randomString: function (length) {
        length = length ? length : 12;
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghiklmnopqrstuvwxyz';
        var string = '';

        for (var i = 0; i < length; i++) {
            var randomNumber = Math.floor(Math.random() * chars.length);
            string += chars.substring(randomNumber, randomNumber + 1);
        }

        return string;
    }
};