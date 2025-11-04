"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.terminalHandlers = terminalHandlers;
const electron_1 = require("electron");
const pty = __importStar(require("node-pty"));
const logger_1 = require("../services/logger");
const terminals = new Map();
function terminalHandlers() {
    electron_1.ipcMain.handle('terminal:create', async (event, terminalId, cwd) => {
        try {
            logger_1.logger.debug('Creating terminal:', terminalId);
            const shell = process.platform === 'win32' ? 'powershell.exe' : 'bash';
            const ptyProcess = pty.spawn(shell, [], {
                name: 'xterm-256color',
                cols: 80,
                rows: 30,
                cwd: cwd || process.env.HOME || process.cwd(),
                env: process.env,
            });
            ptyProcess.onData((data) => {
                event.sender.send('terminal:data', { terminalId, data });
            });
            ptyProcess.onExit(({ exitCode, signal }) => {
                logger_1.logger.debug('Terminal exited:', terminalId, exitCode, signal);
                terminals.delete(terminalId);
                event.sender.send('terminal:exit', { terminalId, exitCode, signal });
            });
            terminals.set(terminalId, ptyProcess);
            return { success: true, terminalId };
        }
        catch (error) {
            logger_1.logger.error('Error creating terminal:', error);
            return { success: false, error: error.message };
        }
    });
    electron_1.ipcMain.handle('terminal:write', async (_event, terminalId, data) => {
        try {
            const terminal = terminals.get(terminalId);
            if (!terminal) {
                throw new Error('Terminal not found');
            }
            terminal.write(data);
            return { success: true };
        }
        catch (error) {
            logger_1.logger.error('Error writing to terminal:', error);
            return { success: false, error: error.message };
        }
    });
    electron_1.ipcMain.handle('terminal:resize', async (_event, terminalId, cols, rows) => {
        try {
            const terminal = terminals.get(terminalId);
            if (!terminal) {
                throw new Error('Terminal not found');
            }
            terminal.resize(cols, rows);
            return { success: true };
        }
        catch (error) {
            logger_1.logger.error('Error resizing terminal:', error);
            return { success: false, error: error.message };
        }
    });
    electron_1.ipcMain.handle('terminal:kill', async (_event, terminalId) => {
        try {
            const terminal = terminals.get(terminalId);
            if (!terminal) {
                return { success: true };
            }
            terminal.kill();
            terminals.delete(terminalId);
            return { success: true };
        }
        catch (error) {
            logger_1.logger.error('Error killing terminal:', error);
            return { success: false, error: error.message };
        }
    });
}
