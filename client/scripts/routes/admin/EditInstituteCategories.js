/**
 * Created by amitava on 18/02/16.
 */
import React from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import {reduxForm} from 'redux-form';
import autobind from 'autobind-decorator';
import find from 'lodash/find';

import {loadCategories} from '../../redux/modules/category';
import {addSubject} from '../../redux/modules/institute';
import {createToast} from '../../redux/modules/toast';



@connect(state => state)
export default class EditInstituteCategories extends React.Component {
    constructor(props, ctx) {
        super(props, ctx);

        this.state = {
            category: null
        }
    }

    componentDidMount(){
        this.props.dispatch(loadCategories());
    }

    @autobind
    SelectCategory(cat){
        this.setState({category: cat});
    }

    @autobind
    save(e){
        const cat = this.state.category;
        if(cat){
            const category = find(this.props.category_store.categories, {_id: cat})
            this.props.dispatch(ADD_INST_CATEGORY(this.props.params.id, {cat_id: cat, cat_name: category.name})).then(
                doc => this.props.dispatch(TOAST('Saved.')),
                e => this.props.dispatch(TOAST(e))
            )
        }
    }

    render() {
        return (
            <div>
                <p>Select categories to to list in:</p>
                <select value={this.state.category} onChange={e => this.SelectCategory(e.target.value)}>
                    <option value="">Select</option>
                    {this.props.category_store.categories.map(i => {
                        return (
                            <option value={i._id}>{i.name}</option>
                        )
                    })}
                </select>
                <button onClick={this.save}>Save</button>
            </div>
        )

    }
}