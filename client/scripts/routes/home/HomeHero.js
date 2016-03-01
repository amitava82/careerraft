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

    static contextTypes = {
        search: React.PropTypes.func
    };

    constructor(props, ctx){
        super(props, ctx);
        this.geoOptions = {
            inputClassName: 'form-control input-md',
            placeholder: 'Select a Location',
            fixtures: [{label: 'Bangalore', location: {lat: 12.9667, lng: 77.5667}}],
            onSuggestSelect: this.onGeoSelect,
            country: 'in',
            onChange: this.onValueChange,
            initialValue: 'Bangalore'
        };
    }

    @autobind
    onSubmit(e){
        e.preventDefault();
        const q = this.refs.query.value;
        this.context.search(q);
    }

    @autobind
    onGeoSelect(data){
        const p = data.location;
        this.props.dispatch(setLocation({
            label: data.label,
            location: p
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
                <div className="tile col-sm-4">
                    <Link to={`/categories/${i.id}`}>
                        <i className={`fa ${i.icon}`}/>
                        <h4>{i.name}</h4>
                    </Link>
                </div>
            )
        });

        return (
            <div>
                <div className="hero">
                    <div className="overlay"></div>
                    <div className="container content">
                        <h3 className="text-display-1">Find the best place to learn almost anything</h3>
                        <form onSubmit={this.onSubmit} className="search form-inline">
                            <Geosuggest {...this.geoOptions} className="form-group" />
                            <div className="input-group">
                                <input className="query form-control input-md" ref="query" type="text" placeholder="Search for a Course, Class or Institute" />
                                <span className="input-group-btn">
                                    <button className="btn btn-primary btn-md" type="submit"><i className="fa fa-search" /> </button>
                                </span>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="container">
                    <div className="row tile-container">
                        {cats}
                        <div className="tile col-sm-4">
                            <Link to="/categories" className="tile col-sm-4">
                                <i className="fa fa-ellipsis-h" />
                                <h4>VIEW ALL</h4>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}