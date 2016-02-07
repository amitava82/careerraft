/**
 * Created by amitava on 04/02/16.
 */
import React from 'react';
import { Link } from 'react-router'

export default class Item extends React.Component {

    render(){

        const inst = this.props.inst;

        return (
            <div className="org-item grid column">
                <div className="item-main grid row">
                    <div className="logo">
                        <img src="http://placehold.it/350x150" />
                    </div>
                    <div className="header grid cell">
                        <div className="cell-2 basic">
                            <h3>{inst.name}</h3>
                            <a href={inst.address} target="_blank">{inst.address}</a>
                            <p>{inst.address}</p>
                        </div>
                        <div className="cell side">
                            <div>Rating: 4/5</div>
                            <div>45 votes</div>
                            <p>Avg. Fees: 22,000 INR</p>
                            <p><i className="fa fa-phone" /> 121221212, 1212121</p>
                        </div>
                    </div>
                </div>
                <div className="grid row item-sm center">
                    <div className="cell">
                        IIT/JEE/12/MORE
                    </div>
                    <div>
                        Mon - Sun, 6AM - 5PM
                    </div>
                </div>
                <div className="actions grid row center item-md">
                    <div className="cell u-center">
                        <Link to={`${inst._id}/enquiry`}>SUBMIT ENQUIRY</Link>
                    </div>
                    <div className="cell u-center">
                        <Link to={`/institute/${inst._id}/reviews`}>REVIEWS</Link>
                    </div>
                    <div className="cell u-center">
                        <Link to={`/institute/${inst._id}`}>MORE INFORMATION</Link>
                    </div>
                </div>
            </div>
        )
    }
}