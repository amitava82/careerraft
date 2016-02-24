/**
 * Created by amitava on 13/02/16.
 */
import React from 'react';
import {reduxForm } from 'redux-form';
import {connect} from 'react-redux';
import autobind from 'autobind-decorator';
import reduce from 'lodash/reduce';

import {loadCategories} from '../../../redux/modules/category';
import {loadCourses} from '../../../redux/modules/course';
import {getSubjects} from '../../../redux/modules/subject';
import {addSubject, removeSubject} from '../../../redux/modules/institute';

@reduxForm({
    form: 'assign_subject',
    fields: [
        'course',
        'subjects',
        'category'
    ]
}, state => {
    return {
        institute_store: state.institute_store,
        category_store: state.category_store,
        course_store: state.course_store,
        subject_store: state.subject_store
    }
})
export default class AssignSubject extends React.Component {

    static componentName = 'AssignSubject';

    constructor(props, ctx){
        super(props, ctx);

        this.state = {

        }
    }

    @autobind
    onSubmit(data){
        return this.props.dispatch(addSubject(this.props.params.id, data)).then(
            r => this.props.onSave(r),
            e => console.log(e)
        )
    }

    @autobind
    onChangeCategory(e){
        this.props.fields.category.onChange(e);
        this.props.dispatch(loadCourses(e.target.value));
    }

    @autobind
    onChangeCourse(e){
        this.props.fields.course.onChange(e);
        this.props.dispatch(getSubjects({course: e.target.value, category: this.props.fields.category.value}));
    }

    @autobind
    unassign(cat){
        if(confirm("Confirm delete?")){
            this.props.dispatch(removeSubject(this.props.params.id, cat.subject._id));
        }
    }

    render(){

        const {fields: {course, subjects, category}, handleSubmit, submitting, institute_store, category_store, subject_store, course_store} = this.props;
        const inst = institute_store.entities[this.props.params.id];

        return (
            <div className="grid">
                <div className="cell-3">
                    <form onSubmit={handleSubmit(this.onSubmit)} className="cell-2">
                        <div>
                            <label>Select Category</label>
                            <select {...category} value={category.value} onChange={this.onChangeCategory}>
                                <option value="">Select</option>
                                {
                                    category_store.ids.map(c => {
                                        const cat = category_store.entities[c];
                                        return <option value={cat._id}>{cat.name}</option>
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
                                    reduce(course_store.ids, (memo, c) => {
                                        const _c = course_store.entities[c];
                                        if(_c.category == category.value)
                                            memo.push(<option value={_c._id}>{_c.name}</option>);
                                        return memo;
                                    }, [])
                                }
                            </select>
                        </div>
                        <div>
                            <label>Select Subject</label>
                            <select multiple  {...subjects} value={subjects.value}>
                                <option  value="">Select</option>
                                {
                                    reduce(subject_store.ids, (memo, i) => {
                                        const s = subject_store.entities[i];
                                        if(s.course == course.value)
                                            memo.push( <option value={s._id}>{s.name}</option> );
                                        return memo;
                                    }, [])
                                }
                            </select>
                        </div>
                        <div>
                            <button disabled={submitting} type="submit">Save</button>
                        </div>
                    </form>
                </div>
                <div className="cell">
                    <h5>Assigned subjects:</h5>
                    {inst.subjects.map(i => {
                        return (
                            <p>{i.subject.course.name} - {i.name} <button onClick={() => this.unassign(i)} className="link">Delete</button></p>
                        )
                    })}
                </div>
            </div>
        )
    }
}