/**
 * Created by amitava on 14/02/16.
 */
import React from 'react';
import {Link} from 'react-router';
import uniq from 'lodash/uniq'

import formatAddress from '../../utils/format-address';

export default class InstItem extends React.Component {

    render(){
        const i = this.props.inst;

        const categories = [], subjects = [], courses = [];
        i.subjects.forEach(i => {
            categories.push(
                i.category
            );
            courses.push(
                i.course
            )
        });

        const desc = i.description.length >= 300 ? i.description.substr(0,300).trim()  : i.description;

        const detailsLink = `/institute/${i.url_slug || i._id}`;

        return (
            <div className="inst-item">
                <h5 className="text-headline"><Link to={detailsLink}>{i.name}</Link></h5>
                <p className="addr text-subhead"><i className="fa fa-map-marker" /> {formatAddress(i.address)}</p>
                <p className="desc">{desc}{i.description.length >= 300 && <Link to={detailsLink}>...more</Link>}</p>
                <div className="m-bm">
                    <h5 className="text-subhead">
                        <span className="strong">Specializes in:</span> {uniq(courses).join(', ')}
                    </h5>
                </div>
                <div className="categories pills">
                    <div><span className="strong">Listed under:</span> {uniq(categories).map(i => {
                        return (
                            <div className="label label-default">
                                {i}
                            </div>
                        )
                    })}</div>

                </div>
            </div>
        )
    }
}