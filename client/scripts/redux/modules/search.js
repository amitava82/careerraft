/**
 * Created by amitava on 31/01/16.
 */

import reject from 'lodash/reject';
import merge from 'lodash/merge';
import union from 'lodash/union';
import extend from 'lodash/extend';
import get from 'lodash/get';
import { resolve, reject as _reject } from '../middleware/simple-promise';
import simpleStore from '../../utils/simpleStore';

import createAction from '../createActions';

const [SET_LOCATION, SEARCH, FILTERS, GEO_LOOKUP, RESET, SUGGESTIONS] = createAction('search',
    ["SET_LOCATION", "SEARCH", "DELETE", "GET", "FILTERS", "GEO_LOOKUP", "RESET", "SUGGESTIONS"]);

const loc = simpleStore('user_location');
const initialState = {
    query: null,
    location: loc,
    results: [],
    filters: {},
    limit: 10,
    offset: 0,
    total: 0,
    loading: false,
    search_location: get(loc, 'label'), //for ui
    error: null,
    recent_search: {} // not used
};

export default function(state = initialState, action = {}){

    switch (action.type) {
        case SEARCH:
            return extend({}, state, {
                loading: true,
                results: [],
                filters: {},
                error: null
            });

        case _reject(SEARCH):
        case _reject(FILTERS):
            return extend({}, state, {
                loading: false,
                error: action.payload
            });

        case SET_LOCATION:
            simpleStore('user_location', action.payload);
            return extend({}, state, {
                location: action.payload
            });

        case resolve(SEARCH):
            return extend({}, state, {
                loading: false,
                results: action.payload.results,
                filters: action.payload.aggs,
                query: action.meta.query,
                search_location: get(state.location, 'label')
            });

        case RESET:
            return extend({}, state, {
                results: [],
                filters: {},
                search_location: get(state.location, 'label')
            });

        case resolve(FILTERS):
            return extend({}, state, {
                loading: false,
                filters: action.payload
            });

        case resolve(GEO_LOOKUP):
            const pay = action.payload;
            if(pay.city && pay.longitude && pay.latitude){
                return extend({}, state, {
                    location: {
                        label: pay.city,
                        location: [pay.longitude, pay.latitude]
                    }
                });
            }else
                return state;

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

export function geoIP(ip){
    return {
        type: GEO_LOOKUP,
        payload: {
            promise: api => api.get(`http://freegeoip.net/json/${ip}`)
        }
    }
}

export function loadSuggestions(input){
    return {
        type: SUGGESTIONS,
        payload: {
            promise: api => api.get('search/suggestions', {params: {q: input}})
        }
    }
}

export function search(query){
    return {
        type: SEARCH,
        payload: {
            promise: api => api.get('v2/search', {params: query}),
            query: query
        }
    }
}

export function filters(params){
    return {
        type: FILTERS,
        payload: {
            promise: api => api.get('search/filters', {params})
        }
    }
}

export function reset(){
    return {
        type: RESET,
        payload: null
    }
}