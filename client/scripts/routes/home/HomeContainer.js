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
import InstItem from './components/InstItem';

@connect(state => state)
export default class HomeContainer extends React.Component {

    componentDidMount(){
            this.props.dispatch(search.SEARCH());
            this.props.dispatch(category.LOAD_CATEGORIES());
    }

    render(){

        const instsList = this.props.search_store.results.map(i => {
            return <InstItem inst={i} />;
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