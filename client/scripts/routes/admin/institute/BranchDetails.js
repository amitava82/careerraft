/**
 * Created by amitava on 13/02/16.
 */
import React from 'react';
import {connect} from 'react-redux';
import autobind from 'autobind-decorator';

import {getProfile} from '../../../redux/modules/profile';
import  AssignCourses from './AssignCourses';
import {formatAddress} from '../../../utils/format-address'


@connect(state => state)
export default class BranchDetails extends React.Component {

    constructor(...args){
        super(...args);
    }
    componentDidMount(){
        this.props.dispatch(getProfile(this.props.params.branch));
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.params.branch == this.props.params.branch) return;

        this.props.dispatch(getProfile(this.props.params.branch));
    }

    @autobind
    onSave(d){
        console.log(d)
    }

    render() {

        const {profile_store: {entities}, params: {branch}} = this.props;

        const inst = entities[branch];

        if(!inst) return <h5>Loading...</h5>;

        return (
            <div>
                <address>{formatAddress(inst.address)}</address>
                <div className="grid row">
                    <AssignCourses branch={branch} onSave={this.onSave} />
                    <div>
                        {inst.courses.map(i => {
                            return (
                                <div className="list-group">
                                    <div className="list-group-item">
                                        <p>{i.name}</p>
                                        <p>{i.course}</p>
                                        <p>{i.category}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        )
    }
}