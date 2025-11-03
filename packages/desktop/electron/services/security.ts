import { session, ipcMain } from 'electron';
import { logger } from './logger';

export function setupSecurity(): void {
  setupCSP();
  setupPermissions();
  setupProtocolHandling();
  validateIPCCalls();

  logger.info('Security measures enabled');
}

function setupCSP(): void {
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data: https:",
          "font-src 'self' data:",
          "connect-src 'self' https://api.anthropic.com",
        ].join('; '),
      },
    });
  });
}

function setupPermissions(): void {
  session.defaultSession.setPermissionRequestHandler((_webContents, permission, callback) => {
    const allowedPermissions = ['clipboard-read', 'clipboard-write', 'media'];

    if (allowedPermissions.includes(permission)) {
      callback(true);
    } else {
      logger.warn(`Permission denied: ${permission}`);
      callback(false);
    }
  });
}

function setupProtocolHandling(): void {
  session.defaultSession.protocol.interceptFileProtocol('file', (request, callback) => {
    const url = request.url.substr(7);

    const allowedPaths = [process.resourcesPath, process.cwd()];

    const isAllowed = allowedPaths.some((allowedPath) => url.startsWith(allowedPath));

    if (isAllowed) {
      callback({ path: url });
    } else {
      logger.warn(`Blocked file access: ${url}`);
      callback({ error: -10 });
    }
  });
}

function validateIPCCalls(): void {
  const dangerousPatterns = [/eval\(/i, /Function\(/i, /require\(/i, /<script/i, /javascript:/i];

  ipcMain.on('*', (event, ...args) => {
    const argsString = JSON.stringify(args);

    for (const pattern of dangerousPatterns) {
      if (pattern.test(argsString)) {
        logger.error('Dangerous IPC call detected:', argsString);
        event.returnValue = { success: false, error: 'Blocked for security reasons' };
        return;
      }
    }
  });
}

export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

export function validatePath(path: string): boolean {
  const normalizedPath = path.replace(/\\/g, '/');

  const dangerousPatterns = [/\.\./, /^\/etc\//, /^\/sys\//, /^\/proc\//, /^C:\/Windows\//i];

  return !dangerousPatterns.some((pattern) => pattern.test(normalizedPath));
}
