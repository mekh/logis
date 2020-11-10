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
 * Logger
 */
declare class Logger {
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
    set level(logLevel: logLevelString)
    /**
     * Get log level
     */
    get level(): logLevelString;
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
