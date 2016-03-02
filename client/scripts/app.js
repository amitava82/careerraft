/**
 * Created by amitava on 30/01/16.
 */
import React from 'react';
import { connect } from 'react-redux';
import {push} from 'react-router-redux';
import autobind from 'autobind-decorator';
import merge from 'lodash/merge';
import get from 'lodash/get';
var GoogleAnalytics = require('react-g-analytics');

import Header from './components/Header';
import Footer from './components/Footer';
import Toastr from './utils/toastr';

import getUserLocation from './utils/location';
import {loadCategories} from './redux/modules/category';


@connect(state => state)
export default class App extends React.Component {

    static needs = [
        loadCategories
    ];

    static fetchData(props, store){
        return store.dispatch(loadCategories());
    }

    static childContextTypes = {
        search: React.PropTypes.func
    };

    getChildContext(){
        return {
            search: this.search
        }
    }

    @autobind
    search(q){
        const location = get(this.props.search_store, 'location.location', {});
        const query = merge({}, {...this.props.location.query, q, loc: location});
        const {hash, ...rest} = this.props.location;
        this.props.dispatch(push({...rest, query, pathname: '/search'}));
    }

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