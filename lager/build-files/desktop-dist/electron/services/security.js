"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSecurity = setupSecurity;
exports.sanitizeInput = sanitizeInput;
exports.validatePath = validatePath;
const electron_1 = require("electron");
const logger_1 = require("./logger");
function setupSecurity() {
    setupCSP();
    setupPermissions();
    setupProtocolHandling();
    validateIPCCalls();
    logger_1.logger.info('Security measures enabled');
}
function setupCSP() {
    electron_1.session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
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
function setupPermissions() {
    electron_1.session.defaultSession.setPermissionRequestHandler((_webContents, permission, callback) => {
        const allowedPermissions = ['clipboard-read', 'clipboard-write', 'media'];
        if (allowedPermissions.includes(permission)) {
            callback(true);
        }
        else {
            logger_1.logger.warn(`Permission denied: ${permission}`);
            callback(false);
        }
    });
}
function setupProtocolHandling() {
    electron_1.session.defaultSession.protocol.interceptFileProtocol('file', (request, callback) => {
        const url = request.url.substr(7);
        const allowedPaths = [
            process.resourcesPath,
            process.cwd(),
        ];
        const isAllowed = allowedPaths.some((allowedPath) => url.startsWith(allowedPath));
        if (isAllowed) {
            callback({ path: url });
        }
        else {
            logger_1.logger.warn(`Blocked file access: ${url}`);
            callback({ error: -10 });
        }
    });
}
function validateIPCCalls() {
    const dangerousPatterns = [
        /eval\(/i,
        /Function\(/i,
        /require\(/i,
        /<script/i,
        /javascript:/i,
    ];
    electron_1.ipcMain.on('*', (event, ...args) => {
        const argsString = JSON.stringify(args);
        for (const pattern of dangerousPatterns) {
            if (pattern.test(argsString)) {
                logger_1.logger.error('Dangerous IPC call detected:', argsString);
                event.returnValue = { success: false, error: 'Blocked for security reasons' };
                return;
            }
        }
    });
}
function sanitizeInput(input) {
    return input
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
}
function validatePath(path) {
    const normalizedPath = path.replace(/\\/g, '/');
    const dangerousPatterns = [
        /\.\./,
        /^\/etc\//,
        /^\/sys\//,
        /^\/proc\//,
        /^C:\/Windows\//i,
    ];
    return !dangerousPatterns.some((pattern) => pattern.test(normalizedPath));
}
