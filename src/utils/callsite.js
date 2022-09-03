/**
 * @link https://v8.dev/docs/stack-trace-api
 * @returns {{fileName: string, functionName: string, lineNumber: number}}
 */
const getCallsite = () => {
  const bkpFn = Error.prepareStackTrace;
  const bkpLimit = Error.stackTraceLimit;

  Error.prepareStackTrace = (_, stack) => stack;
  Error.stackTraceLimit = 4;

  // stack items: 0 - error, 1 - this file, 2 - loggis, 3 - caller
  const caller = new Error().stack[3];
  Error.prepareStackTrace = bkpFn;
  Error.stackTraceLimit = bkpLimit;

  return {
    fileName: caller.getFileName(),
    functionName: caller.getFunctionName(),
    lineNumber: caller.getLineNumber(),
  };
};

module.exports = getCallsite;
