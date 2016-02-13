/**
 * Created by amitava on 11/02/16.
 */

function isPromise(val) {
    return val && typeof val.then === 'function';
}

export default function promiseMiddleware(_ref) {
    var dispatch = _ref.dispatch;

    return function (next) {
        return function (action) {
            if (!action.payload) {
                return isPromise(action) ? action.then(dispatch) : next(action);
            }

            return isPromise(action.payload) ? action.payload.then(function (result) {
                dispatch(Object.assign({}, action, { payload: result }));
                return Promise.resolve(result);
            }, function (error) {
                dispatch(Object.assign({}, action, { payload: error, error: true }));
                return Promise.reject(error);
            }) : next(action);
        };
    };
}
