/**
 * Created by amitava on 26/02/16.
 */
import React from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';

import {loadProfiles} from '../../../redux/modules/profile';
import {formatAddress} from '../../../utils/format-address';

import Api from '../../../helpers/api';

const api = new Api();

@connect(state => state)
export default class ManageBranches extends React.Component{

    constructor(props, ctx){
        super(props, ctx);

        this.state = {
            institutes: []
        }
    }

    componentDidMount(){
        this.props.dispatch(loadProfiles({provider: this.props.params.id}));
    }

    render(){
        const {profile_store, params} = this.props;



        const existingBranches = profile_store.ids.reduce((memo, i) => {
            const p = profile_store.entities[i];
            if(p.provider == params.id){
                const _edit =  <Link to={`/admin/provider/manage/${params.id}/${i}`}>Edit</Link>;
                const label = formatAddress(p.address);
                const linkLabel = <span>{label} {_edit}</span>;
                memo.push(
                    <p key={i._id}>{linkLabel}</p>
                )
            }
            return memo;

        }, []);

        return (
            <div>
                <div className="m-bl">
                    {existingBranches.length === 0 ? <p>No branches</p> : null}
                    {existingBranches}
                </div>
                <Link to={`/admin/provider/manage/${params.id}/create-branch`}>Create Branch</Link>
            </div>
        )
    }
}