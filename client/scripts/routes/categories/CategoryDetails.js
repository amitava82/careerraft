/**
 * Created by amitava on 18/02/16.
 */
import React from 'react';
import Helmet from 'react-helmet';
import {connect} from 'react-redux';
import {Link} from 'react-router';

import {loadCourses} from '../../redux/modules/course'

import middleware from '../../utils/middleware';


@middleware([
    {
        key: '$categories',
        watch: (props) => props.params.id,
        handler: (props, id) => props.dispatch(loadCourses({_id: id}))
    }
])
@connect(state => state)
export default class CategoryDetails extends React.Component {

    componentDidMount(){
        //this.props.dispatch(LOAD_COURSES({_id: this.props.params.id}));
    }

    render() {

        const courses = this.props.course_store.courses.map(i => {
            return (

                    <Link to={`/subjects/${i._id}`} key={i._id} className="tile">
                        <h6>{i.name}</h6>
                        <p>{i.description}</p>
                    </Link>
            )
        });
        return (
            <div>
                <h5>Courses available under this category:</h5>
                <div className="tile-container">
                    {courses}
                </div>
            </div>
        )

    }
}