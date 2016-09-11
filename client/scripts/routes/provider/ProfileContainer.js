/**
 * Created by amitava on 04/05/16.
 */
import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import {push} from 'react-router-redux';

import Loading from '../../components/Loading';

@connect(state=>state)
export default class ProfileContainer extends React.Component{
    
    componentDidMount(){
        const {provider_store, session_store, dispatch}= this.props;
        const provider = session_store.user.provider;
        const branches = provider_store.providers[provider].branches;
        if(branches.length){
            dispatch(push(`/provider/profile/${branches[0]._id}`));
        }
    }
    
    render(){
        const {provider_store, session_store}= this.props;
        const providerId = session_store.user.provider;
        const provider = provider_store.providers[providerId] || {};

        if(provider_store.loading) return <Loading />;

        let branchContent = null;
        if(provider.branches.length === 0){
            branchContent = (
                <div className="text-center">
                    <p className="text-title">You have not created any institute profile yet.</p>
                    <Link className="btn btn-md btn-primary" to="/provider/profile/create">Create Now</Link>
                </div>
            )
        }

        return (
            <div>
                {branchContent}
                {this.props.children}
            </div>
        )

    }
}