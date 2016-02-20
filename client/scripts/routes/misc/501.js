/**
 * Created by amitava on 31/01/16.
 */
import React from 'react';
import Helmet from 'react-helmet';

export default class ServerError extends React.Component{

    render(){
        return (
            <div>
                <Helmet title="Server error" />
                <h1>Internal server error</h1>
            </div>
        )
    }
}