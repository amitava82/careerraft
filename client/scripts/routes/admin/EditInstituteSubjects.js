/**
 * Created by amitava on 18/02/16.
 */
import React from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import {reduxForm} from 'redux-form';

@connect(state => state)
export default class EditInstituteCategories extends React.Component {
    constructor(props, ctx) {
        super(props, ctx);
    }

    render() {
        return (
            <div>
                Subject stuff
            </div>
        )

    }
}