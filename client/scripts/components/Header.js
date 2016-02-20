import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import { routeActions } from 'react-router-redux';
import autobind from 'autobind-decorator';
import each from 'lodash/each';
import reduce from 'lodash/reduce';
import throttle from 'lodash/throttle';
var Geosuggest = require('react-geosuggest');


import { setLocation } from '../redux/modules/search';
import getUserLocation from '../utils/location';
import Dropdown from './Dropdown';

@connect(state => state)
export default class Nav extends React.Component {

    constructor(props, ctx){
        super(props, ctx);

        this.state = {
          suggestions: []
        };

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

    componentDidMount(){
        getUserLocation(loc => {
            this.props.dispatch(setLocation([loc.lng, loc.lat]));
        });
    }

    @autobind
    onGeoSelect(data){
        const p = data.location;
        this.props.dispatch(setLocation([p.lng, p.lat]));
    }

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
        this.props.dispatch(routeActions.push(`/search?q=${q}`));
    }

    @autobind
    onValueChange(val){
        if(!val)
            this.props.dispatch(setLocation(null));
    }

    render () {

        const results = this.state.suggestions;
        let items = [];

        each(results, (val, key) => {
            reduce(val, (memo, i) => {
                memo.push({
                    label: <div>{i.name} in <strong>{key}</strong></div>,
                    link: `/${key}/${i._id}`,
                    id: i._id
                });
                return memo;
            }, items);
            items.push({
                label: <strong>Search {this.refs.query.value} in {key}</strong>,
                link: `/search/${key}?q=${this.refs.query.value}`,
                id: key
            });
        });

        const session = this.props.session_store;

        let loginMenu = null;
        if(session.isLoggedIn){
            loginMenu = (
                <div>
                    {session.user.name}
                    <Link to="/admin"><i className="fa fa-cog" /></Link>
                </div>
            )
        }else {
            loginMenu = (
                <div>
                    <a href="/auth/login">Login / Register</a>
                </div>
            )
        }

        return (
            <header className="grid row center">
                <div className="brand">
                    <Link to="/">
                        <img src="/images/logo.png" />
                    </Link>
                </div>
                {this.props.routing.location.pathname != '/' ? (
                    <form onSubmit={this.onSubmit} className="search grid cell">
                        <Geosuggest {...this.geoOptions} />
                        <div>
                            <input className="query form-control" ref="query" type="text" placeholder="Search for a Course/Institute" />
                        </div>
                        <button type="submit">Search</button>
                    </form>
                ) : <nav className="cell">
                    <Link to="/about">ABOUT</Link>
                    <Link to="/core-values">CORE VALUES</Link>
                    <Link to="/team">TEAM</Link>
                    <Link to="/contact-us">GET IN TOUCH</Link>
                </nav> }
                <nav className="grid row">
                    {loginMenu}
                </nav>
            </header>
        )
    }
}