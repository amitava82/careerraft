/**
 * Created by amitava on 11/04/16.
 */
import React from 'react';
import { reduxForm } from 'redux-form';
import {push, goBack} from 'react-router-redux';
import autobind from 'autobind-decorator';
import ReactSelect from 'react-select';
import GeoSuggest from 'react-geosuggest';
import map from 'lodash/map';
import merge from 'lodash/merge';
import get from 'lodash/get';
import Api from '../../helpers/api';

import {createToast} from '../../redux/modules/toast';
import {createProfile, update as updateInstitute} from '../../redux/modules/profile';
import {loadProvider} from '../../redux/modules/provider';

import Input from '../../components/PureInput';
import Select from '../../components/Select';
import Textarea from '../../components/Textarea';
import STATES from '../../utils/states';
import {parseAddress, formatAddress} from '../../utils/format-address';
import {addressToGeo} from '../../utils/google-geo';

const GEO_OPTIONS = {
    inputClassName: 'form-control',
    placeholder: 'Select a locality',
    country: 'in',
    types: ['(regions)'],
    skipSuggest: i => i.types && i.types.indexOf('sublocality_level_1') === -1,
    className: 'geosuggest-locality',
    getSuggestLabel: s => s.terms[0].value
};


@reduxForm({
    form: 'branch_create',
    fields: [
        'address.line1',
        'address.line2',
        'address.locality',
        'address.city',
        'address.state',
        'address.pincode',
        'address.loc[]',
        'website',
        'email',
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
        profile_store: state.profile_store,
        category: state.category_store,
        course: state.course_store,
        session: state.session_store
    }
})
export default class Branch extends React.Component {


    componentDidMount(){
        const id = this.props.params.id;
        if(id){
            const profile = this.props.profile_store.entities[id];
            this.props.initializeForm(profile);
        }
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
        })
    }

    @autobind
    onSubmit(data){
        data.provider = this.props.session.user.provider;

        const id  = this.props.params.id;
        let action = null

        if(id){
            action = updateInstitute(id, data);
        }else{
            action = createProfile(data);
        }

        return this.props.dispatch(action).then(
            d => {
                this.props.dispatch(goBack());
                this.props.dispatch(loadProvider(data.provider));
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

    @autobind
    cancel(){
        this.props.dispatch(goBack());
    }

    @autobind
    localitySelect(val){
        const loc = [val.location.lng, val.location.lat];
        this.props.fields.address.locality.onChange(val.label);
        this.props.fields.address.loc.forEach((i,idx) => i.onChange(loc[idx]));
    }

    render(){
        const {fields: {
            address,
            website,
            email,
            telephones
        }, error, handleSubmit, submitting} = this.props;

        return (
            <div>
                <form onSubmit={handleSubmit(this.onSubmit)} className="form cell-2">
                    <h5>Please provide address & contact information</h5>
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
                        }}>Add another phone number</a>
                    </div>
                    <div>
                        <button className="btn btn-primary" disabled={submitting} type="submit">Save</button>
                        <button className="btn btn-default" type="button" onClick={this.cancel}>Cancel</button>
                    </div>
                </form>
            </div>
        )
    }
}