/**
 * Created by amitava on 16/03/16.
 */
var mongoose = require('mongoose');
var ObjId = mongoose.Schema.Types.ObjectId;
var createId = require('../helpers/create-id');

module.exports = function (deps) {

    const model = 'Question';

    var answerSchema = mongoose.Schema({
        user: {
            type: ObjId,
            ref: 'User',
            required: true
        },
        body: {
            type: String,
            required: true,
            max: 4000,
            min: 10
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        replies: [
            {
                _id: false,
                user: {
                    type: ObjId,
                    ref: 'User',
                    required: true
                },
                body: {
                    type: String,
                    required: true,
                    max: 500,
                    min: 10
                },
                createdAt: {
                    type: Date,
                    default: Date.now
                }
            }
        ],

        votes: Number
    }, {timestamps: true});

    var questionSchema = mongoose.Schema({

        org: {
            type: ObjId,
            ref: 'Organization',
            required: true
        },

        user: {
            type: ObjId,
            ref: 'User',
            required: true
        },

        title: {
            type: String,
            required: true,
            max: 200,
            min: 10
        },

        votes: Number,

        answers: [answerSchema]

    }, {timestamps: true});

    return mongoose.model(model, questionSchema);
};