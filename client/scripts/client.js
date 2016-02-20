/**
 * Created by amitava on 30/01/16.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, browserHistory } from 'react-router';
import useScroll from 'scroll-behavior/lib/useStandardScroll';
import { Provider } from 'react-redux';



import routes from './routes';
import createStore from './redux/createStore';
import apiClient from './helpers/api';

const history = useScroll(() => browserHistory)();
const store = createStore(window.__INITIAL_STATE__, history, new apiClient());

class Client extends React.Component {

    render() {

        return (
            <Provider store={store}>
                <Router history={history}>
                    {routes}
                </Router>
            </Provider>
        )
    }
}

ReactDOM.render(<Client />, document.getElementById('app-root'));