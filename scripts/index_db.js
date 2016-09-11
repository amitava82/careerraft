/**
 * Created by amitava on 13/05/16.
 */
require("babel-register");

var _  = require('lodash');

require('./bootstrap')(function (error, deps) {

    var elastic = require('../lib/elasticsearch/index')(deps);
    
    deps.models.Profile.find({}).select('_id').lean().exec().then(
        function (r) {
            elastic.createProfileIndexBulk(_.map(r, '_id'), function(){
                console.log('+++++Index Created+++++');
                process.exit(1);
            });
        }
    )

});