/**
 * Created by amitava on 18/02/16.
 */
import React from 'react';

export default class CategoryDetails extends React.Component {
    render() {
        return (
            <div>
                stuff
                {this.props.params.id}
            </div>
        )

    }
}