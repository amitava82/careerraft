/**
 * Created by amitava on 08/02/16.
 */
import update from 'react-addons-update';
import reject from 'lodash/reject';
import { resolve, reject as _reject } from 'redux-simple-promise';

import createAction from '../createActions';

const [LOAD, CREATE] = createAction('subject', ["LOAD", "CREATE"]);



const initialState = {
    subjects: [],
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
            return update(state, {
                loading: {$set: false},
                error: {$set: action.payload}
            });

        case resolve(LOAD):
            return update(state, {
                subjects: {$set: action.payload},
                loading: {$set: false}
            });

        case resolve(CREATE):
            return update(state, {
                subjects: {
                    $push: [action.payload],
                    loading: {$set: false}
                }
            });

        default:
            return state;
    }
}

export function getSubjects(query){
    return {
        type: LOAD,
        payload: {
            promise: api => api.get(`subjects`, query)
        }
    }
}

export function createSubject(data){
    return {
        type: CREATE,
        payload: {
            promise: api => api.post('subjects', data)
        }
    }
}