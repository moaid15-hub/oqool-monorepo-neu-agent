"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.settingsHandlers = settingsHandlers;
const electron_1 = require("electron");
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const electron_2 = require("electron");
const logger_1 = require("../services/logger");
let settings = {};
let settingsPath;
function initializeSettings() {
    const userDataPath = electron_2.app.getPath('userData');
    settingsPath = path_1.default.join(userDataPath, 'settings.json');
    if (fs_extra_1.default.existsSync(settingsPath)) {
        try {
            const data = fs_extra_1.default.readFileSync(settingsPath, 'utf-8');
            settings = JSON.parse(data);
        }
        catch (error) {
            logger_1.logger.error('Failed to load settings:', error);
            settings = getDefaultSettings();
        }
    }
    else {
        settings = getDefaultSettings();
        saveSettingsToFile();
    }
}
function getDefaultSettings() {
    return {
        editor: {
            fontSize: 14,
            fontFamily: 'Fira Code',
            lineHeight: 21,
            tabSize: 2,
            insertSpaces: true,
            wordWrap: 'on',
            minimap: true,
        },
        theme: {
            id: 'oqool-dark',
            name: 'Oqool Dark',
        },
        terminal: {
            fontSize: 14,
            fontFamily: 'Fira Code',
            shell: process.platform === 'win32' ? 'powershell.exe' : 'bash',
        },
        ai: {
            defaultPersonality: 'sarah',
            model: 'claude-sonnet-4-20250514',
            inlineSuggestionsEnabled: true,
        },
        git: {
            autoFetch: true,
            confirmSync: true,
        },
        locale: 'ar',
    };
}
function saveSettingsToFile() {
    try {
        fs_extra_1.default.writeFileSync(settingsPath, JSON.stringify(settings, null, 2), 'utf-8');
    }
    catch (error) {
        logger_1.logger.error('Failed to save settings:', error);
    }
}
function settingsHandlers() {
    initializeSettings();
    electron_1.ipcMain.handle('settings:get', async (_event, key) => {
        try {
            const keys = key.split('.');
            let value = settings;
            for (const k of keys) {
                value = value?.[k];
            }
            return { success: true, value };
        }
        catch (error) {
            logger_1.logger.error('Error getting setting:', error);
            return { success: false, error: error.message };
        }
    });
    electron_1.ipcMain.handle('settings:set', async (_event, key, value) => {
        try {
            const keys = key.split('.');
            let obj = settings;
            for (let i = 0; i < keys.length - 1; i++) {
                if (!obj[keys[i]]) {
                    obj[keys[i]] = {};
                }
                obj = obj[keys[i]];
            }
            obj[keys[keys.length - 1]] = value;
            saveSettingsToFile();
            return { success: true };
        }
        catch (error) {
            logger_1.logger.error('Error setting setting:', error);
            return { success: false, error: error.message };
        }
    });
    electron_1.ipcMain.handle('settings:getAll', async (_event) => {
        try {
            return { success: true, settings };
        }
        catch (error) {
            logger_1.logger.error('Error getting all settings:', error);
            return { success: false, error: error.message };
        }
    });
}
