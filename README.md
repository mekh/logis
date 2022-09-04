# loggis [![Tests](https://github.com/mekh/logis/actions/workflows/test.yml/badge.svg)](https://github.com/mekh/logis/actions/workflows/test.yml) [![Coverage Status](https://coveralls.io/repos/github/mekh/logis/badge.svg?branch=main)](https://coveralls.io/github/mekh/logis?branch=main)
## ATTENTION: The documentation hasn't been fully updated yet. Please wait a bit.
A simple, lightweight,   console logger for Node.JS.

A perfect choice for Kubernetes, Docker, and other systems that collect logs directly from stdout.

# Features
- no dependencies
- [ready for usage right out of the box](#quick-start)
- [supports JSON](#json-format)
- [global and individual configuration of loggers](#the-default-an-individual-configuration)
- [automatic objects serialization](#quick-start)
- [automatic circular structures handling](#circulars)
- [robust configuration](#advance-configuration)
- [tracing information - caller's file and function name, and even line number where the log method has been called](#quick-start)
- [colored output](#configuration)
- safe for any kind of data - Express req/res, Sequelize models, Error objects, etc.
- both **CommonJS** and [**ESM**](#esm) are supported
- **Typescript** friendly

# Installation
```bash
$ npm install loggis
```

# Quick start
The logger can be user right out of the box, i.e. it does not require any configuration by default.
The default settings are:
- loglevel: info
- colorize: false
- [logline](#logline): [ISO timestamp] [level] [process.pid] [category] [filename||functionName:lineNumber] message
- [primitives](#primitives-default-configuration)
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
- [format](#custom-formatter-deprecated) - custom message formatter (DEPRECATED)
- [logline](#logline) - the Logline instance
- [primitives](#primitives) - the Primitives instance

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

## Custom formatter (deprecated)
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

## ESM
```ejs
import logger from 'loggis';

const log = logger.getLogger('MY_APP');
```
```ejs
import { getLogger } from 'loggis';

const log = getLogger('MY_APP')
````

# Advance configuration
## Primitives
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

#### Primitives default configuration
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

### Primitives usage examples
#### Filter sensitive data:
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

#### Sequelize models serialization
```js
const { Model } = require('sequelize');
const logger = require('loggis');

const primitives = new logger.formatters.Primitives()
  .add(Primitives.instanceof(Model), (model) => model.toJSON())
```

## Logline
The elements to be printed are specified by calling the `add` method of an instance of the `Logline` class.

The `add` method accepts a `Message` instance and returns any type of data.

The `Message` instance has the following properties:
- date - new Date()
- pid - process.pid
- data - an array of items returned by the Parser (see [Primitives](#primitives))
- level - message level, i.e. for log.error it will be error
- category - logger category (logger.getLogger('myapp') => the category is myapp);
- fileName - the name of the file where the logger function was called
- lineNumber - line number where the logger method was called
- functionName - name of the function from which the logger method was called
- text - could be a string or an array depending on `json` option of the logger

The `Logline` class is available in the `formatters` property of the logger.

The `join` method of the logline instance defines a separator that is used while joining all the logline elements. It does not work for JSON format.

```js
const logger = require('loggis');
const { Logline } = logger.formatters.Logline;

// --- Simplest format ---
const logline = new Logline().add(message => message.text);
logger.configure({ logline }).info(1, [2, 3], { 4: 5 }); // 1 [2,3] {"4":5}

// --- Static text ---
const logline = new Logline()
        .add(() => '[static_text]')
        .add(message => `[${message.text}]`);
logger.configure({ logline }).info('log message'); // [static_text] [log message]

// --- JOIN ---
const logline = new Logline()
        .add(message => message.date.valueOf())
        .add(message => message.level.toUpperCase())
        .add(message => message.pid)
        .add(message => message.text)
        .join(' | ');
logger.configure({ logline }).info('log message'); // 1662193046549 | INFO | 123 | log message

// --- JSON format ---
const logline = new Logline()
        .add(message => ({ date: message.date }))
        .add(message => ({ message: message.text }));
logger.configure({ json: true, logline }).info('user =>', { id: 1, name: 'John' }); // {"date":"2022-09-03T08:17:26.549Z","message":["user =>",{"id":1,"name":"John"}]}
```

#### Default logline
```js
const wrap = data => `[${data}]`;

logline
  .add(message => wrap(message.date.toISOString()))
  .add(message => wrap(message.level.toUpperCase()))
  .add(message => wrap(message.pid))
  .add(message => wrap(message.category))
  .add(message => wrap(`${message.fileName}||${message.functionName || '-'}:${message.lineNumber || -1}`))
  .add(message => message.text);

```
#### Default json logline
```js
loglineJson
  .add(message => ({ date: message.date.toISOString() }))
  .add(message => ({ level: message.level }))
  .add(message => ({ pid: message.pid }))
  .add(message => ({ category: message.category }))
  .add(message => ({ filename: message.fileName }))
  .add(message => ({ function: message.functionName || '-' }))
  .add(message => ({ line: message.lineNumber || -1 }))
  .add(message => ({ data: message.text }));
```

## License
[MIT](https://opensource.org/licenses/MIT "The MIT License")
