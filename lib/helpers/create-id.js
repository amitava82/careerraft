/**
 * Created by amitava on 17/02/16.
 */
module.exports = function(str){
    return str.toLowerCase().replace(/[^a-z0-9]/g, '-')
};