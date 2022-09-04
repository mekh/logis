# loggis [![Tests](https://github.com/mekh/logis/actions/workflows/test.yml/badge.svg)](https://github.com/mekh/logis/actions/workflows/test.yml) [![Coverage Status](https://coveralls.io/repos/github/mekh/logis/badge.svg?branch=main)](https://coveralls.io/github/mekh/logis?branch=main)
## ATTENTION: The documentation hasn't been fully updated yet. Please wait a bit.
A simple, lightweight,   console logger for Node.JS.

A perfect choice for Kubernetes, Docker, and other systems that collect logs directly from stdout.

# Features
- no dependencies
- supports JSON
- safe for any kind of data - Express req/res, Sequelize models, Error objects, etc.
- ready for usage right out of the box
- global and individual configuration of loggers
- both **CommonJS** and **ESM** are supported
- **Typescript** friendly
- automatic objects serialization
- automatic circular structures handling
- tracing information - caller's file and function name, and even line number where the log method has been called
- robust configuration
- colored output

# Installation
```bash
$ npm install loggis
```

# Quick start
The logger can be user right out of the box, i.e. it does not require any configuration by default.
The default settings are:
- loglevel: info
- colorize: false
- logline: [ISO timestamp] [level] [process.pid] [category] [filename||functionName:lineNumber] message
- primitives
  - Function => <Function ${function.name || 'anonymous'}>
  - Date instance => Date.toISOString()
  - Promise instance => '<Promise>'
  - Buffer instance - Buffer.toString()
  - Error instance => error properties/values concatenated by a new line

```js
// /app/test_log.js
const logger = require('loggis');

const logFn = () => {
  logger.info('its simple');
  logger.error('this', ['will', 'be'], { serialized: { into: 'a string' } });

  // won't be printed since the default loglevel is info
  logger.trace('trace info');
};

logFn();
// [2022-09-03T08:17:26.549Z] [INFO] [123] [default] [/app/test_log.js||logFn:4] its simple
// [2022-09-03T08:17:26.554Z] [ERROR] [123] [default] [/app/test_log.js||logFn:5] this ["will","be"] {"serialized":{"into":"a string"}}

```

# Configuration
The default configuration can be set either through the `configure` method or the environment variables.
Each logger instance can be configured individually by setting an instance properties like `level`, `colorize`, etc.

## Environment variables
The default configuration can be set through the environment variables.

| Name       | Type    | Default value | Description                       |
|------------|---------|---------------|-----------------------------------|
| LOG_LEVEL  | String  | info          | The default logging level         |
| LOG_JSON   | Boolean | false         | Turns on/off JSON output          |
| LOG_COLORS | Boolean | false         | Turns on/off the colorized output |

## Configure options
The default configuration can be passed to the `configure` method.
It accepts the following parameters:
- loglevel - the default logging level, valid values are `error`, `warn`, `info`, `debug`, and `trace`
- json - use json output
- colorize - use colored output
- format - (DEPRECATED) custom message formatter
- logline - the Logline instance
- primitives - the Primitives instance

The same parameters can be used for an individual configuration of a logger.

## Circulars
It's safe to pass any kind of arguments to the log functions, including Express requests, Sequelize models, etc.
The logger automatically detects circular structures and replaces them by string references.
The reference is a path within an object.

```js
const logger = require('loggis');

const a = { a: 1 };
a.b = a; // circular reference
a.c = [1, { d: 2, e: { f: 'abc' } }]
a.g = a.c[1].e; // circular reference

logger.info(a);
// ...{"a":1,"b":"[REF => .]","c":[1,{"d":2,"e":{"f":"abc"}}],"g":"[REF => c[1].e]"}
```

## [DEPRECATED] Custom formatter
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

const customFormatter = ({ args, level, logger }) => JSON.stringify({
  date: new Date(),
  module: module.parent.filename.replace(process.cwd(), ''),
  category: logger.category,
  level,
  data: args, // be careful, it might crash if data is not compatible with JSON.stringify
});

loggis.configure({ format: customFormatter });

module.exports = loggis;

// ./src/app.js
const logger = require('./logger');

const log = logger.getLogger('MY_APP');

log.info('the configuration is =>', {
  level: logger.loglevel,
  color: logger.colorize,
  json: logger.json,
});

// ./index.js
require('./src/app');

// {"date":"2022-09-03T08:17:26.549Z","module":"/app.js","category":"MY_APP","level":"info","data":["the configuration is =>",{"level":"info","color":false,"json":false}]}
````

# Usage examples
### Set the default configuration, get a logger, use it
```js
const logger = require('loggis')

const log = logger.configure({ loglevel: 'debug' }).getLogger('MY_APP');

log.error('easy to log error')
log.debug('easy to log debug');
log.trace('will not be printed, since the log level is DEBUG');
// [2022-09-03T08:17:26.549Z] [ERROR] [123] [MY_APP] [/app/test_log.js||-:5] easy to log error
// [2022-09-03T08:17:26.554Z] [DEBUG] [123] [MY_APP] [/app/test_log.js||-:6] easy to log debug

```

