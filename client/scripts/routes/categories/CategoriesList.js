/**
 * Created by amitava on 18/02/16.
 */
import React from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';

import {loadCategories} from '../../redux/modules/category';

import middleware from '../../utils/middleware';

@connect(state => state)
@middleware([
    {
        key: '$categories',
        watch: (props) => props,
        handler: (props) => props.dispatch(loadCategories())
    }
])
export default class CategoryDetails extends React.Component {

    componentDidMount(){
        this.props.dispatch(loadCategories());
    }

    render() {

        const categories = this.props.category_store.ids.map(c => {
            const i = this.props.category_store.entities[c];
            return (
                <div className="tile">
                    <Link to={`/categories/${i._id}`}>
                        <h4>{i.name}</h4>
                        <p>{i.description}</p>
                    </Link>
                </div>
            )
        });
        return (
            <div className="tile-container">
                {categories}
            </div>
        )

    }
}