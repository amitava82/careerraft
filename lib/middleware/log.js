module.exports = function (deps) {

  return function(req, res, next){
      console.log(req.method, req.originalUrl, req.query, req.body);
      next();
  };
};