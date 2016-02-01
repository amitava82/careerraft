/**
 * Created by amitava on 31/01/16.
 */

import {handleActions} from 'redux-actions';
import update from 'react-addons-update';

const initialState = {
    orgs: [],
    org: null
};

export default handleActions({
    LOAD_ORGS: (state, action) => {
        return update(state, {
            orgs: { $set: action.payload}
        });
    }
}, initialState);