/**
 * Created by amitava on 30/01/16.
 */
import React from 'react';
import { connect } from 'react-redux'
import autobind from 'autobind-decorator';

import Header from './components/Header';
import Footer from './components/Footer';

import { SET_LOCATION, LOAD_SEARCH_SUGGESTION } from './actions/search';

import getUserLocation from './utils/location';

@connect(state => state)
export default class App extends React.Component {

    componentWillMount(){
        getUserLocation(loc => {
            this.props.dispatch(SET_LOCATION(loc));
        });
    }

    @autobind
    onSearch(query){
        this.props.dispatch(LOAD_SEARCH_SUGGESTION(query, this.props.search.location));
    }

    @autobind
    onPlaceChange(location){
        this.props.dispatch(SET_LOCATION(location))
;    }

    render(){
        return (
            <main>
                <Header onPlaceChange={this.onPlaceChange}
                        onSearch={this.onSearch}
                        location={this.props.search.location}
                        search={this.props.search.query}
                />
                <div id="main">
                    {this.props.children}
                </div>
                <Footer />
            </main>
        )
    }
}