/**
 * Created by amitava on 30/01/16.
 */
import React from 'react';
import { connect } from 'react-redux'
import autobind from 'autobind-decorator';
var GoogleAnalytics = require('react-g-analytics');

import Header from './components/Header';
import Footer from './components/Footer';
import Toastr from './utils/toastr';

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
                <GoogleAnalytics id="UA-73916287-1" />
            </main>
        )
    }
}