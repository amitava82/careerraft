/**
 * Created by amitava on 26/02/16.
 */
import React from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import {reduxForm, initialize} from 'redux-form';
import autobind from 'autobind-decorator';
import reduce from '../../../../../node_modules/lodash/reduce';
import find from 'lodash/find';

import Checkbox from '../../../components/Checkbox';

import {loadInstitutes, updateBranches} from '../../../redux/modules/institute';

import Api from '../../../helpers/api';

const api = new Api();

@reduxForm({
    form: 'assign_branches',
    fields: ['institutes']
}, state=> {
    return {
        institute_store: state.institute_store
    }
})
export default class ManageBranches extends React.Component{

    constructor(props, ctx){
        super(props, ctx);

        this.state = {
            institutes: []
        }
    }

    componentDidMount(){
        const inst = this.props.institute_store.entities[this.props.params.id];
        this.props.initializeForm({institutes: inst.branches.map(i => i._id)});
    }

    @autobind
    search(e){
        const q = this.refs.query.value;
        const query = {};
        if(q) query.name = q;
        api.get('institutes', {params: query}).then(
            r => {
                this.setState({institutes: r});
            },
            e => console.log(e)
        );
    }

    @autobind
    onSave(data){
        return this.props.dispatch(updateBranches(this.props.params.id, [...data.institutes]))
    }

    @autobind
    handleChange(e, val){
        const checked = e.target.checked;
        const s = this.props.fields.institutes;

        if (s.value !== undefined) {
            const idx = s.value.indexOf(val);
            if (checked) {
                if(idx === -1)
                    s.onChange(s.value.concat(val));
            } else {
                const valuesCopy = [...s.value];
                valuesCopy.splice(idx, 1);
                s.onChange(valuesCopy);
            }
        } else {
            //first item
            if (checked) {
                s.onChange([val]);
            }
        }
    }

    render(){
        const {fields: {institutes}, handleSubmit, submitting, institute_store, params} = this.props;

        const inst = institute_store.entities[params.id];
        const searchResults = reduce(this.state.institutes, (memo,i) => {
            const exists = find(inst.branches, {_id: i._id});
            if(i._id !== params.id && !exists){
                const isChecked = (institutes.value && institutes.value.indexOf(i._id) > -1);
                memo.push(
                    <Checkbox key={i._id}
                              checked={isChecked}
                              className="input-horizontal"
                              value={isChecked}
                              type="checkbox"
                              label={i.name}
                              onChange={e => this.handleChange(e, i._id)}  />
                );

            }
            return memo;
        }, []);

        const existingBranches = inst.branches.map(i => {
            const isChecked = (institutes.value && institutes.value.indexOf(i._id) > -1);
            return(
                <Checkbox key={i._id}
                          checked={isChecked}
                          className="input-horizontal"
                          value={isChecked}
                          type="checkbox"
                          label={i.name}
                          onChange={e => this.handleChange(e, i._id)}  />
            )
        });

        return (
            <div>
                <form onSubmit={handleSubmit(this.onSave)}>
                    <label>Search</label>
                    <div className="input-group">
                        <input className="form-control" type="text" ref="query" />
                        <div className="input-group-btn">
                            <button type="button" className="btn btn-primary" onClick={this.search}>Search</button>
                        </div>
                    </div>
                    <div>
                        {existingBranches.length && <p>Current branches</p>}
                        {existingBranches}
                    </div>
                    <hr />
                    <p className="text-subhead">Select institutes to assign as branches for <strong>{inst.name}</strong></p>
                    {searchResults}
                    <div>
                        <button className="btn btn-primary" disabled={submitting || !institutes.value}>Save</button>
                    </div>
                </form>
            </div>
        )
    }
}