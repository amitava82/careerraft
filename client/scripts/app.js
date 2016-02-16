/**
 * Created by amitava on 30/01/16.
 */
import React from 'react';
import { connect } from 'react-redux'
import autobind from 'autobind-decorator';

import Header from './components/Header';
import Footer from './components/Footer';
import Toastr from './utils/toastr';

import { SET_LOCATION, LOAD_SEARCH_SUGGESTION } from './actions/search';

import getUserLocation from './utils/location';

export default class App extends React.Component {
    render(){
        return (
            <main>
                <Header />
                <div id="main">
                    {this.props.children}
                </div>
                <Footer />
                <Toastr />
            </main>
        )
    }
}