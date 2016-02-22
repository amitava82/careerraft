/**
 * Created by amitava on 11/02/16.
 */

import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import Helmet from 'react-helmet';


const sideLinks = [
    {
        name: 'Create Institute',
        link: 'institute/add'
    },
    {
        name: 'Manage Institute',
        link: 'institute/manage'
    },
    {
        name: 'Add Category',
        link: 'category/add'
    },
    {
        name: 'Add Course',
        link: 'course/add'
    },
    {
        name: 'Add Subject',
        link: 'subject/add'
    }
];

@connect(state => state)
export default class HomeContainer extends React.Component {

    componentDidMount(){

    }

    render(){

        return (
            <div className="admin-page grid row">
                <Helmet title="Careerraft admin page" />
                <aside>
                    <div className="list-group">
                        {
                            sideLinks.map(i => {
                                return (
                                    <Link to={`/admin/${i.link}`} className="list-group-item" activeClassName="active">{i.name}</Link>
                                )
                            })

                        }
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