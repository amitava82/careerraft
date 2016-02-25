/**
 * Created by amitava on 11/02/16.
 */
import React from 'react';
import { reduxForm } from 'redux-form';
import {connect} from 'react-redux';
import {routeActions} from 'react-router-redux';
import autobind from 'autobind-decorator';
import map from '../../../../../node_modules/lodash/map';

import {createInstitute} from '../../../redux/modules/institute';
import {loadCourses} from '../../../redux/modules/course';
import {loadCategories} from '../../../redux/modules/category';
import {getSubjects} from '../../../redux/modules/subject';
import {createToast} from '../../../redux/modules/toast';

import Input from '../../../components/PureInput';
import Select from '../../../components/Select';
import Textarea from '../../../components/Textarea';
import STATES from '../../../utils/states';

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
export default class CreateInstitute extends React.Component{

    static displayName = 'CreateInstituteFrom';

    @autobind
    onSubmit(data){
        return this.props.dispatch(createInstitute(data)).then(
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
            address,
            logo,
            banner,
            website,
            email,
            type,
            telephones,
            estd,
            student_count,
            faculty_count
            }, error, handleSubmit, submitting} = this.props;

        return (
            <div className="grid row create-int-page">
                <form onSubmit={handleSubmit(this.onSubmit)} className="form cell-2">
                    <h4>Create Institute</h4>
                    <div>
                        <Input label="Name" type="text" field={name} />
                    </div>
                    <div>
                        <Select label="Institute type Type" field={type} options={[
                            {label: 'Institute', value: 'institute'},
                            {label: 'Individual', value: 'individual'}
                        ]} />
                    </div>
                    <div>
                        <Textarea label="Description" field={description} />
                    </div>
                    <div>
                        <Textarea label="Short Description" field={short_description} />
                    </div>
                    <div>
                        <label>Address</label>
                        <Input type="text" field={address.line1} placeholder="Address line 1" />
                        <Input type="text" field={address.line2} placeholder="Address line 2" />
                        <Input type="text" field={address.locality} placeholder="Locality" />
                        <Input type="text" field={address.city} placeholder="City" />
                        <Select field={address.state} options={map(STATES, (v,k) => ({label: v, value: k}))} />

                        <Input type="text" field={address.pincode} placeholder="Pin Code" />
                    </div>
                    <div>
                        <label>Location [Longitude, Latitude]</label>
                        <input type="text" {...address.loc[0]} placeholder="Longitude"/>
                        <input type="text" {...address.loc[1]} placeholder="Latitude"/>
                    </div>
                    <div>
                        <Input type="text" field={logo} label="Logo URL" />
                    </div>
                    <div>
                        <Input type="text" field={banner} label="Banner URL" />
                    </div>
                    <div>
                        <Input type="text" field={website} label="Website address" />
                    </div>
                    <div>
                        <Input type="email" field={email} label="Email address" />
                    </div>
                    <div>
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
                        <Input type="text" field={estd} label="Established in" />
                    </div>
                    <div>
                        <Input type="text" field={student_count} label="Student count" />
                    </div>
                    <div>
                        <Input type="text" field={faculty_count} label="Faculty count" />
                    </div>

                    <div>
                        <button disabled={submitting} type="submit">Save</button>
                    </div>
                </form>
            </div>
        )
    }
}