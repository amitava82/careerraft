/**
 * Created by amitava on 04/02/16.
 */
import { createAction } from 'redux-actions';

import { meta } from './misc';

import Api from '../helpers/api';

const api = new Api();

export const LOAD_CATEGORIES = createAction('LOAD_CATEGORIES', () => {
    return api.get(`categories`);
}, meta);

export const CREATE_CATEGORY = createAction('CREATE_CATEGORY',(data) => {
    return api.post('categories', data);
});

export const DELETE_CATEGORY = createAction('DELETE_CATEGORY', id => {
    return api.del(`categories/${id}`);
}, meta);