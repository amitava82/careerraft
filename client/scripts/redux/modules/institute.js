/**
 * Created by amitava on 31/01/16.
 */

import reject from 'lodash/reject';
import merge from 'lodash/merge'
import union from 'lodash/union'
import { resolve, reject as _reject } from 'redux-simple-promise';
import Schemas from '../../helpers/schema';
import createAction from '../createActions';

const [LOAD, CREATE, DELETE, GET, ADD_SUBJECT, REMOVE_SUBJECT] = createAction('institute', ["LOAD", "CREATE", "DELETE", "GET", "ADD_SUBJECT", "REMOVE_SUBJECT"]);


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
        case DELETE:
        case GET:
        case ADD_SUBJECT:
        case REMOVE_SUBJECT:
            return merge({}, state, {
                loading: true,
                 error: null
            });

        case _reject(LOAD):
        case _reject(CREATE):
        case _reject(DELETE):
        case _reject(GET):
        case _reject(ADD_SUBJECT):
        case _reject(REMOVE_SUBJECT):
            return merge({}, state, {
                loading: false,
                error: action.payload
            });

        case resolve(LOAD):
            return merge({}, state, {
                ids: union(state.ids, action.payload.result),
                entities: action.payload.entities.institutes,
                loading: false
            });

        case resolve(GET):
        case resolve(ADD_SUBJECT):
        case resolve(REMOVE_SUBJECT):
            return merge({}, state, {
                ids: union(state.ids, [action.payload.result]),
                entities: action.payload.entities.institutes,
                loading: false
            });

        case resolve(CREATE):
            return merge({}, state, {
                ids: union(state.ids, [action.payload.result]),
                entities: action.payload.entities.institutes
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