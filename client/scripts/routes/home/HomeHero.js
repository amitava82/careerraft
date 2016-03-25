/**
 * Created by amitava on 15/02/16.
 */
import React from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import autobind from 'autobind-decorator';
import get from 'lodash/get';
import extend from 'lodash/extend';

var Geosuggest = require('react-geosuggest');

import Autocomplete from '../../components/Autocomplete';
import { setLocation, getSuggestions } from '../../redux/modules/search';
import {HOME_CATEGORIES, GEO_OPTIONS} from '../../constants';

@connect(state => state)
export default class HomeHero extends React.Component {

    static contextTypes = {
        search: React.PropTypes.func
    };

    constructor(props, ctx){
        super(props, ctx);
        
        this.state = {
            suggestions: [],
            search: {},
            searchText: ''
        };
        
        this.geoOptions = extend({}, GEO_OPTIONS, {
            inputClassName: 'form-control input-lg',
            onSuggestSelect: this.onGeoSelect,
            onChange: this.onValueChange
        });
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
    onGeoSelect(data){
        const p = data.location;
        this.props.dispatch(setLocation({
            label: data.label,
            location: p,
            city:data.city
        }));
    }

    @autobind
    onValueChange(val){
        if(!val)
            this.props.dispatch(setLocation(null));
    }

    @autobind
    onAutoSelect(val){
        this.setState({search: val, searchText: val.displayname});
    }
    
    @autobind
    onInputChange(e){
        const val = e.target.value;
        this.props.dispatch(getSuggestions(val, val.length < 3 ? 5 : 10)).then(
            r => this.setState({suggestions: r}),
            e => console.log(e)
        );
        this.setState({searchText: val});
    }

    @autobind
    onSearchFocus(){
        this.setState({showAutoComplete: true})
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

        const initialValue = get(this.props.search_store, 'location.label', '');

        return (
            <div>
                <div className="hero">
                    <div className="overlay"></div>
                    <div className="container content">
                        <h3 className="text-display-3 text-center">Find the best place to learn almost anything</h3>
                        <form onSubmit={this.onSubmit} className="search form-inline m-bl text-center">
                            <Geosuggest ref={ref => this.geosuggest = ref} {...this.geoOptions} initialValue={initialValue} className="form-group" />
                            <div className="input-group input-group-lg text-left">
                                <input value={this.state.searchText} onFocus={this.onSearchFocus} onChange={this.onInputChange} className="query form-control" ref="query" type="text" placeholder="Search for a Course, Class or Subject" />
                                <Autocomplete className="lg" show={this.state.showAutoComplete} onSelect={this.onAutoSelect} items={this.state.suggestions} />
                                <span className="input-group-btn">
                                    <button className="btn btn-primary" type="submit"><i className="fa fa-search" /> </button>
                                </span>
                            </div>
                        </form>
                        <div className="text-center">
                            <a href="#features" className="text-display-1 btn-pill">Learn More</a>
                        </div>
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