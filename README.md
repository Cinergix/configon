# Configon

> Gulp tool for generating configuration files for multiple environments on your app. Simply lets you generate templated files based on a specific environment config.



## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [API](#api)
- [Contribute](#contribute)
- [License](#license)


## Install

```
npm install configon --save-dev
```

## Usage

Configon uses configuration value files and template files to generate the configuration required by applying all configuration values to the templates for the respective environment. 

Given below is a sample implementation of Configon, please take a look at the example folder for a detailed example.
```
var Configon = require( 'configon' );

const config = new Configon( './path-to-config-files/config.@@ENV.json' )
            .addTemplate( './path-to-template-files/template1.ts','./output-dir/output-filename1.ts' )
            .addTemplate( './path-to-template-files/template2.xml','./output-dir/output-filename2.xml' )
            .build( 'environment-name' );

```

The key @@ENV denotes the environment name, The value for @@ENV on the filename will be used as the environment name. 

### Setting up your templates and environment configurations

Configurations are stored as key, value pairs in configuration file specific for an environment and the key is used with the "@@" symbol in the front in template files which will be replaced with respective value while configuration is built.

NOTE: *All text based files can be used as a template*


Example template1.ts


    /**
     * Contains all Application configuration 
     */
    export const AppConfig = {
    
	    /**
	     * Logging level
	     */
	    LOG_LEVEL : '@@LOG_LEVEL',
	    
	    /**
	     * API URL of the server
	     */
	    API_URL : '@@API_URL'

	}
     
config.development.json


    {
	    "LOG_LEVEL": "debug",
	    "API_URL": "http://localhost:8080"
	}


output-filename1.ts


    /**
     * Contains all Application configuration 
     */
    export const AppConfig = {
    
	    /**
	     * Logging level
	     */
	    LOG_LEVEL : 'debug',
	    
	    /**
	     * API URL of the server
	     */
	    API_URL : 'http://localhost:8080'

	}

Following keys are available on configon and can be used in the templates to fill data

Key             | Description
----------------|--------------------------------------------------
@@ENV           | Name of the environment which is taken from the file name 
@@APP_NAME      | Name of the application retrieved from package.json
@@VERSION       | Version of the application retrieved from package.json
@@BUILD_DATE    | It takes current system date/time during the build as the build date 
@@MY_IP_ADDRESS | Your local IP Address of the system or the value passed as parameters, if retrieving IP Address fails `localhost` will used.


### Building your configuration for your environment

You can pass parameters with arguments through CLI or also set NODE_ENV environment variable or pass a parameter when you call build in your gulp task.

Following examples assumes that your gulp task is `config`
```
    gulp config --env:< environment >
```

Eg. 
```
    gulp config --env:development
```
### Using Environment variables

You can set environment variable with the identifier `NODE_ENV`

For just one run (from the unix shell prompt):
```
    NODE_ENV=development gulp config
```
More permanently:
```
    export NODE_ENV=development

    gulp config
```
In Windows:
```
    SET NODE_ENV=production
```

### Priorities of obtaining environment values

1. Environment values obtained through arguments passed in CLI e.g `gulp config --env:development`
2. Environment set on the `NODE_ENV` environment variable
3. Environment passed as parameter when calling build function

### Setting custom IP Address

This is useful if you are developing a mobile application and you want to point you app to a custom IP Address in your LAN

```
    gulp config --ip:< IP Address >`

    gulp config --ip:192.168.0.100 --env:device`
```

## API

name                        | arguments                                                     | description
----------------------------|---------------------------------------------------------------|------------
Configon <br>_constructor_  | configFilePattern:String                                      | Creates an instance <br>`var EnvConfig = require('configon');` <br>`var config = EnvConfig( './config/config.@@ENV.json' );`<br> Key @@ENV denotes the environment name in the file path
build                       | environment:String(optional) <br> ipAddress:String(optional)  | Builds the configuraation and apply all the changes to templates and export them in to the required location
addTemplate                 | templateFile:String <br> outputFile:String                    | Add template file path and its destination path.
removeTemplate              | templateFile:String                                           | Removes detail of template file from the list of templates  
setDefaultEnv               | env:String                                                    | Sets default environment for configuration



## Contribute

See [the contribute file](contribute.md)!

PRs accepted.

### Any optional sections

## License

[MIT © Cinergix Pty Ltd.](../LICENSE)
