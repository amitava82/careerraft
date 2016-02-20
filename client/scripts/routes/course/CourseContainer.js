/**
 * Created by amitava on 16/02/16.
 */
import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import Helmet from 'react-helmet';

export default class CourseContainer extends React.Component {

    render(){
        return (
            <div className="course-page">
                <Helmet title="Careerraft - Courses" />
                {this.props.children}
            </div>
        )
    }
}