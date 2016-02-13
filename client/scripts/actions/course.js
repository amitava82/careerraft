/**
 * Created by amitava on 04/02/16.
 */
import { createAction } from 'redux-actions';

import { meta } from './misc';

import Api from '../helpers/api';

const api = new Api();

export const LOAD_COURSES = createAction('LOAD_COURSES', (category) => {
    return api.get(`courses`, {category});
}, meta);

export const CREATE_COURSE = createAction('CREATE_COURSE', data => {
    return api.post('courses', data);
},meta);

export const DELETE_COURSE = createAction('DELETE_COURSE', id => {
    return api.del(`courses/${id}`);
}, meta);