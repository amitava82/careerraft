/**
 * Created by amitava on 20/02/16.
 */
import React from 'react';
import {connect} from 'react-redux';
import get from 'lodash/get';
import autobind from 'autobind-decorator';

import {Collapse} from 'react-bootstrap';
import Checkbox from '../../components/Checkbox';

@connect(state => state)
export default class FilterPane extends React.Component {

    constructor(...args){
        super(...args);
        this.state = {open: true};
    }

    render() {
        const {category_store, routing, filters} = this.props;
        const query = routing.location.query;

        const categories = get(filters, 'categories', []).map(i => {
            const f = query['category'] || [];

            return <Checkbox label={i} checked={f.indexOf(i) > -1} onChange={e => this.props.toggleFilter(i, 'category', !e.target.checked)} />
        });

        const courses = get(filters, 'courses', []).map(i => {
            const f = query['course'] || [];
            return <Checkbox checked={f.indexOf(i) > -1}  onChange={e => this.props.toggleFilter(i, 'course', !e.target.checked)} label={i} />
        });

        const subjects = get(filters, 'subjects', []).map(i => {
            const f = query['subject'] || [];
            return <Checkbox checked={f.indexOf(i) > -1}  label={i} onChange={e => this.props.toggleFilter(i, 'subject', !e.target.checked)}/>
        });

        return (
            <div className="filter-panel">
                <div className="strong text-title filter-pane-header">
                    <i className="fa fa-filter" />
                    Refine
                    <span className="pull-right">
                        <button className="sm btn-link" onClick={this.props.resetFilters}>clear</button>
                        <button onClick={ ()=> this.setState({ open: !this.state.open })} className="visible-xs-inline btn-link sm"><i className="fa fa-bars" /></button>
                    </span>
                </div>
                <Collapse in={this.state.open}>
                    <div className="filter-panel-body">
                        <div className="filter-group">
                            <h5 className="text-caption strong">Categories</h5>
                            <div className="filter-list">
                                {categories}
                            </div>
                        </div>
                        <div className="filter-group">
                            <h5 className="text-caption strong">Courses</h5>
                            <div className="filter-list">
                                {courses}
                            </div>
                        </div>
                        <div className="filter-group">
                            <h5 className="text-caption strong">Subjects</h5>
                            <div className="filter-list">
                                {subjects}
                            </div>
                        </div>
                    </div>
                </Collapse>
            </div>
        )
    }
}