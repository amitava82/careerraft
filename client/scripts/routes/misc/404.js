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
                <div className="container">
                    <div className="row">
                        <div className="text-center">
                            <h2 className="text-display-2">Not found</h2>
                            <h4 className="text-title">You seems to have stumbled upon something that does not exists :(</h4>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}