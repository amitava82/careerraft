/**
 * Created by amitava on 30/01/16.
 */
import React from 'react';
import { renderToString } from 'react-dom/server';
import { RoutingContext, match } from 'react-router';
import { createLocation, createMemoryHistory } from 'history'
import { Provider } from 'react-redux';

import HTML from './html';
import App from './app';
import createStore from './createStore';

import { LOAD_ORGS } from './actions/actions';


module.exports = function (deps, app, callback) {

    app.use(handleRender);
};

function handleRender(req, res){
 const history = createMemoryHistory();
 const store = createStore({}, history);

    const location = createLocation(req.url);

    match({routes: App, location}, function (err, redirect, props) {
        if (err) {
            console.error(err);
            return res.status(500).end('Internal server error');
        }

        if (!props) return res.status(404).end('Not found.');

        const InitialComponent = (
            <Provider store={store}>
                <RoutingContext {...props} />
            </Provider>
        );

        store.dispatch(LOAD_ORGS()).then(
            r => {
                const state = store.getState();

                const renderedHtml = renderToString(InitialComponent);

                const markup = HTML(renderedHtml, state);

                res.send(markup);
            },
            e => console.log(e)
        )

    });
}
