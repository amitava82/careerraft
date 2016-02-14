/**
 * Created by amitava on 10/02/16.
 */
import React from 'react';
import each from 'lodash/each';

import formatAddress from '../../utils/format-address';


export default class InstituteDetails extends React.Component {

    render(){

        const inst = this.props.inst;

        let courses = [], subjects = [], categories = [];

        each(inst.subjects, i => {
           courses.push(<span className="pill">{i.course}</span>);
            subjects.push(<span className="pill">{i.name}</span>);
            categories.push(<span className="pill">{i.category}</span>);
        });

        return (
            <div className="inst grid column">
                <div className="header grid row">
                    <div className="cell-2">
                        <h3>{inst.name}</h3>
                        <address>
                            <i className="fa fa-map-marker" />
                            {formatAddress(inst.address)}
                        </address>
                        <h5>Courses</h5>
                        <div className="pills">
                            {courses}
                        </div>
                        <h5>Categories</h5>
                        <div className="pills">
                            {categories}
                        </div>
                    </div>
                    <div className="cell-1 grid column">
                        <div>
                            {inst.telephones.map(i => {
                                return (
                                    <p>{i.name}: {i.number}</p>
                                )
                            })}
                        </div>
                        <div>
                            <a href={inst.website}>{inst.website}</a>
                        </div>
                    </div>
                </div>
                <div className="content">
                    <div className="box">
                        <div className="box-header">
                            <h5>About XYZ center</h5>
                        </div>
                        <div className="box-content">
                            <p>
                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}