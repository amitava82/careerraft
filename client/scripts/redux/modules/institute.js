/**
 * Created by amitava on 31/01/16.
 */

import update from 'react-addons-update';
import reject from 'lodash/reject';
import { resolve, reject as _reject } from 'redux-simple-promise';

import createAction from '../createActions';

const [LOAD, CREATE, DELETE, GET, ADD_SUBJECT] = createAction('institute', ["LOAD", "CREATE", "DELETE", "GET", "ADD_SUBJECT"]);


const initialState = {
    institutes: [],
    selected: null,
    error: null,
    loading: false
};

export default function(state = initialState, action = {}){

    switch (action.type){
        case LOAD:
        case CREATE:
        case DELETE:
        case GET:
            return update(state, {
                loading: {$set: true},
                error: {$set: null}
            });

        case _reject(LOAD):
        case _reject(CREATE):
        case _reject(DELETE):
        case _reject(GET):
            return update(state, {
                loading: {$set: false},
                error: {$set: action.payload}
            });

        case resolve(LOAD):
            return update(state, {
                institutes: { $set: action.payload},
                loading: {$set: false}
            });

        case resolve(GET):
            return update(state, {
                selected: {$set: action.payload},
                loading: {$set: false}
            });

        case resolve(CREATE):
            return update(state, {
                institutes: {$push: [action.payload]},
                loading: {$set: false}
            });

        default:
            return state;
    }
}

export function loadInstitutes(query){
    return {
        type: LOAD,
        payload: {
            promise: api => api.get(`institutes`, query)
        }
    }
}

export function getInstitute(id){
    return {
        type: GET,
        payload: {
            promise: api => api.get(`institutes/${id}`)
        }
    }
}

export function createInstitute(data) {
    return {
        type: CREATE,
        payload: {
            promise: api => api.post(`institutes`, data)
        }
    }
}

export function addSubject(id, data){
    return {
        type: ADD_SUBJECT,
        payload: {
            promise: api => api.put(`institutes/${id}/subjects`, data)
        }
    }
}