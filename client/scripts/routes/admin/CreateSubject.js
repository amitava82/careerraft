/**
 * Created by amitava on 11/02/16.
 */
import React from 'react';
import { reduxForm } from 'redux-form';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import autobind from 'autobind-decorator';

import reduce from 'lodash/reduce';

import { createSubject, getSubjects } from '../../redux/modules/subject';
import { loadCourses } from '../../redux/modules/course';
import { loadCategories } from '../../redux/modules/category';
import {createToast} from '../../redux/modules/toast';



@connect(state => {
    return {
        category_store: state.category_store,
        subject_store: state.subject_store,
        course_store: state.course_store
    }
})
@reduxForm({
    form: 'subject_create',
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
        const p =  this.props.dispatch(createSubject({...data, category, course}));

        p.then(
                (r) => {
                    console.log(r)
                    this.props.dispatch(createToast('Created'));
                    this.props.resetForm();
                },
                e => this.props.dispatch(createToast(e))
            )
        }

    componentDidMount(){
        console.log('cat')
        this.props.dispatch(loadCategories());
    }

    @autobind
    selectCategory(e){
        const val = e.target.value;
        this.setState({category: val, course: null});
        this.props.dispatch(loadCourses(val));
    }

    @autobind
    selectCourse(e){
        const val = e.target.value;
        this.props.dispatch(getSubjects({course: val}));
        this.setState({course: val});
    }

    render(){
        const {fields: {name, description}, error, handleSubmit, submitting,category_store, subject_store, course_store} = this.props;

        const subjects = reduce(subject_store.ids, (memo, i) => {
            const c = subject_store.entities[i];
            if(c.course == this.state.course)
                memo.push(
                    <li key={c._id}>
                        <strong>{c.name}</strong>
                        <Link to={`/admin/subject/${c._id}/edit`}>Edit</Link>
                    </li>
                );
            return memo;
        }, []);
        return (
            <div className="grid row">
                <form onSubmit={handleSubmit(this.onSubmit)} className="form cell-2">
                    <h4>Add Subject</h4>
                    <div>
                        <label>Select Category</label>
                        <select value={this.state.category} onChange={this.selectCategory}>
                            <option value="">Select</option>
                            {category_store.ids.map(i => {
                                const c = category_store.entities[i];
                                return (<option value={c._id} key={c._id}>{c.name}</option>)
                            })}
                        </select>
                    </div>
                    <div>
                        <label>Select Course</label>
                        <select value={this.state.course} onChange={this.selectCourse}>
                            <option value="">Select</option>
                            {reduce(course_store.ids, (memo, c) => {
                                const i = course_store.entities[c];
                                if(i.category == this.state.category)
                                    memo.push((<option value={i._id} key={i._id}>{i.name}</option>))
                                return memo;
                            }, [])}
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