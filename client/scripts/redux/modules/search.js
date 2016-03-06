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

const [SET_LOCATION, SEARCH, FILTERS, GEO_LOOKUP] = createAction('search', ["SET_LOCATION", "SEARCH", "DELETE", "GET", "FILTERS", "GEO_LOOKUP"]);


const initialState = {
    query: null,
    location: simpleStore('user_location'),
    results: [],
    filters: {},
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
            simpleStore('user_location', action.payload);
            return merge({}, state, {
                location: action.payload
            });

        case resolve(SEARCH):
            return extend({}, state, {
                loading: false,
                results: action.payload
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
            promise: api => api.get('search', {params: query})
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
