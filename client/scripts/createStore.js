/**
 * Created by amitava on 31/01/16.
 */
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { routeReducer, syncHistory } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form';
import thunk from 'redux-thunk';
import promise from './utils/promise-middleware';

import session from './reducers/session';
import search from './reducers/search';
import orgs from './reducers/orgs';
import category from './reducers/categories';
import course from './reducers/courses';
import subject from './reducers/subjects';


export default function (initialState = {}, history, apiClient) {

    const reduxRouterMiddleware = syncHistory(history);
    const createStoreWithMiddleware = applyMiddleware(thunk, promise, reduxRouterMiddleware)(createStore);

    const reduers = combineReducers({
        session,
        search,
        orgs,
        category,
        course,
        subject,
        routing: routeReducer,
        form: formReducer
    });

    return createStoreWithMiddleware(reduers, initialState);
}
