/**
 * Created by amitava on 30/01/16.
 */
import React from 'react';
import { renderToString } from 'react-dom/server';
import {Route, Link} from 'react-router';

import {
    SearchContainer
} from './routes/search';

import {
    InstituteContainer
} from './routes/institute'

class App extends React.Component {


    render(){
        return (
            <main>
                <header>
                    <Link to="/search">Search</Link>
                    <Link to="/institute">Me</Link>
                </header>
                {this.props.children}
            </main>
        )
    }
}

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