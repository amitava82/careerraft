/**
 * Created by amitava on 08/02/16.
 */
import update from 'react-addons-update';
import reject from 'lodash/reject';
import merge from 'lodash/merge'
import union from 'lodash/union'
import { resolve, reject as _reject } from 'redux-simple-promise';
import Schemas from '../../helpers/schema';

import createAction from '../createActions';

const [LOAD, CREATE, DELETE, GET, UPDATE] = createAction('category', ["LOAD", "CREATE", "DELETE", "GET", "UPDATE"]);


const initialState = {
  ids: [],
  entities: {},
  loading: false,
  error: null
};


export default function (state= initialState, action = {}) {

    switch (action.type){
        case LOAD:
        case CREATE:
        case DELETE:
        case GET:
        case UPDATE:
            return update(state, {
                loading: {$set: true},
                error: {$set: null}
            });

        case _reject(LOAD):
        case _reject(CREATE):
        case _reject(DELETE):
        case _reject(GET):
        case _reject(UPDATE):
            return update(state, {
                loading: {$set: false},
                error: {$set: action.payload}
            });

        case resolve(LOAD):
            return merge({}, state, {
                loading: false,
                ids: union(state.ids, action.payload.result),
                entities: action.payload.entities.categories
            });

        case resolve(CREATE):
        case resolve(UPDATE):
            return merge({}, state, {
                ids: union(state.ids, [action.payload.result]),
                entities: action.payload.entities.categories
            });

        case resolve(DELETE):
            const [id] = action.meta;
            const items = reject(state.categories, {_id: id});

            return update(state, {
                categories: {$set: items}
            });

        default:
            return state;
    }
}

export function loadCategories(){
    return {
        type: LOAD,
        payload: {
            promise: api => api.get(`categories`, {
                schema: Schemas.CategoryArray
            })
        }
    }
}

export function createCategory(data){
    return {
        type: CREATE,
        payload: {
            promise: api => api.post('categories', {
                data: data,
                schema: Schemas.Category
            })
        }
    }
}

export function updateCategory(id, data){
    return {
        type: UPDATE,
        payload: {
            promise: api => api.put(`categories/${id}`, {
                data,
                schema: Schemas.Category
            })
        }
    }
}