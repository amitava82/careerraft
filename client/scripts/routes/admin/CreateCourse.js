/**
 * Created by amitava on 11/02/16.
 */
import React from 'react';
import { reduxForm } from 'redux-form';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import autobind from 'autobind-decorator';

import { CREATE_COURSE, LOAD_COURSES, DELETE_COURSE } from '../../actions/course';
import { LOAD_CATEGORIES } from '../../actions/category';
import {createToast} from '../../actions';



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
            category: null
        }
    }

    @autobind
    onSubmit(data){
        const category = this.state.category;
        return this.props.dispatch(CREATE_COURSE({...data, category})).then(
            () => {
                this.props.dispatch(createToast('Created'));
                this.props.resetForm();
            },
            e => this.props.dispatch(createToast(e))
        )
    }

    componentDidMount(){
        this.props.dispatch(LOAD_CATEGORIES())
    }

    @autobind
    selectCategory(e){
        const val = e.target.value;
        this.setState({category: val});
        this.props.dispatch(LOAD_COURSES(val));
    }

    render(){
        const {fields: {name, description, category}, error, handleSubmit, submitting, course} = this.props;

        const courses = course.courses.map(c => {
            return (
                <li key={c._id}>
                    <strong>{c.name}</strong>
                    <Link to={`/admin/course/${c._id}/edit`}>Edit</Link>
                </li>
            )
        });
        return (
            <div className="grid row">
                <form onSubmit={handleSubmit(this.onSubmit)} className="form cell-2">
                    <h4>Add Course</h4>
                    <div>
                        <label>Select Category</label>
                        <select value={this.state.category} onChange={this.selectCategory} >
                            <option value="">Select category</option>
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
                        <textarea  {...description} value={description.value || ''}/>
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