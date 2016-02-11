/**
 * Created by amitava on 11/02/16.
 */
var _ = require('lodash');

module.exports = function (deps) {
    return function(err, req, res, next){
        if(err){
            if(err.name === 'ValidationError'){
                var errors = {
                    _error: 'Validation failed.'
                };
                _.reduce(err.errors, (memo, e) => {
                    memo[e.path] = e.message;
                    return memo;
                }, errors);

                res.status(400).send(errors);

            }else{
                res.status(500).send({
                    error: err.name,
                    message: err.message
                });
            }
        }else {
            next();
        }
    }
};