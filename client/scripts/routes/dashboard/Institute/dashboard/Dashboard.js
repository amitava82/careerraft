/**
 * Created by amitava on 11/04/16.
 */
import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import Api from '../../../../helpers/api';
import Loading from '../../../../components/Loading';
const api = new Api();

@connect(state => state)
export default class Dashboard extends React.Component {

    constructor(...args){
        super(...args);

        this.state = {
            provider: null,
            loading: true
        }
    }

    componentDidMount(){
        api.get(`profiles/provider/${this.props.session_store.user.provider}`).then(
            r => this.setState({provider: r, loading: false})
        )
    }
    
    render(){
        const {session_store: {user}, user_store} = this.props;
        const {loading, provider} = this.state;

        if(loading) return <Loading />;
        
        return (
            <div>
                {!provider.branches.length ? (
                    <div>
                        <p className="text-title">No profile created. Create your institute profile now.</p>
                        <Link to="/dashboard/profile/create">Create profile</Link>
                    </div>
                ):(
                    <div>
                        You have 4 new questions. Answer them now.
                    </div>
                )}
            </div>
        )
    }
}