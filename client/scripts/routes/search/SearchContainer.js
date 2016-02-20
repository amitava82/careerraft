/**
 * Created by amitava on 31/01/16.
 */
import React from 'react';
import autobind from 'autobind-decorator';
import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';
import Helmet from 'react-helmet';
import { search } from '../../redux/modules/search';

import map from 'lodash/map';

import InstItem from '../home/components/InstItem';

@connect(state => state)
export default class SearchContainer extends React.Component {

    constructor(props, ctx){
        super(props, ctx);

        this.state = {
            loading: true
        }

    }


    componentDidMount(){
        this.search(this.props);
    }

    componentWillReceiveProps(nextPros){
        if(this.state.loading) return;
        if(isEqual(nextPros.location.query, this.props.location.query) && isEqual(this.props.search_store.location, nextPros.search_store.location)) return;

        this.search(nextPros);
    }

    search(props){
        props.dispatch(search({
            q: props.location.query.q,
            loc: props.search_store.location,
            ...props.location.query
        })).then(
            r => this.setState({loading: false}),
            e => console.log(e)
        );
    }

    render (){

        const searchList = this.props.search_store.results.map(i => {
            return <InstItem inst={i} />;
        });
        return (
            <div className="search-page">
                <Helmet title="Search for institutes, classes, courses, subjects" />
                <h4>Search results for <em>{this.props.location.query.q}</em></h4>
                {this.state.loading ? 'LOADING....' : searchList}
                {this.props.children}
            </div>
        )
    }
}