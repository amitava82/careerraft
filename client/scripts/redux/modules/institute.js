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

const [LOAD, CREATE, UPDATE, DELETE, GET, ADD_SUBJECT, REMOVE_SUBJECT, UPDATE_BRANCHES, SEND_QUERY] = createAction('institute',
    ["LOAD", "CREATE", "UPDATE", "DELETE", "GET", "ADD_SUBJECT", "REMOVE_SUBJECT", "UPDATE_BRANCHES", "SEND_QUERY"]);


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
        case ADD_SUBJECT:
        case REMOVE_SUBJECT:
        case UPDATE_BRANCHES:
            return merge({}, state, {
                loading: true,
                 error: null
            });

        case _reject(LOAD):
        case _reject(CREATE):
        case _reject(UPDATE):
        case _reject(DELETE):
        case _reject(GET):
        case _reject(ADD_SUBJECT):
        case _reject(REMOVE_SUBJECT):
        case _reject(UPDATE_BRANCHES):
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
        case resolve(ADD_SUBJECT):
        case resolve(REMOVE_SUBJECT):
        case resolve(UPDATE_BRANCHES):
        case resolve(CREATE):
        case resolve(UPDATE):
            return extend({}, state, {
                ids: union(state.ids, [action.payload.result]),
                entities: action.payload.entities.institutes,
                loading: false
            });

        default:
            return state;
    }
}

export function loadInstitutes(query){
    return {
        type: LOAD,
        payload: {
            promise: api => api.get(`institutes`, {
                params: query,
                schema: Schemas.InstituteArray
            })
        }
    }
}

export function getInstitute(id){
    return {
        type: GET,
        payload: {
            promise: api => api.get(`institutes/${id}`, {
                schema: Schemas.Institute
            })
        }
    }
}

export function createInstitute(data) {
    return {
        type: CREATE,
        payload: {
            promise: api => api.post(`institutes`, {data: data, schema: Schemas.Institute})
        }
    }
}

export function update(id, data) {
    return {
        type: UPDATE,
        payload: {
            promise: api => api.put(`institutes/${id}`, {data, schema: Schemas.Institute})
        }

    }
}

export function addSubject(id, data){
    return {
        type: ADD_SUBJECT,
        payload: {
            promise: api => api.put(`institutes/${id}/subjects`, {data: data, schema: Schemas.Institute})
        }
    }
}

export function removeSubject(id, subject){
    return {
        type: REMOVE_SUBJECT,
        payload: {
            promise: api => api.del(`institutes/${id}/subjects/${subject}`, {schema: Schemas.Institute})
        }
    }
}

export function updateBranches(id, branches){
    return {
        type: UPDATE_BRANCHES,
        payload: {
            promise: api => api.put(`institutes/${id}/branches`, {data: branches, schema: Schemas.Institute})
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