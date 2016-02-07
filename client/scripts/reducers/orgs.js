/**
 * Created by amitava on 31/01/16.
 */

import {handleActions} from 'redux-actions';
import update from 'react-addons-update';

const initialState = {
    institutes: []
};

export default handleActions({
    LOAD_INSTITUTES: {
        next: (state, action) => {
            return update(state, {
                institutes: { $set: action.payload}
            });
        }
    }
}, initialState);