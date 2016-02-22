/**
 * Created by amitava on 31/01/16.
 */
import React from 'react';
import autobind from 'autobind-decorator';
import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';
import Helmet from 'react-helmet';

import { search } from '../../redux/modules/search';

import SearchResults from './SearchResuts';
import Loading from '../../components/Loading';

@connect(state => state)
export default class SearchContainer extends React.Component {

    constructor(props, ctx){
        super(props, ctx);
    }


    componentDidMount(){
        this.search(this.props);
    }

    componentWillReceiveProps(nextPros){

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
        const query = this.props.location.query.q;
        const pageTitle = query ? `Search results for ${query}` : "Search for institutes, classes, courses, subjects";

        const {search_store} = this.props;

        let content = null;

        if(search_store.error){
            content = <h5>{search_store.error}</h5>
        }else{
            content = search_store.loading ? <Loading /> : <SearchResults results={search_store.results} />
        }

        return (
            <div className="search-page">
                <Helmet title={pageTitle} />
                <h4>Search results for <em>{query}</em></h4>
                {content}
                {this.props.children}
            </div>
        )
    }
}