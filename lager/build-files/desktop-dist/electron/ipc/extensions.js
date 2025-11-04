"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extensionHandlers = extensionHandlers;
const electron_1 = require("electron");
// Extension IPC Handlers - placeholder for now
function extensionHandlers() {
    electron_1.ipcMain.handle('extension:list', async () => {
        return { success: true, extensions: [] };
    });
    electron_1.ipcMain.handle('extension:install', async (_event, extensionPath) => {
        return { success: false, error: 'Not implemented yet' };
    });
    electron_1.ipcMain.handle('extension:uninstall', async (_event, extensionId) => {
        return { success: false, error: 'Not implemented yet' };
    });
    electron_1.ipcMain.handle('extension:enable', async (_event, extensionId) => {
        return { success: false, error: 'Not implemented yet' };
    });
    electron_1.ipcMain.handle('extension:disable', async (_event, extensionId) => {
        return { success: false, error: 'Not implemented yet' };
    });
}
