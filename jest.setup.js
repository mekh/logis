const { CustomConsole } = require('@jest/console');

const formatter = (type, message) => `console.${type} => ${message}`;

global.console = new CustomConsole(process.stdout, process.stderr, formatter);
