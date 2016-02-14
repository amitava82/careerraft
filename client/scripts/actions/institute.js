/**
 * Created by amitava on 04/02/16.
 */
import { createAction } from 'redux-actions';
import { meta } from './misc';

import Api from '../helpers/api';

const api = new Api();

export const LOAD_INSTITUTES = createAction('LOAD_INSTITUTES', (query) => {
    return api.get(`institutes`, query);
}, meta);

export const LOAD_INSTITUTE = createAction('LOAD_INSTITUTE', id => {
    return api.get(`institutes/${id}`);
}, meta);

export const CREATE_INSTITUTE = createAction('CREATE_INSTITUTE', data => {
    return api.post(`institutes`, data);
}, meta);

export const ADD_SUBJECTS = createAction('ADD_SUBJECTS', (id, data) => {
    return api.put(`institutes/${id}/subjects`, data);
}, meta);