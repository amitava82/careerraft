/**
 * Created by amitava on 13/02/16.
 */
import React from 'react';
import {connect} from 'react-redux';
import autobind from 'autobind-decorator';
import {Link} from 'react-router';

import {getInstitute} from '../../../redux/modules/institute';
import {loadCategories} from '../../../redux/modules/category';

import Api from '../../../helpers/api';

const api = new Api();

@connect(state => state)
export default class ManageInstitute extends React.Component{

    constructor(){
        super();

        this.state = {
            institute: null,
            institutes: [],
            category: null,
            course: null,
            subject: null
        }
    }

    componentDidMount(){
        this.props.dispatch(loadCategories());
    }

    @autobind
    search(e){
        const q = this.refs.query.value;
        const query = {};
        if(q) query.name = q;
        api.get('institutes', {params: query}).then(
            r => {
                this.setState({institutes: r})
            },
            e => console.log(e)
        )
    }

    @autobind
    selectOrg(id){
        this.setState({institute: null});

        this.props.dispatch(getInstitute(id)).then(
            r => {
                this.setState({institute: r})
            },
            e => console.log(e)
        )
    }

    @autobind
    onSelect(model, val){
        this.setState({[model]: val}, () => console.log(this.state));
    }

    onSubmit(data){
        console.log(data)
    }

    render (){

        const {fields, handleSubmit, submitting} = this.props;

        const searchResults = this.state.institutes.map(i => {
            return (
                <div>
                    <p><Link to={`/admin/institute/manage/${i._id}`}>{i.name}</Link></p>

                </div>
            )
        });

        return (
            <div className="grid column">
                <div>
                    <label>Search</label>
                    <div className="input-group">
                        <input className="form-control" type="text" ref="query" />
                        <span className="input-group-btn">
                             <button className="btn btn-primary" onClick={this.search}>Search</button>
                        </span>

                    </div>
                    {searchResults}
                </div>
                <div>
                    {this.props.children}
                </div>
            </div>
        )
    }
}