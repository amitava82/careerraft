/**
 * Created by amitava on 03/05/16.
 */
import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import {push} from 'react-router-redux';
import autobind from 'autobind-decorator';
import get from 'lodash/get';
import Collapse from 'rc-collapse';

import {loadProvider, updateProvider} from '../../redux/modules/provider';
import {getProfile, deleteCourse} from '../../redux/modules/profile';

import Api from '../../helpers/api';
import Loading from '../../components/Loading';
import {formatAddress} from '../../utils/format-address';
import EditProvider from './components/EditProvider';

const api = new Api();


@connect(state => state)
export default class Dashboard extends React.Component {


    constructor(...args){
        super(...args);

        this.state = {
            editing: false
        }
    }

    componentDidMount(){
        this.loadProfile(this.props.params.id);
    }

    componentWillReceiveProps(nextProps){
        if(this.props.params.id != nextProps.params.id){
            this.loadProfile(nextProps.params.id);
        }
    }

    @autobind
    changeBranch(e){
        // this.setState({selected: e.target.value});
        // this.loadProfile(e.target.value);
        this.props.dispatch(push(`/provider/profile/${e.target.value}`))
    }

    loadProfile(id){
        //this.setState({loading: true});
        this.props.dispatch(getProfile(id));
        // api.get(`profiles/${id}`).then(
        //     r => this.setState({profileDetails: r, loading: false})
        // )
    }

    @autobind
    toggleEditing(){
        this.setState({editing: !this.state.editing});
    }

    @autobind
    updateProvider(data){
        this.props.dispatch(updateProvider(this.props.session_store.user.provider, data));
        
    }

    @autobind
    deleteCourse(id){
        this.props.dispatch(deleteCourse(this.props.params.id, id));
    }

    render(){
        const {provider_store, profile_store: {loading, entities}, params} = this.props;
        const providerId = this.props.session_store.user.provider;
        const provider = provider_store.providers[providerId];

        const profileId = params.id;
        const profile = entities[profileId];

        if(loading || !profile) return <Loading />;

        const branches = provider.branches;
        const profileDetails = entities[profileId];

        const options = branches.map(i => <option value={i._id}>{i.address.locality}</option>);


        let profileContent = null;

        if(profileDetails){
            const coursesList = profileDetails.courses.map(c => {
                const header = (
                                <span>
                                    {c.course.name}
                                    <Link to={`/provider/profile/${profile._id}/courses/${c.course._id}`}>edit</Link>
                                </span>);
                return (
                    <Collapse.Panel header={header}>
                        <p>{c.description}</p>
                        <strong>Subjects taught:</strong>
                        <p>{c.subjects.map(i => i.name).join(', ')}</p>
                        <button onClick={()=>this.deleteCourse(c.course._id)} className="btn btn-link">Delete this course</button>
                    </Collapse.Panel>
                )
            });


            profileContent = profileDetails && (

                    <div>
                        <div className="panel panel-default">
                            <div className="panel-heading clearfix">
                                <div className="col-xs-6">
                                    <h3 className="panel-title">Address & Contact</h3>
                                </div>
                                <div className="col-xs-6">
                                    <Link to={`/provider/profile/${profileId}/edit`} className="pull-right">Edit</Link>
                                </div>
                            </div>
                            <div className="panel-body">
                                <dl>
                                    <dt>Address</dt>
                                    <dd>{formatAddress(profileDetails.address)}</dd>
                                    <dt>Telephones</dt>
                                    <dd>{profileDetails.telephones.map(t=> `${t.name}: ${t.number}`)}</dd>
                                    <dt>Email</dt>
                                    <dd>{profileDetails.email}</dd>
                                    <dt>Website</dt>
                                    <dd>{profileDetails.website}</dd>
                                </dl>
                            </div>
                        </div>
                        <div className="panel panel-default">
                            <div className="panel-heading">
                                <h3 className="panel-title">Courses Offered</h3>
                            </div>
                            <div className="panel-body">
                                {profileDetails.courses.length === 0 ? (
                                    <p>You have not added any courses in the profile. <Link to={`/provider/profile/${profileDetails._id}/courses`}>Add Now</Link></p>
                                ) : (
                                    <div>
                                        <Collapse accordion={true} defaultActiveKey="0">
                                            {coursesList}
                                        </Collapse>
                                        <Link to={`/provider/profile/${profileDetails._id}/courses`}>Add more course</Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
        }

        return(
            <div>
                <div className="panel panel-default">
                    <div className="panel-heading clearfix">
                        <div className="col-xs-6"><h3 className="panel-title">Basic Information</h3></div>
                        <div className="col-xs-6">
                            <button className="btn btn-xs btn-link pull-right" onClick={this.toggleEditing}>Edit</button>
                        </div>
                    </div>
                    <div className="panel-body">
                        {this.state.editing ? <EditProvider initialValues={provider} kind={provider.kind} onSubmit={this.updateProvider} onCancel={this.toggleEditing} /> : (
                            <dl>
                                <dt>Name</dt>
                                <dd>{provider.name}</dd>
                                <dt>Short Description</dt>
                                <dd>{provider.short_description}</dd>
                                <dt>Description</dt>
                                <dd>{provider.description}</dd>
                            </dl>
                        )}
                    </div>
                </div>
                <div className="panel panel-default">
                    <div className="panel-heading clearfix">
                        <div className="col-xs-6">
                            {
                                branches.length > 1 ? (
                                    <div className="form-inline">
                                        <label className="m-rm">Select branch: </label>
                                        <select className="form-control" onChange={this.changeBranch} value={profileId}>{options}</select>
                                    </div>
                                ) : null
                            }
                        </div>
                        <div className="col-xs-6">
                            <Link className="pull-right" to="/provider/profile/create">Add a branch</Link>
                        </div>
                    </div>
                    <div className="panel-body">
                        {profileContent}
                    </div>
                </div>
            </div>
        )
    }
}