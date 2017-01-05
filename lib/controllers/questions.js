/**
 * Created by amitava on 16/03/16.
 */
var _ = require('lodash');
var populateHelper = require('../helpers/populate');

module.exports = function (deps) {

    const Question = deps.models.Question;
    const populate = [
        ['user', {name: 1, photo: 1}],
        ['answers.user', {name: 1, photo: 1, _id: 0}],
        ['answers.replies.user', {name: 1, photo: 1, _id: 0}]
    ];

    return {

        /*
        GET /api/questions/:org
        has post hook
         */
        list: function(req, res, next){
            var query = Question.find({org: req.params.org});

            populateHelper(query, populate).sort('-createdAt');

            query.exec().then(
                r => res.send(r || []),
                e => next(e)
            )
        },

        /*
         POST /api/questions/:org
         */
        create: function (req, res, next) {
            var q = new Question({
                org: req.params.org,
                user: req.user._id,
                title: req.body.title
            });
            
            q.save().then(
                r => r.populate('user', 'name photo').execPopulate()
            ).then(
                r => res.send(r),
                e => next(e)
            )
        },

        /*
        POST /api/questions/:q/answers
        
         */
        createAnswer: [
            function (req, res, next) {
                if(req.user.role == 'ADMIN') return next();
                
                const userOrg = req.user.org;
                const error = new Error('You do not have permission to post answer for this question');
                error.status = 400;
                
                if(!userOrg) next(error);

                Question.find({_id: req.params.q, org: userOrg}).count().then(
                    r => {
                        if(r === 0) next(error);
                        else next();
                    },
                    e => next(e)
                )
            },
            function (req, res, next) {

                const answer = {
                    user: req.user._id, body: req.body.body
                };

                var q = Question.findByIdAndUpdate(req.params.q, {
                    $addToSet: {
                        answers: answer
                    }
                }, {safe: true, upsert: true, new: true});
                
                populateHelper(q, populate);
                
                q.then(
                    r => {
                        res.send(r);
                        
                        //Notofication
                        //TODO turn unto micro service
                        return deps.models.User.findById(r.user._id).then(
                            u => {
                                deps.nodemailer.sendMail({
                                        from: 'go@educationalley.in',
                                        fromname: 'Education Alley',
                                        to: `${u.email}`,
                                        subject: `An answer has been posted for your question`,
                                        html: `
                                            <div>
                                                <p>
                                                    Your question has been answered. Please visit the institute page to see it.
                                                </p>
                                                <p>Question: ${r.title}</p>
                                                <p>Answer: ${req.body.body}</p>
                                                <a href="https://www.educationalley.in/institute/${r.org}#qna" target="_blank">View and Reply now</a>
                                                <hr />
                                                <p>
                                                    Regards,
                                                    <br />
                                                    Education Alley Team
                                                </p>
                                            </div>
                                            `
                                    }, function(err, info) {
                                        if (err) {
                                            deps.log.error(err);
                                        }
                                });
                            }
                        )
                    },
                    e => next(e)
                )
        }],

        /*
        POST /api/questions/:q/answers/:a/reply
         */
        createReply: function (req, res, next) {
            var q = Question.findOneAndUpdate({
                _id: req.params.q,
                'answers._id': req.params.a
            }, {
                 $addToSet: {
                    'answers.$.replies': {
                        user: req.user._id,
                        body: req.body.body
                    }
                 }
            }, {safe: true, upsert: true, new: true});
            
            populateHelper(q, populate);
            
            q.then(
                r => res.send(r),
                e => next(e)
            )
        }
    }
};