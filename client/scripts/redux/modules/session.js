/**
 * Created by amitava on 31/01/16.
 */
import update from 'react-addons-update';
import { resolve, reject as _reject } from '../middleware/simple-promise';

import createAction from '../createActions';

const [STORE_SESSION] = createAction('session', ["STORE_SESSION"]);



const initialState = {
    user: null,
    isLoggedIn: false,
    loading: false,
    error: null
};

export default function(state = initialState, action = {}){
    switch (action.type){
        case STORE_SESSION:
            return update(state, {
                user: { $set: action.payload},
                isLoggedIn: {$set : !!action.payload._id}
            });

        case _reject(STORE_SESSION):
            return update(state, {
                error: {$set: action.payload},
                isLoggedIn: {$set: false},
                user: {$set: null}
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