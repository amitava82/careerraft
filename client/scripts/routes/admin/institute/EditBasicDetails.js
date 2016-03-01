/**
 * Created by amitava on 18/02/16.
 */
import React from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import {reduxForm, initialize} from 'redux-form';
import autobind from 'autobind-decorator';
import map from '../../../../../node_modules/lodash/map';

import STATES from '../../../utils/states';

import Input from '../../../components/PureInput';
import Select from '../../../components/Select';
import Textarea from '../../../components/Textarea';
import Loading from '../../../components/Loading';

import AssignSubject from './AssignSubject';

import {getInstitute, update} from '../../../redux/modules/institute';


@reduxForm({
    form: 'inst_edit',
    fields: [
        'name',
        'description',
        'short_description',
        'address.line1',
        'address.line2',
        'address.locality',
        'address.city',
        'address.state',
        'address.pincode',
        'address.loc[]',
        'logo',
        'banner',
        'website',
        'email',
        'type',
        'telephones[].name',
        'telephones[].number',
        'estd',
        'student_count',
        'faculty_count'
    ],
    initialValues: {
        address: {
            loc: [0, 0]
        }
    }
}, state => (
{institute_store: state.institute_store}
))
export default class EditInstitute extends React.Component{

    constructor(props, ctx){
        super(props, ctx);

        this.state = {}
    }

    componentDidMount(){
        const inst = this.props.institute_store.entities[this.props.params.id];
        this.props.initializeForm(inst);
    }

    @autobind
    onSubmit(data){
        this.props.dispatch(update(this.props.params.id, data));
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
                        <label>Address</label>
                        <Input type="text" field={fields.address.line1} placeholder="Line 1"/>
                        <Input type="text" field={fields.address.line2} placeholder="Line 2"/>
                        <Input type="text" field={fields.address.locality} placeholder="Locality"/>
                        <Input type="text" field={fields.address.city} placeholder="City" />
                        <Select field={fields.address.state} options={map(STATES, (v,k) => ({label: v, value: k}))} />

                        <Input type="text" field={fields.address.pincode} placeholder="Pin Code" />
                        <Input type="text" field={fields.address.loc[0]} placeholder="Longitude"/>
                        <Input type="text" field={fields.address.loc[1]} placeholder="Latitude"/>

                        <Input type="text" field={fields.website} label="Website"/>
                        <Input type="text" field={fields.email} label="Email"/>

                    </div>
                    <div className="form-group">
                        <button className="btn btn-primary" type="submit">Save</button>
                    </div>
                </form>
            </div>
        )
    }
}