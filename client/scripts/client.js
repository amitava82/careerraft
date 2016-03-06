/**
 * Created by amitava on 30/01/16.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, useRouterHistory } from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import useScroll from 'scroll-behavior/lib/useStandardScroll';
import { Provider } from 'react-redux';
import {parse, stringify} from 'qs';
import routes from './routes';
import createStore from './redux/createStore';
import apiClient from './helpers/api';
var smoothScroll = require('smoothscroll');

import simpleStore from './utils/simpleStore';
import {setLocation} from './redux/modules/search';

const createScrollHistory = useScroll(createBrowserHistory);
const appHistory = useRouterHistory(createScrollHistory)({
    parseQueryString: parse,
    stringifyQuery: stringify
});

const store = createStore(window.__INITIAL_STATE__, appHistory, new apiClient());

const _routes = routes(store);

class Client extends React.Component {

    componentWillMount(){
        const loc = simpleStore('user_location');
        if(loc){
            store.dispatch(setLocation(loc))
        }
    }

    render() {

        return (
            <Provider store={store}>
                <Router history={appHistory}>
                    {_routes}
                </Router>
            </Provider>
        )
    }
}

ReactDOM.render(<Client />, document.getElementById('app-root'));