/**
 * Created by amitava on 30/01/16.
 */
import React from 'react';
import { renderToString } from 'react-dom/server';
import { RoutingContext, match } from 'react-router';
import createHistory from 'react-router/lib/createMemoryHistory';
import { Provider } from 'react-redux';
import Helmet from 'react-helmet';
import HTML from './html';
import routes from './routes';
import createStore from './redux/createStore';
import ApiClient from './helpers/api';
import config from 'config';

import { storeSession } from './redux/modules/session';
import fetchComponentData from './helpers/fetchComponentData';


module.exports = function (deps, app, callback) {

    app.use(handleRender);


    function handleRender(req, res){
        const api = new ApiClient(req, config.get('api'));
        const history = createHistory(req.originalUrl);
        const store = createStore({}, history, api);

        if(req.isAuthenticated()){
            store.dispatch(storeSession(req.user));
        }

        function hydrate(props){
            const InitialComponent = (
                <Provider store={store}>
                    <RoutingContext {...props} />
                </Provider>
            );

            //TODO server side render

            const state = store.getState();

            let renderedHtml = '';
            try {
                renderedHtml = renderToString(InitialComponent);
            }catch(e){
                deps.log.error(e);
                throw e;
            }
            const head = Helmet.rewind();
            const markup = HTML(renderedHtml, state, head);

            res.send(markup);
        }

        //const location = createLocation(req.originalUrl);

        match({history, routes: routes, location: req.originalUrl}, function (err, redirect, props) {
            if (err) {
                deps.log.error(err);
                res.status(500);
                hydrate();
            }else if(redirect){
                res.redirect(redirect.pathname + redirect.search);
            }else if(!props){
                res.status(404);
                hydrate();
            }else{
                //hydrate(props);
                fetchComponentData(store.dispatch, props.components, props.params).then(
                    (r) => {
                        hydrate(props);
                    },
                    e => {
                        deps.log.error(e);
                        res.status(500).send(e);
                    }
                )
            }
        });
    }

};
