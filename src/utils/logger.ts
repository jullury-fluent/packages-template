export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'silent';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: string;
  metadata?: Record<string, unknown>;
  error?: Error;
}

export interface LoggerOptions {
  level?: LogLevel;
  timestamps?: boolean;
  prettyPrint?: boolean;
  formatter?: (entry: LogEntry) => string;
  writer?: (formatted: string, level: LogLevel) => void;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  silent: 4,
};

// ANSI color codes
const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m',
};

const LEVEL_COLORS: Record<LogLevel, string> = {
  debug: COLORS.gray,
  info: COLORS.cyan,
  warn: COLORS.yellow,
  error: COLORS.red,
  silent: COLORS.reset,
};

export class Logger {
  private readonly options: Required<Omit<LoggerOptions, 'formatter' | 'writer'>> & {
    formatter?: (entry: LogEntry) => string;
    writer?: (formatted: string, level: LogLevel) => void;
  };

  constructor(options: LoggerOptions = {}) {
    this.options = {
      level: options.level ?? 'info',
      timestamps: options.timestamps ?? true,
      prettyPrint: options.prettyPrint ?? false,
      formatter: options.formatter,
      writer: options.writer,
    };
  }

  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS[level] >= LOG_LEVELS[this.options.level];
  }

  private format(entry: LogEntry): string {
    if (this.options.formatter) {
      return this.options.formatter(entry);
    }

    const levelColor = LEVEL_COLORS[entry.level];
    const reset = COLORS.reset;
    const dim = COLORS.dim;
    const bright = COLORS.bright;

    const parts: string[] = [];

    if (this.options.timestamps) {
      const timestamp = `${dim}[${entry.timestamp}]${reset}`;
      parts.push(timestamp);
    }

    const levelStr = `${levelColor}${bright}[${entry.level.toUpperCase()}]${reset}`;
    parts.push(levelStr);

    if (entry.context) {
      const contextStr = `${COLORS.magenta}[${entry.context}]${reset}`;

      parts.push(contextStr);
    }

    const messageStr = `${COLORS.white}${entry.message}${reset}`;
    parts.push(messageStr);

    if (entry.metadata && Object.keys(entry.metadata).length > 0) {
      const metadataStr = this.options.prettyPrint
        ? JSON.stringify(entry.metadata, null, 2)
        : JSON.stringify(entry.metadata);
      const coloredMetadata = `${COLORS.green}${metadataStr}${reset}`;
      parts.push(coloredMetadata);
    }

    if (entry.error) {
      const errorStr = `\n${COLORS.red}Error: ${entry.error.message}${reset}`;
      parts.push(errorStr);
      if (entry.error.stack) {
        const stackStr = `\n${dim}Stack: ${entry.error.stack}${reset}`;
        parts.push(stackStr);
      }
    }

    return parts.join(' ');
  }

  private write(entry: LogEntry): void {
    if (!this.shouldLog(entry.level)) {
      return;
    }

    const formatted = this.format(entry);

    if (this.options.writer) {
      this.options.writer(formatted, entry.level);
      return;
    }

    switch (entry.level) {
      case 'error':
        console.error(formatted);
        break;
      case 'warn':
        console.warn(formatted);
        break;
      case 'debug':
      case 'info':
        console.log(formatted);
        break;
      case 'silent':
        break;
    }
  }

  private createEntry(
    level: LogLevel,
    message: string,
    context?: string,
    metadata?: Record<string, unknown>,
    error?: Error
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      metadata,
      error,
    };
  }

  public debug(message: string, context?: string, metadata?: Record<string, unknown>): void {
    this.write(this.createEntry('debug', message, context, metadata));
  }

  public info(message: string, context?: string, metadata?: Record<string, unknown>): void {
    this.write(this.createEntry('info', message, context, metadata));
  }

  public warn(message: string, context?: string, metadata?: Record<string, unknown>): void {
    this.write(this.createEntry('warn', message, context, metadata));
  }

  public error(
    message: string,
    error?: Error,
    context?: string,
    metadata?: Record<string, unknown>
  ): void {
    this.write(this.createEntry('error', message, context, metadata, error));
  }

  public child(context: string): ContextLogger {
    return new ContextLogger(this, context);
  }

  public setLevel(level: LogLevel): void {
    this.options.level = level;
  }

  public getLevel(): LogLevel {
    return this.options.level;
  }
}

export class ContextLogger {
  constructor(
    private readonly logger: Logger,
    private readonly context: string
  ) {}

  public debug(message: string, metadata?: Record<string, unknown>): void {
    this.logger.debug(message, this.context, metadata);
  }

  public info(message: string, metadata?: Record<string, unknown>): void {
    this.logger.info(message, this.context, metadata);
  }

  public warn(message: string, metadata?: Record<string, unknown>): void {
    this.logger.warn(message, this.context, metadata);
  }

  public error(message: string, error?: Error, metadata?: Record<string, unknown>): void {
    this.logger.error(message, error, this.context, metadata);
  }
}
