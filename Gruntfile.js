var spawn = require('child_process').spawn;

module.exports = function(grunt){
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        sass: {
            options: {
                includePaths: [
                    "build/public/lib/normalize-scss/sass",
                    "build/public/lib/support-for/sass",
                    "build/public/lib/font-awesome/scss"
                ],
                sourceMap: process.env.NODE_ENV !== 'production',
                outputStyle: 'compressed'
            },

            dev: {
                files: {
                    "build/public/css/client.css": "client/scss/import.scss"
                }
            }
        },
        postcss: {
            options: {
                map: true, // inline sourcemaps
                processors: [
                    //require('pixrem')(), // add fallbacks for rem units
                    require('autoprefixer')({browsers: 'last 3 versions'}), // add vendor prefixes
                    //require('cssnano')() // minify the result
                ]
            },
            dist: {
                src: 'build/public/css/client.css'
            }
        }
    });

    grunt.registerTask('webpack', 'Build webpack', function(){
        spawn('webpack -p');
    });

    grunt.registerTask('css', ['sass', 'postcss']);
    grunt.registerTask('prod', ['css', 'webpack'])

};