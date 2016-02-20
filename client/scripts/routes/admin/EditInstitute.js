/**
 * Created by amitava on 18/02/16.
 */
import React from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import {reduxForm} from 'redux-form';

import Input from '../../components/PureInput';
import Select from '../../components/Select';
import Textarea from '../../components/Textarea';

import {loadInstitutes} from '../../redux/modules/institute';

@connect(state => state)
@reduxForm({
    form: 'inst_edit',
    fields: ['name']
})
export default class EditInstitute extends React.Component{

    constructor(props, ctx){
        super(props, ctx);

        this.state = {}
    }
    componentDidMount(){
        this.props.dispatch(loadInstitutes(this.props.params.id)).then(
            r => {
                this.setState({institute: r});
            }
        )
    }

    render(){

        if(!this.state.institute) return <h5>Loading...</h5>;

        const inst = this.state.institute;

        return (
            <div className="grid">
                <div className="cell grid column">
                    <Link to={`/admin/institute/manage/${this.props.params.id}/categories`}>Edit Categories</Link>
                    <Link to={`/admin/institute/manage/${this.props.params.id}/courses`}>Edit Courses</Link>
                    <Link to={`/admin/institute/manage/${this.props.params.id}/subjects`}>Edit Subjects</Link>
                </div>
                <div className="cell">
                    <div className="control-group">
                        <Input type="text" value={inst.name} label="Name"/>
                        <Textarea value={inst.description} label="Description" />
                        <label>Address</label>
                        <Input type="text" value={inst.address.line1}/>
                        <Input type="text" value={inst.address.line2}/>
                        <Input type="text" value={inst.address.locality}/>
                        <Input type="text" value={inst.address.loc[0]}/>
                        <Input type="text" value={inst.address.loc[1]}/>

                        <Input type="text" value={inst.website} label="Website"/>
                        <Input type="text" value={inst.email} label="Email"/>


                    </div>
                </div>
                <div className="cell">
                    {this.props.children}
                </div>
            </div>
        )
    }
}