/**
 * Created by amitava on 07/03/16.
 */
import React from 'react';
import {connect} from 'react-redux';
import Helmet from 'react-helmet';
import {reduxForm} from 'redux-form';
import autobind from 'autobind-decorator';
import {Modal, Button} from 'react-bootstrap';
import {goBack, push} from 'react-router-redux';
import {Link} from 'react-router';
import get from 'lodash/get';

import Input from './PureInput';
import {createValidator, required, email, minLength} from '../utils/validator';
import { signup, login, resetPassword, closeLogin } from '../redux/modules/session';
import {loadSavedList} from '../redux/modules/user';
import {createToast} from '../redux/modules/toast';

const loginValidator = createValidator({
    email: required,
    password: required
});

const signupValidator = createValidator({
    email: [email, required],
    password: [required, minLength(5)],
    name: required
});

@connect(state => state)
export default class LoginModal extends React.Component {

    constructor(props, ctx){

        super(props, ctx);
        const params = props.params;

        this.state = {
            login: params.mode == 'l',
            signup: params.mode == 's'
        }
    }

    @autobind
    close() {
        this.props.dispatch(closeLogin());
    }

    @autobind
    login(data){
        return this.props.dispatch(login(data.email, data.password)).then(
            r => {
                this.props.dispatch(loadSavedList());
                this.props.dispatch(closeLogin());
                this.props.dispatch(createToast({text: 'You have been successfully logged in!', type: 'success'}));
            }
        )
    }

    @autobind
    signup(data){
        return this.props.dispatch(signup(data)).then(
            r => this.setState({success: true, login: false, signup: false, message: 'We have sent your a confirmation email. Please check your inbox.'})
        )
    }

    @autobind
    resetPassword(data){
        return this.props.dispatch(resetPassword(data.email)).then(
            r => this.setState({success: true, login: false, signup: false, message: 'We have sent you password reset instruction to your registered email address.'})
        )
    }

    @autobind
    toggleSignup(){
        this.setState({signup: true, login: false});
    }

    @autobind
    toggleLogin(){
        this.setState({signup: false, login: true});
    }

    @autobind
    reset(){
        this.setState({signup: false, login: false});
    }

    render() {

        const {session_store} = this.props;
        let content = null;

        if(this.state.login){
            content = (
                <div className="row m-bl">
                    <LoginForm onSubmit={this.login} cancel={this.reset} resetPassword={this.resetPassword} />
                </div>
            )
        }else if(this.state.signup){
            content = (
                <div className="row m-bl">
                    <SignupForm onSubmit={this.signup} cancel={this.reset} />
                </div>
            )
        }else if(this.state.success){
            content = (
                <div className="row m-bl">
                    <div className="col-xs-12">
                        <p className="text-title">Thank you!</p>
                        <p>{this.state.message}</p>
                    </div>
                </div>
            )
        }else {
            const msg = session_store.loginMessage;
            const returnPath = get(this.props.session_store, 'previousLocation.pathname', '');
            content = (
                <div className="row m-bl">
                    <Helmet title="Careerraft - Login" />
                    <div className="col-xs-12">
                        {msg ? (
                            <div className="alert alert-info sm">
                                {msg}
                            </div>
                        ): null}
                        <a href={`/auth/login/facebook?return=${returnPath}`} className="social fb m-bm">
                            <div className="icon-f"><i className="fa fa-facebook"></i></div>
                            <div>LOGIN WITH FACEBOOK</div>
                        </a>
                        <p className="text-subhead text-center m-bl">One click Login. We will never post anything without your permission.</p>
                        <a href={`/auth/login/google?return=${returnPath}`} className="social google m-bl">
                            <div className="icon-g"><i className="fa fa-google"></i></div>
                            <div>LOGIN WITH GOOGLE</div>
                        </a>
                        <p className="text-subhead text-center">Or use your email address</p>
                    </div>
                    <div className="col-xs-6 text-center">
                        <Button bsSize="xsmall" onClick={this.toggleLogin}>LOG IN</Button>
                    </div>
                    <div className="col-xs-6 text-center m-bl">
                        <Button bsSize="xsmall" onClick={this.toggleSignup}>SIGN UP</Button>
                    </div>
                </div>
            )
        }

        return (
            <Modal show={true} onHide={this.close} dialogClassName="login-modal" bsSize="sm">
                <Modal.Header closeButton>
                    <Modal.Title>LOG IN TO CAREERRAFT</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {session_store.error && <div className="alert alert-danger sm">{session_store.error.message}</div>}
                    {content}
                    <div className="row">
                        <div className="col-xs-12">
                            <p className="sm">
                                By logging in, you agree to Careerraft's <a href="/terms">Terms of Service</a>, and <a href="/privacy">Privacy Policy</a>.
                            </p>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        )
    }
}

@reduxForm({
    form: 'reset_form',
    fields: ['email'],
    validate: createValidator({email: required})
})
class ResetForm extends React.Component{

    render(){
        const {fields: {email}, handleSubmit, submitting, cancel} = this.props;
        return (
            <form onSubmit={handleSubmit}>
                <p>Please enter your email address</p>
                <Input type="email" field={email} placeholder="Your email address"/>
                <Button disabled={submitting} bsStyle="primary" type="submit">Reset password</Button>
                <button type="button" className="btn btn-link btn-sm" onClick={cancel}>Back</button>
            </form>
        )
    }
}

@reduxForm({
    form: 'login_form',
    fields: ['email', 'password'],
    validate: loginValidator
})
class LoginForm extends React.Component{

    constructor(props, ctx){
        super(props, ctx);
        this.state = {
            reset: false
        }
    }

    @autobind
    toggleResetForm(){
        this.setState({reset: !this.state.reset});
    }

    render(){
        const {fields: {email, password}, handleSubmit, submitting, cancel, resetPassword} = this.props;
        let content = null;

        if(this.state.reset){
            content = <ResetForm onSubmit={resetPassword} cancel={this.toggleResetForm} />
        }else {
            content = (
                <form onSubmit={handleSubmit}>
                    <Input type="email" field={email} placeholder="Your email address"/>
                    <Input type="password" field={password} placeholder="Your password"/>
                    <Button disabled={submitting} bsStyle="primary" type="submit">Login</Button>
                    <button type="button" className="btn btn-link btn-sm" onClick={cancel}>Back</button>
                    <button onClick={this.toggleResetForm} type="button" className="btn btn-link btn-sm pull-right">Reset password</button>
                </form>
            )
        }

        return (
            <div className="col-xs-12">
                <Helmet title="Careerraft - Login" />
                {content}
            </div>
        )
    }
}

@reduxForm({
    form: 'signup_form',
    fields: ['email', 'password', 'name'],
    validate: signupValidator
})
class SignupForm extends React.Component{

    render(){
        const {fields: {email, password, name}, handleSubmit, submitting, cancel} = this.props;

        return (
            <div className="col-xs-12">
                <Helmet title="Careerraft - Signup" />
                <form onSubmit={handleSubmit}>
                    <p className="text-subhead">Signup for an account. It takes less than a minute!</p>
                    <Input type="text" field={name} placeholder="Your full name"/>
                    <Input type="email" field={email} placeholder="Your email address"/>
                    <Input type="password" field={password} placeholder="Enter a tricky password"/>
                    <Button disabled={submitting} bsStyle="primary" type="submit">Sign up</Button>
                    <button type="button" className="btn btn-link btn-sm" onClick={cancel}>Back</button>
                </form>
            </div>
        )
    }
}