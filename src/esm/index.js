/* eslint-disable prefer-destructuring */
import logger from '../index';

export const getLogger = logger.getLogger;
export const configure = logger.configure;
export const Primitives = logger.formatters.Primitives;
export const Logline = logger.formatters.Logline;

export default logger;
