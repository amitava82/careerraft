module.exports = function(dep){
    return function (callback) {
        callback(null, {
            error: function () {
                console.log(arguments);
            }
        })
    }
};