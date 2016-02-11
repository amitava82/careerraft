/**
 * Created by amitava on 04/02/16.
 */
import { createAction } from 'redux-actions';

import { meta } from './misc';

import Api from '../helpers/api';

const api = new Api();

export const LOAD_SUBJECTS = createAction('LOAD_SUBJECTS', () => {
    return api.get(`subjects`);
}, meta);

export const CREATE_SUBJECT = createAction('CREATE_SUBJECT', data => {
    return api.post('subjects', data);
}, meta);