/**
 * Created by amitava on 10/02/16.
 */
import React from 'react';
import {connect} from 'react-redux';
import Promise from 'bluebird';

import each from 'lodash/each';
import reduce from 'lodash/reduce';

export const PENDING = 'PENDING';
export const COMPLETED = 'COMPLETED';
export const FAILED = 'FAILED';

/**
 * @param object
 * @param required = false
 * @param key string: unique key
 * @param watch function: watch fn that evaluates. returns value to compare for change
 * @param handle function: function to exec on watch change
 */

@connect(state => state)
export default function middleware(options) {
    return function (Component) {
        return class WrappedComponent extends React.Component {

            static displayName = Component.displayName;

            constructor(props, ctx){
                super(props, ctx);

                this.state = {
                    value: {}
                };



            }

            componentWillMount(){
                each(options, i => {
                    this.setState({[i.key]: PENDING});
                });

                Promise.reduce(options, (memo, i) => {
                    return i.handler(this.props, i.watch(this.props)).then(
                        r => {
                            console.log(i.key, r.payload)
                            this.setState({
                                [i.key]: COMPLETED,
                                value: {
                                    [i.key]: r.payload
                                }
                            });
                        },
                        e => this.setState({[i.key]: FAILED})
                    )
                }, []).then(
                    res => console.log(res),
                    e => console.log(e)
                )
            }

            load(){
                each(options)
            }

            componentDidMount(){

            }

            componentWillReceiveProps(nextProps) {

            }

            componentWillUnmount(){

            }

            fetch(key){
                return this.state.value[key];
            }

            render() {
                return <Component />
            }
        }
    }
}