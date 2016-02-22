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

const [LOAD, CREATE, DELETE, GET] = createAction('course', ["LOAD", "CREATE", "DELETE", "GET"]);


const initialState = {
    ids: [],
    entities: {},
    loading: false,
    error: null
};

export default function reducer(state = initialState, action = {}){
    switch (action.type){
        case LOAD:
        case CREATE:
        case DELETE:
        case GET:
            return update(state, {
                loading: {$set: true},
                error: {$set: null}
            });

        case _reject(LOAD):
        case _reject(CREATE):
        case _reject(DELETE):
        case _reject(GET):
            return update(state, {
                loading: {$set: false},
                error: {$set: action.payload}
            });

        case resolve(LOAD):
            return merge({}, state, {
                loading: false,
                ids: union(state.ids, action.payload.result),
                entities: action.payload.entities.courses
            });

        case resolve(CREATE):
            return update(state, {
                courses: {$push: [action.payload]},
                loading: {$set: false}
            });

        case resolve(DELETE):
            const [id] = action.meta;
            const items = reject(state.courses, {_id: id});

            return update(state, {
                courses: {$set: items},
                loading: {$set: false}
            });

        default:
            return state;
    }
}

export function loadCourses(category){
    return {
        type: LOAD,
        payload: {
            promise: api => api.get(`courses`, {params: {category}, schema: Schemas.CourseArray}),
            category
        }
    }
}

export function createCourse(data){
    return {
        type: CREATE,
        payload: {
            promise: api => api.post('courses', {data: data, schema: Schemas.Course}),
            data
        }
    }
}