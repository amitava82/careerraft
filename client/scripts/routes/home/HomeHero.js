/**
 * Created by amitava on 15/02/16.
 */
import React from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import autobind from 'autobind-decorator';
import get from 'lodash/get';
import { routeActions } from 'react-router-redux';
import Geosuggest from 'react-geosuggest';

import SearchSuggest from '../../components/SearchSuggest';
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
            inputClassName: 'form-control input-lg',
            placeholder: 'Select a Location',
            fixtures: [{label: 'Bangalore', location: {lat: 12.9667, lng: 77.5667}}],
            onSuggestSelect: this.onGeoSelect,
            country: 'in',
            onChange: this.onValueChange,
            //initialValue: 'Bangalore'
        };

        this.state = {suggest: null}
    }

    @autobind
    onSubmit(e){
        e.preventDefault();

        if(!this.props.search_store.location){
            this.geosuggest.focus();
            return;
        }

        const q = get(this.state.suggest, 'displayname', '');
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
    
    @autobind
    onSuggestSelect(val){
        this.setState({suggest: val})
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
                        <h3 className="text-display-3">Find the best place to learn almost anything</h3>
                        <form onSubmit={this.onSubmit} className="search form-inline m-bl">
                            <Geosuggest ref={ref => this.geosuggest = ref} {...this.geoOptions} initialValue={initialValue} className="form-group" />
                            <div className="input-group input-group-lg">
                                {/*<input className="query form-control" ref="query" type="text" placeholder="Search for a Course, Class or Institute" />*/}
                                <SearchSuggest 
                                    className="search-suggest query Select-lg"
                                    onSelect={this.onSuggestSelect}
                                    value={this.state.suggest}
                                />
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