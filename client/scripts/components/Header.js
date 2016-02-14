import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import { routeActions } from 'react-router-redux'
import autobind from 'autobind-decorator';
import each from 'lodash/each';
import reduce from 'lodash/reduce';
import throttle from 'lodash/throttle';

import { institute, search } from '../actions';

import getUserLocation from '../utils/location';

import Dropdown from './Dropdown';

@connect(state => ({search: state.search_store, session: state.session_store}))
export default class Nav extends React.Component {

    constructor(props, ctx){
        super(props, ctx);

        this.state = {
          suggestions: []
        };
        this._throttleeSearch = throttle(this.autoSearch, 300);
    }

    componentDidMount(){
        this.autocomplete = new google.maps.places.Autocomplete(this.refs.location, {types: ['geocode'], componentRestrictions: {country: 'in'}});
        this.autocomplete.addListener('place_changed', () => this.placeChanged(this.autocomplete));

        getUserLocation(loc => {
            this.props.dispatch(search.SET_LOCATION([loc.lng, loc.lat]));
        });
    }

    placeChanged(auto){
        const p =auto.getPlace();
        const lat = p.geometry.location.lat();
        const lng = p.geometry.location.lng();
        this.props.dispatch(search.SET_LOCATION([lng, lat]));
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
        this.props.dispatch(routeActions.push(`/search?q=${q}`));
        //if(q) this.props.dispatch(search.LOAD_SEARCH_SUGGESTION(q, this.props.search.location)).then(
        //    r => this.setState({suggestions: r})
        //);
    }

    @autobind
    autoSearch(e){
        const q = this.refs.query.value;
        if(q.length >=3){
            this.props.dispatch(search.LOAD_SEARCH_SUGGESTION(q, this.props.search.location)).then(
                r => this.setState({suggestions: r})
            );
        }
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

        const session = this.props.session;

        let loginMenu = null;
        if(session.isLoggedIn){
            loginMenu = (
                <div>
                    {session.user.name}
                    <a href="/admin"><i className="fa fa-cog" /></a>
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
                    <a href="/">
                        <img src="/images/logo.png" />
                    </a>
                </div>
                <form onSubmit={this.onSubmit} className="search grid cell">
                    <input className="loc form-control" ref="location" onFocus={this.getGeoLocation} type="text" placeholder="Location" name="location" />
                    <div>
                        <input className="query form-control" ref="query" type="text" placeholder="Search for a Course/Institute" />
                    </div>
                    <button type="submit">Search</button>
                </form>
                <nav className="grid row">
                    <Link to="/courses">Courses</Link>
                    <Link to="/institutes">Institutes</Link>
                    {loginMenu}
                </nav>
            </header>
        )
    }
}