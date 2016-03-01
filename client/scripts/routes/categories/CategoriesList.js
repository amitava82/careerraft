/**
 * Created by amitava on 18/02/16.
 */
import React from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';

import middleware from '../../utils/middleware';

@connect(state => state)
export default class CategoryDetails extends React.Component {

    componentDidMount(){
        //this.props.dispatch(loadCategories());
    }

    render() {

        const categories = this.props.category_store.ids.map(c => {
            const i = this.props.category_store.entities[c];
            return (
                <div className="m-bl">
                    <h5 className="text-headline">
                        <Link className="strong" to={`/categories/${i._id}`}>
                            {i.name}
                        </Link>
                    </h5>
                    <p>{i.description}</p>
                </div>

            )
        });
        return (
            <div className="container">
                <div className="row">
                    <div className="col-xs-11 col-xs-offset-1">
                        {categories}
                    </div>
                </div>
            </div>
        )

    }
}