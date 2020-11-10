# loggis [![build](https://travis-ci.org/mekh/logis.svg?branch=main)](https://travis-ci.org/github/mekh/logis) [![Coverage Status](https://coveralls.io/repos/github/mekh/logis/badge.svg?branch=main)](https://coveralls.io/github/mekh/logis?branch=main)
A simple and lightweight logger for Node.JS

# Install
```bash
npm install loggis
```

# Use
```js
const log = require('loggis');

log.info('its simple');
log.trace('will not be printed since the default loglevel is info')
// [2020-10-04T09:10:42.276Z] [INFO] [16616] its simple
```

```js
const log = require('loggis')
  .configure({ loglevel: 'debug' })
  .getLogger('MY_APP');

log.error('easy to log error')
log.debug('easy to log debug');
log.trace('will not be printed, since the log level is DEBUG');
// [2020-10-04T09:10:42.276Z] [ERROR] [16959] [MY_APP] easy to log error
// [2020-10-04T09:10:42.276Z] [DEBUG] [16959] [MY_APP] easy to log debug
```

```js
const log = require('loggis');

log.error('this', ['will', 'be'], { concatenated: { into: 'a single string'  } })
// [2020-10-04T09:10:42.276Z] [ERROR] [17019] [MY_APP] this ["will","be"] {"concatenated":{"into":"a single string"}}
```
