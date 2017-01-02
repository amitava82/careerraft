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
                <Helmet title="Education Alley - Search better, Learn better" />
                <Hero  />
                <div className="teach-hint">
                    Are you an individual or running a training center? <Link to="/educator">Learn how Education Alley can help you.</Link>
                </div>
                <div id="features" className="features container-fluid">
                    <div className="row">
                        <div className="col-md-4">
                            <i className="fa fa-map-marker bg-success-dark" />
                            <p className="lead">Location Based Listing</p>
                            <p>Search your institutes on the go, find the institute near your location.</p>
                        </div>
                        <div className="col-md-4">
                            <i className="fa fa-gift bg-danger-dark" />
                            <p className="lead">Offers for students</p>
                            <p>Get offers from institutes and surrounding retailers when you use our services.</p>
                        </div>
                        <div className="col-md-4">
                            <i className="fa fa-tasks bg-info-dark" />
                            <p className="lead">Career Counseling</p>
                            <p>We provide free career counseling to help students make right career oriented decisions.</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}