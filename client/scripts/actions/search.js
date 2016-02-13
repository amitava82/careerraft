/**
 * Created by amitava on 07/02/16.
 */
import { createAction } from 'redux-actions';

import { meta } from './misc';

import Api from '../helpers/api';

const api = new Api();

export const LOAD_SEARCH_SUGGESTION = createAction('LOAD_SEARCH_SUGGESTION', (query, location) =>{
    return  api.get('search/suggestion', {
        query: query,
        location: location
    });
}, meta);

export const SET_LOCATION = createAction('SET_LOCATION', (location) => {
    return location;
});

export const SEARCH = createAction('SEARCH', query => {
    return api.get('search', query);
}, meta);