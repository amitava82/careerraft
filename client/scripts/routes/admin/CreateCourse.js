/**
 * Created by amitava on 11/02/16.
 */
import React from 'react';
import { reduxForm } from 'redux-form';
import {connect} from 'react-redux';
import autobind from 'autobind-decorator';

import { CREATE_COURSE, LOAD_COURSES, DELETE_COURSE } from '../../actions/course';
import { LOAD_CATEGORIES } from '../../actions/category';



@connect(state => {
    return {
        course: state.course_store,
        category: state.category_store
    }
})
@reduxForm({
    form: 'course',
    fields: ['name', 'description', 'category']
})
export default class CreateCourse extends React.Component{

    static displayName = 'CreateCourseFrom';

    constructor(props, ctx){
        super(props, ctx);

        this.state = {
            categories: []
        }
    }

    @autobind
    onSubmit(data){
        return this.props.dispatch(CREATE_COURSE(data));
    }

    componentDidMount(){
        this.props.dispatch(LOAD_CATEGORIES())
    }

    @autobind
    delete(id){
        this.props.dispatch(DELETE_COURSE(id))
    }

    render(){
        const {fields: {name, description, category}, error, handleSubmit, submitting, course} = this.props;

        const courses = course.courses.map(c => {
            return (
                <li key={c._id}>
                    <strong>{c.name}</strong>
                    <p>{c.description}</p>
                    <button onClick={() => this.delete(c._id)}>Delete</button>
                </li>
            )
        });
        return (
            <div className="grid row">
                <form onSubmit={handleSubmit(this.onSubmit)} className="form cell-2">
                    <h4>Add Course</h4>
                    <div>
                        <label>Select Category</label>
                        <select {...category} value={category.value}>
                            {this.props.category.categories.map(i => {
                                return (<option value={i._id} key={i._id}>{i.name}</option>)
                            })}
                        </select>
                    </div>
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
                        {courses}
                    </ul>
                </div>
            </div>
        )
    }
}