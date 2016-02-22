/**
 * Created by amitava on 15/02/16.
 */
import React from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import autobind from 'autobind-decorator';
import { routeActions } from 'react-router-redux';
var Geosuggest = require('react-geosuggest');

import { setLocation } from '../../redux/modules/search';
import {HOME_CATEGORIES} from '../../constants';

@connect(state => state)
export default class HomeHero extends React.Component {

    constructor(props){
        super(props);
        this.geoOptions = {
            inputClassName: 'form-control',
            placeholder: 'Select a Location',
            fixtures: [{label: 'Bangalore', location: {lat: 12.9667, lng: 77.5667}}],
            onSuggestSelect: this.onGeoSelect,
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
        this.props.dispatch(setLocation({
            label: data.label,
            location: [p.lng, p.lat]
        }));
    }

    @autobind
    onValueChange(val){
        if(!val)
            this.props.dispatch(setLocation(null));
    }

    render(){

        const cats = HOME_CATEGORIES.map(i => {
            return (
                <Link to={`/categories/${i.id}`} className="cell tile">
                    <i className={`fa ${i.icon}`}/>
                    <h4>{i.name}</h4>
                </Link>
            )
        });

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
                    {cats}
                    <Link to="/categories" className="cell tile">
                        <i className="fa fa-ellipsis-h" />
                        <h4>VIEW ALL</h4>
                    </Link>
                </div>
            </div>
        )
    }
}