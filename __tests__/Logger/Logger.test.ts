import { Logger, LogLevel, ConsoleLogOutput, DSLLogger, type LogOutput } from '@logger';

describe('Logger', () => {
  describe('LogLevel enum', () => {
    it('has ordered severity', () => {
      expect(LogLevel.debug).toBeLessThan(LogLevel.info);
      expect(LogLevel.info).toBeLessThan(LogLevel.warning);
      expect(LogLevel.warning).toBeLessThan(LogLevel.error);
      expect(LogLevel.error).toBeLessThan(LogLevel.none);
    });
  });

  describe('Logger class', () => {
    it('creates with default tag and level', () => {
      const logger = new Logger();
      expect(logger).toBeDefined();
    });

    it('respects minimum log level', () => {
      const output: LogOutput = { log: jest.fn() };
      const logger = new Logger('Test', LogLevel.warning, [output]);

      logger.debug('debug msg');
      logger.info('info msg');
      expect(output.log).not.toHaveBeenCalled();

      logger.warn('warn msg');
      expect(output.log).toHaveBeenCalledTimes(1);
      expect(output.log).toHaveBeenCalledWith(LogLevel.warning, 'Test', 'warn msg', undefined);
    });

    it('logs error level', () => {
      const output: LogOutput = { log: jest.fn() };
      const logger = new Logger('Test', LogLevel.error, [output]);

      logger.warn('skipped');
      expect(output.log).not.toHaveBeenCalled();

      logger.error('error msg', { code: 500 });
      expect(output.log).toHaveBeenCalledWith(LogLevel.error, 'Test', 'error msg', { code: 500 });
    });

    it('creates child logger with sub-tag', () => {
      const output: LogOutput = { log: jest.fn() };
      const parent = new Logger('App', LogLevel.debug, [output]);
      const child = parent.createChild('Network');

      child.info('request sent');
      expect(output.log).toHaveBeenCalledWith(LogLevel.info, 'App:Network', 'request sent', undefined);
    });

    it('supports multiple outputs', () => {
      const output1: LogOutput = { log: jest.fn() };
      const output2: LogOutput = { log: jest.fn() };
      const logger = new Logger('Test', LogLevel.debug, [output1]);
      logger.addOutput(output2);

      logger.info('msg');
      expect(output1.log).toHaveBeenCalledTimes(1);
      expect(output2.log).toHaveBeenCalledTimes(1);
    });

    it('survives output failures', () => {
      const failingOutput: LogOutput = { log: () => { throw new Error('fail'); } };
      const goodOutput: LogOutput = { log: jest.fn() };
      const logger = new Logger('Test', LogLevel.debug, [failingOutput, goodOutput]);

      expect(() => logger.info('msg')).not.toThrow();
      expect(goodOutput.log).toHaveBeenCalled();
    });

    it('can change min level', () => {
      const output: LogOutput = { log: jest.fn() };
      const logger = new Logger('Test', LogLevel.none, [output]);

      logger.error('suppressed');
      expect(output.log).not.toHaveBeenCalled();

      logger.setMinLevel(LogLevel.debug);
      logger.debug('now visible');
      expect(output.log).toHaveBeenCalledTimes(1);
    });
  });

  describe('ConsoleLogOutput', () => {
    it('creates without errors', () => {
      expect(new ConsoleLogOutput()).toBeDefined();
    });
  });

  describe('DSLLogger', () => {
    it('is a Logger instance', () => {
      expect(DSLLogger).toBeInstanceOf(Logger);
    });
  });
});
