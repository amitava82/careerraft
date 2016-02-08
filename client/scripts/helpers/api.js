/**
 * Created by amitava on 06/02/16.
 */
import superagent from 'superagent-bluebird-promise';
import { stringify } from 'qs'
const methods = ['get', 'post', 'put', 'patch', 'del'];

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
            this[method] = (path, params, data) => {
                const request = superagent[method](formatUrl(path));

                if (params) {
                    request.query(stringify(params, { arrayFormat: 'brackets' }));
                }

                if (typeof window === 'undefined' && req && req.get('cookie')) {
                    request.set('cookie', req.get('cookie'));
                }

                if (data) {
                    request.send(data);
                }
                return request.promise().get('body');
            });
    }
}

const ApiClient = _ApiClient;

export default ApiClient;