import { autoUpdater } from 'electron-updater';
import { logger } from './logger';

export function setupAutoUpdater() {
  // Configure auto updater
  autoUpdater.logger = logger;

  autoUpdater.on('checking-for-update', () => {
    logger.info('Checking for updates...');
  });

  autoUpdater.on('update-available', (info) => {
    logger.info('Update available:', info);
  });

  autoUpdater.on('update-not-available', (info) => {
    logger.info('Update not available:', info);
  });

  autoUpdater.on('error', (err) => {
    logger.error('Error in auto-updater:', err);
  });

  autoUpdater.on('download-progress', (progressObj) => {
    logger.info(
      `Download speed: ${progressObj.bytesPerSecond} - Downloaded ${progressObj.percent}%`
    );
  });

  autoUpdater.on('update-downloaded', (info) => {
    logger.info('Update downloaded:', info);
    // Notify renderer process
  });

  // Check for updates
  autoUpdater.checkForUpdatesAndNotify();
}
