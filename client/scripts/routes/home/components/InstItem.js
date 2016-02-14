/**
 * Created by amitava on 14/02/16.
 */
import React from 'react';
import {Link} from 'react-router';
import map from 'lodash/map';

import formatAddress from '../../../utils/format-address';

export default class InstItem extends React.Component {

    render(){
        const i = this.props.inst;

        const categories = map(i.categories, c => {
            return (
                <div className="pill pill-success sm" key={c._id}>
                    {c.name}
                </div>
            )
        });

        const courses = map(i.courses, c => {
            return (
                <div className="pill pill-info sm" key={c._id}>
                    {c.name}
                </div>
            )
        });

        return (
            <div key={i._id} className="inst-item">
                <h5><Link to={`/institute/${i._id}`}>{i.name}</Link></h5>
                <p className="addr"><i className="fa fa-map-marker" /> {formatAddress(i.address)}</p>
                <p className="desc">{i.description}</p>
                <div className="categories pills">
                    {categories}
                </div>
                <div className="courses pills">
                    {courses}
                </div>
            </div>
        )
    }
}