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
  const { stack } = new Error();
  const callerIdx = 2;

  Error.prepareStackTrace = bkpFn;
  Error.stackTraceLimit = bkpLimit;

  return {
    fileName: stack[callerIdx].getFileName(),
    functionName: stack[callerIdx].getFunctionName(),
    lineNumber: stack[callerIdx].getLineNumber(),
  };
};

module.exports = {
  getCallsite,
};
