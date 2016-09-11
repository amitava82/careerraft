/**
 * Created by amitava on 04/05/16.
 */
import React from 'react';
import {reduxForm} from 'redux-form';

import Input from '../../../components/PureInput';
import Textarea from '../../../components/Textarea';

@reduxForm({
    form: 'edit-provider',
    fields: ['name', 'description', 'short_description']
})
export default class EditProvider extends React.Component{

    static propTypes = {
        kind: React.PropTypes.string,
        initialValues: React.PropTypes.object,
        onSubmit: React.PropTypes.func,
        onCancel: React.PropTypes.func
    };

    componentDidMount(){
        this.props.initializeForm(this.props.initialValues);
    }

    render(){
        const {fields: {name, description, short_description},  handleSubmit, onCancel, kind} = this.props;

        return (
            <form onSubmit={handleSubmit}>
                <Input label={kind == 'INST' ? 'Institute Name' : 'Your name'} field={name} />
                <Textarea label="Short description" field={short_description} placeholder={kind == 'INST' ? "Please write a summary in two lines" : "Your tag line"} />
                <Textarea label={kind == 'INST' ? 'Detailed description about your Institute' : "Please write about yourself"} field={description} />
                <button type="submit" className="btn btn-primary">Submit</button>
                <button onClick={onCancel} type="button" className="btn btn-default">Cancel</button>
            </form>
        )
    }
}