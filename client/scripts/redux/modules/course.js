/**
 * Created by amitava on 08/02/16.
 */
import reject from 'lodash/reject';
import merge from 'lodash/merge'
import union from 'lodash/union'

import { resolve, reject as _reject } from 'redux-simple-promise';

import Schemas from '../../helpers/schema';
import createAction from '../createActions';

const [LOAD, CREATE, DELETE, GET, UPDATE] = createAction('course', ["LOAD", "CREATE", "DELETE", "GET", "UPDATE"]);


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
        case UPDATE:
            return merge({}, state, {
                loading: true,
                error: null
            });

        case _reject(LOAD):
        case _reject(CREATE):
        case _reject(DELETE):
        case _reject(GET):
        case _reject(UPDATE):
            return merge({}, state, {
                loading: false,
                error: action.payload
            });

        case resolve(LOAD):
            return merge({}, state, {
                loading: false,
                ids: union(state.ids, action.payload.result),
                entities: action.payload.entities.courses
            });

        case resolve(CREATE):
        case resolve(UPDATE):
            return merge({}, state, {
                ids: union(state.ids, [action.payload.result]),
                entities: action.payload.entities.courses,
                loading: false
            });

        case resolve(DELETE):
            const [id] = action.meta;
            const items = reject(state.courses, {_id: id});

            //TODO
            return merge({}, state, {

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

export function update(id, data){
    return {
        type: UPDATE,
        payload: {
            promise: api => api.put(`courses/${id}`, {data, schema: Schemas.Course})
        }
    }
}