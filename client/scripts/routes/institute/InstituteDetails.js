/**
 * Created by amitava on 10/02/16.
 */
import React from 'react';
import {connect} from 'react-redux';
import { routeActions } from 'react-router-redux';
import autobind from 'autobind-decorator';
import {Link} from 'react-router';

import each from 'lodash/each';
import isEmpty from 'lodash/isEmpty';

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
                    <div className="label label-success">
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
                    <div className="page-inner container">
                        <div className="row">
                            <div className="col-md-2">
                                <button onClick={this.goBack} className="btn-link"><i className="fa fa-angle-double-left"></i> Back</button>
                            </div>
                            <div className="col-md-10">
                                <h3 className="text-display-2 profile-title">{inst.name}</h3>
                                <address>
                                    <i className="fa fa-map-marker" />
                                    {formatAddress(inst.address)}
                                </address>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="inst-profile-content container">
                    <div className="page-inner row">
                        <div className="col-sm-2 col-md-2 pull-up visible-lg-block visible-md-block">
                            <div className="inst-avatar">
                                <Avatar width="130" height="120" name={inst.name} />
                            </div>

                        </div>
                        <div className="col-sm-8 col-md-9">
                            <div className="profile-header">
                                <article>
                                    {inst.short_description}
                                </article>
                                <div className="inst-type text-subhead clearfix">
                                    <div className="col-xs-6">
                                        INSTITUTE TYPE: <span>{inst.type}</span>
                                    </div>
                                    <div className="col-xs-6 text-right">
                                        {inst.branches.length ? (
                                            <a href="#branches">{inst.branches.length} Branch(es)</a>
                                        ): null}
                                    </div>
                                </div>
                                <div className="row text-center">
                                    <div className="col-md-4">
                                        <div className="pull-left"><i className="fa fa-phone" /></div>
                                        <div className="">
                                            {inst.telephones.map(i => {
                                                if(isEmpty(i)) return null;
                                                return (
                                                    <div>
                                                        <span className="inst-phone">{i.name}: {i.number}</span>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                    <div className="col-md-4 text-center">
                                        {' '}<a href={`mailto:${inst.email}`}><i className="fa fa-envelope" /> Email</a>
                                    </div>
                                    <div className="col-md-4 text-center">
                                        {inst.website ? <a href={formatUrl(inst.website)} target="_blank"><i className="fa fa-external-link" /> Website</a> : null}
                                    </div>
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
                                {inst.branches.length ?
                                <div id="branches" className="profile-section border-bottom-think">
                                    <h3 className="text-display-1">Branches</h3>
                                    <div className="profile-sub-section">
                                        {inst.branches.map(i => {
                                            return (
                                                <div>
                                                    <p><Link to={`/institute/${i._id}`}>{i.name}</Link></p>
                                                    <address>
                                                        <i className="fa fa-map-marker" />
                                                        {formatAddress(i.address)}
                                                    </address>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                                 : null}
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

function formatUrl(url){
    if(url){
        url = url.trim();
        return url.indexOf('http://') !== 0 ?  'http://' + url : url;
    }
    return url;
}