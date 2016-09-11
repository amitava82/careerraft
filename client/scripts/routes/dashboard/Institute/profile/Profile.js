/**
 * Created by amitava on 11/04/16.
 */
import React from 'react';
import {connect} from 'react-redux';
import {push} from 'react-router-redux';
import autobind from 'autobind-decorator';
import {Link} from 'react-router';
import Collapse from 'rc-collapse';
import {formatAddress} from '../../../../utils/format-address';
import {getProfile, loadBranch} from '../../../../redux/modules/profile';
import Loading from '../../../../components/Loading';

import ManageGallery from '../../../admin/institute/ManageGallery';


@connect(state => state)
export default class Profile extends React.Component {

    componentDidMount(){
        // this.props.dispatch(getProfile(this.props.params.id)).then(
        //     r => this.props.dispatch(loadBranch(this.props.params.id))
        // );

    }

    componentWillReceiveProps(nextProps){
        // if(nextProps.params.id != this.props.params.id){
        //     this.props.dispatch(getProfile(nextProps.params.id)).then(
        //         r => this.props.dispatch(loadBranch(nextProps.params.id))
        //     );
        // }
    }

    @autobind
    changeBranch(id){
        this.props.dispatch(push(`/dashboard/profile/${id}`))
    }
    
    render(){
        const {session_store: {user}, user_store, institute_store} = this.props;

        const profile = !institute_store.loading && institute_store.entities[this.props.params.id];

        let content = null;

        if(profile){

            const coursesList = profile.courses.map(c => {
                const header = <span>{c.course_id.name} <Link to={`/dashboard/profile/${profile._id}/edit-courses/${c.course_id._id}`}>edit</Link></span>;
                return (
                    <Collapse.Panel header={header}>
                        <p>{c.description}</p>
                        <strong>Subjects taught:</strong>
                        <p>{c.subjects.map(i => i.name).join(', ')}</p>
                    </Collapse.Panel>
                )
            });

            content = (
                <div>
                    <Link to={`/dashboard/profile/${user.org}/create-branch`}>Add a branch</Link>
                    {profile.branches && profile.branches.length ? (
                    <div className="pull-right">
                        <label>Select branch:</label>
                        <select onChange={(e) => this.changeBranch(e.target.value)}>
                            <option selected>Select</option>
                            {profile.branches.map(i => <option value={i._id}>{i.name} - {i.address.locality}</option>)}
                        </select>
                    </div>
                    ) : null }
                    <div className="panel panel-default">
                        <div className="panel-heading">
                            <h3 className="panel-title">Basic Information</h3>
                        </div>
                        <div className="panel-body">
                            <dl>
                                <dt>Name</dt>
                                <dd>{profile.name}</dd>
                                <dt>Short Description</dt>
                                <dd>{profile.short_description}</dd>
                                <dt>Description</dt>
                                <dd>{profile.description}</dd>
                            </dl>
                        </div>
                    </div>
                    <div className="panel panel-default">
                        <div className="panel-heading">
                            <h3 className="panel-title">Address & Contact</h3>
                        </div>
                        <div className="panel-body">
                            <dl>
                                <dt>Address</dt>
                                <dd>{formatAddress(profile.address)}</dd>
                                <dt>Telephones</dt>
                                <dd>{profile.telephones.map(t=> `${t.name}: ${t.number}`)}</dd>
                                <dt>Email</dt>
                                <dd>{profile.email}</dd>
                                <dt>Website</dt>
                                <dd>{profile.website}</dd>
                            </dl>
                        </div>
                    </div>
                    <div className="panel panel-default">
                        <div className="panel-heading">
                            <h3 className="panel-title">Courses Offered</h3>
                        </div>
                        <div className="panel-body">
                            {profile.courses.length === 0 ? (
                                <p>You have not added any courses in the profile. <Link to={`/dashboard/profile/${profile._id}/edit-courses`}>Add Now</Link></p>
                            ) : (
                                <div>
                                    <Collapse accordion={true} defaultActiveKey="0">
                                        {coursesList}
                                    </Collapse>
                                    <Link to={`/dashboard/profile/${profile._id}/edit-courses`}>Add more course</Link>
                                </div>
                            )}
                        </div>
                    </div>
                    <div>
                        <ManageGallery {...this.props} />
                    </div>
                </div>
            )
        }

        return (
            <div>
                {!user.org ? (
                    <div>
                        <p className="text-title">No profile created. Create your institute profile now.</p>
                        <Link to="/dashboard/profile/create">Create profile</Link>
                    </div>
                ):(
                    institute_store.loading ? <Loading /> : content


                )}
            </div>
        )
    }
}
