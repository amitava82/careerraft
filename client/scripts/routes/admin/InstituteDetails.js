/**
 * Created by amitava on 13/02/16.
 */
import React from 'react';
import {connect} from 'react-redux';

import {LOAD_INSTITUTE} from '../../actions/institute';
import  AssignSubject from './AssignSubject';


@connect(state => state)
export default class InstituteDetails extends React.Component {

    constructor(){
        super();

        this.state = {
            institute: null
        }
    }
    componentDidMount(){
        this.props.dispatch(LOAD_INSTITUTE(this.props.params.id)).then(
            r => this.setState({institute: r})
        )
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.params.id == this.props.params.id) return;

        this.props.dispatch(LOAD_INSTITUTE(this.props.params.id)).then(
            r => this.setState({institute: r})
        )
    }

    render() {

        if(!this.state.institute) return <h5>Loading...</h5>;

        const inst = this.state.institute;

        return (
            <div>
                <h5>{inst.name}</h5>
                <AssignSubject />
            </div>
        )
    }
}