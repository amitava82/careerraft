/**
 * Created by amitava on 10/02/16.
 */
import React from 'react';
import {connect} from 'react-redux';
import Promise from 'bluebird';
import autobind from 'autobind-decorator';

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

            static displayName = 'WrappedMiddleware-'+Component.displayName;

            constructor(props, ctx){
                super(props, ctx);

                this.state = {
                    pendingCount: options.length,
                    queue: []
                };

                this.values = {}
            }

            componentDidMount(){

                const requests = options.reverse();

                this.load(options, this.props).then(
                    r => console.log('final resp', r),
                    e => console.log('final error ', e)
                );

                //Promise.reduce(options, (memo, i) => {
                //    return i.handler(this.props, i.watch(this.props)).then(
                //        r => {
                //            console.log(i.key, r.payload)
                //            this.setState({
                //                [i.key]: COMPLETED,
                //                value: {
                //                    [i.key]: r.payload
                //                }
                //            });
                //        },
                //        e => this.setState({[i.key]: FAILED})
                //    )
                //}, []).then(
                //    res => console.log(res),
                //    e => console.log(e)
                //)
            }

            load(requests, props){
                return Promise.reduce(requests, (values, req) =>{
                    const key = req.key;

                    if(this.state[key] == PENDING) return Promise.resolve();

                    console.log('requesting: ', key)

                    this.setState({[key]: PENDING});

                    this.values[key] = undefined;

                    var p = req.handler(props, req.watch(props));

                    return p.then(
                        v => {
                            console.log('done: ', key)
                            values.push(v);
                            this.setState({[key]: COMPLETED});
                            this.values[key] = v;
                        },
                        e => {
                            console.log('error: ', key)
                            this.setState({[key]: FAILED});
                        }
                    ).return(values)

                }, []);
            }

            componentWillReceiveProps(nextProps) {

                var newOptions = []
                options.forEach(o => {
                    const watch = o.watch;
                    if(watch(nextProps) !== watch(this.props)) newOptions.push(o);
                });

                this.load(newOptions, nextProps);
            }

            componentWillUnmount(){

            }

            @autobind
            fetch(key){
                return this.values[key];
            }

            render() {
                return <Component {...this.props} {...this.state} fetch={this.fetch} />
            }
        }
    }
}