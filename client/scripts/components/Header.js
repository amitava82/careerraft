import React from 'react';
import {Link} from 'react-router';
import autobind from 'autobind-decorator';

import { institute } from '../actions';

import getUserLocation from '../utils/location';

export default class Nav extends React.Component {

    static propTypes = {
        onPlaceChange: React.PropTypes.func
    };

    constructor(props, ctx){
        super(props, ctx);
    }

    componentWllMount(){

    }

    componentDidMount(){
        this.autocomplete = new google.maps.places.Autocomplete(this.refs.location, {types: ['geocode'], componentRestrictions: {country: 'in'}});
        this.autocomplete.addListener('place_changed', () => this.placeChanged(this.autocomplete))

    }

    placeChanged(auto){
        const p =auto.getPlace();
        const lat = p.geometry.location.lat();
        const lng = p.geometry.location.lng();
        this.props.onPlaceChange([lng, lat]);
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
        if(q) this.props.onSearch(q);
    }

    render () {
        return (
            <header className="grid row center">
                <div className="brand">
                    <a href="http://careerraft.com">
                        <img src="images/logo.png" alt="Logo" />
                    </a>
                </div>
                <form onSubmit={this.onSubmit} className="search grid cell">
                    <input className="loc" ref="location" onFocus={this.getGeoLocation} type="text" placeholder="Location" name="location" />
                    <input className="query" ref="query" type="text" placeholder="Search for a Course/Institute" />
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