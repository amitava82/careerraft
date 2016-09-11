/**
 * Created by amitava on 09/03/16.
 */
import React from 'react';
import {connect} from 'react-redux';

import InstituteDashboard from './institute';
import UserDashboard from './user';

@connect(state => state)
export default class Dashboard extends React.Component {

    componentDidMount(){

    }

    render(){
        return <UserDashboard {...this.props} />
    }
}