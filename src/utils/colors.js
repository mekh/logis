const end = '\x1B[0m';

const red = text => `\x1B[0;31m${text}${end}`;
const blue = text => `\x1B[0;34m${text}${end}`;
const cyan = text => `\x1B[0;36m${text}${end}`;
const green = text => `\x1B[0;32m${text}${end}`;
const yellow = text => `\x1B[0;33m${text}${end}`;

module.exports = {
  red,
  blue,
  cyan,
  green,
  yellow,
};
