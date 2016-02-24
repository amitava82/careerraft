/**
 * Created by amitava on 10/02/16.
 */
var _ = require('lodash');

export default function fetchComponentData(dispatch, components, params) {
    var _components = _.compact(components);
    const needs = _components.reduce( (prev, current) => {
        return (current.needs || [])
            .concat((current.WrappedComponent ? current.WrappedComponent.needs : []) || [])
            .concat(prev);
    }, []);

    const promises = needs.map(need => dispatch(need(params)));
    return Promise.all(promises);
}