module.exports = function (deps) {

    return function(role){
        return function(req, res, next){
            if(req.user && req.user.role === role) return next();

            if(req.xhr){
                res.status(403).send({
                    message: "You do not have permission to view this resource.",
                    error: 'NoAccess',
                    code: 403
                });
            } else {
                res.redirect('/login');
            }
        };
    }
};