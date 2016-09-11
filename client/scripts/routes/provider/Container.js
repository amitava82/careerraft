/**
 * Created by amitava on 11/04/16.
 */
import React from 'react';
import {connect} from 'react-redux';
import Helmet from 'react-helmet';
import {Image} from 'react-bootstrap';
import {Link, IndexLink} from 'react-router';
import Api from '../../helpers/api';
import Loading from '../../components/Loading';
const api = new Api();

import {loadProvider} from '../../redux/modules/provider';

@connect(state => state)
export default class Dashboard extends React.Component {

    constructor(...args){
        super(...args);

        this.state = {
            provider: null,
            loading: true
        }
    }

    static childContextTypes = {
        provider: React.PropTypes.object
    };

    getChildContext(){
        return {
            provider: this.state.provider
        }
    }

    componentWillMount(){
        this.props.dispatch(loadProvider(this.props.session_store.user.provider));
    }

    render(){
        const {session_store: {user}, provider_store} = this.props;
        const {loading} = provider_store;

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
                                    <IndexLink to="/provider/dashboard" className="list-group-item" activeClassName="active">Dashboard</IndexLink>
                                    <Link to="/provider/profile" className="list-group-item" activeClassName="active">Profile</Link>
                                    <Link to="/provider/account" className="list-group-item" activeClassName="active">Account</Link>
                                </ul>
                            </div>
                        </div>
                        <div className="col-md-9">
                            {loading ? <Loading /> : this.props.children}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}