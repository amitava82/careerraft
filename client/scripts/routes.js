/**
 * Created by amitava on 30/01/16.
 */
import React from 'react';
import {Route} from 'react-router';

import {
    SearchContainer
} from './routes/search';

import {
    InstituteContainer
} from './routes/institute'

import App from './app';

export default (
    <Route component={App}>
        <Route path="/">

        </Route>
        <Route path="/search" component={SearchContainer}>

        </Route>
        <Route path="/institute" conponent={InstituteContainer}>

        </Route>
        <Route path="/admin">

        </Route>
        <Route path="/manage">

        </Route>
    </Route>
)