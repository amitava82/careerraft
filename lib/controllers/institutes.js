var _ = require('lodash');

module.exports = function(deps){
    var apiError = deps.middleware.apiError;

    return {
        create: function (req, res) {
                var org = new deps.models.Organization(req.body);
                org.save().then(
                    doc => res.send(doc),
                    err => apiError(err, req, res)
                )
        },

        list: function(req, res){
            const query = {...req.query};

            //search regx for name only
            if(query.name) query.name = new RegExp(query.name, 'i');

            deps.models.Organization.find({...query})
                .populate('parent').exec().then(
                orgs => res.send(orgs),
                err => res.status(500).send(err)
            )
        },

        get: function (req, res) {
            deps.models.Organization.findById(req.params.id).then(
                doc => res.send(doc),
                e => res.status(404).send(e)
            )
        },

        update: function(req, res) {

        },

        addSubjects: function(req, res){
            var Organization =  deps.models.Organization;

            Organization.assignSubjects(req.params.id, req.body).then(
                r => res.send(r),
                e => apiError(e, req, res)
            )
        }
    }
};

function distance2radius(distance){
    return distance / 6.378;
}