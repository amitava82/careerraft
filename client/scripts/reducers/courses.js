/**
 * Created by amitava on 08/02/16.
 */
import {handleActions} from 'redux-actions';
import update from 'react-addons-update';
import reject from 'lodash/reject'

const initialState = {
    courses: [],
    loading: false
};
export default handleActions({
    LOAD_COURSES: {
        next(state, action){
            return update(state, {
                courses: {$set: action.payload}
            });
        },
        throw(state, action){
            return state
        }
    },

    CREATE_COURSE: {
        next(state, action) {
            return update(state, {
                courses: {$push: [action.payload]}
            });
        }
    },

    DELETE_COURSE: {
        next(state, action) {
            const [id] = action.meta;
            const items = reject(state.courses, {_id: id});

            return update(state, {
                courses: {$set: items}
            });
        }
    }

}, initialState)