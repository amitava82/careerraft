/**
 * Created by amitava on 20/02/16.
 */
import React from 'react';
import {connect} from 'react-redux';
import get from 'lodash/get';

import autobind from 'autobind-decorator';

import {Collapse} from 'react-bootstrap';
import Checkbox from '../../components/Checkbox';
import Radio from '../../components/Radio';

const FILTERS = ['locality', 'categories', 'courses', 'kind'];
@connect(state => state)
export default class FilterPane extends React.Component {

    constructor(...args){
        super(...args);
        this.state = {open: true};
    }

    render() {
        const {routing, filters} = this.props;
        const query = routing.location.query;

        const categoryAgg = filters.categories;

        const categories = get(categoryAgg, 'buckets', []).map(i => {
            const f = query['category'] || "";
            return <Radio 
                        name="category" 
                        key={i.key} 
                        label={`${i.key} (${i.doc_count})`} 
                        checked={f.indexOf(i.key) > -1} 
                        onChange={e => this.props.toggleFilter(i.key, 'category', !e.target.checked, false)} />
        });

        const courseAgg = filters.courses;

        const courses = get(courseAgg, 'buckets', []).sort().map(i => {
            const f = query['courses'] || [];
            return <Checkbox 
                        key={i.key} 
                        label={`${i.key} (${i.doc_count})`} 
                        checked={f.indexOf(i.key) > -1}  
                        onChange={e => this.props.toggleFilter(i.key, 'courses', !e.target.checked, true)} />
        });

        const localityAgg = filters.locality;
        const locality = get(localityAgg, 'buckets', []).sort().map(i => {
            const f = query['locality'] || [];
            return <Radio
                        name="locality"
                        key={i.key} 
                        label={`${i.key} (${i.doc_count})`} 
                        checked={f.indexOf(i.key) > -1} 
                        onChange={e => this.props.toggleFilter(i.key, 'locality', !e.target.checked, true)}/>
        });

        const kindAgg = filters.kind;
        const kind = get(kindAgg, 'buckets', []).map(i => {
            const f = query['kind'] || [];
            return <Radio 
                        name="kind" key={i.key} 
                        label={`${i.key} (${i.doc_count})`} 
                        checked={f.indexOf(i.key) > -1} 
                        onChange={e => this.props.toggleFilter(i.key, 'kind', !e.target.checked, false)} />
        });

        return (
            <div className="filter-panel">
                <div className="strong text-title filter-pane-header">
                    <i className="fa fa-filter" />
                    Refine
                    <span className="pull-right">
                        <button onClick={ ()=> this.setState({ open: !this.state.open })} className="visible-xs-inline btn-link sm"><i className="fa fa-bars" /></button>
                    </span>
                </div>
                <Collapse in={this.state.open}>
                    <div className="filter-panel-body">
                        <div className="filter-group">
                            <h5 className="text-caption">
                                <strong>Locality</strong>
                                <a onClick={() => this.props.clearFilter('locality')} className="pull-right m-rm">clear</a>
                            </h5>
                            <div className="filter-list">
                                {locality}
                            </div>
                        </div>
                        <div className="filter-group">
                            <h5 className="text-caption">
                                <strong>Categories</strong>
                                <a onClick={() => this.props.clearFilter('category')} className="pull-right m-rm">clear</a>
                            </h5>
                            <div className="filter-list">
                                {categories}
                            </div>
                        </div>
                        <div className="filter-group">
                            <h5 className="text-caption">
                                <strong>Courses</strong>
                                <a onClick={() => this.props.clearFilter('courses')} className="pull-right m-rm">clear</a>
                            </h5>
                            <div className="filter-list">
                                {courses}
                            </div>
                        </div>
                        <div className="filter-group">
                            <h5 className="text-caption">
                                <strong>Type</strong>
                                <a onClick={() => this.props.clearFilter('kind')} className="pull-right m-rm">clear</a>
                            </h5>
                            <div className="filter-list">
                                {kind}
                            </div>
                        </div>
                    </div>
                </Collapse>
            </div>
        )
    }
}