/**
 * Created by amitava on 31/01/16.
 */
import { combineReducers } from 'redux';
import { routeReducer } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form';

import user from './user';
import session from './session';
import search from './search';
import institute from './institute';
import category from './category';
import course from './course';
import subject from './subject';
import toast from './toast';


export default combineReducers({
    user_store: user,
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