/**
 * Created by amitava on 30/01/16.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link } from 'react-router';
import { createHistory } from 'history';
import { Provider } from 'react-redux';


import app from './app';
import createStore from './createStore';

const history = createHistory();
const store = createStore(window.__INITIAL_STATE__, history);

class Client extends React.Component {

    render() {

        return (
            <Provider store={store}>
                <Router history={history}>
                    {app}
                </Router>
            </Provider>
        )
    }
}

ReactDOM.render(<Client />, document.getElementById('app-root'));