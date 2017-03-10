var fs = require( 'fs' ); //file system
var gulp = require( 'gulp' ); //Gulp itself
var gutil = require( 'gulp-util' );//Gulp utils
var replace = require( 'gulp-replace-task' );//gulp plugin replace data in a file
var rename = require( 'gulp-rename' );//rename files
var myip = require( 'quick-local-ip' );

/**
 * This consists functionalities related configuration management for application with 
 * multiple environment. It utilizes gulp to achieve the task
 * 
 * @param   {String} configFilePattern The string pattern which identifies the files 
 *          of configuration for specific environment. 
 *          E.g. ` ./config/config.@@ENV.json ` 
 *          would be 
 *               ./config/config.dev.json for `dev`  environment
 *               ./config/config.prod.json for `prod` environment
 */
var EnvConfig = function ( configFilePattern ) {

    const ARG_ENVIRONMENT_FLAG = '--env';
    const ARG_DELIMITER = ':';
    const ARG_IP_FLAG = '--ip';

    /**
     * This variable holds default environment for configuration
     * it will be used if any environment is not passed
     */
    var defaultEnvironment = 'dev';
    
    /**
     * This is key which is used to identify environment name
     * index from the configuration file pattern.
     */
    var KEY_ENV = '@@ENV';

    /**
     * This variable {Array} consisting of objects wih templates and the respective output destination
     * which needs configurations to be applied 
     * E.g. [ { template: './conf-template.js', dest: './conf.js' }] 
     */
    var templates;

    /**
     * This function reads a json file and return an Object
     * @param {String} fileName
     * @returns Object
     */
    function readJSON( fileName ) {
        if( fileName ) {
            return JSON.parse( fs.readFileSync( fileName, 'utf8' ) );
        }
        return undefined;
    }

    /**
     * This function reads a configuration json file and return an Object
     * @param {String} env
     * @returns Object
     */
    function readConfig( env ) {
        try {
            var path = getConfigFilePath( env );
            return readJSON( path );
        } catch ( err ){
            gutil.log( gutil.colors.red( '=> Could find file for `' + env + '` environment!' ) );
        }
        return undefined;
    }

    /**
     * This functions give the respected path of a config file for a given environment
     * @param {String} env
     * @returns {String} File path for configuration file
     */
    function getConfigFilePath( env ){
        var filePath = undefined;
        if( validateConfigFilePattern() && typeof env === 'string' ) {
            var pathArray = configFilePattern.split( KEY_ENV );
            if( pathArray && pathArray.length == 2 ) {
                filePath = pathArray[0] + env + pathArray[1];
            }
        } else {
             gutil.log( gutil.colors.red( '=> Invalid path pattern for config file or invalid environment.' ) );
        }
        return filePath;
    }

    /**
     * This function checks the pattern of config file is valid
     * @returns boolean True if it matches the expected pattern
     */
    function validateConfigFilePattern() {
        var pattern = /^\.\/([a-zA-Z_\-0-9.\/]+)+@@ENV.*?\.json$/;
        return ( configFilePattern && pattern.test( configFilePattern ) );
    }

    /**
     * This function generates the files after applying all configuration
     * @param patterns Replacement patterns
     */
    function generateConfiguredFiles( patterns ) {
        if ( templates && templates.length > 0 ) {
            templates.forEach( function ( templateObj ) {
                var templateFile = templateObj.template.trim();
                var templateOutput = templateObj.dest.trim();
                var index = templateOutput.lastIndexOf( '/' );//index where filename starts 
                var dest = templateOutput.substring( 0, index );//targeted destination of the file
                var fileName = templateOutput.substring( index + 1 );
                gulp.src( templateFile )
                    .pipe( replace( { patterns : patterns } ) )
                    .pipe( rename( fileName ) )
                    .pipe( gulp.dest( dest ) );

            }, this );
        } else {
            gutil.log( gutil.colors.red( '=> Templates missing. Please add a template.' ) );
        }
    }

    /**
     * This function retrieves the current environment from arguments 
     * or from node environment
     * @returns {String} environment name
     */
    function getCurrentEnvironment() {
        //Retrieving env from NODE_ENV if retrieving from arguments fail
        return getArgumentValue( ARG_ENVIRONMENT_FLAG ) || process.env.NODE_ENV;
    }

    /**
     * This function retrieves the value passed with argument flags separated with
     * {@link ARG_DELIMITER}
     * @param argumentFlag  Flagged argument name
     * eg.  gulp config --env:dev
     *          "--env" is the flag return "dev"
     * @returns {String} Respective value for the argument flag passed
     */
    function getArgumentValue( argumentFlag ) {
        var value = undefined;
        if( process && process.argv ){
            //Retreiving args passed while running the command
            var argumentsPassed = process.argv;
            argumentsPassed.forEach( function ( argument ) {
                if ( argument.includes( argumentFlag ) ) {
                    value = argument.split( ARG_DELIMITER )[1];
                }
            }, this );
        } else {
            gutil.log( gutil.colors.red( '=> Could not access parameters passed while running the command.' ) );
        }
        return value;
    }
    
    /**
     * This object holds the publicly exposed functions of this class
     */
    var configon =  {
        
        /**
         * This method add details of template file and output location into the template map 
         */
        addTemplate: function ( templateFile, outputFile ) {
            if( !templates ) {
                templates = [];
            }
            templates.push( { 'template' :  templateFile,  'dest' : outputFile } );
            return configon;
        },

        /**
         * This method remove details of template file from the template map 
         */
        removeTemplate: function ( templateFile ) {
            if( templates ){
                templates = templates.filter( function( obj ) {
                    return obj.template !== templateFile;
                });
            }
            return configon;
        },

        /**
         * This function builds the config and apply all the changes to templates and export them in 
         * to the required location
         * @param environment Environment name 
         */
        build: function ( environment = undefined, ipAddress = undefined ) {
            gutil.log( gutil.colors.green( 'Looking for environment configuration...' ) );
            
            var env = getCurrentEnvironment() || environment || defaultEnvironment;
            //This function retrieves the ip Address from arguments or picks from the system
            ipAddress = getArgumentValue( ARG_IP_FLAG ) || ipAddress || myip.getLocalIP4() || 'localhost';

            // (1) Load Environment configuration 
            var config = readConfig( env );
            
            // (2) validate the environment:
            if (!config) {
                gutil.log( gutil.colors.red( '=> Could not load `' + env + '` environment!' ) );
            } else {
                gutil.log( gutil.colors.green( 'Loading `' + env + '` environment...') );

                // (3) Add additional (dynamic) constants.
                var packageJson = readJSON( './package.json' );;
                config['APP_NAME'] = packageJson.name;
                config['VERSION'] = packageJson.version;
                config['BUILD_DATE'] = ( new Date() ).toJSON();
                config['ENV'] = env;
                
                // (4) Replace IP Values for @@MY_IP_ADDRESS keys in JSON
                for ( var key in config ) {
                    if ( config.hasOwnProperty( key ) ) {
                        if ( typeof config[ key ] === 'string' ) {
                            config[ key ] = config[ key ].replace( '@@MY_IP_ADDRESS', ipAddress );
                        }
                    }
                }

                // (5) Construct replacement patterns, ex: replace @@KEYS with real values.
                var patterns = Object.keys( config ).map(  function ( key ) {
                    gutil.log( gutil.colors.green( '=> ' + key + ': ' + config[ key ] ) );
                    return { match: key, replacement: config[ key ] };
                });

                // (6) Generate files
                generateConfiguredFiles( patterns );

            }
            return configon;
        },

        /**
         * This function sets default environment for configuration
         * @param env Environment name
         */
        setDefaultEnv: function( env ) {
            defaultEnvironment = env;
            return configon
        }

    }

    return configon;
}

module.exports = EnvConfig;
