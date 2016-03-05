/**
 * Created by amitava on 20/02/16.
 */
import React from 'react';

import InstItem from './InstItem';


export default class SearchResuts extends React.Component{


    render(){
        const results = this.props.results || [];

        const resultList = results.map(i => {
           return <InstItem inst={i} key={i._id}  />
        });

        return(
            <div className="search-results">
                {resultList}
            </div>
        )
    }
}