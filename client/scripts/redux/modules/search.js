/**
 * Created by amitava on 31/01/16.
 */

import update from 'react-addons-update';
import reject from 'lodash/reject';
import { resolve, reject as _reject } from 'redux-simple-promise';

import createAction from '../createActions';

const [SET_LOCATION, SEARCH, DELETE, GET] = createAction('search', ["SET_LOCATION", "SEARCH", "DELETE", "GET"]);


const initialState = {
    query: null,
    location: null,
    results: [],
    loading: false,
    error: null
};

export default function(state = initialState, action = {}){

    switch (action.type) {
        case SEARCH:
            return update(state, {
                loading: {$set: true},
                error: {$set: null}
            });

        case _reject(SEARCH):
            return update(state, {
                loading: {$set: false},
                error: {$set: action.payload}
            });

        case SET_LOCATION:
            return update(state, {
                location: {
                    $set: action.payload
                }
            });

        case resolve(SEARCH):
            return update(state, {
                results: {$set: action.payload},
                loading: {$set: false}
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