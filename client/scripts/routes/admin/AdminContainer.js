/**
 * Created by amitava on 11/02/16.
 */

import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';

import { course, category } from '../../actions'

@connect(state => state)
export default class HomeContainer extends React.Component {

    componentDidMount(){

    }

    render(){

        return (
            <div className="admin-page grid row">
                <aside>
                    <div className="list-group">
                        <Link to="/admin/category/add" className="list-group-item">Add Category</Link>
                        <Link to="/admin/course/add" className="list-group-item">Add Course</Link>
                        <Link to="/admin/subject/add" className="list-group-item">Add Subject</Link>
                        <a  className="list-group-item" href="/auth/logout">Logout</a>
                    </div>
                </aside>
                <div className="cell main">
                    {this.props.children}
                </div>
            </div>
        )
    }
}