/**
 * Created by amitava on 20/02/16.
 */

export default function clientMiddleware() {
    return ({dispatch, getState}) => {
        return next => action => {
            const {payload, meta} = action;
            if(payload && meta && meta.schema){

            }
            console.log('normalizer: ', action);

            return next(action);
        };
    };
}