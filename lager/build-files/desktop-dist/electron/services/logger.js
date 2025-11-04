"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const electron_1 = require("electron");
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
var LogLevel;
(function (LogLevel) {
    LogLevel["DEBUG"] = "DEBUG";
    LogLevel["INFO"] = "INFO";
    LogLevel["WARN"] = "WARN";
    LogLevel["ERROR"] = "ERROR";
})(LogLevel || (LogLevel = {}));
class Logger {
    logDir;
    logFile;
    minLevel = LogLevel.INFO;
    constructor() {
        this.logDir = path_1.default.join(electron_1.app.getPath('userData'), 'logs');
        this.ensureLogDir();
        this.logFile = this.getCurrentLogFile();
    }
    ensureLogDir() {
        if (!fs_extra_1.default.existsSync(this.logDir)) {
            fs_extra_1.default.mkdirSync(this.logDir, { recursive: true });
        }
    }
    getCurrentLogFile() {
        const today = new Date().toISOString().split('T')[0];
        return path_1.default.join(this.logDir, `oqool-${today}.log`);
    }
    formatMessage(level, ...args) {
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
    shouldLog(level) {
        const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
        return levels.indexOf(level) >= levels.indexOf(this.minLevel);
    }
    writeLog(level, ...args) {
        if (!this.shouldLog(level))
            return;
        const message = this.formatMessage(level, ...args);
        console.log(message.trim());
        try {
            // Rotate log file if date changed
            const currentLogFile = this.getCurrentLogFile();
            if (currentLogFile !== this.logFile) {
                this.logFile = currentLogFile;
            }
            fs_extra_1.default.appendFileSync(this.logFile, message);
        }
        catch (error) {
            console.error('Failed to write to log file:', error);
        }
    }
    setMinLevel(level) {
        this.minLevel = level;
    }
    debug(...args) {
        this.writeLog(LogLevel.DEBUG, ...args);
    }
    info(...args) {
        this.writeLog(LogLevel.INFO, ...args);
    }
    warn(...args) {
        this.writeLog(LogLevel.WARN, ...args);
    }
    error(...args) {
        this.writeLog(LogLevel.ERROR, ...args);
    }
    cleanOldLogs(daysToKeep = 7) {
        try {
            const files = fs_extra_1.default.readdirSync(this.logDir);
            const now = Date.now();
            const maxAge = daysToKeep * 24 * 60 * 60 * 1000;
            files.forEach((file) => {
                const filePath = path_1.default.join(this.logDir, file);
                const stats = fs_extra_1.default.statSync(filePath);
                const age = now - stats.mtime.getTime();
                if (age > maxAge) {
                    fs_extra_1.default.unlinkSync(filePath);
                    this.info(`Deleted old log file: ${file}`);
                }
            });
        }
        catch (error) {
            this.error('Failed to clean old logs:', error);
        }
    }
}
exports.logger = new Logger();
// Clean old logs on startup
exports.logger.cleanOldLogs();
