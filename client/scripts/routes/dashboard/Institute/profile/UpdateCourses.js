/**
 * Created by amitava on 12/04/16.
 */
import React from 'react';
import {connect} from 'react-redux';
import {push, goBack} from 'react-router-redux';
import autobind from 'autobind-decorator';
import reduce from 'lodash/reduce';
import uniqBy from 'lodash/uniqBy';
import find from 'lodash/find';
import Select from 'react-select';


//import {} from '../../../../redux/modules/category';
import {loadCourses} from '../../../../redux/modules/course';
import {getSubjects} from '../../../../redux/modules/subject';


import Textarea from '../../../../components/Textarea';

import Api from '../../../../helpers/api';

const api = new Api();


@connect(state => state)
export default class UpdateCourses extends React.Component {
    
    constructor(...args){
        super(...args);
        
        this.state = {
            course: null,
            desc: null,
            subjects: [],
            selected: [],
            disabled: false
        }

    }
    
    componentDidMount(){
        const selected = this.props.params.course;
        if(selected){
            const org = this.props.institute_store.entities[this.props.params.id];
            const course = find(org.courses, c => {
                return c.course_id._id === selected;
            });

            this.loadSubjects(selected, (e, list) => {
                this.setState({
                    subjects: list
                });
            });

            this.setState({
                disabled: true,
                course: {
                    label: course.course_id.name,
                    value: selected
                },
                desc: course.description,
                selected: course.subjects.map(s => ({label: s.name, value: s._id}))
            });
        }
    }


    @autobind
    loadSubjects(courseid, callback){
        api.get(`subjects`, {
            params: {course: courseid}
        }).then(
            r => {
                const options = r.map(i => {
                    return {
                        label: i.name,
                        value: i._id
                    }
                });
                callback(null, options);
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
    handleCourseChange(v){
        this.setState({course: v});
        this.loadSubjects(v.value, (e, list) => {
            this.setState({subjects: list})
        })
    }

    @autobind
    handleSubjectChange(v){
        var selected = this.state.selected;
        Array.prototype.push.apply(selected, v);
        this.setState({selected: uniqBy(selected, 'value')});
    }

    @autobind
    onDescChange(e){
        this.setState({desc: e.target.value});
    }

    @autobind
    save(){
        const d = {
            course_id: this.state.course.value,
            description: this.state.desc,
            subjects: this.state.selected.map(i => i.value)
        };

        api.put(`institutes/${this.props.params.id}/courses`, {data: d}).then(
            r => this.props.dispatch(goBack()),
            e => console.log(e)
        )
    }

    @autobind
    cancel(){
        this.props.dispatch(goBack());
    }
    
    render(){

        return (
            <div>
                <div className="form-group">
                    <label className="control-label">Select courses you teach:</label>
                    <Select.Async
                        disabled={this.state.disabled}
                        value={this.state.course}
                        clearable={false}
                        loadOptions={this.loadCourses}
                        name="courses"
                        onChange={this.handleCourseChange}
                    />
                </div>

                {this.state.course ?
                    <div>
                        <Textarea onChange={this.onDescChange} value={this.state.desc} label="Please describe more about this course" placeholder="optional" />

                        <div className="form-group">
                            <label className="control-label">Which subjects do you teach</label>
                            <Select
                                value={this.state.selected}
                                multi={true}
                                clearable={false}
                                options={this.state.subjects}
                                name="subjects"
                                onChange={this.handleSubjectChange}
                            />
                        </div>
                        <button type="button" onClick={this.save} className="btn btn-primary">Save</button>
                        <button type="button" className="btn btn-default" onClick={this.cancel}>Cancel</button>
                    </div>
                    : null }
            </div>
        )
    }
}