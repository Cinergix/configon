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
 */
gulp.task('config', function() {
    
    var env = 'dev';
    config.build( env );
    
});
