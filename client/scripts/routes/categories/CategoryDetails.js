/**
 * Created by amitava on 18/02/16.
 */
import React from 'react';
import Helmet from 'react-helmet';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import reduce from 'lodash/reduce';

import {loadCourses} from '../../redux/modules/course'

import middleware from '../../utils/middleware';


@connect(state => state)
export default class CategoryDetails extends React.Component {

    componentDidMount(){
        this.props.dispatch(loadCourses({_id: this.props.params.id}));
    }

    render() {

        const {course_store} = this.props;
        const courses = reduce(course_store.ids, (memo,i) => {
            const c = course_store.entities[i];
            if(c.category == this.props.params.id)
                memo.push(
                    <div className="m-bl" key={i._id}>
                        <h5 className="text-headline"><Link to={`/search/?subject_id=${c._id}`} key={c._id} className="strong">{c.name}</Link></h5>
                        <p>{c.description}</p>
                    </div>
                );
            return memo;
        }, []);

        return (
            <div className="container">
                <div className="row">
                    <div className="col-xs-11 col-xs-offset-1">
                        {courses}
                    </div>
                </div>
            </div>
        )

    }
}