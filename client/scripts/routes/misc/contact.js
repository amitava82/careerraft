/**
 * Created by amitava on 18/02/16.
 */
import React from 'react';
import {reduxForm} from 'redux-form';
import {sendMail} from '../../redux/modules/misc';
import {createToast} from '../../redux/modules/toast';
import autobind from 'autobind-decorator';
import Helmet from 'react-helmet';

const validate = values => {
    const errors = {};
    if (!values.name) {
        errors.name = 'Name is required';
    }
    if (!values.email) {
        errors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'Invalid email address';
    }
    if (!values.telephone) {
        errors.telephone = 'Telephone is required';
    } else if (isNaN(Number(values.telephone))) {
        errors.telephone = 'Must be a number';
    }
    if(!values.message){
        errors.message = 'Message is required.';
    }
    return errors;
};


@reduxForm({
    form: 'contact_form',
    fields: ['name', 'email', 'telephone', 'message'],
    validate: validate
}, state => state.dispatch)
export default class Contact extends React.Component {

    constructor(props, ctx){
        super(props, ctx);
        this.state = {}
    }

    @autobind
    sendMail(data){
        return this.props.dispatch(sendMail(data)).then(
            r => {
                this.props.resetForm();
                this.props.dispatch(createToast('Thank you! Your message has been sent.'));

            },
            e => {
                this.props.dispatch(createToast(e));
            }
        )
    }

    render(){
        const {fields: {name, email, telephone, message}, error, handleSubmit, submitting} = this.props;
        return (
            <div className="contact-page">
                <Helmet title="Careerraft :: Contact us" />
                <div className="hero-unit">
                    <div className="page-inner grid">
                        <div className="cell-span-7">
                            <h3 className="text-display-2">Connect</h3>
                        </div>
                        <div className="cell-span-3"></div>
                    </div>
                </div>
                <div className="content-body">
                    <div className="page-inner">
                        <div className="grid m-bl">
                            <p className="text-subhead">Want to partner with us or have a feedback? Please get in touch, we'd love to hear from you.</p>
                        </div>
                        <div className="grid row">
                            <div className="cell-span-6">
                                <p className="text-headline">
                                    VISIT OUR OFFICE
                                </p>
                                <p>
                                    <strong><i className="fa fa-map-marker"></i> Address:</strong> 100 Ft Road, Indiranagar, Bangalore
                                </p>
                                <p>
                                    <strong><i className="fa fa-phone"></i> Telephone:</strong> +91-8147267399
                                </p>
                                <p>
                                    <strong><i className="fa fa-envelope-o"></i> Email:</strong> <a href="mailto:aloha@careerraft.com">aloha@careerraft.com</a>
                                </p>
                            </div>
                            <div className="cell-span-6">
                                <form onSubmit={handleSubmit(this.sendMail)}>
                                    <div className="control-group">
                                        <label>
                                            YOUR NAME:
                                        </label>
                                        <input {...name} className="form-control" type="text"/>
                                        {name.touched && name.error && <div className="text-error">{name.error}</div>}
                                    </div>
                                    <div className="control-group">
                                        <label>YOUR EMAIL ADDRESS</label>
                                        <input {...email} className="form-control" type="email"/>
                                        {email.touched && email.error && <div className="text-error">{email.error}</div>}
                                    </div>
                                    <div className="control-group">
                                        <label>YOUR PHONE NUMBER</label>
                                        <input {...telephone} className="form-control" type="text"/>
                                        {telephone.touched && telephone.error && <div className="text-error">{telephone.error}</div>}
                                    </div>
                                    <div className="control-group">
                                        <label>MESSAGE</label>
                                        <textarea {...message} value={message.value || ''} />
                                        {message.touched && message.error && <div className="text-error">{message.error}</div>}
                                    </div>
                                    <div className="control-group">
                                        <button disabled={submitting} type="submit">SUBMIT</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}