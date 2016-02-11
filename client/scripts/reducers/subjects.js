/**
 * Created by amitava on 08/02/16.
 */
import {handleActions} from 'redux-actions';
import update from 'react-addons-update';

const initialState = {
    subjects: [],
    loading: false
};
export default handleActions({
    LOAD_SUBJECTS: {
        next(state, action){
            return update(state, {
                subjects: {$set: action.payload}
            });
        },
        throw(state, action){
            return state
        }
    },

    CREATE_SUBJECT: {
        next(state, action) {
            return update(state, {
                subjects: {
                    $push: [action.payload]
                }
            })
        }
    }
}, initialState)