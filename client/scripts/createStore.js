/**
 * Created by amitava on 31/01/16.
 */
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { routeReducer, syncHistory } from 'react-router-redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise';

import session from './reducers/session';
import search from './reducers/search';
import orgs from './reducers/orgs';



export default function (initialState = {}, history) {

    const reduxRouterMiddleware = syncHistory(history);
    const createStoreWithMiddleware = applyMiddleware(thunk, promise, reduxRouterMiddleware)(createStore);

    const reduers = combineReducers({
        session,
        search,
        orgs,
        routing: routeReducer
    });

    return createStoreWithMiddleware(reduers, initialState);
}
