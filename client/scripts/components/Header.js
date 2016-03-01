import React from 'react';
import ReactDOM from 'react-dom'
import {connect} from 'react-redux';
import {Link} from 'react-router';
import { push } from 'react-router-redux';
import autobind from 'autobind-decorator';
import each from 'lodash/each';
import reduce from 'lodash/reduce';
import throttle from 'lodash/throttle';
var Geosuggest = require('react-geosuggest');

import {Navbar, Nav, NavItem, Button, Input} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';


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
export default class Header extends React.Component {

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

        const navBar = ReactDOM.findDOMNode(this);
        const collapsibleNav = navBar.querySelector('div.navbar-collapse');
        const btnToggle = navBar.querySelector('button.navbar-toggle');

        navBar.addEventListener('click', (evt) => {
            if (evt.target.tagName !== 'A' || evt.target.classList.contains('dropdown-toggle') || ! collapsibleNav.classList.contains('in')) {
                return;
            }

            btnToggle.click();
        }, false);

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
                <LinkContainer to="/admin">
                    <NavItem eventKey={10}>
                        {session.user.name}
                        <i className="fa fa-cog" />
                    </NavItem>
                </LinkContainer>
            )
        }else {
            loginMenu = (
                <LinkContainer to="/educator" ctiveClassName="active">
                    <NavItem eventKey={9}>For Institutes</NavItem>
                </LinkContainer>
            )
        }

        const staticLinks = (
            <Nav>
                <LinkContainer to="/about">
                    <NavItem eventKey={1}>About</NavItem>
                </LinkContainer>
                <LinkContainer to="/core-values" onSelect={()=>{}}>
                    <NavItem eventKey={2}>Core values</NavItem>
                </LinkContainer>
                <LinkContainer to="/team">
                    <NavItem>Team</NavItem>
                </LinkContainer>
                <LinkContainer to="/contact-us">
                    <NavItem>Get in touch</NavItem>
                </LinkContainer>
            </Nav>
        );

        const searchForm = (
            <Navbar.Form pullLeft>
                <form onSubmit={this.onSubmit} className="search">
                    <Geosuggest {...this.geoOptions} className="form-group" />{' '}
                    <div className="form-group">{' '}
                        <Input className="query" ref="query" type="text" placeholder="Search for a Course/Institute" />
                    </div>{' '}
                    <Button type="submit">Search</Button>
                </form>
            </Navbar.Form>
        );

        return (
            <Navbar fixedTop>
                <Navbar.Header>
                    <Navbar.Brand className="brand">
                        <Link to="/">
                            Career<span>raft</span><span className="beta-badge">beta</span>
                        </Link>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                    {NOSEARCH[this.props.routing.location.pathname] === true ? staticLinks : searchForm}
                    <Nav pullRight className="hidden-sm">
                        {loginMenu}
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        )
    }
}