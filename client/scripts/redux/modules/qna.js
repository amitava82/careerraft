import reject from 'lodash/reject';
import merge from 'lodash/merge';
import union from 'lodash/union';
import extend from 'lodash/extend';
import get from 'lodash/get';
import { resolve, reject as _reject } from '../middleware/simple-promise';

import Schemas from '../../helpers/schema';

import createAction from '../createActions';

const [LOAD, SAVE_QUESTION, SAVE_ANSWER, SAVE_REPLY] = createAction('qna', ["LOAD", "SAVE_QUESTION", "SAVE_ANSWER", "SAVE_REPLY"]);

const initialState = {
    ids: [],
    entities: {},
    loading: false,
    error: null
}

export default function(state = initialState, action = {}){
    switch (action.type) {
        case LOAD:
        case SAVE_QUESTION:
        case SAVE_ANSWER:
        case SAVE_REPLY:
            return extend({}, state, {
                loading: true,
                error: null
            });    
            break;
            
        case _reject(LOAD):    
        case _reject(SAVE_QUESTION):    
        case _reject(SAVE_ANSWER):    
        case _reject(SAVE_REPLY):
            return extend({}, state, {
                loading: false,
                error: action.payload
            });
            
       case resolve(LOAD):
            return extend({}, state, {
                ids: union(state.ids, action.payload.result),
                entities: extend(state.entities, action.payload.entities.questions),
                loading: false
            });    
       case resolve(SAVE_ANSWER):
       case resolve(SAVE_QUESTION):
       case resolve(SAVE_REPLY):    
            return extend({}, state, {
               ids: union(state.ids, [action.payload.result]),
               entities: extend(state.entities, action.payload.entities.questions),
               loading: false 
            });        
            
        
    
        default:
            return state;
    }
}

export function loadQnA(org) {
    return {
        type: LOAD,
        payload: {
            promise: api => api.get(`questions/${org}`, {schema: Schemas.QuestionsArray})
        }
    }
}

export function saveQuestion(org, title) {
    return {
        type: SAVE_QUESTION,
        payload: {
            promise: api => api.post(`questions/${org}`, {data: {title}, schema: Schemas.Question})
        }
    }
}

export function saveAnswer(q, data) {
    return {
        type: SAVE_ANSWER,
        payload: {
            promise: api => api.post(`questions/${q}/answers`, {data, schema: Schemas.Question})
        }
    }
}

export function saveReply(q, a, body) {
    return {
        type: SAVE_REPLY,
        payload: {
            promise: api => api.post(`questions/${q}/answers/${a}/reply`, {data: {body}, schema: Schemas.Question})
        }
    }
}