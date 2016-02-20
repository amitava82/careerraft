/**
 * Created by amitava on 16/02/16.
 */
import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import Helmet from 'react-helmet';


export default class CategoryContainer extends React.Component {

    render(){
        return (
            <div className="category-page">
                <Helmet title="Careerraft - List of categories" />
                {this.props.children}
            </div>
        )
    }
}