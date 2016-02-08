import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import autobind from 'autobind-decorator';
import each from 'lodash/each';
import reduce from 'lodash/reduce';

import { institute, search } from '../actions';

import getUserLocation from '../utils/location';

import Dropdown from './Dropdown';

@connect(state => ({search: state.search}))
export default class Nav extends React.Component {

    constructor(props, ctx){
        super(props, ctx);
    }

    componentDidMount(){
        this.autocomplete = new google.maps.places.Autocomplete(this.refs.location, {types: ['geocode'], componentRestrictions: {country: 'in'}});
        this.autocomplete.addListener('place_changed', () => this.placeChanged(this.autocomplete));

        getUserLocation(loc => {
            this.props.dispatch(search.SET_LOCATION(loc));
        });
    }

    placeChanged(auto){
        const p =auto.getPlace();
        const lat = p.geometry.location.lat();
        const lng = p.geometry.location.lng();
        this.props.dispatch(search.SET_LOCATION({lng, lat}));
    }

    @autobind
    getGeoLocation() {
        getUserLocation(loc => {
            const circle = new google.maps.Circle({
                center: loc,
                radius: 50000 //50KM //position.coords.accuracy
            });
            this.autocomplete.setBounds(circle.getBounds());
        });
    }

    @autobind
    onSubmit(e){
        e.preventDefault();
        const q = this.refs.query.value;
        if(q) this.props.dispatch(search.LOAD_SEARCH_SUGGESTION(q, this.props.search.location));
    }

    render () {

        const results = this.props.search.results;
        let items = [];

        each(results, (val, key) => {
            reduce(val, (memo, i) => {
                memo.push({
                    label: <div>{i.name} in <strong>{key}</strong></div>,
                    model: key,
                    id: i._id
                });
                return memo;
            }, items);
        });

        return (
            <header className="grid row center">
                <div className="brand">
                    <a href="http://careerraft.com">
                        <img src="images/logo.png" alt="Logo" />
                    </a>
                </div>
                <form onSubmit={this.onSubmit} className="search grid cell">
                    <input className="loc" ref="location" onFocus={this.getGeoLocation} type="text" placeholder="Location" name="location" />
                    <div>
                        <input className="query" ref="query" type="text" placeholder="Search for a Course/Institute" />
                        <Dropdown items={items}  />
                    </div>
                    <button type="submit">Search</button>
                </form>
                <nav className="grid row">
                    <Link to="/courses">Courses</Link>
                    <Link to="/Institutes">Institutes</Link>
                    <Link to="/Deals">Deals</Link>
                    <div>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </div>
                </nav>
            </header>
        )
    }
}