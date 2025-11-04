"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dialogHandlers = dialogHandlers;
const electron_1 = require("electron");
const logger_1 = require("../services/logger");
function dialogHandlers() {
    // Show Open Dialog
    electron_1.ipcMain.handle('dialog:showOpenDialog', async (_event, options) => {
        try {
            logger_1.logger.debug('Showing open dialog with options:', options);
            const result = await electron_1.dialog.showOpenDialog(options);
            return { success: true, ...result };
        }
        catch (error) {
            logger_1.logger.error('Error showing open dialog:', error);
            return { success: false, error: error.message };
        }
    });
    // Show Save Dialog
    electron_1.ipcMain.handle('dialog:showSaveDialog', async (_event, options) => {
        try {
            logger_1.logger.debug('Showing save dialog with options:', options);
            const result = await electron_1.dialog.showSaveDialog(options);
            return { success: true, ...result };
        }
        catch (error) {
            logger_1.logger.error('Error showing save dialog:', error);
            return { success: false, error: error.message };
        }
    });
}
