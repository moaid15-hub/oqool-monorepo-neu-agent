"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApplicationMenu = createApplicationMenu;
const electron_1 = require("electron");
function createApplicationMenu() {
    const template = [
        {
            label: 'File',
            submenu: [
                {
                    label: 'New File',
                    accelerator: 'CmdOrCtrl+N',
                    click: () => {
                        // Send to renderer
                    },
                },
                {
                    label: 'Open Folder',
                    accelerator: 'CmdOrCtrl+O',
                    click: () => {
                        // Send to renderer
                    },
                },
                { type: 'separator' },
                {
                    label: 'Save',
                    accelerator: 'CmdOrCtrl+S',
                    click: () => {
                        // Send to renderer
                    },
                },
                {
                    label: 'Save All',
                    accelerator: 'CmdOrCtrl+Shift+S',
                    click: () => {
                        // Send to renderer
                    },
                },
                { type: 'separator' },
                {
                    label: 'Close',
                    accelerator: 'CmdOrCtrl+W',
                    click: () => {
                        // Send to renderer
                    },
                },
                {
                    label: 'Quit',
                    accelerator: 'CmdOrCtrl+Q',
                    click: () => {
                        electron_1.app.quit();
                    },
                },
            ],
        },
        {
            label: 'Edit',
            submenu: [
                { role: 'undo' },
                { role: 'redo' },
                { type: 'separator' },
                { role: 'cut' },
                { role: 'copy' },
                { role: 'paste' },
                { role: 'delete' },
                { type: 'separator' },
                { role: 'selectAll' },
            ],
        },
        {
            label: 'View',
            submenu: [
                { role: 'reload' },
                { role: 'forceReload' },
                { role: 'toggleDevTools' },
                { type: 'separator' },
                { role: 'resetZoom' },
                { role: 'zoomIn' },
                { role: 'zoomOut' },
                { type: 'separator' },
                { role: 'togglefullscreen' },
            ],
        },
        {
            label: 'Terminal',
            submenu: [
                {
                    label: 'New Terminal',
                    accelerator: 'CmdOrCtrl+`',
                    click: () => {
                        // Send to renderer
                    },
                },
                {
                    label: 'Split Terminal',
                    accelerator: 'CmdOrCtrl+Shift+`',
                    click: () => {
                        // Send to renderer
                    },
                },
            ],
        },
        {
            label: 'Help',
            submenu: [
                {
                    label: 'Documentation',
                    click: async () => {
                        await electron_1.shell.openExternal('https://github.com/oqool-desktop/docs');
                    },
                },
                {
                    label: 'Report Issue',
                    click: async () => {
                        await electron_1.shell.openExternal('https://github.com/oqool-desktop/issues');
                    },
                },
                { type: 'separator' },
                {
                    label: 'About',
                    click: () => {
                        // Show about dialog
                    },
                },
            ],
        },
    ];
    return electron_1.Menu.buildFromTemplate(template);
}
