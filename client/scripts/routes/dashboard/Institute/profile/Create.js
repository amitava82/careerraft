/**
 * Created by amitava on 11/04/16.
 */
import React from 'react';
import { reduxForm } from 'redux-form';
import {push} from 'react-router-redux';
import autobind from 'autobind-decorator';
import ReactSelect from 'react-select';
import map from 'lodash/map';
import merge from 'lodash/merge';

import {createToast} from '../../../../redux/modules/toast';
import {createProfile} from '../../../../redux/modules/user';

import Input from '../../../../components/PureInput';
import Select from '../../../../components/Select';
import Textarea from '../../../../components/Textarea';
import STATES from '../../../../utils/states';
import {addressToGeo} from '../../../../utils/google-geo';

@reduxForm({
    form: 'institute_create',
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
        'website',
        'email',
        'type',
        'telephones[].name',
        'telephones[].number'
    ],
    initialValues: {
        address: {
            loc: [0, 0]
        },
        telephones: [{name: 'Office', number: ''}]
    }
}, state => {
    return {
        subject: state.subject_store,
        institute: state.institute_store,
        category: state.category_store,
        course: state.course_store
    }
})
export default class CreateProfile extends React.Component {

    @autobind
    fetchAddress(val){
        let query = '';
        if(typeof val === 'object'){
            query = compact(values({a: val.line1, b: val.line2, c: val.locality, d: val.city})).join(', ');
        }else{
            query = val;
        }

        if(!query) return;

        addressToGeo(query, (err, data) =>{
            if(!err){
                this.props.initializeForm(merge({}, this.props.values, {
                    address: {
                        city: data.city,
                        state: data.state,
                        loc: data.geo
                    }
                }));
            }
        })
    }

    @autobind
    onSubmit(data){
        return this.props.dispatch(createProfile(data)).then(
            d => {
                this.props.dispatch(createToast('Institute created.'));
                this.props.dispatch(push('/dashboard/profile'));
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
            address,
            website,
            email,
            type,
            telephones
        }, error, handleSubmit, submitting} = this.props;

        return (
            <div>
                <form onSubmit={handleSubmit(this.onSubmit)} className="form cell-2">
                    <h4>Create Institute</h4>
                    <div className="form-group">
                        <Input label="Name" type="text" field={name} />
                    </div>
                    <div className="form-group" >
                        <Select label="Institute type Type" field={type} options={[
                            {label: 'Institute', value: 'institute'},
                            {label: 'Individual', value: 'individual'}
                        ]} />
                    </div>
                    <div className="form-group">
                        <Textarea  label="Description" field={description} />
                    </div>
                    <div className="form-group">
                        <Textarea label="Short Description" field={short_description} />
                    </div>
                    <div className="form-group">
                        <label>Address</label>
                        <Input type="text" field={address.pincode} onBlur={(e) => this.fetchAddress(e.target.value)} placeholder="Pin Code" />
                        <Input type="text" field={address.line1} placeholder="Address line 1" />
                        <Input type="text" field={address.line2} placeholder="Address line 2" />
                        <Input type="text" field={address.locality} placeholder="Locality" />
                        <Input type="text" field={address.city} placeholder="City" />
                        <Select field={address.state} options={map(STATES, (v,k) => ({label: v, value: k}))} />
                    </div>
                    <div className="form-group">
                        <Input type="text" field={website} label="Website address" />
                    </div>
                    <div className="form-group">
                        <Input type="email" field={email} label="Email address" />
                    </div>
                    <div className="form-group">
                        <label>Telephones</label>
                        {telephones.map(p => {
                            return (
                                <div>
                                    <Input type="text" field={p.name} />
                                    <Input type="text" field={p.number} />
                                </div>
                            )
                        })}
                        <a onClick={e => {
                            telephones.addField()
                        }}>Add more</a>
                    </div>
                    <div>
                        <button className="btn btn-primary" disabled={submitting} type="submit">Save</button>
                    </div>
                </form>
            </div>
        )
    }
}