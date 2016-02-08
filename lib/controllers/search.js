/**
 * Created by amitava on 07/02/16.
 */
var _ = require("lodash");
var Promise = require("bluebird");

module.exports = function(deps){

    return {
        suggestion: function (req, res) {
            var models = deps.models;
            var Org = models.Organization;
            var Category = models.Category;
            var Course = models.Course;
            var Subject = models.Subject;

            var query = req.query;
            var loc = req.query.location;

            if(loc){
                loc = [loc.lng, loc. lat];
            }

            Promise.all([
                Org.find({
                    name: new RegExp(query.query, 'i')
                }).where('address.loc').near(loc).limit(3).exec(),
                Category.find({
                    name: new RegExp(query.query, 'i')
                }).limit(3).exec(),
                Course.find({
                    name: new RegExp(query.query, 'i')
                }).limit(3).exec(),
                Subject.find({
                    name: new RegExp(query.query, 'i')
                }).limit(3).exec()
            ]).then(
                ([orgs, categories, courses]) => res.send({orgs, categories, courses}),
                err => res.status(500).send(err)
            );
        }
    }
};