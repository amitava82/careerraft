/**
 * Created by amitava on 26/02/16.
 */
import React from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import autobind from 'autobind-decorator';
import reduce from '../../../../../node_modules/lodash/reduce';
import find from 'lodash/find';

import Checkbox from '../../../components/Checkbox';

import {loadBranch} from '../../../redux/modules/institute';
import formatAddress from '../../../utils/format-address';

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
        this.props.dispatch(loadBranch(this.props.params.id));
        //const inst = this.props.institute_store.entities[this.props.params.id];
        //this.props.initializeForm({institutes: inst.branches.map(i => i._id)});
    }

    render(){
        const {institute_store, params} = this.props;

        const inst = institute_store.entities[params.id];

        if(inst.parent_id){
            return (
                <div>
                    This is a branch institute.
                </div>
            )
        }

        const branches = inst.branches || [];

        const existingBranches = branches.map(i => {
            const _edit =  <Link to={`/admin/institute/manage/${i._id}`}>Edit</Link>;
            const label = i.name + ' ' + formatAddress(i.address);
            const linkLabel = <span>{label} {_edit}</span>;
            return(
                <p key={i._id}>{linkLabel}</p>
            )
        });

        return (
            <div>
                <div className="m-bl">
                    {existingBranches.length ? <p>Current branches</p> : null}
                    {existingBranches}
                </div>
                <Link to={`/admin/institute/manage/${inst._id}/create-branch`}>Create Branch</Link>
            </div>
        )
    }
}