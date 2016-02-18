/**
 * Created by amitava on 18/02/16.
 */
import React from 'react';
import {reduxForm} from 'redux-form';
import {SEND_MAIL, TOAST} from '../../actions/misc';
import autobind from 'autobind-decorator';

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
        return this.props.dispatch(SEND_MAIL(data)).then(
            r => {
                this.props.resetForm();
                this.props.dispatch(TOAST('Thank you! Your message has been sent.'));

            },
            e => {
                this.props.dispatch(TOAST(e));
            }
        )
    }

    render(){
        const {fields: {name, email, telephone, message}, error, handleSubmit, submitting} = this.props;
        return (
            <div className="contact-page">
                <p className="lead">
                    Want to partner with us or have a feedback? Please get in touch, we'd love to hear from you.
                </p>
                <div className="grid row">
                    <div className="cell">
                        <p className="lead">
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
                    <div className="cell">
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
        )
    }
}