/**
 * Created by amitava on 30/01/16.
 */
import React from 'react';
import { renderToString } from 'react-dom/server';
import { RoutingContext, match } from 'react-router';
import { createLocation, createMemoryHistory } from 'history'
import { Provider } from 'react-redux';
import { routeActions } from 'react-router-redux';

import HTML from './html';
import routes from './routes';
import createStore from './createStore';
import ApiClient from './helpers/api';
import config from 'config';


module.exports = function (deps, app, callback) {

    app.use(handleRender);
};

function handleRender(req, res){
 const api = new ApiClient(req, config.get('api'));
 const history = createMemoryHistory();
 const store = createStore({}, history, api);

    function hydrate(props){
        const InitialComponent = (
            <Provider store={store}>
                <RoutingContext {...props} />
            </Provider>
        );

        //TODO server side render

        const state = store.getState();

        const renderedHtml = renderToString(InitialComponent);

        const markup = HTML(renderedHtml, state);

        res.send(markup);
    }
    const location = createLocation(req.url);

    match({routes: routes, location}, function (err, redirect, props) {
        if (err) {
            console.error(err);
            res.status(500);
            hydrate();
        }else if(redirect){
            res.redirect(redirect.pathname + redirect.search);
        }else if(!props){
            res.status(404);
            hydrate();
        }else{
            hydrate(props);
        }
    });
}
