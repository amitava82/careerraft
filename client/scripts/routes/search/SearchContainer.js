/**
 * Created by amitava on 31/01/16.
 */
import React from 'react';
import autobind from 'autobind-decorator';
import { connect } from 'react-redux';

import { institute } from '../../actions';

import map from 'lodash/map';

@connect(state => state)
export default class SearchContainer extends React.Component {

    constructor(props, ctx){
        super(props, ctx);

        this.state = {
            orgs: [],
            loading: false
        }

    }
    @autobind
    loadOrgs(){
        this.props.dispatch(institute.LOAD_INSTITUTES()).then(
            r => console.log(r),
            e => console.log(e)
        )
    }

    componentWillMount(){
        //this.props.dispatch(LOAD_ORGS(1));
    }

    render (){

        const list = map(this.props.orgs.orgs, (org) => {
            return (
                <h4>{org.name}</h4>
            )
        });

        return (
            <div>
                {this.state.loading? 'LOADING>....' : list}
                <button onClick={this.loadOrgs}>Load Orgs</button>
                {this.props.children}
            </div>
        )
    }
}