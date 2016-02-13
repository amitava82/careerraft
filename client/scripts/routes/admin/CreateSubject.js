/**
 * Created by amitava on 11/02/16.
 */
import React from 'react';
import { reduxForm } from 'redux-form';
import {connect} from 'react-redux';
import autobind from 'autobind-decorator';

import { CREATE_SUBJECT, LOAD_SUBJECTS } from '../../actions/subject';
import { LOAD_COURSES } from '../../actions/course';
import { LOAD_CATEGORIES } from '../../actions/category';



@connect(state => {
    return {
        subject: state.subject_store,
        course: state.course_store,
        category: state.category_store
    }
})
@reduxForm({
    form: 'subject',
    fields: ['name', 'description', 'category', 'course']
})
export default class CreateSubject extends React.Component{

    static displayName = 'CreateSubjectFrom';

    @autobind
    onSubmit(data){
        return this.props.dispatch(CREATE_SUBJECT(data));
    }

    componentDidMount(){
        //this.props.dispatch(LOAD_COURSES());
        this.props.dispatch(LOAD_CATEGORIES());
    }

    @autobind
    delete(item){

    }

    render(){
        const {fields: {name, description, category, course}, error, handleSubmit, submitting, subject} = this.props;

        const subjects = subject.subjects.map(c => {
            return (
                <li key={c._id}>
                    <strong>{c.name}</strong>
                    <p>{c.description}</p>
                    <button onClick={this.delete}>Delete</button>
                </li>
            )
        });
        return (
            <div className="grid row">
                <form onSubmit={handleSubmit(this.onSubmit)} className="form cell-2">
                    <h4>Add Subject</h4>
                    <div>
                        <label>Select Category</label>
                        <select {...category} value={category.value}
                                              onChange={e =>{
                                                category.onChange(e);
                                                this.props.dispatch(LOAD_COURSES(e.target.value))
                                              }

                        }>
                            <option value="">Select</option>
                            {this.props.category.categories.map(i => {
                                return (<option value={i._id} key={i._id}>{i.name}</option>)
                            })}
                        </select>
                    </div>
                    <div>
                        <label>Select Course</label>
                        <select {...course} value={course.value}>
                            <option value="">Select</option>
                            {this.props.course.courses.map(i => {
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
                        {subjects}
                    </ul>
                </div>
            </div>
        )
    }
}