import { app } from 'electron';
import fs from 'fs-extra';
import path from 'path';

enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

class Logger {
  private logDir: string;
  private logFile: string;
  private minLevel: LogLevel = LogLevel.INFO;

  constructor() {
    this.logDir = path.join(app.getPath('userData'), 'logs');
    this.ensureLogDir();
    this.logFile = this.getCurrentLogFile();
  }

  private ensureLogDir(): void {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  private getCurrentLogFile(): string {
    const today = new Date().toISOString().split('T')[0];
    return path.join(this.logDir, `oqool-${today}.log`);
  }

  private formatMessage(level: LogLevel, ...args: any[]): string {
    const timestamp = new Date().toISOString();
    const message = args
      .map((arg) => {
        if (typeof arg === 'object') {
          return JSON.stringify(arg, null, 2);
        }
        return String(arg);
      })
      .join(' ');

    return `[${timestamp}] [${level}] ${message}\n`;
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
    return levels.indexOf(level) >= levels.indexOf(this.minLevel);
  }

  private writeLog(level: LogLevel, ...args: any[]): void {
    if (!this.shouldLog(level)) {return;}

    const message = this.formatMessage(level, ...args);
    console.log(message.trim());

    try {
      // Rotate log file if date changed
      const currentLogFile = this.getCurrentLogFile();
      if (currentLogFile !== this.logFile) {
        this.logFile = currentLogFile;
      }

      fs.appendFileSync(this.logFile, message);
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }

  public setMinLevel(level: LogLevel): void {
    this.minLevel = level;
  }

  public debug(...args: any[]): void {
    this.writeLog(LogLevel.DEBUG, ...args);
  }

  public info(...args: any[]): void {
    this.writeLog(LogLevel.INFO, ...args);
  }

  public warn(...args: any[]): void {
    this.writeLog(LogLevel.WARN, ...args);
  }

  public error(...args: any[]): void {
    this.writeLog(LogLevel.ERROR, ...args);
  }

  public cleanOldLogs(daysToKeep: number = 7): void {
    try {
      const files = fs.readdirSync(this.logDir);
      const now = Date.now();
      const maxAge = daysToKeep * 24 * 60 * 60 * 1000;

      files.forEach((file) => {
        const filePath = path.join(this.logDir, file);
        const stats = fs.statSync(filePath);
        const age = now - stats.mtime.getTime();

        if (age > maxAge) {
          fs.unlinkSync(filePath);
          this.info(`Deleted old log file: ${file}`);
        }
      });
    } catch (error) {
      this.error('Failed to clean old logs:', error);
    }
  }
}

export const logger = new Logger();

// Clean old logs on startup
logger.cleanOldLogs();
