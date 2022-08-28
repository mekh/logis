/**
 * @returns {{fileName: string, functionName: string, lineNumber: number}}
 */
const getCallsite = () => {
  const bkp = Error.prepareStackTrace;
  Error.prepareStackTrace = (_, stack) => stack;

  // stack items: 0 - error, 1 - this file, 2 - loggis, 3 - caller
  const caller = new Error().stack[3];
  Error.prepareStackTrace = bkp;

  return {
    fileName: caller ? caller.getFileName() : 'unknown',
    functionName: caller ? caller.getFunctionName() : 'anonymous',
    lineNumber: caller ? caller.getLineNumber() : -1,
  };
};

module.exports = getCallsite;
