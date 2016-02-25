/**
 * Created by amitava on 25/02/16.
 */
import React from 'react';
import {connect} from 'react-redux';
import {push} from 'react-router-redux';

@connect(state => state)
export default function Pagination(options){

    return function (Component){
        return class WrappedComponent extends React.Component {

            static displayName = 'Paginate_'+Component.displayName;

            constructor(props, ctx){
                super(props, ctx);
            }

            hasNext(){
                const {page} = this.props.location.query;
            }

            hasPrevious(){

            }

            isFirst(){

            }

            next(){

            }

            previous(){

            }

            render(){
                return (
                    <Component />
                )
            }
        }
    }
}