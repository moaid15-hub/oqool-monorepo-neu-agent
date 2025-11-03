// parallel-processor.ts
// ============================================
// ⚡ نظام المعالجة المتوازية
// ============================================
import pLimit from 'p-limit';
import chalk from 'chalk';
// ============================================
// ⚡ معالج متوازي
// ============================================
export class ParallelProcessor {
    constructor(options = {}) {
        this.concurrency = options.concurrency || 5;
        this.timeout = options.timeout || 30000;
        this.retries = options.retries || 2;
    }
    /**
     * معالجة ملفات متعددة بالتوازي
     */
    async processFiles(files, processor, options = {}) {
        const startTime = Date.now();
        const limit = pLimit(options.concurrency || this.concurrency);
        const results = [];
        const errors = [];
        let completed = 0;
        const total = files.length;
        // إنشاء tasks
        const tasks = files.map((file) => limit(async () => {
            const taskResult = await this.processWithRetry(file, processor);
            if (taskResult.success) {
                results.push(taskResult.result);
            }
            else {
                errors.push({
                    file: taskResult.file,
                    error: taskResult.error || 'Unknown error'
                });
            }
            completed++;
            if (options.onProgress) {
                options.onProgress(completed, total);
            }
            return taskResult;
        }));
        // تنفيذ جميع الـ tasks
        await Promise.all(tasks);
        const duration = Date.now() - startTime;
        return {
            success: errors.length === 0,
            results,
            errors,
            duration,
            completedCount: results.length,
            failedCount: errors.length
        };
    }
    /**
     * معالجة مع إعادة المحاولة
     */
    async processWithRetry(file, processor, attempt = 0) {
        const startTime = Date.now();
        try {
            // timeout wrapper
            const result = await Promise.race([
                processor(file),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), this.timeout))
            ]);
            return {
                file,
                success: true,
                result,
                duration: Date.now() - startTime
            };
        }
        catch (error) {
            // إعادة المحاولة
            if (attempt < this.retries) {
                console.log(chalk.yellow(`⚠️  إعادة المحاولة ${attempt + 1}/${this.retries} للملف: ${file}`));
                return await this.processWithRetry(file, processor, attempt + 1);
            }
            return {
                file,
                success: false,
                error: error.message,
                duration: Date.now() - startTime
            };
        }
    }
    /**
     * قراءة ملفات متعددة بالتوازي
     */
    async readFilesInParallel(fileManager, files) {
        console.log(chalk.cyan(`📁 قراءة ${files.length} ملف بالتوازي...\n`));
        const result = await this.processFiles(files, async (file) => {
            const content = await fileManager.readFile(file);
            if (!content) {
                throw new Error('فشل قراءة الملف');
            }
            return content;
        }, {
            onProgress: (completed, total) => {
                process.stdout.write(`\r📖 تقدم القراءة: ${completed}/${total}`);
            }
        });
        process.stdout.write('\n');
        return result;
    }
    /**
     * تحليل ملفات متعددة بالتوازي
     */
    async analyzeFilesInParallel(analyzer, files) {
        console.log(chalk.cyan(`🔍 تحليل ${files.length} ملف بالتوازي...\n`));
        const result = await this.processFiles(files, async (file) => {
            return await analyzer.analyzeFile(file);
        }, {
            onProgress: (completed, total) => {
                process.stdout.write(`\r🧠 تقدم التحليل: ${completed}/${total}`);
            }
        });
        process.stdout.write('\n');
        if (result.success) {
            console.log(chalk.green(`✅ تم تحليل ${result.completedCount} ملف بنجاح!\n`));
        }
        else {
            console.log(chalk.yellow(`⚠️  تم تحليل ${result.completedCount} ملف، فشل ${result.failedCount}\n`));
        }
        return result;
    }
    /**
     * كتابة ملفات متعددة بالتوازي
     */
    async writeFilesInParallel(fileManager, files) {
        console.log(chalk.cyan(`✍️  كتابة ${files.length} ملف بالتوازي...\n`));
        const result = await this.processFiles(files.map(f => f.path), async (filePath) => {
            const file = files.find(f => f.path === filePath);
            return await fileManager.writeFile(file.path, file.content);
        }, {
            onProgress: (completed, total) => {
                process.stdout.write(`\r💾 تقدم الكتابة: ${completed}/${total}`);
            }
        });
        process.stdout.write('\n');
        if (result.success) {
            console.log(chalk.green(`✅ تم كتابة ${result.completedCount} ملف بنجاح!\n`));
        }
        else {
            console.log(chalk.yellow(`⚠️  تم كتابة ${result.completedCount} ملف، فشل ${result.failedCount}\n`));
        }
        return result;
    }
    /**
     * معالجة دفعات (batches)
     */
    async processBatches(items, batchSize, processor) {
        const startTime = Date.now();
        const results = [];
        const errors = [];
        // تقسيم إلى batches
        const batches = [];
        for (let i = 0; i < items.length; i += batchSize) {
            batches.push(items.slice(i, i + batchSize));
        }
        console.log(chalk.cyan(`📦 معالجة ${batches.length} دفعة (batch)...\n`));
        // معالجة كل batch
        for (let i = 0; i < batches.length; i++) {
            const batch = batches[i];
            try {
                const batchResults = await processor(batch);
                results.push(...batchResults);
                console.log(chalk.green(`✅ دفعة ${i + 1}/${batches.length} - ${batchResults.length} عنصر`));
            }
            catch (error) {
                console.log(chalk.red(`❌ فشلت دفعة ${i + 1}/${batches.length}: ${error.message}`));
                batch.forEach(item => {
                    errors.push({
                        file: item,
                        error: error.message
                    });
                });
            }
        }
        const duration = Date.now() - startTime;
        return {
            success: errors.length === 0,
            results,
            errors,
            duration,
            completedCount: results.length,
            failedCount: errors.length
        };
    }
    /**
     * معالجة مع progress bar
     */
    async processWithProgress(files, processor, label = 'معالجة') {
        console.log(chalk.cyan(`\n⚡ ${label} ${files.length} ملف...\n`));
        const startTime = Date.now();
        const result = await this.processFiles(files, processor, {
            onProgress: (completed, total) => {
                const percentage = Math.round((completed / total) * 100);
                const progressBar = this.createProgressBar(percentage);
                process.stdout.write(`\r${progressBar} ${completed}/${total} (${percentage}%)`);
            }
        });
        process.stdout.write('\n\n');
        const duration = (result.duration / 1000).toFixed(2);
        if (result.success) {
            console.log(chalk.green(`✅ ${label} مكتمل! (${duration}s)\n`));
        }
        else {
            console.log(chalk.yellow(`⚠️  ${label} مكتمل بأخطاء: ${result.failedCount}/${files.length} فشل (${duration}s)\n`));
        }
        return result;
    }
    /**
     * إنشاء progress bar
     */
    createProgressBar(percentage, width = 30) {
        const filled = Math.round((percentage / 100) * width);
        const empty = width - filled;
        const bar = '█'.repeat(filled) + '░'.repeat(empty);
        return `[${bar}]`;
    }
    /**
     * عرض إحصائيات النتائج
     */
    displayResults(result, label = 'العملية') {
        console.log(chalk.cyan(`\n📊 إحصائيات ${label}:`));
        console.log(chalk.gray('═'.repeat(60)));
        console.log(chalk.white(`⏱️  الوقت: ${(result.duration / 1000).toFixed(2)}s`));
        console.log(chalk.green(`✅ نجح: ${result.completedCount}`));
        if (result.failedCount > 0) {
            console.log(chalk.red(`❌ فشل: ${result.failedCount}`));
            if (result.errors.length > 0) {
                console.log(chalk.yellow('\n⚠️  الأخطاء:'));
                result.errors.forEach(error => {
                    console.log(chalk.red(`  • ${error.file}: ${error.error}`));
                });
            }
        }
        console.log(chalk.gray('═'.repeat(60) + '\n'));
    }
}
// تصدير instance
export function createParallelProcessor(options) {
    return new ParallelProcessor(options);
}
//# sourceMappingURL=parallel-processor.js.map