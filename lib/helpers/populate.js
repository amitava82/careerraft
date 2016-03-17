/**
 * Created by amitava on 16/03/16.
 */
var _ = require('lodash');

module.exports = function (query, populate) {
    if(populate){
        if(_.isArray(populate)){
            populate.forEach(p => {
                _.isArray(p) ? query.populate.apply(query, p) : query.populate(p);

            });
        }else
            query.populate(populate);

    }
    return query;
};