/**
 * Created by amitava on 04/02/16.
 */
import {createAction} from 'redux-actions';
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