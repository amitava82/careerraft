/**
 * Created by amitava on 11/02/16.
 */
import React from 'react';
import { reduxForm } from 'redux-form';
import {connect} from 'react-redux';
import {routeActions} from 'react-router-redux';
import autobind from 'autobind-decorator';
import {createProvider} from '../../../redux/modules/profile';
import {createToast} from '../../../redux/modules/toast';

import Input from '../../../components/PureInput';
import Select from '../../../components/Select';
import Textarea from '../../../components/Textarea';

@reduxForm({
    form: 'institute_create',
    fields: [
        'name',
        'description',
        'short_description',
        "kind"
    ]
}, state => state)
export default class Provider extends React.Component{

    static displayName = 'CreateInstituteFrom';

    @autobind
    onSubmit(data){
        return this.props.dispatch(createProvider(data)).then(
            d => {
                this.props.dispatch(routeActions.push(`/admin/institute/manage/${d.result}`));
                this.props.dispatch(createToast('Institute created.'));
            },
            e => {
                this.props.dispatch(createToast({
                    text: e._error,
                    type: 'error'
                }));
                return Promise.reject(e);
            }
        )
    }


    render(){
        const {fields: {
            name,
            description,
            short_description,
            kind
            }, error, handleSubmit, submitting} = this.props;

        return (
            <div className="create-int-page">
                <form onSubmit={handleSubmit(this.onSubmit)} className="form cell-2">
                    <h4>Create Institute</h4>
                    <div className="form-group">
                        <Input label="Name" type="text" field={name} />
                    </div>
                    <div className="form-group" >
                        <Select label="Institute type Type" field={kind} options={[
                            {label: 'Institute', value: 'INST'},
                            {label: 'Individual', value: 'TUTOR'}
                        ]} />
                    </div>
                    <div className="form-group">
                        <Textarea  label="Description" field={description} />
                    </div>
                    <div className="form-group">
                        <Textarea label="Short Description" field={short_description} />
                    </div>
                    <div>
                        <button className="btn btn-primary" disabled={submitting} type="submit">Save</button>
                    </div>
                </form>
            </div>
        )
    }
}