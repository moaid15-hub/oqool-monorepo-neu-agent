import { ipcMain, IpcMainInvokeEvent } from 'electron';
import * as pty from 'node-pty';
import { logger } from '../services/logger';

const terminals = new Map<string, pty.IPty>();

export function terminalHandlers() {
  ipcMain.handle(
    'terminal:create',
    async (event: IpcMainInvokeEvent, terminalId: string, cwd?: string) => {
      try {
        logger.debug('Creating terminal:', terminalId);

        const shell = process.platform === 'win32' ? 'powershell.exe' : 'bash';
        const ptyProcess = pty.spawn(shell, [], {
          name: 'xterm-256color',
          cols: 80,
          rows: 30,
          cwd: cwd || process.env.HOME || process.cwd(),
          env: process.env as { [key: string]: string },
        });

        ptyProcess.onData((data) => {
          event.sender.send('terminal:data', { terminalId, data });
        });

        ptyProcess.onExit(({ exitCode, signal }) => {
          logger.debug('Terminal exited:', terminalId, exitCode, signal);
          terminals.delete(terminalId);
          event.sender.send('terminal:exit', { terminalId, exitCode, signal });
        });

        terminals.set(terminalId, ptyProcess);

        return { success: true, terminalId };
      } catch (error: any) {
        logger.error('Error creating terminal:', error);
        return { success: false, error: error.message };
      }
    }
  );

  ipcMain.handle(
    'terminal:write',
    async (_event: IpcMainInvokeEvent, terminalId: string, data: string) => {
      try {
        const terminal = terminals.get(terminalId);
        if (!terminal) {
          throw new Error('Terminal not found');
        }

        terminal.write(data);
        return { success: true };
      } catch (error: any) {
        logger.error('Error writing to terminal:', error);
        return { success: false, error: error.message };
      }
    }
  );

  ipcMain.handle(
    'terminal:resize',
    async (_event: IpcMainInvokeEvent, terminalId: string, cols: number, rows: number) => {
      try {
        const terminal = terminals.get(terminalId);
        if (!terminal) {
          throw new Error('Terminal not found');
        }

        terminal.resize(cols, rows);
        return { success: true };
      } catch (error: any) {
        logger.error('Error resizing terminal:', error);
        return { success: false, error: error.message };
      }
    }
  );

  ipcMain.handle('terminal:kill', async (_event: IpcMainInvokeEvent, terminalId: string) => {
    try {
      const terminal = terminals.get(terminalId);
      if (!terminal) {
        return { success: true };
      }

      terminal.kill();
      terminals.delete(terminalId);
      return { success: true };
    } catch (error: any) {
      logger.error('Error killing terminal:', error);
      return { success: false, error: error.message };
    }
  });
}
