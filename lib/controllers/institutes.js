var _ = require('lodash');
var multer  = require('multer');
var path = require('path');

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
    var populate = {
        path: 'subjects.subject',
        model: 'Subject',
        populate: {path: 'course', model: 'Course'}
    };

    var crud = require('../helpers/crud')({
        Model: org,
        populate: populate
    });

    var apiError = deps.middleware.apiError;

    return _.extend(crud, {

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

        addCategory: function (req, res) {
            const id = req.params.id;
            const Organization =  deps.models.Organization;

            Organization.findById(id).exec().then(
                org => {
                    const cat = org.categories.id(req.body.cat_id);
                    if(cat) return org;

                    org.categories.push({
                        _id: req.body.cat_id,
                        name: req.body.cat_name
                    });

                    return org.save();
                }
            ).then(
                org => res.send(org),
                e => apiError(e, req, res)
            )
        },

        deleteCategory: function (req, res) {
            const id = req.params.id;
            const Organization =  deps.models.Organization;
            Organization.findById(id).exec().then(
                doc => {
                    doc.categories.id(this.params.category).remove();
                    return doc.save();
                }
            ).then(
                doc => res.send(doc),
                e => apiError(e, req, res)
            )
        },


        addSubjects: function(req, res){
            var Organization =  deps.models.Organization;

            Organization.assignSubjects(req.params.id, req.body).then(
                r => crud.get(req, res),
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
                r => res.send(r),
                e => apiError(e, req, res)
            )
        },

        upload: [
            upload.single('file'),
            function(req, res){
                var Organization =  deps.models.Organization;
                Organization.findByIdAndUpdate(req.params.id, {
                    [req.params.type]: req.file.filename
                }, {new: true}).populate(populate).then(
                    r => res.send(r),
                    e => apiError(e, req, res)
                )
            }
        ]
    })
};

function distance2radius(distance){
    return distance / 6.378;
}