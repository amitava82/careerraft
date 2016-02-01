/**
 * Created by amitava on 31/01/16.
 */
import { createAction, handleAction, handleActions } from 'redux-actions';
import { get } from 'superagent-bluebird-promise';


export const LOAD_ORGS = createAction('LOAD_ORGS', (id) => {
    return get(`/api/orgs`).promise().get('body');
}, meta)

export const STORE_SELF = createAction('STORE_SELF', () => {
    return get(`/api/orgs`).promise().get('body');
}, meta);


function meta(){
    console.log(this);
    var args = arguments;
    return Array.prototype.slice.apply(args);
}