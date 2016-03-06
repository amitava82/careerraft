/**
 * Created by amitava on 31/01/16.
 */

import reject from 'lodash/reject';
import merge from 'lodash/merge';
import union from 'lodash/union';
import extend from 'lodash/extend';
import { resolve, reject as _reject } from '../middleware/simple-promise';
import simpleStore from '../../utils/simpleStore';

import createAction from '../createActions';

const [SET_LOCATION, SEARCH, FILTERS, GEO_LOOKUP, RESET] = createAction('search', ["SET_LOCATION", "SEARCH", "DELETE", "GET", "FILTERS", "GEO_LOOKUP", "RESET"]);


const initialState = {
    query: null,
    location: simpleStore('user_location'),
    results: [],
    filters: {},
    loading: false,
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
                results: action.payload,
                query: action.meta.query
            });

        case RESET:
            return extend({}, state, {
                results: [],
                filters: {}
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

export function search(query){
    return {
        type: SEARCH,
        payload: {
            promise: api => api.get('search', {params: query}),
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