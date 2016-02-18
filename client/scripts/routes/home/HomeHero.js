/**
 * Created by amitava on 15/02/16.
 */
import React from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import autobind from 'autobind-decorator';
import { routeActions } from 'react-router-redux';
var Geosuggest = require('react-geosuggest');

import { search } from '../../actions';

@connect(state => state)
export default class HomeHero extends React.Component {

    constructor(props){
        super(props);
        this.geoOptions = {
            inputClassName: 'form-control',
            placeholder: 'Select a Location',
            fixtures: [{label: 'Bangalore', location: {lat: 12.9667, lng: 77.5667}}],
            onSuggestSelect: this.onGeoSelect,
            types: ['geocode'],
            country: 'in',
            onChange: this.onValueChange
        };
    }

    @autobind
    onSubmit(e){
        e.preventDefault();
        const q = this.refs.query.value;
        this.props.dispatch(routeActions.push(`/search?q=${q}`));
    }

    @autobind
    onGeoSelect(data){
        const p = data.location;
        this.props.dispatch(search.SET_LOCATION([p.lng, p.lat]));
    }

    @autobind
    onValueChange(val){
        if(!val)
            this.props.dispatch(search.SET_LOCATION(null));
    }

    render(){

        return (
            <div>
                <div className="hero cell grid center justify-center">
                    <div className="overlay"></div>
                    <div className="content">
                        <h3>Find the best place to learn almost anything</h3>
                        <form onSubmit={this.onSubmit} className="search grid cell justify-center">
                            <Geosuggest {...this.geoOptions} />
                            <div>
                                <input className="query form-control" ref="query" type="text" placeholder="Search for a Course, Class or Institute" />
                            </div>
                            <button type="submit">SEARCH</button>
                        </form>
                    </div>
                </div>
                <div className="cell grid row tile-container">
                    <Link to={categoryUrl('pre-school')} className="cell tile">
                        <i className="fa fa-pencil" />
                        <h4>Pre-School</h4>
                    </Link>
                    <Link to={categoryUrl('engineering-entrance')} className="cell tile">
                        <i className="fa fa-graduation-cap" />
                        <h4>Engineering Entrance</h4>
                    </Link>
                    <Link to={categoryUrl('medical-entrance')} className="cell tile">
                        <i className="fa fa-user-md" />
                        <h4>Medical Entrance</h4>
                    </Link>
                    <Link to={categoryUrl('commerce-classes')} className="cell tile">
                        <i className="fa fa-inr" />
                        <h4>Commerce Classes</h4>
                    </Link>
                    <Link to={categoryUrl('hobby-classes')} className="cell tile">
                        <i className="fa fa-music" />
                        <h4>Hobby Classes</h4>
                    </Link>
                    <Link to="/categories" className="cell tile">
                        <i className="fa fa-ellipsis-h" />
                        <h4>VIEW ALL</h4>
                    </Link>
                </div>
            </div>
        )
    }
}

function categoryUrl(id){
    return `/categories/${id}`;
}