/**
 * Created by amitava on 06/02/16.
 */
import superagent from 'superagent';
import {normalize, arrayOf} from 'normalizr';
import isArray from 'lodash/isArray';

import { stringify } from 'qs'
const methods = ['get', 'post', 'put', 'patch', 'del'];
const Promise = require('bluebird');

Promise.config({
    // Enable cancellation.
    cancellation: true
});

class _ApiClient {
    constructor(req, config) {
        function formatUrl(path) {
            const adjustedPath = path[0] !== '/' ? '/' + path : path;
            if (typeof window === 'undefined') {
                // Prepend host and port of the API server to the path.
                return 'http://' + config.get('api.host') + ':' + config.get('api.port') + adjustedPath;
            }
            // Prepend `/api` to relative URL, to proxy to API server.
            return '/api' + adjustedPath;
        }
        methods.forEach((method) =>
            this[method] = (path, {params, data, schema} = {}) => new Promise((resolve,reject,onCancel) => {
                const request = superagent[method](formatUrl(path));

                if(method != 'get' && !data){
                    data = params;
                    params = null;
                }

                if (params) {
                    params._ = new Date().getTime();
                    request.query(stringify(params, { arrayFormat: 'brackets' }));
                }

                if (typeof window === 'undefined' && req && req.get('cookie')) {
                    request.set('cookie', req.get('cookie'));
                }

                if (data) {
                    request.send(data);
                }
                request.end((err, {body} = {}) => {
                    if(err){
                        reject(body || err);
                    }else {
                        if(schema){
                            resolve(normalize(body, schema));
                        }else{
                            resolve(body);
                        }
                    }
                });

                onCancel(() => request.abort());

            }));
    }
}

const ApiClient = _ApiClient;

export default ApiClient;