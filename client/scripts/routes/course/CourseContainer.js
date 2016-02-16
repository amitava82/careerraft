/**
 * Created by amitava on 16/02/16.
 */
import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';

export default class CourseContainer extends React.Component {

    render(){
        return (
            <div className="course-page">
                {this.props.children}
            </div>
        )
    }
}