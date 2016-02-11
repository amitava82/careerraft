/**
 * Created by amitava on 08/02/16.
 */
import {handleActions} from 'redux-actions';
import update from 'react-addons-update';

import reject from 'lodash/reject';

const initialState = {
  categories: [],
  loading: false
};
export default handleActions({
    LOAD_CATEGORIES: {
        next(state, action){
            return update(state, {
                categories: {$set: action.payload}
            });
        },
        throw(state, action){
            return state
        }
    },

    CREATE_CATEGORY: {
        next(state, action) {
            return update(state, {
                categories: {$push: [action.payload]}
            });
        }
    },

    DELETE_CATEGORY: {
        next(state, action) {
            const [id] = action.meta;
            const items = reject(state.categories, {_id: id});

            return update(state, {
                categories: {$set: items}
            });
        }
    }
}, initialState)