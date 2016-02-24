/**
 * Created by amitava on 20/02/16.
 */
import React from 'react';

export default class Loading extends React.Component {
    render(){
        return (
            <div className="error text-error text-center">
                <p className="text-title">
                    <i className="fa fa-exclamation-circle" />
                    <span> Ops, something is wrong.</span>
                </p>
                {this.props.error ? (
                    <p>{this.props.error.message}</p>
                ): (
                    this.props.children
                )}
            </div>
        )
    }
}