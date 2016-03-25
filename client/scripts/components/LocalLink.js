/**
 * Created by amitava on 24/03/16.
 */
import React from 'react';
import {Link} from 'react-router';


export default class LocalLink extends React.Component{
    render(){
        const {params, to, ...rest} = this.props;
        const _to = '/' + params.city + to;
        return (
          <Link to={_to} {...rest} />
        );
    }
}