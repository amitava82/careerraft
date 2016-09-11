/**
 * Created by amitava on 03/05/16.
 */
import reject from 'lodash/reject';
import merge from 'lodash/merge';
import union from 'lodash/union';
import extend from 'lodash/extend';
import { resolve, reject as _reject } from '../middleware/simple-promise';
import Schemas from '../../helpers/schema';
import createAction from '../createActions';

const [LOAD, CREATE, UPDATE] = createAction("provider", ["LOAD", "CREATE", "UPDATE"]);

const initialState = {
    loading: false,
    error: null,
    providers: {}
};

export default function (state = initialState, action) {

    switch (action.type){
        case LOAD:
        case CREATE:
        case UPDATE:
            return merge({}, state, {
                loading: true,
                error: null
            });

        case _reject(LOAD):
        case _reject(CREATE):
        case _reject(UPDATE):
            return merge({}, state, {
                loading: false,
                error: action.payload
            });

        case resolve(LOAD):
        case resolve(CREATE):
        case resolve(UPDATE):
            const providers = extend({}, state.providers, {[action.payload._id]: action.payload});
            return extend({}, state, {
                providers,
                loading: false
            });
        default:
            return state;
    }
}

export function loadProvider(id){
    return {
        type: LOAD,
        payload: {
            promise: api => api.get(`providers/${id}`)
        }
    }
}

export function createProvider(data){
    return {
        type: CREATE,
        payload: {
            promise: api => api.post(`providers`, {data})
        }
    }
}

export function updateProvider(id, data){
    return {
        type: CREATE,
        payload: {
            promise: api => {
                return api.put(`providers/${id}`, {data}).then(
                    r => api.get(`providers/${id}`),
                    e => e
                )
            }
        }
    }
}