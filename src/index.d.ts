/**
 * Available log levels
 */
interface logLevels {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
    trace: 4,
}

type logLevelString = keyof logLevels;

type primitives = [
    'number',
    'string',
    'boolean',
    'undefined',
    'bigint',
    'symbol',
    'function',
]

interface Cls<T, A extends any[] = any[]> extends Function { new(...args: A): T; }

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
     * A string if 'json' is false, an array otherwise
     */
    text: string | any[];
}


/**
 * The logline configuration represents the format of the string
 * that will be printed by the logger
 */
interface Logline {
    /**
     * The `json` parameter defines the output format - a string if it false, JSON if it true
     */
    new (config?: { json: boolean }): Logline;
    /**
     * Add a logline item formatter
     *
     * @example:
     * const logline = new Logline();
     *
     * logline
     *   .add(message => message.date.toISOString)
     *   .add(message => `[${message.level.toUpperCase()}])
     *   .add(message => message.text)
     *   .join(' | ');
     *
     * // ...
     *
     * log.info('abc', { b: 123 }); // `2022-01-01T12:01:01.001Z | [INFO] | abc {"b": 123}`
     */
    add<T>(format: (message: Message) => T): Logline;
    /**
     * Replaces the default separator (a space) - see example above
     * Won't have effect if json=true
     */
    join(separator: string): Logline;
}

/**
 * A primitive is an element that is processed by a given format function
 * The formatting function is only applied if checkFn returned true.
 * This could be useful for filtering or modifying some items before they
 * go to the log output.
 *
 * @example
 * const mask = (number) => number
 *   .toString()
 *   .split('')
 *   .map((d, i) => (i >= 6 && i < 12 ? '*' : d))
 *   .join('');
 *
 * const primitives = new Primitives()
 *   .add(
 *     (obj) => (obj && obj.password), // formatting function
 *     (obj) => ({ ...obj, password: '***' }), // check function
 *   )
 *   .add(
 *     (obj) => (obj && obj.cvv && obj.number),
 *     (obj) => ({ ...obj, cvv: '***', number: mask(obj.number) }),
 *   );
 *
 * const logline = new Logline().add(message => message);
 * logger.configure({ logline, primitives });
 *
 * logger.info('user_info =>', {
 *   name: 'John',
 *   password: 'super_secret',
 *   card: { cvv: 321, number: 4111111111111111 },
 * });
 *
 * // user_info => {"name":"John","password":"***","card":{"cvv":"***","number":"411111******1111"}}
 */
interface PrimitivesStatic {
    new (): Primitives;
    /**
     * Check if `data` is a type of `type`
     */
    typeof<T = any>(type: string): ((data: T) => boolean);
    /**
     * Check if `data` is an instance of `cls`
     */
    instanceof<T, V = any>(cls: Cls<T>): ((data: V) => boolean);

}

interface Primitives {
    /**
     * A list of primitive types from the logger's point of view
     */
    types: primitives;
    /**
     * The formatFn will be applied to any item if the checkFn returned true for the same item
     */
    add<T, V>(checkFn: (data: T) => boolean, formatFn: (data: T) => V);
    /**
     * Returns true if data is null or typeof data is in `this.types` array
     */
    isPrimitive<T>(data: T): boolean;
}

declare namespace loggis {
    interface loggerFormatFn {
        args: any[],
        logger?: Logger,
        level?: logLevelString,
    }

    type formatFn = (params: loggerFormatFn) => string;

    /**
     * Logger
     */
    class Logger {
        levels: logLevels;
        /**
         * Get current log output format - JSON if true, string otherwise
         */
        get json(): boolean;
        /**
         * Make output in JSON format
         */
        set json(value: boolean);
        /**
         * Get current status
         */
        get colorize(): boolean;
        /**
         * Make the output colorized (if true)
         */
        set colorize(value: boolean);
        /**
         * Get log level
         */
        get loglevel(): logLevelString;
        /**
         * Set a loglevel for a particular logger
         */
        set loglevel(logLevel: logLevelString)
        /**
         * Get logline instance configured for current logger
         */
        get logline(): Logline;
        /**
         * Set a configured logline for this instance of logger
         */
        set logline(logline: Logline);
        /**
         * Get primitives instance configured for current logger
         */
        get primitives(): Primitives;
        /**
         * Set configured primitives for this instance of logger
         */
        set primitives(primitives: Primitives);
        /**
         * Returns the formatter function
         */
        get format(): formatFn;
        /**
         * Set message formatter
         */
        set format(params: formatFn);
        /**
         * General logging function
         */
        log(level?: logLevelString | any, ...args: any[]): string;
        /**
         * Get a new logger instance configured with the default config
         */
        getLogger(category: string): Logger;
        /**
         * Output error message
         */
        error(...args: any[]): string;
        /**
         * Output warn message
         */
        warn(...args: any[]): string;
        /**
         * Output info message
         */
        info(...args: any[]): string;
        /**
         * Output debug message
         */
        debug(...args: any[]): string;
        /**
         * Output trace message
         */
        trace(...args: any[]): string;
    }

    /**
     * Global configuration
     */
    interface configure {
        /**
         * Set to true for JSON output
         * Default is false
         */
        json?: boolean;
        /**
         * Default is `info`
         */
        loglevel?: logLevelString;
        /**
         * Default is false
         */
        colorize?: boolean;
        /**
         * DEPRECATED
         */
        format?: (params: loggerFormatFn) => string;
        /**
         * Define logline format
         * Check /src/formatter/index.js for defaults
         */
        logline?: Logline;
        /**
         * Define the primitives formatting rules
         * Check /src/formatter/index.js for defaults
         */
        primitives?: Primitives;
    }

    interface Formatters {
        Logline: Logline;
        Primitives: PrimitivesStatic;
    }

    export interface logger extends Logger {
        /**
         * Set the default configuration for all loggers
         */
        configure(params?: configure): logger;
        /**
         * Get an existing logger by name or create and save a new one
         */
        getLogger(category?: string | symbol): logger;
        /**
         * Contains classes that could be used for configuration
         */
        formatters: Formatters;
    }

}

declare const logger: loggis.logger;

export = logger;
