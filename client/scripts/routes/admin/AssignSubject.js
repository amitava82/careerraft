/**
 * Created by amitava on 13/02/16.
 */
import React from 'react';
import {reduxForm } from 'redux-form';
import autobind from 'autobind-decorator';

import {LOAD_CATEGORIES} from '../../actions/category'
import {LOAD_COURSES} from '../../actions/course';
import {LOAD_SUBJECTS} from '../../actions/subject';

@reduxForm({
    form: 'assign_subject',
    fields: [
        'course',
        'subject',
        'category'
    ]
}, state => state)
export default class AssignSubject extends React.Component {

    static componentName = 'AssignSubject';

    constructor(){
        super();

        this.state = {

        }
    }

    componentDidMount(){
        this.props.dispatch(LOAD_CATEGORIES());
    }

    onSubmit(data){
        console.log(data);
    }

    @autobind
    onChangeCategory(e){
        this.props.fields.category.onChange(e);
        this.props.dispatch(LOAD_COURSES(e.target.value));
    }

    @autobind
    onChangeCourse(e){
        this.props.fields.course.onChange(e);
        this.props.dispatch(LOAD_SUBJECTS(e.target.value));
    }

    render(){

        const {fields: {course, subject, category}, handleSubmit} = this.props;

        return (
            <form onSubmit={handleSubmit(this.onSubmit)}>
                <div>
                    <label>Select Category</label>
                    <select {...category} value={category.value} onChange={this.onChangeCategory}>
                        <option value="">Select</option>
                        {
                            this.props.category_store.categories.map(c => {
                                return <option value={c._id}>{c.name}</option>
                            })
                        }
                    </select>
                    <input type="hidden" {...category} value={category.value} />
                </div>
                <div>
                    <label>Select Course</label>
                    <select {...course} onChange={this.onChangeCourse} value={course.value}>
                        <option value="">Select</option>
                        {
                            this.props.course_store.courses.map(c => {
                                return <option value={c._id}>{c.name}</option>
                            })
                        }
                    </select>
                </div>
                <div>
                    <label>Select Subject</label>
                    <select multiple  {...subject} value={subject.value}>
                        <option  value="">Select</option>
                        {
                            this.props.subject_store.subjects.map(c => {
                                return <option value={c._id}>{c.name}</option>
                            })
                        }
                    </select>
                </div>
                <div>
                    <button type="submit">Save</button>
                </div>
            </form>
        )
    }
}