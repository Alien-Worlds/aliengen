export default class Logger {
    static logger: Logger;
    private minLevel: number;
    private readonly levels: { [key: string]: number } = {
        'trace': 1,
        'debug': 2,
        'info': 3,
        'warn': 4,
        'error': 5
    };

    private constructor(options: LogOptions) {
        this.minLevel = this.levelToInt(options.minLevel);
    }

    public static getLogger(options?: LogOptions): Logger {
        if (!Logger.logger) {
            Logger.logger = new Logger(options || {
                minLevel: LogLevel.Trace,
            });
        }

        return Logger.logger;
    }

    public trace(message: string, module?: string, icon?: string): void {
        this.log({ level: LogLevel.Trace, message, module, icon, });
    }
    public debug(message: string, module?: string, icon?: string): void {
        this.log({ level: LogLevel.Debug, message, module, icon, });
    }
    public info(message: string, module?: string, icon?: string): void {
        this.log({ level: LogLevel.Info, message, module, icon, });
    }
    public warn(message: string, module?: string, icon?: string): void {
        this.log({ level: LogLevel.Warn, message, module, icon, });
    }
    public error(message: string, module?: string, icon?: string): void {
        this.log({ level: LogLevel.Error, message, module, icon, });
    }

    private log(data: LogEntry) {
        const level = this.levelToInt(data.level);

        if (level < this.minLevel) return;

        const text = this.buildText(data);

        switch (data.level) {
            case 'trace':
                console.trace(text);
                break;
            case 'debug':
                console.debug(text);
                break;
            case 'info':
                console.info(text);
                break;
            case 'warn':
                console.warn(text);
                break;
            case 'error':
                console.error(text);
                break;
            default:
                console.log(`{${data.level}} ${text}`);
        }
    }

    private buildText(data: LogEntry): string {
        const { message, module, icon } = data;
        let text = '';

        if (icon) { text += `${icon} `; }
        if (module) { text += `[${module}] `; }
        text += `${message}`;

        return text;
    }

    /**
     * Converts a string level (trace/debug/info/warn/error) into a number 
     * 
     * @param minLevel 
     */
    private levelToInt(minLevel: string): number {
        if (minLevel.toLowerCase() in this.levels)
            return this.levels[minLevel.toLowerCase()];
        else
            return 99;
    }


};

export interface LogOptions {
    minLevel: LogLevel;
}

export interface LogEntry {
    level: LogLevel;
    message: string;
    module: string;
    icon?: string;
}

export enum LogLevel {
    Trace = 'trace',
    Debug = 'debug',
    Info = 'info',
    Warn = 'warn',
    Error = 'error'
};
