/**
 * Created by amitava on 18/02/16.
 */
import React from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import {reduxForm, initialize} from 'redux-form';
import autobind from 'autobind-decorator';
import map from 'lodash/map';
import merge from 'lodash/merge';
import values from 'lodash/values';
import compact from 'lodash/compact';

import STATES from '../../../utils/states';
import {addressToGeo} from '../../../utils/google-geo';

import Input from '../../../components/PureInput';
import Select from '../../../components/Select';
import Textarea from '../../../components/Textarea';
import Loading from '../../../components/Loading';

import AssignSubject from './AssignCourses';

import {loadProvider, updateProvider} from '../../../redux/modules/provider';
import {createToast} from '../../../redux/modules/toast';


@reduxForm({
    form: 'edit_provider',
    fields: ['name', 'description', 'short_description']
}, state=>state)
export default class ProviderProfile extends React.Component{

    constructor(props, ctx){
        super(props, ctx);

        this.state = {}
    }

    componentDidMount(){
        const inst = this.props.provider_store.providers[this.props.params.id];
        this.props.initializeForm(inst);
    }

    @autobind
    onSubmit(data){
        return this.props.dispatch(updateProvider(this.props.params.id, data))
            .tap(this.props.dispatch(createToast('Saved.')));
    }

    render(){

        const {handleSubmit, fields} =  this.props;

        return (
            <div>
                <form onSubmit={handleSubmit(this.onSubmit)}>
                    <div className="control-group">
                        <Input type="text" field={fields.name} label="Name"/>
                        <Textarea field={fields.short_description} label="Short description" />
                        <Textarea field={fields.description} label="Description" />
                    </div>
                    <div className="form-group">
                        <button className="btn btn-primary" type="submit">Save</button>
                    </div>
                </form>
            </div>
        )
    }
}