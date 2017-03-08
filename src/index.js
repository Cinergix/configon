var fs = require( 'fs' ); //importing file system

/**
 * This consists functionalities related configuration management for application with 
 * multiple environment. It utilizes gulp to achieve the task
 * 
 * @param   {String} configFilePattern The string pattern which identifies the files 
 *          of configuration for specific environment. The index of the file is denoted 
 *          by positioning {KEY_ENV} in the pattern 
 */
var EnvConfig = function ( configFilePattern ) {
    
    /**
     * This is key which is used to identify environment name
     * index from the configuration file pattern.
     */
    var KEY_ENV = '@@ENV';

    /**
     * This variable {Array} consisting the templates and the respective output destination 
     * which needs configurations to be applied 
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
            return readJSON( getConfigFilePath( env ) );
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
        if( validateConfigFilePattern() && env ) {
            var pathArray = path.split( KEY_ENV );
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
        var pattern = new RegExp( '^(.\/[a-zA-Z_\-0-9\.]+)+(@@ENV)\.(json)$' );
        return ( configFilePattern && pattern.test( configFilePattern ) );
    }

    return {
        
        /**
         * This method add details of template file and output location into the template map 
         */
        addTemplate: function ( templateFile, outputFile ) {
            if( !templates ) {
                templates = [];
            }
            templates[ templateFile ] = outputFile;
        },

        /**
         * This method remove details of template file from the template map 
         */
        removeTemplate: function ( templateFile ) {
            if( templates ){
                delete templates[ templateFile ];
            }
            return false;
        }
    }
}

module.exports = EnvConfig;
