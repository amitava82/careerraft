/**
 * Created by amitava on 04/02/16.
 */
import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import map from 'lodash/map';

import { institute, category } from '../../actions'

import Item from './components/Item';
import FilterBar from './components/FilterBar';

@connect(state => state)
export default class HomeContainer extends React.Component {

    componentDidMount(){
            this.props.dispatch(institute.LOAD_INSTITUTES());
            this.props.dispatch(category.LOAD_CATEGORIES());
    }

    render(){

        const items = this.props.orgs.institutes.map(i => {
            return <Item inst={i} key={i._id} />
        });

        const categories = this.props.category.categories.map(i => {
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
                    {items}
                </div>
            </div>
        )
    }
}