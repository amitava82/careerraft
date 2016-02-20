/**
 * Created by amitava on 31/01/16.
 */
import { combineReducers } from 'redux';
import promiseMiddleware from 'redux-simple-promise';
import { routeReducer } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form';
import thunk from 'redux-thunk';

import session from './session';
import search from './search';
import institute from './institute';
import category from './category';
import course from './course';
import subject from './subject';
import toast from './toast';


export default combineReducers({
    session_store: session,
    search_store: search,
    institute_store: institute,
    category_store: category,
    course_store: course,
    subject_store: subject,
    toast,
    routing: routeReducer,
    form: formReducer
});