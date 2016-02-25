/**
 * Created by amitava on 31/01/16.
 */

import reject from 'lodash/reject';
import merge from 'lodash/merge';
import union from 'lodash/union';
import extend from 'lodash/extend';
import { resolve, reject as _reject } from '../middleware/simple-promise';

import createAction from '../createActions';

const [SET_LOCATION, SEARCH] = createAction('search', ["SET_LOCATION", "SEARCH", "DELETE", "GET"]);


const initialState = {
    query: null,
    location: null,
    results: [],
    loading: false,
    error: null,
    recent_search: {},
    limit: 10,
    page: 1
};

export default function(state = initialState, action = {}){

    switch (action.type) {
        case SEARCH:
            return merge({}, state, {
                loading: true,
                error: null
            });

        case _reject(SEARCH):
            return merge({}, state, {
                loading: false,
                error: action.payload
            });

        case SET_LOCATION:
            return merge({}, state, {
                location: action.payload
            });

        case resolve(SEARCH):
            return extend({}, state, {
                loading: false,
                results: action.payload
            });

        default:
            return state;
    }
}

export function setLocation(loc){
    return {
        type: SET_LOCATION,
        payload: loc
    }
}

export function search(query){
    return {
        type: SEARCH,
        payload: {
            promise: api => api.get('search', {params: query})
        }
    }
}
