/**
 * Created by amitava on 11/02/16.
 */
import React from 'react';
import { reduxForm } from 'redux-form';
import {connect} from 'react-redux';
import autobind from 'autobind-decorator';

import { institute, category, course, subject } from '../../actions';


@reduxForm({
    form: 'institute',
    fields: [
        'name',
        'description',
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
        institute.CREATE_INSTITUTE(data).then(
            (d) => {
                console.log(d);
                this.props.resetForm();
            }
        )
    }

    render(){
        const {fields: {
            name,
            description,
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
            <div className="grid row">
                <form onSubmit={handleSubmit(this.onSubmit)} className="form cell-2">
                    <h4>Create Institute</h4>
                    <div>
                        <label>Name</label>
                        <input type="text" {...name}/>
                        {name.error && <div>{name.error}</div>}
                    </div>
                    <div>
                        <label>Institute type Type</label>
                        <select {...type}>
                            <option value="">Select</option>
                            <option value="organization">Institute</option>
                            <option value="individual">Individual</option>
                        </select>
                    </div>
                    <div>
                        <label>Description</label>
                        <input type="text" {...description}/>
                    </div>
                    <div>
                        <label>Address</label>
                        <input type="text" {...address.line1} placeholder="Address line 1"/>
                        <input type="text" {...address.line2} placeholder="Address line 2"/>
                        <input type="text" {...address.locality} placeholder="Locality"/>
                        <input type="text" {...address.city} placeholder="City"/>
                        <input type="text" {...address.state} placeholder="State"/>
                        <input type="text" {...address.pincode} placeholder="Pin Code"/>
                    </div>
                    <div>
                        <label>Location [Longitude, Latitude]</label>
                        <input type="text" {...address.loc[0]} />
                        <input type="text" {...address.loc[1]} />
                    </div>
                    <div>
                        <label>Logo</label>
                        <input type="text" {...logo} />
                    </div>
                    <div>
                        <label>Banner</label>
                        <input type="text" {...banner} />
                    </div>
                    <div>
                        <label>Website</label>
                        <input type="text" {...website} />
                    </div>
                    <div>
                        <label>email</label>
                        <input type="text" {...email} />
                    </div>
                    <div>
                        <label>Telephones</label>
                        {telephones.map(p => {
                            return (
                                <div>
                                    <input type="text" {...p.name} />
                                    <input type="text" {...p.number} />
                                </div>
                            )
                        })}
                        <a onClick={e => {

                        }}>Add more</a>
                    </div>
                    <div>
                        <label>Established in</label>
                        <input type="text" {...estd} />
                    </div>
                    <div>
                        <label>Student count</label>
                        <input type="text" {...student_count} />
                    </div>
                    <div>
                        <label>Faculty count</label>
                        <input type="text" {...faculty_count} />
                    </div>

                    <div>
                        <button disabled={submitting} type="submit">Save</button>
                    </div>
                </form>
            </div>
        )
    }
}