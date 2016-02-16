/**
 * Created by amitava on 16/02/16.
 */
import {handleActions} from 'redux-actions';
import update from 'react-addons-update';
import extend from 'lodash/extend';
import reject from 'lodash/reject';

const initialState = {
    toasts: []
};

const toastDefaults = {
  type: 'info',
  timeout: 5000
};

export default handleActions({
    TOAST: {
        next(state, action){
            const data = action.payload;
            const toast = {};
            if (typeof data === 'string'){
                toast.text = data;
                extend(toast, toastDefaults);
            }else {
                extend(toast, toastDefaults, data);
            }
            toast.id = id();
            return update(state, {
              toasts: {$push: [toast]}
            });
        }
    },

    REMOVE_TOAST: {
        next(state, action) {
            return update(state, {
                toasts: {$set: reject(state.toasts, {id: action.payload})}
            })
        }
    }
}, initialState)


function id(){
    return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
}