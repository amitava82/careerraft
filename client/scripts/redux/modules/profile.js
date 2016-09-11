/**
 * Created by amitava on 31/01/16.
 */

import reject from 'lodash/reject';
import merge from 'lodash/merge';
import union from 'lodash/union';
import extend from 'lodash/extend';
import { resolve, reject as _reject } from '../middleware/simple-promise';
import Schemas from '../../helpers/schema';
import createAction from '../createActions';

const [LOAD, CREATE, UPDATE, DELETE, GET, SEND_QUERY, DELETE_COURSE, CREATE_PROVIDER] =
    createAction('profile', ["LOAD", "CREATE", "UPDATE", "DELETE", "GET",  "SEND_QUERY", "DELETE_COURSE", "CREATE_PROVIDER"]);


const initialState = {
    ids: [],
    entities: {},
    error: null,
    loading: false
};

export default function(state = initialState, action = {}){

    switch (action.type){
        case LOAD:
        case CREATE:
        case UPDATE:
        case DELETE:
        case GET:
        case DELETE_COURSE:
        //case LOAD_BRANCHES:
            return merge({}, state, {
                loading: true,
                 error: null
            });

        case _reject(LOAD):
        case _reject(CREATE):
        case _reject(UPDATE):
        case _reject(DELETE):
        case _reject(GET):
        case _reject(DELETE_COURSE):
            return merge({}, state, {
                loading: false,
                error: action.payload
            });

        case resolve(LOAD):
            return extend({}, state, {
                ids: union(state.ids, action.payload.result),
                entities: extend({}, state.entities, action.payload.entities.institutes),
                loading: false
            });

        case resolve(GET):
        case resolve(CREATE):
        case resolve(UPDATE):
            return extend({}, state, {
                ids: union(state.ids, [action.payload.result]),
                entities: extend({}, state.entities, action.payload.entities.institutes),
                loading: false
            });

        case resolve(DELETE_COURSE):
            const p = state.entities[action.payload._id];
            p.courses = reject(p.courses, c => (c.course._id == action.meta.course));
            return extend({}, state, {
                entities: extend({}, state.entities, {[p._id]: p}),
                loading: false
            });

        default:
            return state;
    }
}

export function loadProfiles(query){
    return {
        type: LOAD,
        payload: {
            promise: api => api.get(`profiles`, {
                params: query,
                schema: Schemas.InstituteArray
            })
        }
    }
}


export function getProfile(id){
    return {
        type: GET,
        payload: {
            promise: api => api.get(`profiles/${id}`, {
                schema: Schemas.Institute
            })
        }
    }
}

export function createProfile(data) {
    return {
        type: CREATE,
        payload: {
            promise: api => api.post(`profiles`, {data: data, schema: Schemas.Institute})
        }
    }
}

export function createProvider(data) {
    return {
        type: CREATE_PROVIDER,
        payload: {
            promise: api => api.post(`providers`, {data: data})
        }
    }
}

export function update(id, data) {
    return {
        type: UPDATE,
        payload: {
            promise: api => api.put(`profiles/${id}`, {data, schema: Schemas.Institute})
        }

    }
}

export function sendQuery(id, data){
    return {
        type: SEND_QUERY,
        payload: {
            promise: api => api.post(`institutes/${id}/contact`, {data})
        }
    }
}

export function deleteCourse(profile, course){
    return {
        type: DELETE_COURSE,
        payload: {
            promise: api => api.del(`/profiles/${profile}/courses/${course}`),
            profile,
            course
        }
    }
}