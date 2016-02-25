/**
 * Created by amitava on 16/02/16.
 */
import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import Helmet from 'react-helmet';

import Error from '../../components/Error';

@connect(state => state)
export default class CategoryContainer extends React.Component {

    render(){

        const catid = this.props.params.id;
        let catHeader = null;

        if(catid){
            const cat = this.props.category_store.entities[catid];
            catHeader = (
                <div className="cell-span-11">
                    <h3 className="text-display-2">{cat.name}</h3>
                    <p>{cat.description}</p>
                </div>
            )
        }else {
            catHeader = (
                <div className="cell-span-11">
                    <h3 className="text-display-2">Categories</h3>
                </div>
            )
        }

        return (
            <div className="course-page">
                <Helmet title="Careerraft - Courses" />
                <div className="hero-unit">
                    <div className="page-inner grid">
                        <div className="cell-span-1"></div>
                        {catHeader}
                    </div>
                </div>
                {this.props.children}
            </div>
        )
    }
}