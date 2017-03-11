/**
 * This gulpfile is to demonstrate the capability of the configon
 */
var gulp = require('gulp');
var EnvConfig = require('configon');

const config = new EnvConfig( './config/config.@@ENV.json' )
            .addTemplate( './config/template.ts', './bin/config.ts' )//adding template 1
            .addTemplate( './config/template-config.xml', './bin/config.xml' )//adding template 2
            .addTemplate( './example/some.file', './bin/some.file' )//adding template 3
            .removeTemplate( './example/some.file' );//removing template 3

/**
 * Testing environment based config example
 * Example commands
 * gulp config --env:dev - sets custom environment
 * gulp config --ip:192.168.0.45 - sets custom ip
 * 
 * or TRY setting environment variable
 *  ( SET | export ) NODE_ENV=dev 
 */
gulp.task('config', function() {
    
    var defaultEnv = 'dev';
    config.build( defaultEnv );
    
});
