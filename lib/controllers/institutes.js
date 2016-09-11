var _ = require('lodash');
var multer  = require('multer');
var path = require('path');
var mongoose = require('mongoose');

module.exports = function(deps){

    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, deps.config.get('uploadDir'));
        },
        filename: function (req, file, cb) {
            var id = req.params.id, type = req.params.type;
            var filename =  id + '_' +  type;
            cb(null, filename + path.extname(file.originalname));
        }
    });

    var upload = multer({ storage: storage, limits: {
        fileSize: 2097152 //2mb
    },
        fileFilter: function(req, file, cb){
            if ( ['.jpeg', '.jpg', '.png', 'gif'].indexOf(path.extname(file.originalname)) === -1) {
                return cb(new Error('Only images are allowed'))
            }
            cb(null, true)
        }
    });

    var org = deps.models.Organization;
    var populate = [
        ['courses.course_id', '-description'],
        ['parent_id', 'name address'],
        ['courses.subjects', '-description']
    ];

    var crud = require('../helpers/crud')({
        Model: org,
        populate: populate
    });

    var apiError = deps.middleware.apiError;

    return _.extend(crud, {

        update: function(req, res, next){
            var query = org.findByIdAndUpdate(req.params.id, req.body, {new: true});
            query.exec().then(
                (doc) => {
                    deps.models.SummaryDoc.insert(doc._id);
                    crud.get(req, res);
                },
                e => next(e, req, res)
            )
        },

        list: function(req, res, next){
            const query = {...req.query};

            //search regx for name only
            if(query.name) query.name = new RegExp(query.name, 'i');

            deps.models.Organization.find({...query})
                .exec().then(
                    orgs => res.send(orgs),
                    e => next(e, req, res)
                )
        },

        addSubjects: function(req, res, next){
            var Organization =  deps.models.Organization;

            Organization.assignSubjects(req.params.id, req.body).then(
                r => {
                    deps.models.SummaryDoc.insert(r._id);
                    crud.get(req, res);
                },
                e => next(e, req, res)
            )
        },


        deleteSubject: function (req, res) {
            var Organization =  deps.models.Organization;
            Organization.findOneAndUpdate({
                _id: req.params.id
            }, {
                $pull: {subjects: {subject: req.params.subject}}
            }, {new: true}).populate(populate).then(
                r => {
                    deps.models.SummaryDoc.insert(r._id);
                    res.send(r)
                },
                e => apiError(e, req, res)
            )
        },
        
        addCourse: function (req, res, next) {
            org.findById(req.params.id).then(
                o => {
                    var c = _.find(o.courses, {course_id: req.body.course_id});
                    if(!c){
                        o.courses.push(req.body);
                        return o.save();
                    }else{
                        _.extend(c, req.body);
                        return o.save();
                    }
                }
            ).then(
                r => res.send(r),
                e => next(e, req, res)
            )
        },

        deleteCourse: function (req, res, next) {
            
        },

        deactivateCourse: function(req, res, next){

        },

        getBranches: function (req, res, next) {
            org.find({parent_id: req.params.id}, 'name address url_slug').then(
                r => res.send(r),
                e => next(e, req, res)
            )
        },

        createBranch: function(req, res, next){
            org.createBranch(req.params.id, _.extend({},req.body, {created_by: req.user._id})).then(
                r => crud.get(req, res),
                e => next(e, req, res)
            )
        },

        updateBranches: function(req, res, next){
            var branches = req.body;
            deps.models.Organization.findByIdAndUpdate(req.params.id, {
                branches: branches
            }, {new: true}).then(
                r => crud.get(req, res),
                e => next(e, req, res)
            )
        },

        upload: [
            upload.single('file'),
            function(req, res){
                var Organization =  deps.models.Organization;
                Organization.findByIdAndUpdate(req.params.id, {
                    [req.params.type]: req.file.filename
                }, {new: true}).then(
                    r => crud.get(req, res),
                    e => apiError(e, req, res)
                )
            }
        ],

        sendQuery: function(req, res, next){
            var org = deps.models.Organization;
            var query = org.findById(req.params.id);
            if(mongoose.Types.ObjectId.isValid(req.params.id) === false){
                query = org.findOne({url_slug: req.params.id});
            }
            query.lean().then(
                org => {
                    var data = req.body;
                    deps.nodemailer.sendMail({
                        from: data.email,
                        to: `saha.amitava@careerraft.com, aloha@careerraft.com, ${org.email}`,
                        subject: `Student query for ${org.name} from ${data.name}`,
                        html: `
                    <div>
                        <p>Following information has been submitted from the form:</p>
                        <p>Name: ${data.name}</p>
                        <p>Email: ${data.email}</p>
                        <p>Phone: ${data.phone}</p>
                        <p>Message: ${data.message}</p>
                    </div>
                    `
                    }, function(err, info) {
                        if (err) {
                            res.status(400).send({_error: 'Error sending email', message: err.message});
                        } else {
                            res.send('OK')
                        }
                    });
                },
                e => next(e, req, res)
            )
        }
    })
};

function distance2radius(distance){
    return distance / 6.378;
}