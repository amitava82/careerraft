/**
 * Created by amitava on 09/03/16.
 */

import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import map from 'lodash/map';
import Helmet from 'react-helmet';
import {Image} from 'react-bootstrap';

import {createToast} from '../../redux/modules/toast';

@connect(state => state)
//@middleware([
//    {
//        key: '$categories',
//        watch: props => props.params.id,
//        handler: (props, id) => props.dispatch(categoryActions.loadCategories())
//    },
//    {
//        key: '$institutes',
//        watch: (props) => props.params.id,
//        handler: (props, instId) => props.dispatch(instActions.loadInstitutes())
//    }
//])
export default class HomeContainer extends React.Component {

    componentDidMount(){

    }

    render(){
        const {session_store: {user}} = this.props;
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
                        </div>
                        <div className="col-md-9">

                        </div>
                    </div>
                </div>
            </div>
        )
    }
}