/**
 * Created by amitava on 31/01/16.
 */
import React from 'react';
import {connect} from 'react-redux';
import Helmet from 'react-helmet';

import { loadInstitutes } from '../../redux/modules/institute';

import InstituteDetails from './InstituteDetails';

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

    constructor(props, ctx){
        super(props, ctx);

        this.state = {
            loading: true
        }
    }

    componentDidMount(){
        this.props.dispatch(loadInstitutes(this.props.params.id)).then(
            i => this.setState({institute: i, loading: false}),
            e => console.log(e)
        )
    }

    render (){
        return (
            <div className="inst-page">
                <Helmet title="Careerraft - Institutes lists" />
                {this.state.loading ? 'Loading...' : <InstituteDetails inst={this.state.institute} />}
                {this.props.children}
            </div>
        )
    }
}