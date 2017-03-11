# Configon

> Configuration management for apps for multiple environments.

<Long description should be filled here>

## Table of Contents

- [Getting started](#getting-started)
- [Usage](#usage)
- [API](#api)
- [Contribute](#contribute)
- [License](#license)


## Getting started

If you want to use gulp on your CLI install gulp globally

$ `npm install gulp -g`

Install Configon

$ `npm install configon --save-dev`

## Usage

You can simply add the following code on to your gulp and start using it
```
var EnvConfig = require('configon');

const config = new EnvConfig( './example/config/config.@@ENV.json' )
            .addTemplate( './example/config/template.ts','./bin/config.ts' )
            .addTemplate( './example/config/template.xml','./bin/config.xml' );

gulp.task('config', function() {
    var defaultEnv = 'dev';
    config.build( defaultEnv );
});

```

### Building your configuration for your environment

You can pass parameters with arguments through CLI or also set NODE_ENV environment variable or pass a parameter when you call build in your gulp task.

Following examples assumes that your gulp task is `config`

$ `gulp config --env:< environment >`

$ `gulp config --env:dev`

$ `gulp config --env:prod`

### Using Environment variables

You can set environment variable with the identifier `NODE_ENV`

For just one run (from the unix shell prompt):

$ `NODE_ENV=dev gulp config`

More permanently:

$ `export NODE_ENV=dev`

$ `gulp config`

In Windows:

$ `SET NODE_ENV=dev`


### Setting custom IP Address

This is useful if you are developing a mobile application and you want to point you app to a custom IP Address in your LAN

$ `gulp config --ip:< IP Address >`

$ `gulp config --ip:192.168.0.100 --env:device`



### Setting up your templates and environment configuration values


This section tells you how to change configuration for environment 

Configon uses gulp to change the configuration.
It generates a file from a template file applying all configuration values from the configuration (value) files. It matches the key in template file with values in configuration file.

NOTE: *Any text based files can be used as a template*


Example template.ts


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
     
config.json


    {
	    "LOG_LEVEL": "debug",
	    "API_URL": "http://localhost:8080"
	}


output.ts


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

### Getting your Application name, version and build date into configuration.

You can add the following keys in your configuration file to automatically fetch the application name and version from package.json and build date from the system.

1. `@@APP_NAME` - Application Name
2. `@@VERSION`  - Application version
3. `@@BUILD_DATE` - Application build date
4. `@@ENV` - Environment name

Example template.ts

```
    ...
    /**
     * Name of the app
     */
    APP_NAME : '@@APP_NAME',

    /**
     * Version of the app
     */
    VERSION : '@@VERSION',

    /**
     * Build date of the app
     */
    BUILD_DATE : '@@BUILD_DATE',
    
    /**
     * Build date of the app
     */
    ENV : '@@ENV',
    ...

```

### Using your local IP Address into your configuration.

You can add the key "@@MY_IP_ADDRESS" to your configuration to load your local IP Address.

Eg. 

	API_URL : 'http://@@MY_IP_ADDRESS:8080'
	
key "@@MY_IP_ADDRESS" will replaced with Custom IP Address, if retrieving IP Address fails `localhost` will used.

NOTE:
* The local IP Address of the system  if fetched as default.
* Custom IP Address can be set manually by passing arguments in the CLI.  

## API

### Methods

name                        | arguments                                                     | description
----------------------------|---------------------------------------------------------------|------------
Configon <br>_constructor_  | configFilePattern:String                                      | Creates an instance <br>`var EnvConfig = require('configon');` <br>`var config = EnvConfig( './config/config.@@ENV.json' );`<br> Key @@ENV denotes the environment name in the file path
build                       | environment:String(optional) <br> ipAddress:String(optional)  | Builds the configuraation and apply all the changes to templates and export them in to the required location
addTemplate                 | templateFile:String <br> outputFile:String                    | Add template file path and its destination path.
removeTemplate              | templateFile:String                                           | Removes detail of template file from the list of templates  
setDefaultEnv               | env:String                                                    | Sets default environment for configuration


### Available Keys

Key             | description
----------------|--------------------------------------------------
@@ENV           | Name of the environment 
@@APP_NAME      | Name of the application 
@@APP_VERSION   | Version of the application 
@@BUILD_DATE    | Build date of the current build 
@@MY_IP_ADDRESS | Your local IP Address  


## Contribute

See [the contribute file](contribute.md)!

PRs accepted.

### Any optional sections

## License

[MIT © Cinergix Pty Ltd.](../LICENSE)
