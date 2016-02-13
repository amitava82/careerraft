/**
 * Created by amitava on 04/02/16.
 */
import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import map from 'lodash/map';

import formatAddress from '../../utils/format-address';

import { institute, category, search } from '../../actions'

//import Item from './components/Item';
import FilterBar from './components/FilterBar';

@connect(state => state)
export default class HomeContainer extends React.Component {

    componentDidMount(){
            this.props.dispatch(search.SEARCH());
            this.props.dispatch(category.LOAD_CATEGORIES());
    }

    render(){

        const instsList = this.props.search_store.results.map(i => {

            const categories = map(i.categories, c => {
                return (
                    <div className="pill pill-success">
                        {c.name}
                    </div>
                )
            });

            const courses = map(i.courses, c => {
                return (
                    <div className="pill pill-info">
                        {c.name}
                    </div>
                )
            });

            return (
                <div key={i._id} className="inst-item">
                    <h5><Link to={`/institute/${i._id}`}>{i.name}</Link></h5>
                    <p className="addr"><i className="fa fa-map-marker" /> {formatAddress(i.address)}</p>
                    <p className="desc">{i.description}</p>
                    <div className="categories pills">
                        {categories}
                    </div>
                    <div className="courses pills">
                        {courses}
                    </div>
                </div>
            )
        });

        const categories = this.props.category_store.categories.map(i => {
           return <Link className="list-group-item" to={`/search?category=${i._id}`}>{i.name}</Link>
        });
        return (
            <div className="home-page grid row">
                <aside>
                    <div className="list-group">
                        {categories}
                    </div>
                </aside>
                <div className="main grid column cell">
                    {instsList}
                </div>
            </div>
        )
    }
}