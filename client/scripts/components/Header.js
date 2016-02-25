import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import { push } from 'react-router-redux';
import autobind from 'autobind-decorator';
import each from 'lodash/each';
import reduce from 'lodash/reduce';
import throttle from 'lodash/throttle';
var Geosuggest = require('react-geosuggest');


import { setLocation } from '../redux/modules/search';
import getUserLocation from '../utils/location';
import Dropdown from './Dropdown';

const NOSEARCH = {
    "/about": true,
    "/core-values": true,
    "/team": true,
    "/contact-us": true,
    "/educator": true,
    "/": true
};

@connect(state => state)
export default class Nav extends React.Component {

    static contextTypes = {
        search: React.PropTypes.func
    };

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
            country: 'in',
            onChange: this.onValueChange,
            initialValue: 'Bangalore'
        };
    }

    componentDidMount(){
        this.props.dispatch(setLocation({
            location: {lat: 12.9667, lng: 77.5667},
            label: 'Bangalore'
        }));

        //getUserLocation(loc => {
        //    this.props.dispatch(setLocation({
        //        location: [loc.lng, loc.lat]
        //    }));
        //});
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
    onSubmit(e){
        e.preventDefault();
        const q = this.refs.query.value;
        this.context.search(q);
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
                    <a href="/educator">For Institutes</a>
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
                {NOSEARCH[this.props.routing.location.pathname] !== true ? (
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