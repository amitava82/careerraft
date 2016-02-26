/**
 * Created by amitava on 18/02/16.
 */
import React from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';


import Loading from '../../../components/Loading';


import {getInstitute, loadInstitutes} from '../../../redux/modules/institute';


@connect(store => store)
export default class EditInstitute extends React.Component{

    constructor(props, ctx){
        super(props, ctx);

        this.state = {}
    }
    componentWillMount(){
        this.props.dispatch(getInstitute(this.props.params.id));
    }



    render(){

        const {institute_store, params} =  this.props;
        const inst = institute_store.entities[params.id];

        if(institute_store.loading || !inst) return <Loading />;
        //
        //if(inst.branches){
        //    this.props.dispatch(loadInstitutes({
        //        _id: {$in: inst.branches}
        //    }));
        //}

        return (
            <div className="grid">
                <div className="cell grid column">
                    <Link to={`/admin/institute/manage/${this.props.params.id}`}>Basic details</Link>
                    <Link to={`/admin/institute/manage/${this.props.params.id}/subjects`}>Assign Subjects</Link>
                    <Link to={`/admin/institute/manage/${this.props.params.id}/branches`}>Branches</Link>
                </div>
                <div className="cell-4">
                    {this.props.children}
                </div>
            </div>
        )
    }
}