/**
 * Created by amitava on 30/01/16.
 */
import React from 'react';
import { connect } from 'react-redux';
import {push} from 'react-router-redux';
import autobind from 'autobind-decorator';
import merge from 'lodash/merge';
import get from 'lodash/get';
import Helmet from 'react-helmet';

var GoogleAnalytics = require('react-g-analytics');

import Header from './components/Header';
import Footer from './components/Footer';
import Toastr from './utils/toastr';

import getUserLocation from './utils/location';
import {loadCategories} from './redux/modules/category';
import {reset} from './redux/modules/search';
import { setPreviousLocation } from './redux/modules/session';


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

        const query = {q, loc: location};
        const {hash, ...rest} = this.props.location;
        this.props.dispatch(reset());
        this.props.dispatch(push({...rest, query, pathname: '/search'}));
    }

    componentWillReceiveProps(nextProps) {
        // if we changed routes...
        if ((
                nextProps.location.key !== this.props.location.key &&
                nextProps.location.state &&
                nextProps.location.state.modal
            )) {
            // save the old children (just like animation)
            this.previousChildren = this.props.children
        }

        //saving previous location for modal close
        if(this.props.location != nextProps.location){
            this.props.dispatch(setPreviousLocation(this.props.location))
        }
    }

    render(){

        let { location } = this.props;

        let isModal = (
            location.state &&
            location.state.modal &&
            this.previousChildren
        );

        return (
            <main>
                <Helmet title="Education Alley" meta={[
                    {
                        name: 'description',
                        content: 'Education Alley connects students with Institutes, programs, resources, experts and more. Education Alley provides learners with everything they need to find the right match. Discover and compare educational opportunities at any stage of learning.'
                    }
                ]} />
                <Header />
                <div id="main">

                    {isModal ?
                        this.previousChildren :
                        this.props.children
                    }

                    {isModal && (
                        this.props.children
                    )}

                </div>
                <Footer />
                <Toastr />
                <GoogleAnalytics id="UA-73916287-1" />
            </main>
        )
    }
}
