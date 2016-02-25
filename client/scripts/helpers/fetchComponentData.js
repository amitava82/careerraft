/**
 * Created by amitava on 10/02/16.
 */
var _ = require('lodash');

export default function fetchComponentData(dispatch, components, props) {
    var _components = _.compact(components);
    const needs = _components.reduce( (prev, current) => {
        return (current.needs || [])
            .concat((current.WrappedComponent ? current.WrappedComponent.needs : []) || [])
            .concat(prev);
    }, []);

    var fnq = [];
    var n = _.reduce(needs, function(memo, i){
        if(_.isArray(i)){
            var fn = i[0];
            if(fnq.indexOf(fn.name) === -1){
                fnq.push(fn.name);
                memo.push(i);
            }
        }else if(fnq.indexOf(i.name) === -1){
            fnq.push(i.name);
            memo.push(i);
        }
        return memo;
    }, []);

    const promises = n.map(need => {
        if(_.isArray(need)){
            var fn = need[0], params = need[1];
            return dispatch(fn(_.get(props, params)))
        }else {
            return dispatch(need());
        }
    });
    return Promise.all(promises);
}