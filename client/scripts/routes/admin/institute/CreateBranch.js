/**
 * Created by amitava on 21/03/16.
 */
import React from 'react';
import {Link} from 'react-router';
import {goBack} from 'react-router-redux';
import GeoSuggest from 'react-geosuggest';
import {connect} from 'react-redux';
import {reduxForm, initialize} from 'redux-form';
import autobind from 'autobind-decorator';

import map from 'lodash/map';
import merge from 'lodash/merge';
import values from 'lodash/values';
import compact from 'lodash/compact';

import Input from '../../../components/PureInput';
import Select from '../../../components/Select';
import Textarea from '../../../components/Textarea';
import STATES from '../../../utils/states';
import {addressToGeo} from '../../../utils/google-geo';
import {createValidator, required} from '../../../utils/validator';

import {createProfile} from '../../../redux/modules/profile';
import { createToast } from '../../../redux/modules/toast';

const formValidator = createValidator({
    'address.line1': required,
    'address.locality': required,
    'address.city': required,
    'address.state': required,
    'address.pincode': required,
    'email': required
});


const GEO_OPTIONS = {
    inputClassName: 'form-control',
    placeholder: 'Select a locality',
    country: 'in',
    types: ['(regions)'],
    skipSuggest: i => i.types && i.types.indexOf('sublocality_level_1') === -1,
    className: 'geosuggest-locality form-group',
    getSuggestLabel: s => s.terms[0].value
};


@reduxForm({
    form: 'add_branch',
    fields: [
        'address.line1',
        'address.line2',
        'address.locality',
        'address.city',
        'address.state',
        'address.pincode',
        'address.loc[]',
        'email',
        'website',
        'telephones[].name',
        'telephones[].number'
    ],
    initialValues: {
        telephones: [{name: 'Office', number: ''}]
    },
    //validate: formValidator
}, state => {
    return {
        subject: state.subject_store,
        profile: state.profile_store,
        category: state.category_store,
        course: state.course_store
    }
})
export default class CreateBranch extends React.Component{

    @autobind
    submit(data){
        const dispatch = this.props.dispatch;
        console.log(data);
        data.provider = this.props.params.id;
        return dispatch(createProfile(data)).then(
            r => {
                dispatch(createToast('Branch created.'));
                dispatch(goBack());
            },
            e => Promise.reject(e)
        )
    }

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
        });
    }

    @autobind
    localitySelect(val){
        const loc = [val.location.lng, val.location.lat];
        this.props.fields.address.locality.onChange(val.label);
        this.props.fields.address.loc.forEach((i,idx) => i.onChange(loc[idx]));
    }

    render(){
        const {fields: {address, email, website, telephones}, handleSubmit, submitting} = this.props;

        return (
            <div>
                <p className="text-subtitle">Create Branch</p>
                <form onSubmit={handleSubmit(this.submit)}>
                    <div className="form-group">
                        <label>Address</label>
                        <Input type="text" field={address.pincode} onBlur={(e) => this.fetchAddress(e.target.value)} placeholder="Pin Code" />
                        <Input type="text" field={address.line1} placeholder="Address line 1" />
                        <Input type="text" field={address.line2} placeholder="Address line 2" />
                        <GeoSuggest {...GEO_OPTIONS} onSuggestSelect={this.localitySelect} />
                        <Input type="text" field={address.city} placeholder="City" />
                        <Select field={address.state} options={map(STATES, (v,k) => ({label: v, value: k}))} />
                    </div>
                    <div className="form-group">
                        <label>Location [Longitude, Latitude]</label>
                        <input className="form-control" type="text" {...address.loc[0]} placeholder="Longitude"/>
                        <input className="form-control" type="text" {...address.loc[1]} placeholder="Latitude"/>
                    </div>
                    <div className="form-group">
                        <Input type="email" field={email} label="Email address" />
                    </div>
                    <div className="form-group">
                        <Input type="text" field={website} label="Website address" />
                    </div>
                    <div className="form-group">
                        <label>Telephones</label>
                        {telephones.map(p => {
                            return (
                                <div>
                                    <Input type="text" field={p.name} placeholder="Name" />
                                    <Input type="text" field={p.number} placeholder="Number" />
                                </div>
                            )
                        })}
                        <button className="btn btn-link" onClick={e => {
                                telephones.addField()
                            }}>Add more</button>
                    </div>
                    <button className="btn btn-primary" disabled={submitting} type="submit">Save</button>
                </form>
            </div>
        )
    }
}