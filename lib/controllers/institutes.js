var _ = require('lodash');

module.exports = function(deps){

    var org = deps.models.Organization;
    var populate = 'categories.id courses.id subjects.id';

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
                r => res.send(r),
                e => apiError(e, req, res)
            )
        }
    })
};

function distance2radius(distance){
    return distance / 6.378;
}