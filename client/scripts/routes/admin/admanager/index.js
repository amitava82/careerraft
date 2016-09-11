/**
 * Created by amitava on 15/04/16.
 */
import React from 'react';
import autobind from 'autobind-decorator';
import {Modal} from 'react-bootstrap'
import {Link} from 'react-router';
import {connect} from 'react-redux';

import AdFrom from './form';
import Api from '../../../helpers/api';

const api = new Api();

export default class AdManager extends React.Component{

    constructor(...args){
        super(...args);

        this.state = {
            addingAd: false,
            ads: [],
            editing: null
        };
    }

    componentDidMount(){
        api.get('ads').then(
            r => this.setState({ads: r})
        )
    }

    @autobind
    setEditing(ad){
        this.setState({editing: null}, ()=>{
            this.setState({editing: ad})
        });
    }


    @autobind
    addNew(){
        this.setState({addingAd: true});
    }

    @autobind
    submitForm(d){
        this.refs.createForm.submit();
    }

    @autobind
    onSubmit(data){
        const url = data._id ? `ads/${data._id}` : 'ads';
        const method = data._id ? 'put' : 'post';
        api[method](url, {
            data: {
                client_id: data.client_id,
                name: data.name,
                keywords: data.keywords.split(','),
                banner_url: data.banner_url,
                target_url: data.target,
                expires_on: data.expires_on,
                active: data.active,
                target_cities: data.target_cities.split(','),
                ad_type: data.ad_type,
                position: data.position
            }
        }).then(
            r => {
                api.get('ads').then(
                    r => this.setState({ads: r, addingAd: false, editing: null})
                )
            },
            e => console.log(e)
        )
    }

    render(){

        const {ads, addingAd, editing} = this.state;

        const adsList = ads.map(i => {
            return (
                <tr key={i._id}>
                    <td>{i.client_id}</td>
                    <td>{i.name}</td>
                    <td>{i.active ? 'Yes' : 'No'}</td>
                    <td>{i.total_clicks}</td>
                    <td>{i.total_impressions}</td>
                    <td><button className="btn btn-link" onClick={() => this.setEditing(i)}>edit</button></td>
                </tr>
            )
        });

        const editContent = editing && (
            <div>
                <AdFrom ref="createForm" onSubmit={this.onSubmit} ad={editing} />
                <button onClick={this.submitForm}>Submit</button>
            </div>
        );

        const addingContent = addingAd && (
                <div>
                    <AdFrom ref="createForm" onSubmit={this.onSubmit} />
                    <button onClick={this.submitForm}>Submit</button>
                </div>
            );

        return (
            <div>
                <button className="btn btn-primary m-bm" onClick={this.addNew}>Create new Ad</button>
                <table className="table table-bordered">
                    <thead>
                        <th>Client ID</th>
                        <th>Ad name</th>
                        <th>Active</th>
                        <th>Total Clicks</th>
                        <th>Total Impressions</th>
                        <th></th>
                    </thead>
                    <tbody>
                        {adsList}
                    </tbody>
                </table>
                {editContent}
                {addingContent}
            </div>
        )
    }
}

