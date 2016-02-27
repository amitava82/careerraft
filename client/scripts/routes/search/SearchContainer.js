/**
 * Created by amitava on 31/01/16.
 */
import React from 'react';
import autobind from 'autobind-decorator';
import { connect } from 'react-redux';
import {Link} from 'react-router';
import {push} from 'react-router-redux';
import isEqual from 'lodash/isEqual';
import Helmet from 'react-helmet';
import merge from 'lodash/merge';
import pull from 'lodash/pull';

import { search, filters } from '../../redux/modules/search';
import {createToast} from '../../redux/modules/toast';

import SearchResults from './SearchResuts';
import FilterPanel from './FilterPane';
import Loading from '../../components/Loading';
import Error from '../../components/Error';

@connect(state => {
    return {
        search_store: state.search_store,
        routing: state.routing
    }
})
export default class SearchContainer extends React.Component {

    //TODO ssr;
    //static needs = [
    //    function search(props, dispatch){
    //        console.log("SEARCH")
    //        dispatch(search({
    //            ...props.location.query
    //        }))
    //    }
    //];

    constructor(props, ctx) {
        super(props, ctx);

        this.state = {
            filters: null
        }
    }

    componentDidMount() {
        this.search(this.props);
    }

    componentWillReceiveProps(nextPros) {
        if (isEqual(nextPros.location.query, this.props.location.query)) return;
        this.search(nextPros);
    }


    isFirst() {
        const page = this.props.location.query.page;
        return !page || Number(page) === 1;
    }

    hasMore() {
        return this.props.search_store.results.length > 0;
    }

    search(props) {
        props.dispatch(search({
                ...props.location.query
            }))
            .then(
                r => {
                    return props.dispatch(filters({...props.location.query}))
                }
            ).then(
            f => {
                this.setState({filters: f});
            },
            e => {
                this.props.dispatch(createToast(e))
            }
        );
    }

    @autobind
    toggleFilter(val, type, rm) {
        const query = {...this.props.location.query};
        let q = query[type];
        if (q) {
            rm ? pull(q, val) : q.push(val)
        } else {
            q = [val];
            //q[type] =  [val];
        }
        q.length ? query[type] = q : delete query[type];

        this.props.dispatch(push({...this.props.location, query: query}))
    }

    @autobind
    resetFilters(){
        const query = {...this.props.location.query};
        delete query['category'];
        delete query['course'];
        delete query['subject'];
        this.props.dispatch(push({...this.props.location, query: query}));
    }

    @autobind
    next() {
        const page = this.props.location.query.page;
        const next = page ? Number(page) + 1 : 2;
        const q = merge({}, {...this.props.location.query, page: next});
        this.props.dispatch(push({...this.props.location, query: q}));
    }

    @autobind
    previous() {
        const page = this.props.location.query.page;
        const prev = page ? Number(page) - 1 : 1;
        const q = merge({}, {...this.props.location.query, page: prev});
        this.props.dispatch(push({...this.props.location, query: q}));
    }

    render() {
        const query = this.props.location.query.q;
        const pageTitle = query ? `Search for ${query}` : "Search for institutes, classes, courses, subjects";

        const {search_store} = this.props;

        let content = null;

        if (search_store.error) {
            content = <Error error={search_store.error}/>
        } else if (search_store.loading) {
            content = <div className="text-center text-title"><Loading /></div>
        } else if (search_store.results.length) {
            content = <SearchResults results={search_store.results}/>
        } else {
            content = (
                <div className="text-center">
                    <p className="text-headline">No results found. <Link to="/search">Back to Search</Link></p>
                </div>
            )
        }

        return (
            <div className="search-page">
                <Helmet title={pageTitle}/>
                <div className="hero-unit">
                    <div className="page-inner grid">
                        <div className="cell-span-3"></div>
                        <div className="cell-span-7">
                            <h3 className="text-display-2">{pageTitle}</h3>
                            {search_store.location &&
                            <p className="text-title">Searching around {search_store.location.label}</p>}
                        </div>
                    </div>
                </div>
                <div className="content-body">
                    <div className="page-inner grid">
                        <div className="cell-span-3">
                            <FilterPanel filters={this.state.filters} toggleFilter={this.toggleFilter} resetFilters={this.resetFilters} />
                        </div>
                        <div className="cell-span-8">
                            {content}
                            <div className="pager grid">
                                <div className="cell-span-6 text-left">
                                    <button disabled={this.isFirst()} onClick={this.previous} className="text-left">
                                        Previous
                                    </button>
                                </div>
                                <div className="cell-span-6 text-right">
                                    <button disabled={!this.hasMore()} onClick={this.next} className="text-right">Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {this.props.children}
            </div>
        )
    }
}
function createPagingLink() {

}