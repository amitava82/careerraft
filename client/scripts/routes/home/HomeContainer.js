/**
 * Created by amitava on 04/02/16.
 */
import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import map from 'lodash/map';
import Helmet from 'react-helmet';

import middleware from '../../utils/middleware';
import formatAddress from '../../utils/format-address';

import * as instActions from '../../redux/modules/institute';
import * as categoryActions from '../../redux/modules/category';
import * as categorySearch from '../../redux/modules/search';
import {createToast} from '../../redux/modules/toast';


//import Item from './components/Item';
import FilterBar from './components/FilterBar';
import InstItem from './../search/InstItem';
import Hero from './HomeHero';

@connect(state => state)
//@middleware([
//    {
//        key: '$categories',
//        watch: props => props.params.id,
//        handler: (props, id) => props.dispatch(categoryActions.loadCategories())
//    },
//    {
//        key: '$institutes',
//        watch: (props) => props.params.id,
//        handler: (props, instId) => props.dispatch(instActions.loadInstitutes())
//    }
//])
export default class HomeContainer extends React.Component {

    componentDidMount(){

    }

    render(){

        return (
            <div className="home-page">
                <Helmet title="Careerraft - Search better, Learn better" />
                <Hero  />
                <div className="teach-hint">
                    Are you an individual or running a training center? <Link to="/educator">Learn how Careerraft can help you.</Link>
                </div>
                <div className="features grid row">
                    <div className="cell">
                        <i className="fa fa-map-marker" />
                        <p className="lead">Location Based Listing</p>
                        <p>Search your institutes on the go, find the institute near your location.</p>
                    </div>
                    <div className="cell">
                        <i className="fa fa-gift" />
                        <p className="lead">Offers for students</p>
                        <p>Get offers from institutes and surrounding retailers when you use our services.</p>
                    </div>
                    <div className="cell">
                        <i className="fa fa-tasks" />
                        <p className="lead">Career Counseling</p>
                        <p>We provide free career counseling to help students make right career oriented decisions.</p>
                    </div>
                </div>
            </div>
        )
    }
}