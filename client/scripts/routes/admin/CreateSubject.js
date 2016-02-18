/**
 * Created by amitava on 11/02/16.
 */
import React from 'react';
import { reduxForm } from 'redux-form';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import autobind from 'autobind-decorator';

import { CREATE_SUBJECT, LOAD_SUBJECTS } from '../../actions/subject';
import { LOAD_COURSES } from '../../actions/course';
import { LOAD_CATEGORIES } from '../../actions/category';
import {createToast} from '../../actions';



@connect(state => {
    return {
        category_store: state.category_store,
        subject_store: state.subject_store,
        course_store: state.course_store
    }
})
@reduxForm({
    form: 'subject',
    fields: ['name', 'description']
})
export default class CreateSubject extends React.Component{

    static displayName = 'CreateSubjectFrom';

    constructor(props, ctx){
        super(props, ctx);

        this.state = {
            category: null,
            course: null
        }
    }

    @autobind
    onSubmit(data){
        const {category, course} = this.state;
        return this.props.dispatch(CREATE_SUBJECT({...data, category, course})).then(
            () => {
                this.props.dispatch(createToast('Created'));
                this.props.resetForm();
            },
            e => this.props.dispatch(createToast(e))
        )
    }

    componentDidMount(){
        console.log('cat')
        this.props.dispatch(LOAD_CATEGORIES());
    }

    @autobind
    selectCategory(e){
        const val = e.target.value;
        this.setState({category: val, course: null});
        this.props.dispatch(LOAD_COURSES(val));
    }

    @autobind
    selectCourse(e){
        const val = e.target.value;
        this.props.dispatch(LOAD_SUBJECTS({course: val}));
        this.setState({course: val});
    }

    render(){
        const {fields: {name, description}, error, handleSubmit, submitting,category_store, subject_store, course_store} = this.props;

        const subjects = subject_store.subjects.map(c => {
            return (
                <li key={c._id}>
                    <strong>{c.name}</strong>
                    <Link to={`/admin/subject/${c._id}/edit`}>Edit</Link>
                </li>
            )
        });
        return (
            <div className="grid row">
                <form onSubmit={handleSubmit(this.onSubmit)} className="form cell-2">
                    <h4>Add Subject</h4>
                    <div>
                        <label>Select Category</label>
                        <select value={this.state.category} onChange={this.selectCategory}>
                            <option value="">Select</option>
                            {category_store.categories.map(i => {
                                return (<option value={i._id} key={i._id}>{i.name}</option>)
                            })}
                        </select>
                    </div>
                    <div>
                        <label>Select Course</label>
                        <select value={this.state.course} onChange={this.selectCourse}>
                            <option value="">Select</option>
                            {course_store.courses.map(i => {
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
                        <textarea {...description} value={description.value || ''} />
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