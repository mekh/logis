/* eslint-disable no-param-reassign */
/**
 * @param {object} message
 * @returns {message&{callsite: {fileName: string, functionName: string, lineNumber: number}}}
 */
const getCallsite = (message) => {
  const bkp = Error.prepareStackTrace;
  Error.prepareStackTrace = (_, stack) => stack;

  // stack items: 0 - error, 1 - this file, 2 - loggis, 3 - caller
  const caller = new Error().stack[3];
  Error.prepareStackTrace = bkp;

  message.callsite = {
    fileName: caller ? caller.getFileName() : 'unknown',
    functionName: caller ? caller.getFunctionName() : 'anonymous',
    lineNumber: caller ? caller.getLineNumber() : -1,
  };

  return message;
};

module.exports = getCallsite;
