/**
 * This gulpfile is to demonstrate the capability of the configon
 */
var gulp = require('gulp');
var EnvConfig = require('../src/index.js');

const ARG_ENVIRONMENT_FLAG = '--env';
const ARG_DELIMITER = ':';
const ARG_IP_FLAG = '--ip';

const config = new EnvConfig( './example/config/config.@@ENV.json' )
            .addTemplate( './example/config/template.ts', './bin/config.ts' )//adding template 1
            .addTemplate( './example/config/template-config.xml', './bin/config.xml' )//adding template 2
            .addTemplate( './example/some.file', './bin/some.file' )//adding template 3
            .removeTemplate( './example/some.file' );//removing template 3

/**
 * Testing environment based config example
 * Example commands
 * gulp config --env:dev - sets custom environment
 * gulp config --ip:192.168.0.45 - sets custom ip
 */
gulp.task('config', function() {
    
    //retrieving env, default env is dev
    var env = getArgumentValue( ARG_ENVIRONMENT_FLAG ) || 'dev';
    //retrieving custom ipaddress
    var ipaddress = getArgumentValue( ARG_IP_FLAG );

    config.build( env, ipaddress );
});


/**
 * This function retrieves the value passed with argument flags separated with
 * {@link ARG_DELIMITER}
 * @param argumentFlag  Flagged argument name
 * eg. gulp config --env:dev
 * "--env" is the flag return "dev"
 */
function getArgumentValue( argumentFlag ) {
    //Retriving args passed while running the command
    var argumentsFromCli = process.argv;
    var value;
    argumentsFromCli.forEach( function ( argument ) {
        if ( argument.includes( argumentFlag ) ) {
            value = argument.split( ARG_DELIMITER )[1];
        }
    }, this );

    return value;
}
