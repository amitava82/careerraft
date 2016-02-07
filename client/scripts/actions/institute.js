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