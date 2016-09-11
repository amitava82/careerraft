/**
 * Created by amitava on 09/03/16.
 */

import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import map from 'lodash/map';
import Helmet from 'react-helmet';
import {Image} from 'react-bootstrap';

import reduce from 'lodash/reduce';

import {createToast} from '../../../redux/modules/toast';
import {removeSavedItem} from '../../../redux/modules/user';

@connect(state => state)
export default class UserDashboard extends React.Component {

    componentDidMount(){

    }

    removeItem(id){
        this.props.dispatch(removeSavedItem(id));
    }

    render(){
        const {session_store: {user}, user_store} = this.props;

        const selectedList = reduce(user_store.savedItemsIds, (memo, id) => {
            const i = user_store.savedItems[id];
            memo.push(
                <div key={id} className="text-title">
                    <Link to={`/institute/${id}`}>{i.name}</Link>
                    <button onClick={() => this.removeItem(id)} className="btn btn-link btn sm">remove</button>
                </div>
            );
            return memo;
        }, []);

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
                            <h4 className="text-display-1">My saved items</h4>
                            {selectedList}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}