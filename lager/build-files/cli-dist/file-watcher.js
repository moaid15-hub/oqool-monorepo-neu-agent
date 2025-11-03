// file-watcher.ts
// ============================================
// 👁️ File Watcher - مراقبة التغييرات التلقائية
// ============================================
import fs from 'fs-extra';
import { watch } from 'fs';
import { join, relative } from 'path';
import chalk from 'chalk';
export class FileWatcher {
    constructor(workingDirectory) {
        this.watchers = new Map();
        this.callbacks = [];
        this.fileStates = new Map(); // path -> lastModified
        // Ignored patterns
        this.ignorePatterns = [
            'node_modules',
            '.git',
            'dist',
            'build',
            '.next',
            '.cache',
            'coverage',
            '*.log',
            '.DS_Store',
            'package-lock.json'
        ];
        this.workingDirectory = workingDirectory;
    }
    // ============================================
    // 👁️ بدء المراقبة
    // ============================================
    async start() {
        console.log(chalk.cyan(`👁️  بدء مراقبة التغييرات في: ${this.workingDirectory}`));
        try {
            // مراقبة المجلد الرئيسي
            await this.watchDirectory(this.workingDirectory);
            console.log(chalk.green('✅ File Watcher نشط'));
        }
        catch (error) {
            console.error(chalk.red(`❌ فشل بدء File Watcher: ${error.message}`));
        }
    }
    // ============================================
    // 📁 مراقبة مجلد
    // ============================================
    async watchDirectory(dirPath) {
        // تحقق من وجود المجلد
        if (!await fs.pathExists(dirPath)) {
            return;
        }
        // إنشاء watcher
        const watcher = watch(dirPath, { recursive: true }, async (eventType, filename) => {
            if (!filename)
                return;
            const fullPath = join(dirPath, filename);
            const relativePath = relative(this.workingDirectory, fullPath);
            // تجاهل الملفات المستثناة
            if (this.shouldIgnore(relativePath)) {
                return;
            }
            // تحديد نوع التغيير
            try {
                const exists = await fs.pathExists(fullPath);
                if (exists) {
                    const stats = await fs.stat(fullPath);
                    const lastModified = stats.mtimeMs;
                    const previousModified = this.fileStates.get(fullPath);
                    if (!previousModified) {
                        // ملف جديد
                        this.fileStates.set(fullPath, lastModified);
                        this.notifyChange({
                            type: 'created',
                            path: relativePath,
                            timestamp: Date.now()
                        });
                    }
                    else if (previousModified !== lastModified) {
                        // ملف معدل
                        this.fileStates.set(fullPath, lastModified);
                        this.notifyChange({
                            type: 'modified',
                            path: relativePath,
                            timestamp: Date.now()
                        });
                    }
                }
                else {
                    // ملف محذوف
                    this.fileStates.delete(fullPath);
                    this.notifyChange({
                        type: 'deleted',
                        path: relativePath,
                        timestamp: Date.now()
                    });
                }
            }
            catch (error) {
                // ignore errors for temp files
            }
        });
        this.watchers.set(dirPath, watcher);
    }
    // ============================================
    // 🚫 تحديد الملفات المستثناة
    // ============================================
    shouldIgnore(filePath) {
        return this.ignorePatterns.some(pattern => {
            if (pattern.includes('*')) {
                const regex = new RegExp(pattern.replace('*', '.*'));
                return regex.test(filePath);
            }
            return filePath.includes(pattern);
        });
    }
    // ============================================
    // 📢 إشعار بالتغييرات
    // ============================================
    notifyChange(change) {
        const icon = {
            created: '➕',
            modified: '✏️',
            deleted: '🗑️'
        }[change.type];
        console.log(chalk.gray(`${icon} ${change.type}: ${change.path}`));
        // استدعاء callbacks
        for (const callback of this.callbacks) {
            try {
                callback(change);
            }
            catch (error) {
                console.error(chalk.red('خطأ في callback:'), error);
            }
        }
    }
    // ============================================
    // 📝 تسجيل callback
    // ============================================
    onChange(callback) {
        this.callbacks.push(callback);
    }
    // ============================================
    // 🛑 إيقاف المراقبة
    // ============================================
    stop() {
        console.log(chalk.yellow('🛑 إيقاف File Watcher...'));
        for (const [path, watcher] of this.watchers.entries()) {
            watcher.close();
            this.watchers.delete(path);
        }
        this.callbacks = [];
        this.fileStates.clear();
        console.log(chalk.gray('File Watcher متوقف'));
    }
    // ============================================
    // 📊 معلومات المراقبة
    // ============================================
    getStats() {
        return {
            watchedDirectories: this.watchers.size,
            trackedFiles: this.fileStates.size,
            callbacks: this.callbacks.length
        };
    }
    // ============================================
    // ➕ إضافة pattern للتجاهل
    // ============================================
    addIgnorePattern(pattern) {
        if (!this.ignorePatterns.includes(pattern)) {
            this.ignorePatterns.push(pattern);
        }
    }
    // ============================================
    // 📋 الحصول على الملفات المتتبعة
    // ============================================
    getTrackedFiles() {
        return Array.from(this.fileStates.keys()).map(path => relative(this.workingDirectory, path));
    }
}
//# sourceMappingURL=file-watcher.js.map