/**
 * Created by amitava on 31/01/16.
 */
import { resolve, reject as _reject } from '../middleware/simple-promise';
import extend from 'lodash/extend';

import createAction from '../createActions';

const [STORE_SESSION, SIGNUP, LOGIN, RESET_PASSWORD] = createAction('session', ["STORE_SESSION", "SIGNUP", "LOGIN", "RESET_PASSWORD"]);



const initialState = {
    user: null,
    isLoggedIn: false,
    loading: false,
    error: null
};

export default function(state = initialState, action = {}){
    switch (action.type){
        case STORE_SESSION:
        case resolve(LOGIN):
            return extend({}, state, {
                user: action.payload,
                isLoggedIn: !!action.payload._id,
                loading: false,
                error: null
            });

        case SIGNUP:
        case LOGIN:
        case RESET_PASSWORD:
            return extend({}, state, {
                loading: true,
                error: null
            });

        case _reject(SIGNUP):
        case _reject(LOGIN):
        case _reject(RESET_PASSWORD):
            return extend({}, state, {
                loading: false,
                error: action.payload
            });

        case resolve(SIGNUP):
        case resolve(RESET_PASSWORD):
            return extend({}, state, {
                loading: false,
                error: null
            });

        case _reject(STORE_SESSION):
            return extend({}, state, {
                error: action.payload,
                isLoggedIn: false,
                user: null
            });

        default:
            return state;
    }
}

export function storeSession(session){
    return {
        type: STORE_SESSION,
        payload: session
    }
}

export function signup(data){
    return {
        type: SIGNUP,
        payload: {
            promise: api => api.post('auth/signup', {data, prefix: false})
        }
    }
}

export function login(email, password){
    return {
        type: LOGIN,
        payload: {
            promise: api => api.post('auth/login/local', {data: {email, password}, prefix: false})
        }
    }
}

export function resetPassword(email){
    return {
        type: RESET_PASSWORD,
        payload: {
            promise: api => api.post('auth/reset', {data: {email}, prefix: false})
        }
    }
}