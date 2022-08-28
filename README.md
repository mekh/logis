# loggis [![build](https://travis-ci.org/mekh/logis.svg?branch=main)](https://travis-ci.org/github/mekh/logis) [![Coverage Status](https://coveralls.io/repos/github/mekh/logis/badge.svg?branch=main)](https://coveralls.io/github/mekh/logis?branch=main)
A simple and lightweight logger for Node.JS

# Features
- no dependencies
- ready for usage right out of the box
- global and individual configuration of loggers
- both **CommonJS** and **ESM** are supported
- **Typescript** friendly
- automatic objects serialization
- automatic circular structures handling
- robust configuration
- colored output

# Installation
```bash
$ npm install loggis
```

# Quick start
The logger can be user right out of the box, i.e. it does not require any configuration by default.
```js
const log = require('loggis');

log.info('its simple');
log.error('this', ['will', 'be'], { serialized: { into: 'a string'  } })
log.trace('will not be printed since the default loglevel is info')
// [2020-10-04T09:10:42.276Z] [INFO] [16616] its simple
// [2020-10-04T09:10:42.276Z] [ERROR] [16616] this ["will","be"] {"serialized":{"into":"a string"}}
```

# Configuration
The default configuration can be set either through the `configure` method or the environment variables.
Each logger instance can be configured individually by setting an instance properties like `level`, `colorize`, etc.

The environment variables have higher priority than the configuration via the `configure` method.
I.e. if the `LOG_LEVEL` variable set to `debug`, calling the `configure({ loglevel: 'trace' })` won't change the default logging level.

## Environment variables
The default configuration can be set through the environment variables.

| Name          | Type    | Default value | Description                       |
|---------------|---------|---------------|-----------------------------------|
| LOG_LEVEL     | String  | info          | The default logging level         |
| LOG_COLORS    | Boolean | false         | Turns on/off the colorized output |
| LOG_TIMESTAMP | Boolean | true          | Turns on/off the timestamp prefix |

## Configure options
The default configuration can be passed to the `configure` method.
It accepts the following parameters:
- loglevel - the default logging level, valid values are `error`, `warn`, `info`, `debug`, and `trace`
- colorize - use colored output
- timestamp - use timestamp prefix
- format - custom message formatter

The same parameters can be used for an individual configuration of a logger.

## Custom formatter
The formatter function accepts an object with the following properties:
- args -  an array of arguments that was passed to a log method
- level - logging level
- logger - logger instance

It might be convenient to set the default message format for a particular application.
  
For example, if you want to:
- log message in JSON format
- define and log the module name from which the log method is called
- set your own dataset that should be logged
- etc

You can do it like this:
```js
// ./src/logger/index.js
const loggis = require('loggis');

const customFormatter = ({ args, level, logger }) => {
  return JSON.stringify({
    date: new Date(),
    module: module.parent.filename.replace(process.cwd(), ''),
    category: logger.category,
    level,
    message: args.join(', '),
  });
};

loggis.configure({ format: customFormatter });

module.exports = loggis;

// ./src/app.js
const logger = require('./logger');

const log = logger.getLogger('MY_APP');
log.error('one', 'two', 'three');

// ./index.js
require('./src/app');

// {"date":"2020-10-04T09:10:42.276Z","module":"/src/app.js","category":"MY_APP","level":"error","message":"one, two, three"}
````

# Usage examples
Set the default configuration, get a logger, use it
```js
const logger = require('loggis')

const log = logger.configure({ loglevel: 'debug' }).getLogger('MY_APP');

log.error('easy to log error')
log.debug('easy to log debug');
log.trace('will not be printed, since the log level is DEBUG');
// [2020-10-04T09:10:42.276Z] [ERROR] [16959] [MY_APP] easy to log error
// [2020-10-04T09:10:42.276Z] [DEBUG] [16959] [MY_APP] easy to log debug
```

The default an individual configuration
```js
const loggis = require('loggis');

loggis.configure({ loglevel: 'warn', colorize: true, timestamp: false });

const logDebug = loggis.getLogger('A'); // the default configuration will be applied
const logTrace = loggis.getLogger('B');

// configure an instance
logTrace.loglevel = 'trace';
logTrace.colorize = false;

logDebug.trace('will not be printed since the default loglevel is warn');
logTrace.trace('the configuration is =>', {
  loglevel: logTrace.loglevel,
  colorize: logTrace.colorize,
  timestamp: logTrace.timestamp,
});
// [TRACE] [16959] [B] indivial configuration is => {"loglevel":"trace","colorize":false,"timestamp":false}
````

ESM
```js
import loggis from 'loggis';

const log = loggis.getLogger('MY_APP');
```
```js
import { getLogger } from 'loggis';

const log = getLogger('MY_APP')
````
