/**
 * Created by amitava on 18/02/16.
 */
import React from 'react';
import Helmet from 'react-helmet';
import {connect} from 'react-redux';
import {Link} from 'react-router';

import {loadCourses} from '../../redux/modules/course'

import middleware from '../../utils/middleware';


@connect(state => state)
export default class CategoryDetails extends React.Component {

    componentDidMount(){
        this.props.dispatch(loadCourses({_id: this.props.params.id}));
    }

    render() {

        const {course_store} = this.props;
        const courses = course_store.ids.map(i => {
            const c = course_store.entities[i];
            return (
                <div className="m-bl">
                    <h5 className="text-headline"><Link to={`/search/?course=${c._id}`} key={c._id} className="strong">{c.name}</Link></h5>
                    <p>{c.description}</p>
                </div>

            )
        });
        return (
            <div className="content-body">
                <div className="page-inner">
                    <div>
                        {courses}
                    </div>
                </div>
            </div>
        )

    }
}