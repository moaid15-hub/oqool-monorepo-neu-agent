import { app, BrowserWindow, Menu } from 'electron';
import path from 'path';

let mainWindow: BrowserWindow | null = null;

// إخفاء القائمة الأصلية
Menu.setApplicationMenu(null);

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    backgroundColor: '#1e1e1e',
    
    // إعدادات الإطار
    frame: false,                    // بدون إطار
    titleBarStyle: 'hidden',         // إخفاء شريط العنوان
    
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
    },
  });

  // Load app
  if (app.isPackaged) {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  } else {
    mainWindow.loadURL('http://localhost:5174');
  }

  // Dev tools
  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools();
  }

  // عند إغلاق النافذة
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
