/**
 * Created by amitava on 08/02/16.
 */
import reject from 'lodash/reject';
import merge from 'lodash/merge'
import union from 'lodash/union'
import { resolve, reject as _reject } from '../middleware/simple-promise';

import createAction from '../createActions';
import Schemas from '../../helpers/schema';

const [LOAD, CREATE, UPDATE] = createAction('subject', ["LOAD", "CREATE", "UPDATE"]);



const initialState = {
    ids: [],
    entities: {},
    loading: false,
    error: null
};

export default function (state= initialState, action = {}) {

    switch (action.type){
        case LOAD:
        case CREATE:
        case UPDATE:
            return merge({}, state, {
                loading: true,
                error: null
            });

        case _reject(LOAD):
        case _reject(CREATE):
        case _reject(UPDATE):
            return merge({}, state, {
                loading: false,
                error: action.payload
            });

        case resolve(LOAD):
            return merge({}, state, {
                loading: false,
                ids: union(state.ids, action.payload.result),
                entities: action.payload.entities.subjects
            });

        case resolve(CREATE):
        case resolve(UPDATE):
            return merge({}, state, {
                loading: false,
                ids: union(state.ids, [action.payload.result]),
                entities: action.payload.entities.subjects
            });

        default:
            return state;
    }
}

export function getSubjects(query){
    return {
        type: LOAD,
        payload: {
            promise: api => api.get(`subjects`, {params: query, schema: Schemas.SubjectArray})
        }
    }
}

export function createSubject(data){
    return {
        type: CREATE,
        payload: {
            promise: api => api.post('subjects', {data: data, schema: Schemas.Subject})
        }
    }
}

export function update(id, data){
    return {
        type: UPDATE,
        payload: {
            promise: api => api.put(`subjects/${id}`, {data, schema: Schemas.Subject})
        }
    }
}