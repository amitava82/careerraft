/**
 * Created by amitava on 31/01/16.
 */

import {handleActions} from 'redux-actions';
import update from 'react-addons-update';

const initialState = {
    institutes: [],
    selected: null
};

export default handleActions({
    LOAD_INSTITUTES: {
        next(state, action){
            return update(state, {
                institutes: { $set: action.payload}
            });
        }
    },

    LOAD_INSTITUTE: {
        next(state, action){
            return update(state, {
                selected: {$set: action.payload}
            });
        }
    },

    CREATE_INSTITUTE: {
        next(state, action){
            return update(state, {
                institutes: {$push: [action.payload]}
            });
        }
    }
}, initialState);