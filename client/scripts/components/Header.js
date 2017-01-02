import React from 'react';
import ReactDOM from 'react-dom'
import {connect} from 'react-redux';
import {Link} from 'react-router';
import { push } from 'react-router-redux';
import autobind from 'autobind-decorator';
import each from 'lodash/each';
import get from 'lodash/get';
import reduce from 'lodash/reduce';
import throttle from 'lodash/throttle';
import isEqual from 'lodash/isEqual';

var Geosuggest = require('react-geosuggest');

import {Navbar, Nav, NavItem, Button, Input, NavDropdown, MenuItem} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';
import Avatar from './Avatar';


import { setLocation } from '../redux/modules/search';
import getUserLocation from '../utils/location';


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
          query: get(props.search_store, 'query.q')
        };

        this.geoOptions = {
            inputClassName: 'form-control',
            placeholder: 'Select a Location',
            fixtures: [{label: 'Bangalore', location: {lat: 12.9667, lng: 77.5667}}],
            onSuggestSelect: this.onGeoSelect,
            country: 'in',
            onChange: this.onValueChange
        };
    }

    componentDidMount(){

        const navBar = ReactDOM.findDOMNode(this);
        const collapsibleNav = navBar.querySelector('div.navbar-collapse');
        const btnToggle = navBar.querySelector('button.navbar-toggle');

        //hack to collapse navbar
        navBar.addEventListener('click', (evt) => {
            if (evt.target.tagName !== 'A' || evt.target.classList.contains('dropdown-toggle') || ! collapsibleNav.classList.contains('in')) {
                return;
            }

            btnToggle.click();
        }, false);

        //const q = get(search_store, 'query.q');

        //this.setState({query: })

    }

    componentWillReceiveProps(nextProps){

        if(isEqual(nextProps.search_store.query, this.props.search_store.query)) return;

        this.setState({query: nextProps.search_store.query.q});

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

        if(!this.props.search_store.location){
            this.geosuggest.focus();
            return;
        }

        const q = this.refs.query.value;

        this.context.search(q);
    }

    @autobind
    onValueChange(val){
        if(!val)
            this.props.dispatch(setLocation(null));
    }

    render () {

        const {routing, search_store, session_store} = this.props;

        const nosearch = NOSEARCH[routing.location.pathname] === true;

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


        let loginMenu = null;
        if(session_store.isLoggedIn){
            const titletar = (
                <span>
                    <Avatar url={session_store.user.photo} width="42" height="42" />
                    <span className="strong">{session_store.user.name}</span>
                </span>
            );

            loginMenu = (
                <NavDropdown bsStyle="link" title={titletar} id="user-logged-in-menu" className="spaced">
                    <LinkContainer to="/dashboard">
                        <MenuItem>
                            Dashboard
                        </MenuItem>
                    </LinkContainer>
                    {session_store.user.role === 'ADMIN' && (
                        <LinkContainer to="/admin">
                            <MenuItem>
                                Admin console
                            </MenuItem>
                        </LinkContainer>
                    )}
                    <MenuItem divider />
                    <MenuItem href="/auth/logout" >
                        <i className="fa fa-sign-out" /> Logout
                    </MenuItem>
                </NavDropdown>
            )
        }else {
            loginMenu = (
                <LinkContainer to={{pathname: '/login', state: { modal: true, returnTo: routing.location.pathname }}}>
                    <NavItem eventKey={10} className="strong">
                        LOGIN
                    </NavItem>
                </LinkContainer>
            )
        }

        const staticLinks = (
            <Nav pullRight>
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
                <LinkContainer to="/educator" activeClassName="active" className="rounded">
                    <NavItem eventKey={9}>For Institutes</NavItem>
                </LinkContainer>
                {loginMenu}
            </Nav>
        );

        const initialValue = get(search_store, 'location.label', '');
        const q = get(search_store, 'query.q');

        const searchForm = (
            <span>
                <Navbar.Form pullLeft>
                    <form onSubmit={this.onSubmit} className="search">
                        <Geosuggest ref={ref => this.geosuggest = ref} {...this.geoOptions} initialValue={initialValue} className="form-group" />{' '}
                        <input value={this.state.query} onChange={e => this.setState({query: e.target.value})} className="query form-control" ref="query" type="text" placeholder="Search for a Course/Institute" />
                        <Button type="submit"><i className="fa fa-search" /></Button>
                    </form>
                </Navbar.Form>
                <Nav pullRight>
                    {loginMenu}
                </Nav>
            </span>
        );

        const navprops = {
            inverse: !nosearch,
            fixedTop: true
        };

        return (
            <Navbar {...navprops}>
                <Navbar.Header>
                    <Navbar.Brand className="brand">
                        <Link to="/">
                            <img src="/images/logo_small.png" />
                        </Link>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                    {nosearch ? staticLinks : searchForm}
                </Navbar.Collapse>
            </Navbar>
        )
    }
}