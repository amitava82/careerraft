/**
 * Created by amitava on 16/03/16.
 */

if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require);

function asyncRequire(module){
    return function (loc, cb) {
        require.ensure([], require => {
            cb(null, require(module).default);
        });
    }
}

export default  {
        About: asyncRequire('./about'),
        Team: asyncRequire('./team'),
        Values: asyncRequire('./values'),
        Educator: asyncRequire('./educator'),
        Contact: asyncRequire('./contact')
    }
