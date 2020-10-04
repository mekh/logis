# loggis
A simple and lightweight logger for Node.JS

#Install
```bash
npm install loggis
```

# Use
```js
const log = require('loggis');

log.info('its simple');
log.trace('this will not be printed since the default loglevel is info')
// [2020-10-04T09:10:42.276Z] [INFO] [16616] its simple
```

```js
const log = require('loggis')
  .configure({ loglevel: 'trace' })
  .getLogger('MY_APP');

log.debug('easy to debug');
// [2020-10-04T09:10:42.276Z] [DEBUG] [16959] [MY_APP] my app debug message
```

```js
const log = require('loggis');

log.error('this', ['will', 'be'], { concatenated: { into: 'a single string'  } })
// [2020-10-04T09:10:42.276Z] [ERROR] [17019] [MY_APP] this ["will","be"] {"concatenated":{"into":"a single string"}}
```
