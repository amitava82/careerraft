/**
 * Created by amitava on 31/01/16.
 */
import React from 'react';
import {connect} from 'react-redux';
import autobind from 'autobind-decorator';
import Helmet from 'react-helmet';
import find from 'lodash/find';
import noop from 'lodash/noop';

import { getProfile, loadBranch } from '../../redux/modules/profile';
import {loadGallery} from '../../redux/modules/gallery';
import {createToast} from '../../redux/modules/toast';

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
    //    [getProfile, 'params.id']
    //];

    static fetchData(props, store){
        const id = props.params.id;
        const state = store.getState();
        if(state.search_store.loading) return false;
        return store.dispatch(getProfile(id));
    }

    constructor(props, ctx){
        super(props, ctx);
        this.state = {
            images: []
        }
    }

    componentWillReceiveProps(nextProps){
        const id = nextProps.params.id;
        if(this.props.params.id !== id){
            this.loadInstituteData(nextProps);
        }
    }

    componentDidMount(){
        this.loadInstituteData(this.props);
    }

    @autobind
    loadInstituteData(props){
        const {search_store, params: {id}, dispatch} = props;
        const inst = find(search_store.results, {url_slug: id});
        if(inst){
            this.loadImages(inst);
            this.loadBranches(inst);
        }else{
            dispatch(getProfile(id)).tap(
                resp => {
                    const inst = resp.entities.institutes[resp.result];
                    this.loadImages(inst);
                    this.loadBranches(inst);
                }
            ).error(
                e => dispatch(createToast(e))
            );
        }
    }

    @autobind
    loadImages(inst){
        this.props.dispatch(loadGallery(inst._id)).then(
            r => {
                if(r.files.length){
                    this.setState({images: r.files});
                }
            },
            noop
        );
        return null; //suppress promise warning
    }

    @autobind
    loadBranches(inst){
        if(!inst.parent_id)
            this.props.dispatch(loadBranch(inst._id));
    }

    render (){
        const {search_store, params} = this.props;

       // debugger;

        const inst = find(search_store.results, {url_slug: params.id});

        if(search_store.error) return <Error error={search_store.error} />;

        if(search_store.loading) return (
            <div className="text-center text-title">
                <Loading />
            </div>
        );

        const title = inst ? `${inst.name} - Careerraft` : 'Careerraft';

        return (
            <div className="inst-page">
                <Helmet title={title} meta={[
                    {name: 'description', content: inst && inst.short_description}
                ]}  />
                {inst ? <InstituteDetails inst={inst} images={this.state.images} /> : <p className="text-title text-center">Nothing to display</p>}
                {this.props.children}
            </div>
        )
    }
}