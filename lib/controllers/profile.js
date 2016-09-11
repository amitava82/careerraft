/**
 * Created by amitava on 29/04/16.
 */

var can = require('../helpers/can');
var mongoose = require('mongoose');
var _ = require('lodash');

module.exports = function (deps) {

    var elasticHelper = require('../elasticsearch')(deps);

    var Profile = deps.models.Profile;
    var populate = [
        ['courses.course', '-description'],
        ['provider'],
        ['courses.subjects', '-description']
    ];

    //for update request
    function validateUserRole(req, res, next){
        Profile.findById(req.params.id).then(
            r => {
                if(!r) return next(Error('NotFound'));

                if(req.user.role == 'ADMIN'){
                    next();
                }else if(req.user.provider.toString() == r.provider){
                    next();
                }else{
                    next(new Error('NoAccess'));
                }
            },
            e => next(e)
        );
    }

    return {
        getProfiles: function (req, res, next) {
            Profile.find(req.query)
                //.populate(populate)
                .lean()
                .then(
                    r => res.send(r),
                    next  
                )
        },
        
        getProfile: function(req, res, next){
            Profile.findById(req.params.id)
                .populate(populate)
                .lean()
                .then(
                    r => {
                        if(!r) throw new Error('NotFound');

                        return Profile.find({provider: r.provider._id, _id: {$ne: r._id}}).select('address url_slug').lean().then(
                            results => {
                                r.branches = results;
                                return r;
                            }
                        )
                    }
                )
                .then(
                    r => res.send(r),
                    e => next(e)
                )
        },


        createProfile: [
            function (req, res, next) {
                if(req.user.role === 'ADMIN') return next();

                else if(req.user.role === 'PROVIDER'){
                    if(req.user.provider.toString() === req.body.provider) return next();

                    else next(new Error('Invalid request. Provider not allowed'));

                }else{
                    next(new Error('Not Allowed'));
                }
            },
            function (req, res, next) {

                //check user role
                var data = req.body;
                var provider = data.provider;

                deps.models.Provider.findById(provider)
                    .then(
                        p => {
                            if(!p) throw new Error('Provider not found');

                            return p;
                        }
                    )
                    .then(
                        p => {
                            var kind = p.kind;
                            var Model = kind === 'TUTOR' ? Profile.Tutor : Profile.Institute;
                            data.kind = kind;
                            data.name = p.name;
                            Model.create(data).then(
                                r => res.send(r),
                                e => next(e)
                            );
                        }
                    );


            }
        ],

        updateProfile: [
            validateUserRole,
            function (req, res, next) {
                var data = req.body;

                delete data.owner;

                Profile.findByIdAndUpdate(req.params.id, data, {new: true})
                    .then(r => {
                        elasticHelper.createProfileIndex(r._id);
                        return r;
                    })
                    .then(
                        r => res.send(r),
                        e => next(e)
                    )
            }
        ],

        updateCourses: [
            validateUserRole,
            function (req, res, next) {
                Profile.findById(req.params.id).then(
                    o => {
                        var c = _.find(o.courses, {course: req.body.course});
                        if(!c){
                            o.courses.push(req.body);
                            return o.save();
                        }else{
                            _.extend(c, req.body);
                            return o.save();
                        }
                    }
                ).then(r => {
                    elasticHelper.createProfileIndex(r._id);
                    return r;
                }).then(
                    r => res.send(r),
                    e => next(e, req, res)
                )
            }
        ],

        deleteCourse: [
            validateUserRole,
            function(req, res, next){
                Profile.findByIdAndUpdate(req.params.id, {
                    $pull: {courses: {course: req.params.course}}
                }, {new: true}).then(
                    r => {
                        elasticHelper.createProfileIndex(r._id);
                        res.send(r);
                    },
                    next
                )
            }
        ],

        deleteProfile: [
            validateUserRole,
            function (req, res, next) {
                Profile.findByIdAndRemove(req.params.id).then(r=> res.send(r), next);
            }
        ],

        getProvider: function (req, res, next) {
            deps.models.Provider.aggregate([
                {
                    $match: {_id: mongoose.Types.ObjectId(req.params.id)}
                },
                {
                    $lookup: {
                        from: 'profiles',
                        localField: '_id',
                        foreignField: 'provider',
                        as: 'branches'
                    }
                }
            ]).exec().then(r=> res.send(r[0]), next);
        },

        getProviders: function (req, res, next) {
            const query = {...req.query};

            //search regx for name only
            if(query.name) query.name = new RegExp(query.name, 'i');

            deps.models.Provider.find({...query})
                .exec().then(
                p => res.send(p),
                e => next(e, req, res)
            )
        },

        updateProvider: [
            function (req, res, next) {
                if(req.user.role == 'ADMIN'){
                    next();
                }else if(req.user.provider.toString() == req.params.id){
                    next();
                }else{
                    next(new Error('NoAccess'));
                }
            },
            function (req, res, next) {
                deps.models.Provider.findByIdAndUpdate(req.params.id, req.body, {new: true})
                    .then(
                        r => {
                            Profile.find({provider: req.params.id}).select('_id').lean().then(
                                ids => {
                                    elasticHelper.createProfileIndexBulk(_.map(ids, '_id'));
                                }
                            );
                            return r;
                        }
                    )
                    .then(r=> res.send(r), next);
            }
        ],

        createProvider: function (req, res, next) {

            var data = req.body;

            deps.models.Provider.create({
                name: data.name,
                description: data.description,
                short_description: data.short_description,
                kind: data.kind,
                status: 'active'
            }).then(r=> res.send(r), next);
        }
    }
};