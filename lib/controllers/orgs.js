var _ = require('lodash');

module.exports = function(deps){
    return {

        create: function (req, res) {
                var org = new deps.models.Organization(req.body);
                org.save().then(
                    doc => res.send(doc),
                    err => res.status(500).send(err)
                )
        },

        list: function(req, res){
            deps.models.Organization.find({})
                .populate('parent').exec().then(
                orgs => res.send(orgs),
                err => res.status(500).send(err)
            )
        }
    }
};

function distance2radius(distance){
    return distance / 6.378;
}