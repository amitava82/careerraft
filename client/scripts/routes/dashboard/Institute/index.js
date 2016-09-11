/**
 * Created by amitava on 11/04/16.
 */

import React from 'react';
import {connect} from 'react-redux';
import {Link, IndexLink} from 'react-router';
import map from 'lodash/map';
import Helmet from 'react-helmet';
import {Image} from 'react-bootstrap';

import reduce from 'lodash/reduce';

import {createToast} from '../../../redux/modules/toast';
import {removeSavedItem} from '../../../redux/modules/user';

@connect(state => state)

export default class InstituteDashboard extends React.Component {

    componentDidMount(){

    }

    render(){
        const {session_store: {user}, user_store} = this.props;

        return (
            <div className="dashboard-page">
                <Helmet title="Dashboard - Careerraft" />
                <div className="container content-body">
                    <div className="row">
                        <div className="col-md-3">
                            <div className="text-center">
                                <Image src={user.photo} circle />
                                <p className="text-title">{user.name}</p>
                            </div>
                            <div>
                                <ul className="list-group">
                                    <IndexLink to="/dashboard" className="list-group-item" activeClassName="active">Dashboard</IndexLink>
                                    <Link to={`/dashboard/profile/${user.org}`} className="list-group-item" activeClassName="active">Profile</Link>
                                    <Link to="/dashboard/account" className="list-group-item" activeClassName="active">Account</Link>
                                </ul>
                            </div>
                        </div>
                        <div className="col-md-9">
                            {this.props.children}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}