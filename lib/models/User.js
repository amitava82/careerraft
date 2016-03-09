/**
 * Created by amitava on 10/02/16.
 */
var mongoose = require('mongoose');
var ObjId = mongoose.Schema.Types.ObjectId;
var passwordHelper = require('../helpers/password');
var Promise = require('bluebird');
var uuid = require('uuid');
var _ = require('lodash');

import { SUPER_ADMINS } from '../../client/scripts/constants';

module.exports = function (deps) {

    const model = 'User';

    var userSchema = mongoose.Schema({
        name: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true,
            index: 1,
            unique: 1,
            trim: true,
            lowercase: true
        },

        password: {
            type: String,
            required: true,
            select: false,
            min: 5,
            max: 20
        },

        salt: {
            type: String,
            required: true,
            select: false
        },

        role: {
            type: String,
            enum: ['USER', 'ADMIN', 'PROVIDER'],
            default: 'USER',
            required: true
        },

        oauthID: {
            type: String,
            index: 1,
            unique: 1
        },

        photo: {
            type: String
        },

        org: {
            type: ObjId
        }

    });

    userSchema.statics.signup = function(data){

        var Model = this.model(model);
        var user = {
            name: data.name,
            email: data.email
        };

        return Model.count({email: user.email}).then(
            count => {
                if(count > 0) throw new Error('An account exists with the email address.');
            }
        ).then(
            () => {
                if(data.salt && data.role){
                    _.extend(user, {
                        password: data.password,
                        salt: data.salt,
                        role: data.role
                    });

                } else {
                    var pass = passwordHelper.encryptPassword(data.password);

                    _.extend(user, {
                        password: pass.password,
                        salt: pass.salt,
                        role: SUPER_ADMINS.indexOf(user.email) > -1 ? 'ADMIN' : 'USER',
                        oauthID: data.oauthID,
                        photo: data.photo
                    });
                }

                return new Model(user).save();
            }
        );
    };

    userSchema.statics.createInvite = function (data) {

        return new Promise(function(resolve, reject){
            var pass = passwordHelper.encryptPassword(data.password);
            var user = {
                name: data.name,
                password: pass.password,
                salt: pass.salt,
                email: data.email,
                oauthID: data.oauthID,
                photo: data.photo,
                role: SUPER_ADMINS.indexOf(data.email) > -1 ? 'ADMIN' : data.role
            };

            var guid =  uuid();
            var key = 'signup:' + guid;

            deps.redis.set(key, JSON.stringify(user), function(err) {
                if (err) return reject(err);

                deps.redis.expire(key, 86400);
                resolve(guid);
            });
        });

    };

    userSchema.statics.updatePassword = function(email, password){
        var pass = passwordHelper.encryptPassword(password);
        var Model = this.model(model);

        return Model.findOneAndUpdate({email: email}, {
            password: pass.password,
            salt: pass.salt
        });
    };


    return mongoose.model(model, userSchema);
};