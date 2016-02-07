/**
 * Created by amitava on 07/02/16.
 */
import React from 'react';

export default class FilterBar extends React.Component{

    render(){
        return(
            <div className="search-side">
                <div><i className="fa fa-filter" /> FILTERS</div>
                <div className="category-section">
                    <div className="header">CATEGORY</div>
                    <div className="list">
                        <div>
                            <label>
                                Primary
                                <input type="checkbox" />
                            </label>
                            <label>
                                Engineering Entrance
                                <input type="checkbox" />
                            </label>
                        </div>
                    </div>
                </div>
                <div className="category-section">
                    <div className="header">SORT BY</div>
                    <div className="list">
                        <div>
                          Popularity
                          <i className="fa fa-sort-asc" />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}