/**
 * Created by amitava on 18/02/16.
 */
import React from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';


import Loading from '../../../components/Loading';

import {loadProvider} from '../../../redux/modules/provider';

import {formatAddress} from '../../../utils/format-address';


@connect(store => store)
export default class EditProvider extends React.Component{

    constructor(props, ctx){
        super(props, ctx);

        this.state = {}
    }
    componentWillMount(){
        this.props.dispatch(loadProvider(this.props.params.id));
    }

    componentWillReceiveProps(nextProps){
        if(this.props.params.id != nextProps.params.id){
            this.props.dispatch(loadProvider(nextProps.params.id));
        }
    }

    render(){

        const {provider_store, params: {id, branch}} =  this.props;
        const inst = provider_store.providers[id];

        if(!inst) return <Loading />;
        //
        //if(inst.branches){
        //    this.props.dispatch(loadProfiles({
        //        _id: {$in: inst.branches}
        //    }));
        //}

        return (
            <div className="row">
                <div className="col-md-3">
                    <div>
                        <Link to={`/admin/provider/manage/${id}`}>Details</Link>
                    </div>
                    <div>
                        <Link to={`/admin/provider/manage/${id}/branches`}>Branches</Link>
                    </div>
                    <div>
                        <Link to={`/admin/provider/manage/${id}/gallery`}>Image Gallery</Link>
                    </div>
                </div>
                <div className="col-md-9">
                    <div>
                        <p className="text-title">{inst.name} - {inst.kind}</p>
                    </div>
                    <hr />
                    {this.props.children}
                </div>
            </div>
        )
    }
}