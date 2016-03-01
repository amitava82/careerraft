/**
 * Created by amitava on 31/01/16.
 */
import React from 'react';
import {connect} from 'react-redux';
import Helmet from 'react-helmet';

import { getInstitute } from '../../redux/modules/institute';

import InstituteDetails from './InstituteDetails';
import Loading from '../../components/Loading';
import Error from '../../components/Error';

//@middleware([
//    {
//        key: '$test',
//        watch: props => props.params.id,
//        handler: (props, id) => props.dispatch(institute.LOAD_INSTITUTE(id))
//    },
//    {
//        key: '$inst',
//        watch: (props) => props.params.id,
//        handler: (props, instId) => props.dispatch(institute.LOAD_INSTITUTE(instId))
//    }
//])
@connect(state => state)
export default class SearchContainer extends React.Component {

    //static needs = [
    //    [getInstitute, 'params.id']
    //];

    static fetchData(props, store){
        const id = props.params.id;
        const state = store.getState();
        if(state.institute_store.loading) return false;
        return store.dispatch(getInstitute(id));
    }

    constructor(props, ctx){
        super(props, ctx);
    }

    componentDidMount(){
        if(this.props.institute_store.entities[this.props.params.id]) return;
        this.props.dispatch(getInstitute(this.props.params.id));
    }

    render (){
        const {institute_store, params} = this.props;

       // debugger;

        const inst = institute_store.entities[params.id];

        if(institute_store.error) return <Error error={institute_store.error} />;

        if(institute_store.loading) return (
            <div className="text-center text-title">
                <Loading />
            </div>
        );

        return (
            <div className="inst-page">
                <Helmet title={`Careerraft - ${inst && inst.name}`} />
                {inst ? <InstituteDetails inst={inst} /> : <p className="text-title text-center">Nothing to display</p>}
                {this.props.children}
            </div>
        )
    }
}