/**
 * Created by amitava on 18/02/16.
 */
import React from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import {LOAD_CATEGORIES} from '../../actions/category';

@connect(state => state)
export default class CategoryDetails extends React.Component {

    componentDidMount(){
        this.props.dispatch(LOAD_CATEGORIES());
    }

    render() {

        const categories = this.props.category_store.categories.map(i => {
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