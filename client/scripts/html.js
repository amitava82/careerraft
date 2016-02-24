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
    <html>
        <head>
            ${title}
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="keywords" content="${KEYWORDS}" />
            <meta name="description" content="Careerraft is an education site, providing learners with everything they need to find the right match. Through unbiased data and real-world advice, Careerraft connects students with Institutes, programs, resources, experts and more. Careerraft is the best way to discover and compare educational opportunities at any stage of learning." />
            <meta name="author" content="Careerraft" />
            <meta name="copyright" content="(c) 2016 Careerraft Inc." />
            <link href='https://fonts.googleapis.com/css?family=Raleway:400,700,500' rel='stylesheet' type='text/css'>
            <link href='/static/css/client.css' rel='stylesheet' type='text/css'>
            <script type="application/javascript">
              window.__INITIAL_STATE__ = ${JSON.stringify(initialState)};
            </script>
            <script src="https://maps.googleapis.com/maps/api/js?key=${config.get('google.browser')}&libraries=places&types=geocode"></script>
        </head>
        <body>
            <div id="app-root">${markup}</div>
            <script src="/static/vendor.js" type="text/javascript"></script>
            <script src="/static/bundle.js" type="text/javascript"></script>
            <script async src='https://www.google-analytics.com/analytics.js'></script>
        </body>
    </html>
    `
    )
}