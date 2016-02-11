/**
 * Created by amitava on 04/02/16.
 */
import { createAction } from 'redux-actions';
import { meta } from './misc';

import Api from '../helpers/api';

const api = new Api();

export const LOAD_INSTITUTES = createAction('LOAD_INSTITUTES', (query) => {
    return api.get(`orgs`, query);
}, meta);

export const LOAD_INSTITUTE = createAction('LOAD_INSTITUTE', id => {
    return api.get(`orgs/${id}`);
}, meta);

export const CREATE_INSTITUTE = createAction('CREATE_INSTITUTE', data => {
    return api.post(`orgs`, data);
}, meta);