/**
 * Created by amitava on 11/05/16.
 */
import React from 'react';
import Select from 'react-select';
import { connect } from 'react-redux';

import autobind from 'autobind-decorator';
import extend from 'lodash/extend';

import {loadSuggestions} from '../redux/modules/search'

@connect()
export default class SearchSuggest extends React.Component{

    @autobind
    getSuggestions(input, callback){
        this.props.dispatch(loadSuggestions(input)).then(
            r => {
                callback(null, {
                    options: r
                })
            }
        )
    }

    render(){

        return (
            <Select.Async
                name="search-suggestion"
                value={this.props.value}
                loadOptions={this.getSuggestions}
                onChange={this.props.onSelect}
                autoBlur={true}
                className={this.props.className}
                labelKey="displayname"
                valueKey="_id"
                placeholder="Search for a Course, Class or Institute"
            />
        )            
    }
}