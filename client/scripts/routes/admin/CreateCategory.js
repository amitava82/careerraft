/**
 * Created by amitava on 11/02/16.
 */
import React from 'react';
import { reduxForm } from 'redux-form';
import {connect} from 'react-redux';
import autobind from 'autobind-decorator';
import {Link} from 'react-router';


import { createCategory, updateCategory, loadCategories } from '../../redux/modules/category';
import {createToast} from '../../redux/modules/toast';



@connect(state => {
    return {
        category: state.category_store
    }
})
@reduxForm({
    form: 'category',
    fields: ['_id', 'name', 'description']
})
export default class CreateCategory extends React.Component{

    static displayName = 'CreateCategoryFrom';

    @autobind
    onSubmit(data){
        if(data._id){
            const id = data._id;
            delete data._id;
            this.props.dispatch(updateCategory(id, data)).then(
                () => {
                    this.props.dispatch(createToast('Updated'));
                },
                e => this.props.dispatch(createToast(e))
            )
        }else{
            return this.props.dispatch(createCategory(data)).then(
                () => {
                    this.props.dispatch(createToast('Created'));
                    this.props.resetForm();
                },
                e => this.props.dispatch(createToast(e))
            )
        }
    }

    componentDidMount(){
        this.props.dispatch(loadCategories())
    }

    @autobind
    edit(id){
        const cat = this.props.category.entities[id];
        this.props.initializeForm(cat);
    }

    @autobind
    reset(){
        this.props.initializeForm({});
    }

    render(){
        const {fields: {name, description}, error, handleSubmit, submitting, category} = this.props;

        const categories = category.ids.map(i => {
            const c = category.entities[i];
            return (
                <li key={c._id}>
                    <strong>{c.name}</strong>
                    <button className="btn btn-link btn-sm" onClick={() => this.edit(c._id)}>Edit</button>
                </li>
            )
        });

        return (
            <div className="row">
                <div className="col-md-9">
                    <form onSubmit={handleSubmit(this.onSubmit)} className="form cell-2">
                        <h4>Add Category</h4>
                        <div className="form-group">
                            <label>Name</label>
                            <input className="form-control" type="text" {...name}/>
                            {name.error && <div>{name.error}</div>}
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea className="form-control" {...description} value={description.value || ''} />
                        </div>
                        <div>
                            <button className="btn btn-primary" disabled={submitting} type="submit">Save</button>
                            <button className="btn btn-default" type="button" onClick={this.reset}>Reset</button>
                        </div>
                    </form>
                </div>

                <div className="col-md-3">
                    <ul>
                        {categories}
                    </ul>
                </div>
            </div>
        )
    }
}