/**
 * Configurable logging system for the DSL framework.
 * Projects can set a custom log output to integrate with their logging infrastructure.
 */

/** Log severity levels. */
export enum LogLevel {
  debug = 0,
  info = 1,
  warning = 2,
  error = 3,
  none = 4,
}

/** Interface for custom log output targets. */
export interface LogOutput {
  log(level: LogLevel, tag: string, message: string, data?: unknown): void;
}

/** Default console-based log output. */
export class ConsoleLogOutput implements LogOutput {
  log(level: LogLevel, tag: string, message: string, data?: unknown): void {
    const prefix = `[${tag}]`;
    switch (level) {
      case LogLevel.debug:
        // eslint-disable-next-line no-console
        console.debug(prefix, message, data ?? '');
        break;
      case LogLevel.info:
        // eslint-disable-next-line no-console
        console.info(prefix, message, data ?? '');
        break;
      case LogLevel.warning:
        // eslint-disable-next-line no-console
        console.warn(prefix, message, data ?? '');
        break;
      case LogLevel.error:
        // eslint-disable-next-line no-console
        console.error(prefix, message, data ?? '');
        break;
      case LogLevel.none:
        break;
    }
  }
}

/**
 * Logger with configurable output, tag, and minimum level.
 *
 * @example
 * ```ts
 * const logger = new Logger('MyScreen', LogLevel.debug);
 * logger.debug('Loading data', { userId: 123 });
 * logger.info('Data loaded');
 * logger.warn('Deprecated API used');
 * logger.error('Failed to load', error);
 *
 * // Create child logger with sub-tag
 * const childLogger = logger.createChild('NetworkLayer');
 * childLogger.info('Request sent'); // [MyScreen:NetworkLayer] Request sent
 * ```
 */
export class Logger {
  private outputs: LogOutput[];
  private tag: string;
  private minLevel: LogLevel;

  constructor(
    tag: string = 'DSL',
    minLevel: LogLevel = LogLevel.warning,
    outputs?: LogOutput[],
  ) {
    this.tag = tag;
    this.minLevel = minLevel;
    this.outputs = outputs ?? [new ConsoleLogOutput()];
  }

  /** Creates a child logger with a sub-tag. */
  createChild(childTag: string): Logger {
    return new Logger(`${this.tag}:${childTag}`, this.minLevel, this.outputs);
  }

  /** Adds a log output target. */
  addOutput(output: LogOutput): void {
    this.outputs.push(output);
  }

  /** Sets the minimum log level. */
  setMinLevel(level: LogLevel): void {
    this.minLevel = level;
  }

  debug(message: string, data?: unknown): void {
    this.emit(LogLevel.debug, message, data);
  }

  info(message: string, data?: unknown): void {
    this.emit(LogLevel.info, message, data);
  }

  warn(message: string, data?: unknown): void {
    this.emit(LogLevel.warning, message, data);
  }

  error(message: string, data?: unknown): void {
    this.emit(LogLevel.error, message, data);
  }

  private emit(level: LogLevel, message: string, data?: unknown): void {
    if (level < this.minLevel) return;
    for (const output of this.outputs) {
      try {
        output.log(level, this.tag, message, data);
      } catch {
        // Prevent log output failures from crashing the app
      }
    }
  }
}

/** Default framework-level logger. Projects can replace the outputs. */
export const DSLLogger = new Logger('DSL', LogLevel.warning);
