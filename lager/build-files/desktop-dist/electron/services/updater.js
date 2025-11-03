"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupAutoUpdater = setupAutoUpdater;
const electron_updater_1 = require("electron-updater");
const logger_1 = require("./logger");
function setupAutoUpdater() {
    // Configure auto updater
    electron_updater_1.autoUpdater.logger = logger_1.logger;
    electron_updater_1.autoUpdater.on('checking-for-update', () => {
        logger_1.logger.info('Checking for updates...');
    });
    electron_updater_1.autoUpdater.on('update-available', (info) => {
        logger_1.logger.info('Update available:', info);
    });
    electron_updater_1.autoUpdater.on('update-not-available', (info) => {
        logger_1.logger.info('Update not available:', info);
    });
    electron_updater_1.autoUpdater.on('error', (err) => {
        logger_1.logger.error('Error in auto-updater:', err);
    });
    electron_updater_1.autoUpdater.on('download-progress', (progressObj) => {
        logger_1.logger.info(`Download speed: ${progressObj.bytesPerSecond} - Downloaded ${progressObj.percent}%`);
    });
    electron_updater_1.autoUpdater.on('update-downloaded', (info) => {
        logger_1.logger.info('Update downloaded:', info);
        // Notify renderer process
    });
    // Check for updates
    electron_updater_1.autoUpdater.checkForUpdatesAndNotify();
}
