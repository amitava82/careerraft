/**
 * Created by amitava on 04/02/16.
 */
import { createAction } from 'redux-actions';
import { get } from 'superagent-bluebird-promise';

import { meta } from './misc';

export const LOAD_COURSES = createAction('LOAD_COURSES', () => {
    return get(`/api/courses`).promise().get('body');
}, meta);