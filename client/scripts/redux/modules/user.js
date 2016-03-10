/**
 * Created by amitava on 09/03/16.
 */
import { resolve, reject as _reject } from '../middleware/simple-promise';
import extend from 'lodash/extend';
import union from 'lodash/union';
import Schemas from '../../helpers/schema';

import createAction from '../createActions';

import {promptLogin} from './session';

const [SAVE_ITEM, REMOVE_ITEM, LOAD_LIST] = createAction('user', ["SAVE_ITEM", "REMOVE_ITEM", "LOAD_LIST"]);

const initialState = {
    savedItemsIds: [],
    savedItems: {},
    loading: false,
    error: null
};

export default function(state = initialState, action){

    switch (action.type){

        case SAVE_ITEM:
        case REMOVE_ITEM:
        case LOAD_LIST:
            return extend({}, state, {
                loading: true,
                error: null
            });

        case _reject(SAVE_ITEM):
        case _reject(REMOVE_ITEM):
        case _reject(LOAD_LIST):
            return extend({}, state, {
                loading: false,
                error: action.payload
            });

        case resolve(SAVE_ITEM):
        case resolve(LOAD_LIST):
        case resolve(REMOVE_ITEM):
            return extend({}, state, {
               loading: false,
                savedItemsIds: action.payload.result,
                savedItems: extend({},action.payload.entities.saved_items)
            });

        default:
            return state;

    }
}

export function loadSavedList(){
    return {
        type: LOAD_LIST,
        payload: {
            promise: api => api.get(`user/lists`, {schema: Schemas.SavedItemArray})
        }
    }
}

export function removeSavedItem(id){
    return {
        type: REMOVE_ITEM,
        payload: {
            promise: api => api.del(`user/lists/${id}`, {schema: Schemas.SavedItemArray})
        }
    }
}

export function saveItem(id){

    return function(dispatch, getState){
        if(getState().session_store.isLoggedIn){
            dispatch({
                type: SAVE_ITEM,
                payload: {
                    promise: api => api.post(`user/lists`, {data: {id}, schema: Schemas.SavedItemArray})
                }
            })
        }else{
            dispatch(promptLogin('Please login to save.'));
        }
    }
}