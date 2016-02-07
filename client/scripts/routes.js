/**
 * Created by amitava on 30/01/16.
 */
import React from 'react';
import {Route, IndexRoute} from 'react-router';

import {
    HomeContainer
} from './routes/home'

import {
    InstituteContainer
} from './routes/institute';

import {
    SearchContainer
} from './routes/search';

import NotFound from './routes/misc/404';
import ServerError from './routes/misc/501';

import App from './app';

export default (
    <Route path="/" component={App}>
        <IndexRoute component={HomeContainer}/>
        <Route path="search" component={SearchContainer} />
        <Route path="institute" component={InstituteContainer} />
        <Route path="admin" />
        <Route path="manage" />

        <Route path="*" component={NotFound} status="404" />
    </Route>
);