/**
 * Created by amitava on 07/02/16.
 */

module.exports = function(deps){

    return {
        suggestion: function (req, res) {
            res.send(req.query)
        }
    }
};