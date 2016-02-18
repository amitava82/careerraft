/**
 * Created by amitava on 04/02/16.
 */
import {createAction} from 'redux-actions';
import Api from '../helpers/api';
const api = new Api();

export function meta(){
    var args = arguments;
    return Array.prototype.slice.apply(args);
}

export const TOAST = createAction('TOAST', data => {
    return data;
});

export const REMOVE_TOAST = createAction('REMOVE_TOAST', id => {
    return id;
});

export const SEND_MAIL = createAction('SEND_MAIL', data =>{
    return api.post('misc/send_mail', data);
})