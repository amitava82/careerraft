/**
 * Created by amitava on 04/02/16.
 */
import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import map from 'lodash/map';

import formatAddress from '../../utils/format-address';

import { institute, category, search } from '../../actions'

//import Item from './components/Item';
import FilterBar from './components/FilterBar';
import InstItem from './components/InstItem';
import Hero from './HomeHero';

@connect(state => state)
export default class HomeContainer extends React.Component {

    componentDidMount(){
            this.props.dispatch(search.SEARCH());
            this.props.dispatch(category.LOAD_CATEGORIES());
    }

    render(){

        const instsList = this.props.search_store.results.map(i => {
            return <InstItem inst={i} />;
        });

        const categories = this.props.category_store.categories.map(i => {
           return <Link className="list-group-item" to={`/search?category=${i._id}`}>{i.name}</Link>
        });
        return (
            <div className="home-page">
                <Hero />
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