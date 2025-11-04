// history-manager.ts
// ============================================
// ⏮️ نظام التراجع والإعادة (Undo/Redo)
// ============================================
import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
// ============================================
// ⏮️ مدير التاريخ
// ============================================
export class HistoryManager {
    workingDir;
    history;
    currentIndex; // يشير للعنصر الحالي
    maxEntries;
    autoSave;
    historyPath;
    constructor(workingDir = process.cwd(), options = {}) {
        this.workingDir = workingDir;
        this.history = [];
        this.currentIndex = -1; // -1 يعني لا يوجد entries
        this.maxEntries = options.maxEntries || 50;
        this.autoSave = options.autoSave ?? true;
        this.historyPath = options.historyPath || path.join(workingDir, '.oqool', 'history.json');
        this.loadHistory();
    }
    /**
     * تحميل التاريخ من الملف
     */
    async loadHistory() {
        try {
            if (await fs.pathExists(this.historyPath)) {
                const data = await fs.readJSON(this.historyPath);
                // تحويل Maps من objects
                this.history = data.history.map((entry) => ({
                    ...entry,
                    before: new Map(Object.entries(entry.before)),
                    after: new Map(Object.entries(entry.after))
                }));
                this.currentIndex = data.currentIndex;
            }
        }
        catch (error) {
            console.log(chalk.yellow('⚠️  فشل تحميل التاريخ، سيتم البدء بتاريخ جديد'));
            this.history = [];
            this.currentIndex = -1;
        }
    }
    /**
     * حفظ التاريخ في الملف
     */
    async saveHistory() {
        if (!this.autoSave)
            return;
        try {
            await fs.ensureDir(path.dirname(this.historyPath));
            // تحويل Maps إلى objects للـ JSON
            const data = {
                history: this.history.map(entry => ({
                    ...entry,
                    before: Object.fromEntries(entry.before),
                    after: Object.fromEntries(entry.after)
                })),
                currentIndex: this.currentIndex
            };
            await fs.writeJSON(this.historyPath, data, { spaces: 2 });
        }
        catch (error) {
            console.log(chalk.red('❌ فشل حفظ التاريخ'));
        }
    }
    /**
     * توليد ID فريد
     */
    generateId() {
        return `${Date.now()}-${Math.random().toString(36).substring(7)}`;
    }
    /**
     * قراءة محتويات الملفات الحالية
     */
    async readFiles(files) {
        const contents = new Map();
        for (const file of files) {
            try {
                const fullPath = path.join(this.workingDir, file);
                if (await fs.pathExists(fullPath)) {
                    const content = await fs.readFile(fullPath, 'utf8');
                    contents.set(file, content);
                }
                else {
                    contents.set(file, ''); // ملف جديد
                }
            }
            catch (error) {
                contents.set(file, '');
            }
        }
        return contents;
    }
    /**
     * إضافة entry جديد
     */
    async addEntry(action, description, files, metadata) {
        // قراءة محتوى الملفات قبل التعديل
        const before = await this.readFiles(files);
        // إنشاء entry جديد
        const entry = {
            id: this.generateId(),
            action,
            description,
            timestamp: Date.now(),
            files,
            before,
            after: new Map(), // سنملأه بعد التعديل
            metadata
        };
        // حذف أي entries بعد currentIndex (إذا عملنا undo ثم action جديد)
        this.history = this.history.slice(0, this.currentIndex + 1);
        // إضافة entry جديد
        this.history.push(entry);
        this.currentIndex++;
        // فرض الحد الأقصى
        if (this.history.length > this.maxEntries) {
            this.history.shift();
            this.currentIndex--;
        }
        await this.saveHistory();
    }
    /**
     * تحديث entry بعد التعديل
     */
    async updateCurrentEntry() {
        if (this.currentIndex < 0 || this.currentIndex >= this.history.length) {
            return;
        }
        const entry = this.history[this.currentIndex];
        // قراءة محتوى الملفات بعد التعديل
        entry.after = await this.readFiles(entry.files);
        await this.saveHistory();
    }
    /**
     * التراجع (Undo)
     */
    async undo() {
        if (!this.canUndo()) {
            console.log(chalk.yellow('⚠️  لا يمكن التراجع - لا يوجد تاريخ'));
            return false;
        }
        const entry = this.history[this.currentIndex];
        console.log(chalk.cyan(`\n⏮️  التراجع عن: ${entry.description}\n`));
        // استعادة محتويات الملفات
        for (const [file, content] of entry.before.entries()) {
            try {
                const fullPath = path.join(this.workingDir, file);
                if (content === '') {
                    // الملف كان غير موجود، نحذفه
                    if (await fs.pathExists(fullPath)) {
                        await fs.remove(fullPath);
                        console.log(chalk.red(`  🗑️  حذف: ${file}`));
                    }
                }
                else {
                    // استعادة المحتوى
                    await fs.ensureDir(path.dirname(fullPath));
                    await fs.writeFile(fullPath, content, 'utf8');
                    console.log(chalk.green(`  ↶ استعادة: ${file}`));
                }
            }
            catch (error) {
                console.log(chalk.red(`  ❌ فشل استعادة ${file}: ${error.message}`));
            }
        }
        this.currentIndex--;
        await this.saveHistory();
        console.log(chalk.green('\n✅ تم التراجع بنجاح!\n'));
        return true;
    }
    /**
     * الإعادة (Redo)
     */
    async redo() {
        if (!this.canRedo()) {
            console.log(chalk.yellow('⚠️  لا يمكن الإعادة - لا يوجد تاريخ للإعادة'));
            return false;
        }
        this.currentIndex++;
        const entry = this.history[this.currentIndex];
        console.log(chalk.cyan(`\n⏭️  إعادة: ${entry.description}\n`));
        // تطبيق محتويات الملفات الجديدة
        for (const [file, content] of entry.after.entries()) {
            try {
                const fullPath = path.join(this.workingDir, file);
                if (content === '') {
                    // حذف الملف
                    if (await fs.pathExists(fullPath)) {
                        await fs.remove(fullPath);
                        console.log(chalk.red(`  🗑️  حذف: ${file}`));
                    }
                }
                else {
                    // كتابة المحتوى
                    await fs.ensureDir(path.dirname(fullPath));
                    await fs.writeFile(fullPath, content, 'utf8');
                    console.log(chalk.green(`  ↷ إعادة: ${file}`));
                }
            }
            catch (error) {
                console.log(chalk.red(`  ❌ فشل إعادة ${file}: ${error.message}`));
            }
        }
        await this.saveHistory();
        console.log(chalk.green('\n✅ تم الإعادة بنجاح!\n'));
        return true;
    }
    /**
     * هل يمكن التراجع؟
     */
    canUndo() {
        return this.currentIndex >= 0;
    }
    /**
     * هل يمكن الإعادة؟
     */
    canRedo() {
        return this.currentIndex < this.history.length - 1;
    }
    /**
     * عرض التاريخ
     */
    showHistory() {
        if (this.history.length === 0) {
            console.log(chalk.yellow('\n⚠️  لا يوجد تاريخ\n'));
            return;
        }
        console.log(chalk.cyan('\n📜 التاريخ:\n'));
        console.log(chalk.gray('═'.repeat(80)));
        this.history.forEach((entry, index) => {
            const isCurrent = index === this.currentIndex;
            const date = new Date(entry.timestamp).toLocaleString('ar-EG');
            const marker = isCurrent ? chalk.green('→') : ' ';
            const color = isCurrent ? chalk.white : chalk.gray;
            console.log(color(`${marker} ${index + 1}. ${entry.description}`));
            console.log(color(`   الوقت: ${date}`));
            console.log(color(`   الملفات: ${entry.files.join(', ')}`));
            if (entry.metadata?.command) {
                console.log(color(`   الأمر: ${entry.metadata.command}`));
            }
            console.log('');
        });
        console.log(chalk.gray('═'.repeat(80)));
        console.log(chalk.cyan(`\nالموقع الحالي: ${this.currentIndex + 1}/${this.history.length}`));
        console.log(chalk.white(`يمكن التراجع: ${this.canUndo() ? '✅' : '❌'}`));
        console.log(chalk.white(`يمكن الإعادة: ${this.canRedo() ? '✅' : '❌'}\n`));
    }
    /**
     * الذهاب لـ entry محدد
     */
    async goTo(index) {
        if (index < 0 || index >= this.history.length) {
            console.log(chalk.red('❌ رقم غير صحيح'));
            return false;
        }
        if (index === this.currentIndex) {
            console.log(chalk.yellow('⚠️  أنت بالفعل في هذا الموقع'));
            return false;
        }
        console.log(chalk.cyan(`\n🎯 الانتقال إلى: ${index + 1}\n`));
        // التراجع أو التقدم حسب الحاجة
        while (this.currentIndex !== index) {
            if (this.currentIndex > index) {
                await this.undo();
            }
            else {
                await this.redo();
            }
        }
        return true;
    }
    /**
     * مسح التاريخ
     */
    async clearHistory() {
        this.history = [];
        this.currentIndex = -1;
        await fs.remove(this.historyPath);
        console.log(chalk.green('✅ تم مسح التاريخ'));
    }
    /**
     * الحصول على إحصائيات
     */
    getStats() {
        let totalSize = 0;
        for (const entry of this.history) {
            for (const content of entry.before.values()) {
                totalSize += Buffer.byteLength(content, 'utf8');
            }
            for (const content of entry.after.values()) {
                totalSize += Buffer.byteLength(content, 'utf8');
            }
        }
        return {
            totalEntries: this.history.length,
            currentIndex: this.currentIndex,
            canUndo: this.canUndo(),
            canRedo: this.canRedo(),
            totalSize
        };
    }
    /**
     * عرض إحصائيات
     */
    displayStats() {
        const stats = this.getStats();
        console.log(chalk.cyan('\n📊 إحصائيات التاريخ:'));
        console.log(chalk.gray('═'.repeat(60)));
        console.log(chalk.white(`📝 عدد الـ entries: ${stats.totalEntries}`));
        console.log(chalk.white(`📍 الموقع الحالي: ${stats.currentIndex + 1}`));
        console.log(chalk.white(`💾 الحجم الكلي: ${(stats.totalSize / 1024).toFixed(2)} KB`));
        console.log(chalk.white(`⏮️  يمكن التراجع: ${stats.canUndo ? '✅' : '❌'}`));
        console.log(chalk.white(`⏭️  يمكن الإعادة: ${stats.canRedo ? '✅' : '❌'}`));
        console.log(chalk.gray('═'.repeat(60) + '\n'));
    }
    /**
     * البحث في التاريخ
     */
    search(query) {
        return this.history.filter(entry => entry.description.toLowerCase().includes(query.toLowerCase()) ||
            entry.files.some(file => file.toLowerCase().includes(query.toLowerCase())));
    }
    /**
     * عرض نتائج البحث
     */
    displaySearch(query) {
        const results = this.search(query);
        if (results.length === 0) {
            console.log(chalk.yellow(`\n⚠️  لا توجد نتائج لـ: "${query}"\n`));
            return;
        }
        console.log(chalk.cyan(`\n🔍 نتائج البحث عن "${query}" (${results.length}):\n`));
        console.log(chalk.gray('─'.repeat(80)));
        results.forEach((entry, i) => {
            const date = new Date(entry.timestamp).toLocaleString('ar-EG');
            console.log(chalk.white(`${i + 1}. ${entry.description}`));
            console.log(chalk.gray(`   الوقت: ${date}`));
            console.log(chalk.gray(`   الملفات: ${entry.files.join(', ')}`));
            console.log('');
        });
        console.log(chalk.gray('─'.repeat(80) + '\n'));
    }
    /**
     * تصدير التاريخ
     */
    async exportHistory(format = 'json') {
        const exportPath = path.join(this.workingDir, `.oqool/history-export.${format}`);
        if (format === 'json') {
            const data = {
                exported: new Date().toISOString(),
                entries: this.history.map(entry => ({
                    id: entry.id,
                    action: entry.action,
                    description: entry.description,
                    timestamp: entry.timestamp,
                    date: new Date(entry.timestamp).toISOString(),
                    files: entry.files,
                    metadata: entry.metadata
                }))
            };
            await fs.writeJSON(exportPath, data, { spaces: 2 });
        }
        else {
            // CSV format
            let csv = 'ID,Action,Description,Timestamp,Date,Files\n';
            for (const entry of this.history) {
                const date = new Date(entry.timestamp).toISOString();
                const files = entry.files.join('; ');
                csv += `"${entry.id}","${entry.action}","${entry.description}",${entry.timestamp},"${date}","${files}"\n`;
            }
            await fs.writeFile(exportPath, csv, 'utf8');
        }
        return exportPath;
    }
}
// تصدير instance
export function createHistoryManager(workingDir, options) {
    return new HistoryManager(workingDir, options);
}
//# sourceMappingURL=history-manager.js.map