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
        {
            path: 'subjects.subject',
            model: 'Subject',
            populate: {path: 'course', model: 'Course'}
        },
        ['branches', {name: 1, address: 1}]
    ];

    var crud = require('../helpers/crud')({
        Model: org,
        populate: populate
    });

    var apiError = deps.middleware.apiError;

    return _.extend(crud, {

        update: function(req, res){
            var query = org.findByIdAndUpdate(req.params.id, req.body, {new: true});
            query.exec().then(
                (doc) => {
                    deps.models.SummaryDoc.insert(doc._id);
                    crud.get(req, res);
                },
                err => apiError(err, req, res)
            )
        },

        list: function(req, res){
            const query = {...req.query};

            //search regx for name only
            if(query.name) query.name = new RegExp(query.name, 'i');

            deps.models.Organization.find({...query})
                .exec().then(
                    orgs => res.send(orgs),
                    err => res.status(500).send(err)
                )
        },

        addSubjects: function(req, res){
            var Organization =  deps.models.Organization;

            Organization.assignSubjects(req.params.id, req.body).then(
                r => {
                    deps.models.SummaryDoc.insert(r._id);
                    crud.get(req, res);
                },
                e => apiError(e, req, res)
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

        updateBranches: function(req, res, next){
            var branches = req.body;
            deps.models.Organization.findByIdAndUpdate(req.params.id, {
                branches: branches
            }, {new: true}).then(
                r => crud.get(req, res),
                e => apiError(e, req, res)
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

        sendQuery: function(req, res){
            deps.models.Organization.findById(req.params.id, {email: 1, name: 1}).lean().then(
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
                e => deps.middleware.apiError(e, req, res)
            )
        }
    })
};

function distance2radius(distance){
    return distance / 6.378;
}