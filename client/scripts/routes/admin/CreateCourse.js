/**
 * Created by amitava on 11/02/16.
 */
import React from 'react';
import { reduxForm } from 'redux-form';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import autobind from 'autobind-decorator';
import reduce from 'lodash/reduce';

import { createCourse, loadCourses, update } from '../../redux/modules/course';
import { loadCategories } from '../../redux/modules/category';
import {createToast} from '../../redux/modules/toast';



@connect(state => {
    return {
        course: state.course_store,
        category: state.category_store
    }
})
@reduxForm({
    form: 'course',
    fields: ['_id', 'name', 'description', 'category']
})
export default class CreateCourse extends React.Component{

    static displayName = 'CreateCourseFrom';

    constructor(props, ctx){
        super(props, ctx);

        this.state = {
            category: null
        }
    }

    @autobind
    onSubmit(data){
        if(data._id){
            const id = data._id;
            delete data._id;
            this.props.dispatch(update(id, data)).then(
                () => {
                    this.props.dispatch(createToast('Updated'));
                },
                e => this.props.dispatch(createToast(e))
            )
        }else{
            return this.props.dispatch(createCourse({...data, category: this.state.category})).then(
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
    selectCategory(e){
        const val = e.target.value;
        this.setState({category: val});
        this.props.dispatch(loadCourses(val));
    }

    @autobind
    edit(id){
        const s = this.props.course.entities[id];
        this.props.initializeForm(s);
    }

    render(){
        const {fields: {name, description, category}, error, handleSubmit, submitting, course} = this.props;

        const courses = reduce(course.ids, (memo,i) => {
            const c = course.entities[i];
            if(c.category == this.state.category)
            memo.push (
                <li key={c._id}>
                    <strong>{c.name}</strong>
                    <button className="btn btn-link btn-sm" onClick={() => this.edit(c._id)}>Edit</button>
                </li>
            );
            return memo;
        }, []);
        return (
            <div className="row">
                <div className="col-md-9">
                    <form onSubmit={handleSubmit(this.onSubmit)} className="form cell-2">
                        <h4>Add Course</h4>
                        <div className="form-group">
                            <label>Select Category</label>
                            <select className="form-control" value={this.state.category} onChange={this.selectCategory} >
                                <option value="">Select category</option>
                                {this.props.category.ids.map(c => {
                                    const i = this.props.category.entities[c];
                                    return (<option value={i._id} key={i._id}>{i.name}</option>)
                                })}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Name</label>
                            <input className="form-control" type="text" {...name}/>
                            {name.error && <div>{name.error}</div>}
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea className="form-control"  {...description} value={description.value || ''}/>
                        </div>
                        <div>
                            <button className="btn btn-primary" disabled={submitting} type="submit">Save</button>
                        </div>
                    </form>
                </div>
                <div className="col-md-3">
                    <ul>
                        {courses}
                    </ul>
                </div>
            </div>
        )
    }
}