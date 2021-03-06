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

import AssignSubject from './AssignSubject';

import {getInstitute, update} from '../../../redux/modules/institute';
import {createToast} from '../../../redux/modules/toast';


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
        return this.props.dispatch(update(this.props.params.id, data))
            .tap(this.props.dispatch(createToast('Saved.')));
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
                        <Input type="text" field={fields.address.pincode} onBlur={(e) => this.fetchAddress(e.target.value)} placeholder="Pin Code" />
                        <Input type="text" field={fields.address.line1} placeholder="Line 1"/>
                        <Input type="text" field={fields.address.line2} placeholder="Line 2"/>
                        <Input type="text" field={fields.address.locality} placeholder="Locality"/>
                        <Input type="text" field={fields.address.city} placeholder="City" />
                        <Select field={fields.address.state} options={map(STATES, (v,k) => ({label: v, value: k}))} />
                        <Input type="text" field={fields.address.loc[0]} placeholder="Longitude"/>
                        <Input type="text" field={fields.address.loc[1]} placeholder="Latitude"/>

                        <div className="form-group">
                            <label>Telephones</label>
                            {fields.telephones.map(p => {
                                return (
                                    <div>
                                        <Input type="text" field={p.name} />
                                        <Input type="text" field={p.number} />
                                    </div>
                                )
                            })}
                            <a onClick={e => {
                            fields.telephones.addField()
                        }}>Add more</a>
                        </div>

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