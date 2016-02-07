/**
 * Created by amitava on 04/02/16.
 */
import React from 'react';
import {connect} from 'react-redux';
import map from 'lodash/map';

import { institute } from '../../actions'

import Item from './components/Item';
import FilterBar from './components/FilterBar';

@connect(state => state)
export default class HomeContainer extends React.Component {

    componentDidMount(){
            this.props.dispatch(institute.LOAD_INSTITUTES())
    }

    render(){

        const items = this.props.orgs.institutes.map(i => {
            return <Item inst={i} key={i._id} />
        });
        return (
            <div className="home grid row">
                <aside>
                    <FilterBar />
                </aside>
                <div className="main grid column cell">
                    {items}
                </div>
                <aside>
                    side bar
                </aside>
            </div>
        )
    }
}