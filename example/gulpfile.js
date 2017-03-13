/**
 * This gulpfile is to demonstrate the capability of the configon
 */
var gulp = require( 'gulp' );
var EnvConfig = require( '../src/index.js' );

const config = new EnvConfig( './example/config/config.@@ENV.json' )
            .addTemplate( './example/config/template.ts', './app/config.ts' )//adding template 1
            .addTemplate( './example/config/template-config.xml', './config.xml' );//adding template 2


/**
 * Sample task that builds the application
 * Sample  commands to change environment
 * gulp build --env:production - sets the environment
 * gulp build --ip:192.168.0.45 - sets the IP Address
 * 
 * Alternatively
 *  ( SET | export ) NODE_ENV=production
 *  gulp build
 */
gulp.task('build', ['config'],  function() {
    //....
    //App building code
    //....
});


/**
 * Sample task that applies the configuration
 */
gulp.task('config', function() {
    config.build( 'development' );
});
