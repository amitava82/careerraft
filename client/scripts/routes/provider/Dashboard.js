/**
 * Created by amitava on 03/05/16.
 */
import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';


import Api from '../../helpers/api';
import Loading from '../../components/Loading';
const api = new Api();

@connect(state => state)
export default class Dashboard extends React.Component {
    
    static contextTypes = {
        provider: React.PropTypes.object
    };

    constructor(...args){
        super(...args);

    }

    render(){
        const provider = this.context.provider;

        return(
            <div>
                This is where dashboard comes
            </div>
        )
    }
}