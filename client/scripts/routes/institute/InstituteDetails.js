/**
 * Created by amitava on 10/02/16.
 */
import React from 'react';
import {connect} from 'react-redux';
import { routeActions } from 'react-router-redux';
import autobind from 'autobind-decorator';
import {Link} from 'react-router';

import each from 'lodash/each';

import formatAddress from '../../utils/format-address';
import Avatar from '../../components/Avatar';

@connect(state => {
    return {
        category_store: state.category_store
    }
})
export default class InstituteDetails extends React.Component {

    @autobind
    goBack(){
            this.props.dispatch(routeActions.goBack());
    }

    render(){

        const inst = this.props.inst;

        let courses = {}, categories = [];


        inst.subjects.forEach(i => {
            const c = i.subject.course;
            if(courses[c._id]){
                courses[c._id].subjects.push(i);
            }else{
                courses[c._id] = c;
                c.subjects = [i]
            }
        });

        const coursesList = [];
        each(courses, (val, key) => {
            const subjects = val.subjects.map(i => {
                return (
                    <div className="pill pill-success">
                        {i.name}
                    </div>
                )
            });
            coursesList.push(
                <div className="m-bl">
                    <h5 className="text-headline">{val.name}</h5>
                    <p>{val.description}</p>
                    <div className="pills">
                        {subjects}
                    </div>
                </div>
            )
        });

        return (
            <div className="inst-profile">
                <div className="inst-profile-header">
                    <div className="page-inner grid">
                        <div className="cell-span-2">
                            <button onClick={this.goBack} className="link"><i className="fa fa-angle-double-left"></i> Back</button>
                        </div>
                        <div className="cell-span-7">
                            <h3 className="text-display-2 profile-title">{inst.name}</h3>
                            <address>
                                <i className="fa fa-map-marker" />
                                {formatAddress(inst.address)}
                            </address>
                        </div>
                        <div className="cell-span-3"></div>
                    </div>
                </div>
                <div className="inst-profile-content">
                    <div className="page-inner grid">
                        <div className="cell-span-2 pull-up">
                            <div className="inst-avatar">
                                <Avatar width="130" height="120" name={inst.name} />
                            </div>

                        </div>
                        <div className="cell-span-7">
                            <div className="profile-header">
                                <article>
                                    {inst.short_description}
                                </article>
                                <div className="inst-type">
                                    INSTITUTE TYPE: <span>{inst.type}</span>
                                </div>
                                <div className="grid text-center">
                                    <div className="cell-4">
                                        <i className="fa fa-phone" />
                                        {inst.telephones.map(i => {
                                            return <span className="inst-phone">{i.name}: {i.number}</span>;
                                        })}
                                    </div>
                                    <div className="cell-4"><i className="fa fa-envelope" /><a href={`mailto:${inst.email}`}>Email</a></div>
                                    <div className="cell-4"><i className="fa fa-external-link" /> <a href={inst.website} target="_blank">Website</a></div>
                                </div>
                            </div>
                            <div className="profile-body">
                                <div className="profile-section border-bottom-think">
                                    <h3 className="text-display-2">Overview</h3>
                                    <article className="profile-sub-section">{inst.description}</article>
                                </div>
                                <div className="profile-section border-bottom-think">
                                    <h3 className="text-display-1">Courses Offered</h3>
                                    <div className="profile-sub-section">
                                        {coursesList}
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className="cell-span-3">
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}