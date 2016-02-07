/**
 * Created by amitava on 31/01/16.
 */
import React from 'react';

export default class SearchContainer extends React.Component {

    render (){
        return (
            <div>
                <h1>Im institute</h1>
                {this.props.children}
            </div>
        )
    }
}