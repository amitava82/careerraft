var winston = require('winston');
require('winston-mongodb').MongoDB;

module.exports = function(dep){
    winston.add(winston.transports.MongoDB, {
        db: 'mongodb://logger:amitava@ds011158.mlab.com:11158/raft_log',
        level: 'error'
    });
    return function (callback) {
        callback(null, {
            error: function (err) {
                winston.log('error', err);
            }
        });
    }
};