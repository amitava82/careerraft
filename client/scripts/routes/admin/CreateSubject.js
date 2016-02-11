/**
 * Created by amitava on 11/02/16.
 */
import React from 'react';
import { reduxForm } from 'redux-form';
import {connect} from 'react-redux';
import autobind from 'autobind-decorator';

import { CREATE_SUBJECT, LOAD_SUBJECTS } from '../../actions/subject';



@connect(state => {
    return {
        subject: state.subject
    }
})
@reduxForm({
    form: 'subject',
    fields: ['name', 'description']
})
export default class CreateSubject extends React.Component{

    static displayName = 'CreateSubjectFrom';

    @autobind
    onSubmit(data){
        return this.props.dispatch(CREATE_SUBJECT(data));
    }

    componentDidMount(){
        this.props.dispatch(LOAD_SUBJECTS())
    }

    @autobind
    delete(item){

    }

    render(){
        const {fields: {name, description}, error, handleSubmit, submitting, subject} = this.props;

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
                <h4>Add Subject</h4>
                <form onSubmit={handleSubmit(this.onSubmit)} className="form cell-2">
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