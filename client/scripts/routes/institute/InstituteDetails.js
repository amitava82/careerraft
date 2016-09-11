/**
 * Created by amitava on 10/02/16.
 */
import React from 'react';
import {connect} from 'react-redux';
import { routeActions } from 'react-router-redux';
import autobind from 'autobind-decorator';
import {Link} from 'react-router';
import { FacebookButton, FacebookCount } from "react-social";
import {
    ShareButtons,
    ShareCounts,
    generateShareIcon} from 'react-share';

import each from 'lodash/each';
import isEmpty from 'lodash/isEmpty';

import {formatAddress} from '../../utils/format-address';
import Avatar from '../../components/Avatar';
import ImageGallery from '../../components/ImageGallery';
import QnAComponent from './QnAComponent';

const {FacebookShareButton} = ShareButtons;
const {FacebookShareCount} = ShareCounts;
const FacebookIcon = generateShareIcon('facebook');

import {saveItem, removeSavedItem} from '../../redux/modules/user';

@connect(state => {
    return {
        category_store: state.category_store,
        user_store: state.user_store,
        routing: state.routing
    }
})
export default class InstituteDetails extends React.Component {

    @autobind
    goBack(){
            this.props.dispatch(routeActions.goBack());
    }

    @autobind
    removeFromList(){
        this.props.dispatch(removeSavedItem(this.props.inst._id));
    }

    @autobind
    saveToList(){
        this.props.dispatch(saveItem(this.props.inst._id));
    }

    render(){

        const inst = this.props.inst;
        const selected = !!this.props.user_store.savedItems[inst._id];

        let courses = {}, categories = [];


        inst.courses.forEach(i => {
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

        const pathname = this.props.routing.location.pathname;
        const _url = 'https://www.careerraft.com'+ pathname

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
                                <address title="Get direction">
                                    <a href={`https://www.google.com/maps?daddr=${formatAddress(inst.address)}`} target="_blank">
                                    <i className="fa fa-map-marker" />
                                    {' '}
                                    {formatAddress(inst.address)}
                                    </a>
                                </address>
                                <div className="social-share">
                                    <FacebookShareButton
                                        url={_url}
                                        title="Share on Facebook" >
                                        <FacebookIcon
                                            size={32} />
                                    </FacebookShareButton>
                                    <FacebookShareCount
                                        url={_url}>
                                        {count => count + ' shares'}
                                    </FacebookShareCount>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="inst-profile-content container">
                    <div className="page-inner row">
                        <div className="col-sm-2 col-md-2 pull-up">
                            <div className="inst-avatar m-bm">
                                <Avatar width="130" height="120" name={inst.name} url={inst.logo} />
                            </div>
                            <div className="text-center">
                                {selected ? (
                                    <button onClick={this.removeFromList} className="btn btn-link link-save item-list-added"><i className="fa fa-check-circle" /> Saved</button>
                                ) : (
                                    <button onClick={this.saveToList} className="btn btn-link link-save"><i className="fa fa-bookmark" /> Save</button>
                                )}
                            </div>
                        </div>
                        <div className="col-sm-8 col-md-10">
                            <div className="profile-header">
                                <article>
                                    {inst.short_description}
                                </article>
                                <div className="inst-type text-subhead clearfix">
                                    <div className="col-xs-6">
                                        INSTITUTE TYPE: <span className="case-title">{inst.type}</span>
                                    </div>
                                    <div className="col-xs-6 text-right">
                                        {inst.branches && inst.branches.length ? (
                                            <a href="#branches">{inst.branches.length} Branch(es)</a>
                                        ): null}
                                    </div>
                                </div>
                                <div className="row text-center">
                                    <div className="col-md-4">
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
                                        {' '}
                                        <Link to={`${pathname}/contact`}><i className="fa fa-envelope" /> Contact</Link>
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
                                {this.props.images.length ? (
                                    <div className="profile-section border-bottom-think">
                                        <h3 className="text-display-1">Photo gallery</h3>
                                        <div className="profile-sub-section">
                                            <ImageGallery
                                                files={this.props.images}
                                                autoSelect={false}
                                            />
                                        </div>
                                    </div>
                                ) : null}
                                {inst.branches && inst.branches.length ?
                                <div id="branches" className="profile-section border-bottom-think">
                                    <h3 className="text-display-1">Branches</h3>
                                    <div className="profile-sub-section">
                                        {inst.branches.map(i => {
                                            return (
                                                <div>
                                                    <p className="text-title"><Link to={`/institute/${i._id}`}>{i.name}</Link></p>
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
                                <div id="qna" className="profile-section border-bottom-think">
                                    <h3 className="text-display-1">Questions about {inst.name}</h3>
                                    <p>Want more info about {inst.name}?</p>
                                    <div className="profile-sub-section">
                                        <QnAComponent org={inst._id} />
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

function formatUrl(url){
    if(url){
        url = url.trim();
        return url.indexOf('http') !== 0 ?  ('http://' + url) : url;
    }
    return url;
}