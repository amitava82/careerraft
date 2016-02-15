/**
 * Created by amitava on 30/01/16.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, browserHistory } from 'react-router';
import { Provider } from 'react-redux';


import routes from './routes';
import createStore from './createStore';
import apiClient from './helpers/api';

const store = createStore(window.__INITIAL_STATE__, browserHistory);

class Client extends React.Component {

    render() {

        return (
            <Provider store={store}>
                <Router history={browserHistory}>
                    {routes}
                </Router>
            </Provider>
        )
    }
}

ReactDOM.render(<Client />, document.getElementById('app-root'));