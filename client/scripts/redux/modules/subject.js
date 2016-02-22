/**
 * Created by amitava on 08/02/16.
 */
import update from 'react-addons-update';
import reject from 'lodash/reject';
import merge from 'lodash/merge'
import union from 'lodash/union'
import { resolve, reject as _reject } from 'redux-simple-promise';

import createAction from '../createActions';
import Schemas from '../../helpers/schema';

const [LOAD, CREATE] = createAction('subject', ["LOAD", "CREATE"]);



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
            return update(state, {
                loading: {$set: true},
                error: {$set: null}
            });

        case _reject(LOAD):
        case _reject(CREATE):
            console.log(action)
            return update(state, {
                loading: {$set: false},
                error: {$set: action.payload}
            });

        case resolve(LOAD):
            console.log(action)
            return merge({}, state, {
                loading: false,
                ids: union(state.ids, action.payload.result),
                entities: action.payload.entities.subjects
            });

        case resolve(CREATE):
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