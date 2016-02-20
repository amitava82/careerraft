/**
 * Created by amitava on 11/02/16.
 */
import React from 'react';
import { reduxForm } from 'redux-form';
import {connect} from 'react-redux';
import autobind from 'autobind-decorator';
import {Link} from 'react-router';


import { createCategory, loadCategories } from '../../redux/modules/category';
import {createToast} from '../../redux/modules/toast';



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
        return this.props.dispatch(cre(data)).then(
            () => {
                this.props.dispatch(createCategory('Created'));
                this.props.resetForm();
            },
            e => this.props.dispatch(createToast(e))
        )
    }

    componentDidMount(){
        this.props.dispatch(loadCategories())
    }


    render(){
        const {fields: {name, description}, error, handleSubmit, submitting, category} = this.props;

        const categories = category.categories.map(c => {
            return (
                <li key={c._id}>
                    <strong>{c.name}</strong> <Link to={`/admin/category/${c._id}/edit`}>Edit</Link>
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
                        <textarea {...description} value={description.value || ''} />
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