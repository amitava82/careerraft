/**
 * Created by amitava on 31/01/16.
 */
import React from 'react';

import middleware from '../../utils/middleware';
import { institute } from '../../actions';

import InstituteDetails from './InstituteDetails';

@middleware([
    {
        key: '$test',
        watch: props => props.params.id,
        handler: (props, id) => props.dispatch(institute.LOAD_INSTITUTE(id))
    },
    {
        key: '$inst',
        watch: (props) => props.params.id,
        handler: (props, instId) => props.dispatch(institute.LOAD_INSTITUTE(instId))
    }
])
export default class SearchContainer extends React.Component {

    constructor(props, ctx){
        super(props, ctx);

        this.state = {
            loading: true
        }
    }
    render (){
        return (
            <div>
                <InstituteDetails />
                {this.props.children}
            </div>
        )
    }
}