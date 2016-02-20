/**
 * Created by amitava on 31/01/16.
 */
import React from 'react';
import Helmet from 'react-helmet';

export default class NotFound extends React.Component{

    render(){
        return (
            <div>
                <Helmet title="Not found" />
                <h1>You seems to have stumbled upon something that does not exists :(</h1>
            </div>
        )
    }
}