import chalk from 'chalk';

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

    const parts: string[] = [];

    if (this.options.timestamps) {
      parts.push(chalk.gray(`[${entry.timestamp}]`));
    }

    // Colorize log level based on severity
    const levelStr = `[${entry.level.toUpperCase()}]`;
    switch (entry.level) {
      case 'debug':
        parts.push(chalk.blue(levelStr));
        break;
      case 'info':
        parts.push(chalk.green(levelStr));
        break;
      case 'warn':
        parts.push(chalk.yellow(levelStr));
        break;
      case 'error':
        parts.push(chalk.red(levelStr));
        break;
      case 'silent':
        break;
      default:
        break;
    }

    if (entry.context) {
      parts.push(chalk.cyan(`[${entry.context}]`));
    }

    parts.push(entry.message);

    if (entry.metadata && Object.keys(entry.metadata).length > 0) {
      const metadataStr = this.options.prettyPrint
        ? JSON.stringify(entry.metadata, null, 2)
        : JSON.stringify(entry.metadata);
      parts.push(chalk.magenta(metadataStr));
    }

    if (entry.error) {
      parts.push(chalk.red(`\nError: ${entry.error.message}`));
      if (entry.error.stack) {
        parts.push(chalk.dim(`\nStack: ${entry.error.stack}`));
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
