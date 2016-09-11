/**
 * Created by amitava on 17/04/16.
 */
var elasticsearch = require('elasticsearch');

module.exports = function (deps) {
  return function(done){
      var client = new elasticsearch.Client({
          host: 'localhost:9200',
          log: 'trace'
      });

      client.ping({
          hello: "elasticsearch!"
      }, function (error) {
          if (error) {
              done(error);
          } else {
              done(null, client);
          }
      });
  }

};