/**
 * Created by amitava on 10/04/16.
 */
import React from 'react';
import {Button} from 'react-bootstrap';

import Input from '../../components/PureInput';

export default class CreateProfile extends React.Component{

    render(){

        return (
            <div className="container content-body">
                <h3>Sign up for careerraft profile</h3>
                <div className="row">
                    <div className="col-xs-12">
                        <Input type="text" field={name} placeholder="Your full name"/>
                        <Input type="email" field={email} placeholder="Your email address"/>
                        <Input type="password" field={password} placeholder="Enter a tricky password"/>
                        <Button disabled={submitting} bsStyle="primary" type="submit">Sign up</Button>
                    </div>
                </div>
            </div>
        )
    }
}