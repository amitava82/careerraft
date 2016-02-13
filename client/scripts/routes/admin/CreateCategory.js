/**
 * Created by amitava on 11/02/16.
 */
import React from 'react';
import { reduxForm } from 'redux-form';
import {connect} from 'react-redux';
import autobind from 'autobind-decorator';

import { CREATE_CATEGORY, LOAD_CATEGORIES, DELETE_CATEGORY } from '../../actions/category';



@connect(state => {
    return {
        category: state.category_store
    }
})
@reduxForm({
    form: 'category',
    fields: ['name', 'description', 'category']
})
export default class CreateCategory extends React.Component{

    static displayName = 'CreateCategoryFrom';

    @autobind
    onSubmit(data){
        return this.props.dispatch(CREATE_CATEGORY(data));
    }

    componentDidMount(){
        this.props.dispatch(LOAD_CATEGORIES())
    }

    @autobind
    delete(id){
        this.props.dispatch(DELETE_CATEGORY(id));
    }

    render(){
        const {fields: {name, description}, error, handleSubmit, submitting, category} = this.props;

        const categories = category.categories.map(c => {
            return (
                <li key={c._id}>
                    <strong>{c.name}</strong>
                    <button className="sm link" onClick={() => this.delete(c._id)}>Delete</button>
                </li>
            )
        });
        return (
            <div className="grid row">
                <form onSubmit={handleSubmit(this.onSubmit)} className="form cell-2">
                    <h4>Add Category</h4>
                    <div>
                        <label>Name</label>
                        <input type="text" {...name}/>
                        {name.error && <div>{name.error}</div>}
                    </div>
                    <div>
                        <label>Description</label>
                        <input type="text" {...description}/>
                    </div>
                    <div>
                        <button disabled={submitting} type="submit">Save</button>
                    </div>
                </form>
                <div className="cell">
                    <ul>
                        {categories}
                    </ul>
                </div>
            </div>
        )
    }
}