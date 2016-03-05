/**
 * Created by amitava on 31/01/16.
 */
var config = require('config');
import {KEYWORDS} from './constants';
export default function html(markup, initialState, helmet){
    const title = helmet.title.toString() || 'Careerraft';
    return (
        `
    <!DOCTYPE html>
    <html lang="en">
        <head>
            ${title}
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="keywords" content="${KEYWORDS}">
            ${helmet.meta.toString()}
            <meta name="description" content="Careerraft is an education site, providing learners with everything they need to find the right match. Through unbiased data and real-world advice, Careerraft connects students with Institutes, programs, resources, experts and more. Careerraft is the best way to discover and compare educational opportunities at any stage of learning.">
            <meta name="author" content="Careerraft">
            <meta name="copyright" content="(c) 2016 Careerraft Inc.">
            <meta name="google-site-verification" content="crKFLzwTjXhbwYDN0a6swogBz2mgXyZSPAu60iwd4rc">
            <link href='/static/css/client${process.env.NODE_ENV == 'production' ? '.min' : ''}.css' rel='stylesheet' type='text/css'>
            <script type="application/javascript">
              window.__INITIAL_STATE__ = ${initialState};
            </script>

        </head>
        <body>
            <div id="app-root">${markup}</div>
            <link href='https://fonts.googleapis.com/css?family=Raleway:400,700,500,900' rel='stylesheet' type='text/css'>
            <script src="https://maps.googleapis.com/maps/api/js?key=${config.get('google.browser')}&libraries=places&types=geocode"></script>
            <script src="/static/vendor.js" type="text/javascript"></script>
            <script src="/static/bundle.js" type="text/javascript"></script>
            <script async src='https://www.google-analytics.com/analytics.js'></script>
        </body>
    </html>
    `
    )
}