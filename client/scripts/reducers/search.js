/**
 * Created by amitava on 31/01/16.
 */

import {handleActions} from 'redux-actions';
import update from 'react-addons-update';

const initialState = {
    query: null,
    location: null,
    results: [],
    loading: false
};

export default handleActions({

    //LOAD_SEARCH_SUGGESTION: {
    //    next(state, action){
    //        console.log(action);
    //        return update(state, {
    //            results: {$set: action.payload}
    //        });
    //    },
    //    throw(state, action){
    //        console.log(action)
    //    }
    //},

    SET_LOCATION: {
        next(state, action) {
            return update(state, {
                location: {
                    $set: action.payload
                }
            })
        },
        throw(state, action) {
            console.log(action)
        }
    },

    SEARCH: {
        next(state, action) {
            return update(state, {
                results: {$set: action.payload}
            })
        }
    }

}, initialState);