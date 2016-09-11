/**
 * Created by amitava on 30/03/16.
 */
module.exports = function(deps){
    
    var Collection = deps.models.Collection;
    
    return {
        
        get: function (req, res, next) {
            res.send('OK');
        },

        create: function (req, res, next) {

        },

        list: function (req, res, next) {
            
        },

        delete: function (req, res, next) {

        },

        update: function (req, res, next) {

        }

    }
};