### JSON format
```js
const logger = require('loggis');

logger.configure({ json: true });

logger.info('user info =>', { id: 1, name: 'John', email: 'mail@g.co' });

// {"date":"2022-09-03T08:17:26.549Z","level":"info","pid":123,"category":"json","filename":"/app/test_log.js","function":"-","line":5,"data":["user info =>",{"id":1,"name":"John","email":"mail@g.co"}]}

```

### The default an individual configuration
```js
const logger = require('loggis');

logger.configure({ loglevel: 'warn', colorize: true });

const logLine = logger.getLogger('line'); // the default configuration will be applied
const logJson = logger.getLogger('json');

// configure an instance
logJson.loglevel = 'trace';
logJson.json = true;
logJson.colorize = false;

logLine.info('the configuration is =>', {
  level: logLine.loglevel,
  color: logLine.colorize,
  json: logLine.json,
});

logJson.trace('the configuration is =>', {
  level: logJson.loglevel,
  color: logJson.colorize,
  json: logJson.json,
});


// [2022-09-03T08:17:26.549Z] [WARN] [123] [line] [/app/test_log.js||-:13] the configuration is => {"level":"warn","color":true,"json":false}
// {"date":"2022-09-03T08:17:26.554Z","level":"trace","pid":123,"category":"json","filename":"/app/test_log.js","function":"-","line":19,"data":["the configuration is =>",{"level":"trace","color":false,"json":true}]}
````

# ESM
```js
import logger from 'loggis';

const log = logger.getLogger('MY_APP');
```
```js
import { getLogger } from 'loggis';

const log = getLogger('MY_APP')
````

# Advance configuration

Data processing includes two stages:
- parsing each argument passed to the logger function
- formatting the string that will be printed

The parsing of each argument looks like this:
- the parser checks if the formatting rules are defined for the given element
- if such rules were found, they are sequentially applied to the element
- if the element is an object, then for each nested element (array item, object key value), the entire chain is repeated

This way it's possible to format any element at any level of nesting.

An element for which one or more formatting rules are specified is called a `primitive`.

The formatting rules for primitives are set by an instance of the `Primitives` class, the `add` method.
This method takes two arguments:
- the first one is a function that takes an element as an argument and returns a boolean if the element is the given primitive
- the second one is a function that takes an element as an argument and returns the modified element

The `add` method returns the instance itself, so the method can be chained. 

The `Primitives` class is available in the `formatters` property of the logger.

An instance of the `Primitives` class can be passed to the `configure` method of the logger as the `primitives` parameter.

Example:
```js
const logger = require('loggis');

const primitives = new logger.formatters.Primitives()
  .add(
    (item) => typeof item === 'number', // for any number
    (item) => item.toFixed(2),          // apply this function
  );

logger.configure({ primitives });

logger.info(10.987654, '123.1589', { float: 1.5499, int: 1, str: '9.98765' });
// ... 10.99 123.1589 {"float":"1.55","int":"1.00","str":"9.98765"}
```

For convenience, the `Primitives` class has two static methods - `typeof` and `instanceof` with the following definitions:
```typescript
  interface Cls<T, A extends any[] = any[]> extends Function { new(...args: A): T; }
  
  static typeof<T = any>(type: string): ((data: T) => boolean);
  static instanceof<T, V = any>(cls: Cls<T>): ((data: V) => boolean);
```

The default primitives are:
```js
primitives
  .add(Primitives.typeof('function'),  (data) => `<Function ${data.name || 'anonymous'}>`)
  .add(Primitives.instanceof(Date),    (date) => date.toISOString())
  .add(Primitives.instanceof(Buffer),  (data) => data.toString())
  .add(Primitives.instanceof(Promise), () => '<Promise>')
  .add(Primitives.instanceof(Error),   (error) => Object
    .getOwnPropertyNames(error)
    .reduce((acc, prop) => `${acc}\n${prop}: ${error[prop]}`, ''));

```

## Primitives usage examples
### Filter sensitive data:
```js
const logger = require('loggis');
const { Primitives } = logger.formatters;

const isObject = (obj) => typeof obj === 'object' && obj !== null && !Array.isArray(obj);
const hide = (obj, prop) => (Object.hasOwn(obj, prop) ? ({ ...obj, [prop]: '***' }) : obj);

const primitives = new Primitives()
  .add(isObject, (obj) => hide(obj, 'password'))
  .add(isObject, (obj) => hide(obj, 'card_number'))
  .add(isObject, (obj) => hide(obj, 'card_cvv'));

logger.configure({ primitives });

logger.info({ user: { id: 1, name: 'John', password: 'secret', card: { card_cvv: 321, card_number: 4111111111111111 } } });
// ... {"user":{"id":1,"name":"John","password":"***","card":{"card_cvv":"***","card_number":"***"}}}
```

### Sequelize models serialization
```js
const { Model } = require('sequelize');
const logger = require('loggis');

const primitives = new logger.formatters.Primitives()
  .add(Primitives.instanceof(Model), (model) => model.toJSON())
```
