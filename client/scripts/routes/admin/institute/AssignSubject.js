/**
 * Created by amitava on 13/02/16.
 */
import React from 'react';
import {connect} from 'react-redux';
import autobind from 'autobind-decorator';
import reduce from 'lodash/reduce';
import union from 'lodash/union';
import uniqBy from 'lodash/uniqBy';
import Select from 'react-select';

import {loadCategories} from '../../../redux/modules/category';
import {loadCourses} from '../../../redux/modules/course';
import {getSubjects} from '../../../redux/modules/subject';
import {addSubject, removeSubject} from '../../../redux/modules/institute';
import {createToast} from '../../../redux/modules/toast';

import Api from '../../../helpers/api';

const api = new Api();

@connect(state => state)
export default class AssignSubject extends React.Component {

    static componentName = 'AssignSubject';

    constructor(props, ctx){
        super(props, ctx);

        this.state = {
            values: null,
            courses: null
        }
    }

    componentDidMount(){
        const inst = this.props.institute_store.entities[this.props.params.id];
        const subs = reduce(inst.subjects, (memo, i) => {
            memo.push({
                label: i.subject.course.name + ' - ' +i.subject.name,
                value: i.subject._id
            });
            return memo;
        }, []);

        this.setState({values: subs});
    }

    @autobind
    onSubmit(e){
        e.preventDefault();

        const subs = reduce(this.state.values, (memo, i) => {
            memo.push(i.value);
            return memo;
        }, []);

        return this.props.dispatch(addSubject(this.props.params.id, {subjects: subs})).then(
            r => this.props.dispatch(createToast('Saved!')),
            e => this.props.dispatch(createToast(e))
        )
    }

    @autobind
    unassign(cat){
        if(confirm("Confirm delete?")){
            this.props.dispatch(removeSubject(this.props.params.id, cat.subject._id));
        }
    }

    @autobind
    loadSubjects(str, callback){
        api.get(`subjects`, {
            params: {name: str}
        }).then(
            r => {
                const options = r.map(i => {
                    return {
                        label: i.course.name +' - '+i.name,
                        value: i._id
                    }
                });
                callback(null, {options});
            }
        );
    }

    @autobind
    loadCourses(str, callback){
        api.get('courses', {
            params: {name: str}
        }).then(
            r => {
                const options = r.map(i => {
                    return {
                        label: i.name,
                        value: i._id
                    }
                });
                callback(null, {options});
            }
        )
    }

    @autobind
    handleSelectChange(values){
        console.log(values);
        this.setState({values})
    }

    @autobind
    handleCourseChange(v){
        api.get('subjects', {
            params: {course: v.value}
        }).then(
            r => {
                const subjects = r.map(i => {

                    return {
                        value: i._id,
                        label: i.course.name +' - '+i.name
                    }
                });

                Array.prototype.push.apply(subjects, this.state.values);

                this.setState({
                    values: uniqBy(subjects, 'value')
                })
            },
            e => this.props.dispatch(createToast(e))
        )
    }

    render(){

        const {institute_store, category_store, subject_store, course_store} = this.props;
        const inst = institute_store.entities[this.props.params.id];

        return (
            <div className="row">
                <div className="col-md-12">
                    <form onSubmit={this.onSubmit}>
                        <div className="form-group">
                            <label>Assign all subjects from course:</label>
                            <Select.Async
                                value={this.state.courses}
                                clearable={false}
                                loadOptions={this.loadCourses}
                                name="courses"
                                onChange={this.handleCourseChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Selected subjects</label>
                            <Select.Async
                                value={this.state.values}
                                multi={true}
                                clearable={false}
                                loadOptions={this.loadSubjects}
                                name="subjects"
                                onChange={this.handleSelectChange}
                            />
                        </div>
                        <button className="btn btn-primary"  type="submit">Save</button>
                    </form>
                </div>
            </div>
        )
    }
}