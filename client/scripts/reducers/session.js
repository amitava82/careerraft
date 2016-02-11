/**
 * Created by amitava on 31/01/16.
 */

import {handleActions} from 'redux-actions';
import update from 'react-addons-update';

const initialState = {
    user: null,
    isLoggedIn: false
};

export default handleActions({
    STORE_SESSION: {
        next(state, action){
            return update(state, {
                user: { $set: action.payload},
                isLoggedIn: {$set : !!action.payload._id}
            });
        },
        throw(state, action){
            console.log(action)
            return state;
        }
    }
}, initialState);