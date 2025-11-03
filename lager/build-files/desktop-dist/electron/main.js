"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
const file_system_1 = require("./ipc/file-system");
const terminal_1 = require("./ipc/terminal");
const ai_1 = require("./ipc/ai");
const settings_1 = require("./ipc/settings");
const git_1 = require("./ipc/git");
const extensions_1 = require("./ipc/extensions");
const logger_1 = require("./services/logger");
const updater_1 = require("./services/updater");
// import { createApplicationMenu } from './menu'; // ← معطل لإخفاء القائمة
let mainWindow = null;
// إخفاء القائمة تماماً
electron_1.Menu.setApplicationMenu(null);
function createWindow() {
    mainWindow = new electron_1.BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 800,
        minHeight: 600,
        backgroundColor: '#1e1e1e',
        frame: false, // ← بدون إطار للسحب
        titleBarStyle: 'hidden', // ← إخفاء شريط العنوان
        autoHideMenuBar: true,
        webPreferences: {
            preload: path_1.default.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
            sandbox: false,
            webSecurity: true,
        },
        show: false,
    });
    if (electron_1.app.isPackaged) {
        mainWindow.loadFile(path_1.default.join(__dirname, '../renderer/index.html'));
    }
    else {
        mainWindow.loadURL('http://localhost:5173');
        mainWindow.webContents.openDevTools();
    }
    mainWindow.once('ready-to-show', () => {
        mainWindow?.show();
        logger_1.logger.info('Main window shown');
    });
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
    // القائمة معطلة - نستخدم القائمة الداخلية في التطبيق
    // const menu = createApplicationMenu();
    // Menu.setApplicationMenu(menu);
}
electron_1.app.whenReady().then(() => {
    logger_1.logger.info('App ready, creating window');
    (0, file_system_1.setupFileSystemHandlers)();
    (0, terminal_1.terminalHandlers)();
    (0, ai_1.setupAIHandlers)();
    (0, settings_1.settingsHandlers)();
    (0, git_1.gitHandlers)();
    (0, extensions_1.extensionHandlers)();
    createWindow();
    (0, updater_1.setupAutoUpdater)();
    electron_1.app.on('activate', () => {
        if (electron_1.BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
process.on('uncaughtException', (error) => {
    logger_1.logger.error('Uncaught exception:', error);
});
process.on('unhandledRejection', (reason, promise) => {
    logger_1.logger.error('Unhandled rejection at:', promise, 'reason:', reason);
});
