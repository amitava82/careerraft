/**
 * Created by amitava on 13/02/16.
 */
import React from 'react';
import {reduxForm } from 'redux-form';
import {connect} from 'react-redux';
import autobind from 'autobind-decorator';

import {LOAD_CATEGORIES} from '../../actions/category'
import {LOAD_COURSES} from '../../actions/course';
import {LOAD_SUBJECTS} from '../../actions/subject';
import {ADD_SUBJECTS} from '../../actions/institute';


@reduxForm({
    form: 'assign_subject',
    fields: [
        'course',
        'subjects',
        'category'
    ]
}, state => state)
export default class AssignSubject extends React.Component {

    static componentName = 'AssignSubject';

    constructor(props, ctx){
        super(props, ctx);

        this.state = {

        }
    }

    componentDidMount(){
        this.props.dispatch(LOAD_CATEGORIES());
    }

    @autobind
    onSubmit(data){
        return this.props.dispatch(ADD_SUBJECTS(this.props.inst_id, data)).then(
            r => this.props.onSave(r),
            e => console.log(e)
        )
    }

    @autobind
    onChangeCategory(e){
        this.props.fields.category.onChange(e);
        this.props.dispatch(LOAD_COURSES(e.target.value));
    }

    @autobind
    onChangeCourse(e){
        this.props.fields.course.onChange(e);
        this.props.dispatch(LOAD_SUBJECTS({course: e.target.value, category: this.props.fields.category.value}));
    }

    render(){

        const {fields: {course, subjects, category}, handleSubmit, submitting} = this.props;

        return (
            <form onSubmit={handleSubmit(this.onSubmit)} className="cell-2">
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
                    <select multiple  {...subjects} value={subjects.value}>
                        <option  value="">Select</option>
                        {
                            this.props.subject_store.subjects.map(c => {
                                return <option value={c._id}>{c.name}</option>
                            })
                        }
                    </select>
                </div>
                <div>
                    <button disabled={submitting} type="submit">Save</button>
                </div>
            </form>
        )
    }
}