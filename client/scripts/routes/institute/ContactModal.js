/**
 * Created by amitava on 06/03/16.
 */
import React from 'react';
import {Modal, Button} from 'react-bootstrap';
import autobind from 'autobind-decorator';
import {goBack} from 'react-router-redux';
import find from 'lodash/find';
import {reduxForm} from 'redux-form';
import Input from '../../components/PureInput';
import Textarea from '../../components/Textarea';
import {createValidator, required, email, integer, minLength, maxLength} from '../../utils/validator';

import {sendQuery} from '../../redux/modules/institute';
import {createToast} from '../../redux/modules/toast';

const formValidator = createValidator({
    name: required,
    email: [required, email],
    phone: [required, integer, minLength(10), maxLength(10)],
    message: [required, minLength(10)]
});

@reduxForm({
    form: 'contact_institute',
    fields: ['name', 'email', 'phone', 'message'],
    validate: formValidator
}, state => {
    return {
        institute_store: state.institute_store
    }
})
export default class ContactModal extends React.Component{

    constructor(...args){
        super(...args);
        this.state = {
            success: false
        };
    }

    @autobind
    sumbitForm(data){
        return this.props.dispatch(sendQuery(this.props.params.id, data)).then(
            s => {
                this.setState({success: true});
                this.props.resetForm();
            },
            e => this.props.dispatch(createToast(e))
        )
    }

    @autobind
    close(){
        this.props.dispatch(goBack());
    }

    render(){
        const {fields: {name, email, phone, message}, error, handleSubmit, submitting, params, institute_store} = this.props;

        const inst = institute_store.entities[params.id] || find(institute_store.entities, {url_slug: params.id});

        return (
            <Modal show={true} onHide={this.close} autoFocus={true}>
                <Modal.Header closeButton>
                    <Modal.Title>Contact {inst.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div  className="col-xs-12">
                            {this.state.success ? (
                                <div className="alert alert-success">
                                    <strong>Thank you!</strong> Your query has been submitted.
                                </div>
                            ) : (
                                <div>
                                    <p className="text-subhead">
                                        We will send your query to the institute. Institute will get back to you to answer your questions.
                                    </p>
                                    <form onSubmit={handleSubmit(this.sumbitForm)}>
                                        <Input field={name} placeholder="Your name" />
                                        <Input field={email} type="email" placeholder="Your email address" />
                                        <Input field={phone} placeholder="Your mobile number" />
                                        <Textarea field={message} label="Enter your questions" rows="5" />
                                        <Button bsStyle="primary" type="submit" disabled={submitting}>Send</Button>
                                    </form>
                                </div>
                            )}


                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        )
    }
}