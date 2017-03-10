/**
 * This gulpfile is to demonstrate the capability of the configon
 */
var gulp = require('gulp');
var EnvConfig = require('../src/index.js');

const config = new EnvConfig( './example/config/config.@@ENV.json' )
            .addTemplate( './example/config/template.ts', './bin/config.ts' )//adding template 1
            .addTemplate( './example/config/template-config.xml', './bin/config.xml' )//adding template 2
            .addTemplate( './example/some.file', './bin/some.file' )//adding template 3
            .removeTemplate( './example/some.file' );//removing template 3

/**
 * Testing environment based config example
 */
gulp.task('config', function() {
    
    var env = 'dev';
    config.build( env );
    
});
