/**
 * Available log levels
 */
declare interface logLevels {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
    trace: 4,
}

declare type logLevelString = keyof logLevels;

declare interface format {
    args: any[],
    logger?: Logger,
    level?: logLevelString,
}

declare type formatFn = (params: format) => string;

/**
 * Represents a message data and meta-data
 */
declare interface Message {
    /**
     * The date the message is created
     */
    date: Date;
    /**
     * Current process's ID
     */
    pid: number;
    /**
     * Parsed arguments that were passed to log function
     * The type of each item is defined by Primitives settings
     */
    data: any[];
    /**
     * Message's level, i.e. for log.debug it will be 'debug'
     */
    level: logLevelString;
    /**
     * Logger's category name, set by getLogger()
     */
    category: string;
    /**
     * File name from which the log method was called
     */
    fileName: string;
    /**
     * Line number from which the log method was called
     */
    lineNumber: number;
    /**
     * Function name from which the log method was called
     */
    functionName: string;
    /**
     * Stringified values of `message.data` joined by spaces
     */
    payload: string;
}

/**
 * The primitive is an item that is processed by the given format Fn
 * it does not take a part on further parsing even if it's an array or object
 * This could be useful to filter log output, to format specific elements, etc.
 *
 * The format function is applied only if the check one returned true
 *
 */
declare interface Primitives {
    add(checkFn: (value: any) => boolean, formatFn: (value: any) => string);
}

/**
 * The logline configuration represents the format of the string
 * that will be printed by the logger
 */
declare interface Logline {
    /**
     * Add a logline item formatter
     *
     * @example:
     * logline
     *   .add(message => message.date.toISOString)
     *   .add(message => `[${message.level.toUpperCase()}])
     *   .add(message => message.payload)
     *   .join(' | ');
     *
     * ...
     * log.info('abc', { b: 123 }); // => `2022-01-01T12:01:01.001Z | [INFO] | abc {"b": 123}`
     */
    add(format: (message: Message) => string): Logline;
    /**
     * Set a separator string
     */
    join(separator: string): Logline;
}

/**
 * Logger
 */
declare class Logger {
    levels: logLevels;
    /**
     * Make the output colorized (if true)
     */
    set colorize(value: boolean);
    /**
     * Get current status
     */
    get colorize(): boolean;
    /**
     * Set a loglevel for a particular logger
     */
    set loglevel(logLevel: logLevelString)
    /**
     * Get log level
     */
    get loglevel(): logLevelString;
    /**
     * Get timestamp setting
     */
    get timestamp(): boolean;
    /**
     * Set timestamp setting
     */
    set timestamp(timestamp: boolean);
    /**
     * Set message formatter
     */
    set format(params: formatFn);
    /**
     * Returns the formatter function
     */
    get format(): formatFn;
    /**
     * General logging function
     */
    protected log(level?: logLevelString | any, ...args: any[]): void
    /**
     * Output error message
     */
    error(...args: any[]): void;
    /**
     * Output warn message
     */
    warn(...args: any[]): void;
    /**
     * Output info message
     */
    info(...args: any[]): void;
    /**
     * Output debug message
     */
    debug(...args: any[]): void;
    /**
     * Output trace message
     */
    trace(...args: any[]): void;
}

declare namespace loggis {
    /**
     * Global configuration
     */
    interface configure {
        loglevel?: logLevelString,
        colorize?: boolean,
        timestamp?: boolean,
        format?: (params: format) => string,
        logline?: Logline,
        primitives?: Primitives,
    }

    interface logger extends Logger {
        /**
         * Set the default configuration for all loggers
         */
        configure(params: configure): logger,

        /**
         * Get an existing logger by name or create and save a new one
         */
        getLogger(category?: string | symbol): logger,
    }
}

declare const logger: loggis.logger;

export = logger;
