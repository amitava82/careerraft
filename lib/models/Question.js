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

    /*
    Send notification for new questions.
    TODO next featue - subscribe
    */
    questionSchema.post('save', function(doc) {
        deps.models.Organization.findById(doc.org).then(
             o => {
                deps.nodemailer.sendMail({
                        from: 'noreply@careerraft.com',
                        fromname: 'Careerraft',
                        to: `saha.amitava@careerraft.com, atul@careerraft.com, ${o.email}`,
                        subject: `Question submitted for ${o.name}`,
                        html: `
                            <div>
                                <p>
                                A new question has been submitted by a user. Please review and answer it from your institute profile page.
                                </p>
                                <p>Question: ${doc.title}</p>
                                <a href="https://www.careerraft.com/institute/${doc.org}#qna" target="_blank">Answer now</a>
                            </div>
                            `
                    }, function(err, info) {
                        if (err) {
                            deps.log.error(err);
                        }
                });
            },
            e => deps.log.error(e)
        )
    });
    
    return mongoose.model(model, questionSchema);
};