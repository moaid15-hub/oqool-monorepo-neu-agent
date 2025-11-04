// collaborative-features.ts
// ============================================
// 👥 ميزات التعاون للفرق
// ============================================
import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { FileManager } from './file-manager.js';
export class CollaborativeFeatures {
    apiClient;
    fileManager;
    workingDir;
    constructor(apiClient, workingDir = process.cwd()) {
        this.apiClient = apiClient;
        this.fileManager = new FileManager(workingDir);
        this.workingDir = workingDir;
    }
    /**
     * إنشاء جلسة تعاون
     */
    async createSession(name, description, members) {
        const spinner = ora('إنشاء جلسة التعاون...').start();
        try {
            const session = {
                id: this.generateId(),
                name,
                description,
                createdBy: 'current_user', // سيتم الحصول عليه من auth
                createdAt: new Date().toISOString(),
                members,
                files: [],
                status: 'active',
                lastActivity: new Date().toISOString(),
                sharedCode: new Map()
            };
            // حفظ الجلسة محلياً
            const sessionsPath = path.join(this.workingDir, '.oqool', 'sessions');
            await fs.ensureDir(sessionsPath);
            const sessionPath = path.join(sessionsPath, `${session.id}.json`);
            await fs.writeJson(sessionPath, session, { spaces: 2 });
            spinner.succeed('تم إنشاء جلسة التعاون بنجاح!');
            console.log(chalk.green(`\n📋 جلسة: ${name}`));
            console.log(chalk.cyan(`   الأعضاء: ${members.length} عضو`));
            console.log(chalk.gray(`   معرف الجلسة: ${session.id}\n`));
            return session;
        }
        catch (error) {
            spinner.fail('فشل في إنشاء الجلسة');
            throw error;
        }
    }
    /**
     * دعوة عضو للجلسة
     */
    async inviteMember(sessionId, email, role = 'member') {
        const spinner = ora('إرسال الدعوة...').start();
        try {
            // قراءة الجلسة
            const session = await this.getSession(sessionId);
            if (!session) {
                throw new Error('الجلسة غير موجودة');
            }
            // إضافة العضو
            if (!session.members.includes(email)) {
                session.members.push(email);
                session.lastActivity = new Date().toISOString();
                // حفظ التحديث
                await this.saveSession(session);
            }
            spinner.succeed('تم إرسال الدعوة بنجاح!');
            console.log(chalk.green(`\n📧 دعوة مرسلة إلى: ${email}`));
            console.log(chalk.cyan(`   الدور: ${this.getRoleName(role)}`));
            console.log(chalk.gray(`   رابط الانضمام: https://oqool.net/session/${sessionId}\n`));
        }
        catch (error) {
            spinner.fail('فشل في إرسال الدعوة');
            throw error;
        }
    }
    /**
     * مشاركة كود في الجلسة
     */
    async shareCode(sessionId, files) {
        const spinner = ora('مشاركة الكود...').start();
        try {
            const session = await this.getSession(sessionId);
            if (!session) {
                throw new Error('الجلسة غير موجودة');
            }
            // قراءة الملفات
            for (const file of files) {
                const content = await this.fileManager.readFile(file);
                if (content) {
                    session.sharedCode.set(file, content);
                    session.lastActivity = new Date().toISOString();
                }
            }
            // تحديث قائمة الملفات
            session.files = Array.from(session.sharedCode.keys());
            await this.saveSession(session);
            spinner.succeed('تم مشاركة الكود بنجاح!');
            console.log(chalk.green(`\n📤 تم مشاركة ${files.length} ملف`));
            console.log(chalk.cyan(`   في الجلسة: ${session.name}\n`));
        }
        catch (error) {
            spinner.fail('فشل في مشاركة الكود');
            throw error;
        }
    }
    /**
     * إنشاء مراجعة كود
     */
    async createCodeReview(title, description, files, reviewer) {
        const spinner = ora('إنشاء مراجعة الكود...').start();
        try {
            const review = {
                id: this.generateId(),
                title,
                description,
                files,
                reviewer,
                reviewee: 'current_user',
                status: 'pending',
                comments: [],
                createdAt: new Date().toISOString()
            };
            // حفظ المراجعة
            const reviewsPath = path.join(this.workingDir, '.oqool', 'reviews');
            await fs.ensureDir(reviewsPath);
            const reviewPath = path.join(reviewsPath, `${review.id}.json`);
            await fs.writeJson(reviewPath, review, { spaces: 2 });
            spinner.succeed('تم إنشاء مراجعة الكود!');
            console.log(chalk.green(`\n🔍 مراجعة: ${title}`));
            console.log(chalk.cyan(`   الملفات: ${files.length}`));
            console.log(chalk.gray(`   المراجع: ${reviewer}\n`));
            return review;
        }
        catch (error) {
            spinner.fail('فشل في إنشاء المراجعة');
            throw error;
        }
    }
    /**
     * إضافة تعليق للمراجعة
     */
    async addReviewComment(reviewId, file, line, type, content) {
        const spinner = ora('إضافة التعليق...').start();
        try {
            const review = await this.getReview(reviewId);
            if (!review) {
                throw new Error('المراجعة غير موجودة');
            }
            const comment = {
                id: this.generateId(),
                file,
                line,
                type,
                content,
                author: 'current_user',
                timestamp: new Date().toISOString(),
                resolved: false
            };
            review.comments.push(comment);
            review.status = 'in-progress';
            await this.saveReview(review);
            spinner.succeed('تم إضافة التعليق!');
            const typeEmoji = type === 'issue' ? '❌' : type === 'suggestion' ? '💡' : '✅';
            console.log(chalk.green(`\n${typeEmoji} ${file}:${line} - ${content}\n`));
        }
        catch (error) {
            spinner.fail('فشل في إضافة التعليق');
            throw error;
        }
    }
    /**
     * إنشاء قالب فريق
     */
    async createTeamTemplate(name, description, category, files, tags = []) {
        const spinner = ora('إنشاء القالب...').start();
        try {
            const templateFiles = [];
            for (const file of files) {
                const content = await this.fileManager.readFile(file);
                if (content) {
                    // استخراج المتغيرات من المحتوى
                    const variables = this.extractVariables(content);
                    templateFiles.push({
                        path: file,
                        content,
                        variables
                    });
                }
            }
            const template = {
                id: this.generateId(),
                name,
                description,
                category,
                files: templateFiles,
                createdBy: 'current_user',
                tags,
                usageCount: 0,
                rating: 0
            };
            // حفظ القالب
            const templatesPath = path.join(this.workingDir, '.oqool', 'team-templates');
            await fs.ensureDir(templatesPath);
            const templatePath = path.join(templatesPath, `${template.id}.json`);
            await fs.writeJson(templatePath, template, { spaces: 2 });
            spinner.succeed('تم إنشاء القالب بنجاح!');
            console.log(chalk.green(`\n📋 قالب: ${name}`));
            console.log(chalk.cyan(`   الملفات: ${files.length}`));
            console.log(chalk.gray(`   الفئة: ${category}\n`));
            return template;
        }
        catch (error) {
            spinner.fail('فشل في إنشاء القالب');
            throw error;
        }
    }
    /**
     * البحث في قوالب الفريق
     */
    async searchTeamTemplates(query) {
        try {
            const templatesPath = path.join(this.workingDir, '.oqool', 'team-templates');
            if (!await fs.pathExists(templatesPath)) {
                return [];
            }
            const templates = [];
            const files = await fs.readdir(templatesPath);
            for (const file of files) {
                if (file.endsWith('.json')) {
                    const templatePath = path.join(templatesPath, file);
                    const template = await fs.readJson(templatePath);
                    if (template.name.toLowerCase().includes(query.toLowerCase()) ||
                        template.description.toLowerCase().includes(query.toLowerCase()) ||
                        template.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())) ||
                        template.category.toLowerCase().includes(query.toLowerCase())) {
                        templates.push(template);
                    }
                }
            }
            return templates.sort((a, b) => b.usageCount - a.usageCount);
        }
        catch (error) {
            console.error(chalk.red('❌ فشل في البحث في القوالب:'), error);
            return [];
        }
    }
    /**
     * إنشاء تقرير تعاون
     */
    async generateCollaborationReport() {
        const spinner = ora('إنشاء تقرير التعاون...').start();
        try {
            const reportPath = path.join(this.workingDir, '.oqool', 'collaboration-report.md');
            let report = `# 📊 تقرير التعاون - ${new Date().toLocaleDateString('ar')}\n\n`;
            // جلسات التعاون
            const sessions = await this.getAllSessions();
            report += `## 👥 جلسات التعاون\n\n`;
            report += `**الإجمالي:** ${sessions.length} جلسة\n\n`;
            for (const session of sessions.slice(0, 5)) {
                report += `### ${session.name}\n`;
                report += `- **الأعضاء:** ${session.members.length}\n`;
                report += `- **الملفات:** ${session.files.length}\n`;
                report += `- **الحالة:** ${session.status}\n`;
                report += `- **آخر نشاط:** ${new Date(session.lastActivity).toLocaleString('ar')}\n\n`;
            }
            // مراجعات الكود
            const reviews = await this.getAllReviews();
            report += `## 🔍 مراجعات الكود\n\n`;
            report += `**الإجمالي:** ${reviews.length} مراجعة\n\n`;
            const statusCounts = new Map();
            for (const review of reviews) {
                statusCounts.set(review.status, (statusCounts.get(review.status) || 0) + 1);
            }
            for (const [status, count] of statusCounts.entries()) {
                report += `- **${this.getStatusName(status)}:** ${count}\n`;
            }
            report += `\n`;
            // قوالب الفريق
            const templates = await this.getAllTemplates();
            report += `## 📋 قوالب الفريق\n\n`;
            report += `**الإجمالي:** ${templates.length} قالب\n\n`;
            const categoryCounts = new Map();
            for (const template of templates) {
                categoryCounts.set(template.category, (categoryCounts.get(template.category) || 0) + 1);
            }
            for (const [category, count] of categoryCounts.entries()) {
                report += `- **${category}:** ${count}\n`;
            }
            report += `\n`;
            // التوصيات
            report += `## 💡 التوصيات\n\n`;
            if (sessions.length === 0) {
                report += `- ابدأ بإنشاء جلسة تعاون لتنسيق العمل\n`;
            }
            if (reviews.filter(r => r.status === 'pending').length > 0) {
                report += `- راجع المراجعات المعلقة\n`;
            }
            if (templates.length < 3) {
                report += `- أنشئ المزيد من القوالب للاستخدام الشائع\n`;
            }
            report += `\n---\n\n`;
            report += `*تم إنشاء التقرير بواسطة Oqool Code*\n`;
            await fs.ensureDir(path.dirname(reportPath));
            await fs.writeFile(reportPath, report);
            spinner.succeed('تم إنشاء تقرير التعاون!');
            console.log(chalk.green(`\n📄 التقرير محفوظ في: ${reportPath}\n`));
        }
        catch (error) {
            spinner.fail('فشل في إنشاء التقرير');
            throw error;
        }
    }
    /**
     * الحصول على جلسة
     */
    async getSession(sessionId) {
        const sessionPath = path.join(this.workingDir, '.oqool', 'sessions', `${sessionId}.json`);
        if (await fs.pathExists(sessionPath)) {
            return await fs.readJson(sessionPath);
        }
        return null;
    }
    /**
     * حفظ جلسة
     */
    async saveSession(session) {
        const sessionsPath = path.join(this.workingDir, '.oqool', 'sessions');
        await fs.ensureDir(sessionsPath);
        const sessionPath = path.join(sessionsPath, `${session.id}.json`);
        await fs.writeJson(sessionPath, session, { spaces: 2 });
    }
    /**
     * الحصول على مراجعة
     */
    async getReview(reviewId) {
        const reviewPath = path.join(this.workingDir, '.oqool', 'reviews', `${reviewId}.json`);
        if (await fs.pathExists(reviewPath)) {
            return await fs.readJson(reviewPath);
        }
        return null;
    }
    /**
     * حفظ مراجعة
     */
    async saveReview(review) {
        const reviewsPath = path.join(this.workingDir, '.oqool', 'reviews');
        await fs.ensureDir(reviewsPath);
        const reviewPath = path.join(reviewsPath, `${review.id}.json`);
        await fs.writeJson(reviewPath, review, { spaces: 2 });
    }
    /**
     * الحصول على جميع الجلسات
     */
    async getAllSessions() {
        const sessionsPath = path.join(this.workingDir, '.oqool', 'sessions');
        if (!await fs.pathExists(sessionsPath)) {
            return [];
        }
        const files = await fs.readdir(sessionsPath);
        const sessions = [];
        for (const file of files) {
            if (file.endsWith('.json')) {
                const sessionPath = path.join(sessionsPath, file);
                const session = await fs.readJson(sessionPath);
                sessions.push(session);
            }
        }
        return sessions.sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime());
    }
    /**
     * الحصول على جميع المراجعات
     */
    async getAllReviews() {
        const reviewsPath = path.join(this.workingDir, '.oqool', 'reviews');
        if (!await fs.pathExists(reviewsPath)) {
            return [];
        }
        const files = await fs.readdir(reviewsPath);
        const reviews = [];
        for (const file of files) {
            if (file.endsWith('.json')) {
                const reviewPath = path.join(reviewsPath, file);
                const review = await fs.readJson(reviewPath);
                reviews.push(review);
            }
        }
        return reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    /**
     * الحصول على جميع القوالب
     */
    async getAllTemplates() {
        const templatesPath = path.join(this.workingDir, '.oqool', 'team-templates');
        if (!await fs.pathExists(templatesPath)) {
            return [];
        }
        const files = await fs.readdir(templatesPath);
        const templates = [];
        for (const file of files) {
            if (file.endsWith('.json')) {
                const templatePath = path.join(templatesPath, file);
                const template = await fs.readJson(templatePath);
                templates.push(template);
            }
        }
        return templates.sort((a, b) => b.usageCount - a.usageCount);
    }
    /**
     * استخراج المتغيرات من المحتوى
     */
    extractVariables(content) {
        const variables = [];
        const regex = /\{\{(\w+)\}\}/g;
        let match;
        while ((match = regex.exec(content)) !== null) {
            if (!variables.includes(match[1])) {
                variables.push(match[1]);
            }
        }
        return variables;
    }
    /**
     * توليد معرف فريد
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    /**
     * الحصول على اسم الدور
     */
    getRoleName(role) {
        const roleNames = {
            owner: 'مالك',
            admin: 'مدير',
            member: 'عضو',
            viewer: 'مراقب'
        };
        return roleNames[role];
    }
    /**
     * الحصول على اسم الحالة
     */
    getStatusName(status) {
        const statusNames = {
            'pending': 'معلقة',
            'in-progress': 'قيد التنفيذ',
            'approved': 'معتمدة',
            'rejected': 'مرفوضة',
            'changes-requested': 'تغييرات مطلوبة'
        };
        return statusNames[status] || status;
    }
}
// مصنع لإنشاء instance
export function createCollaborativeFeatures(apiClient, workingDir) {
    return new CollaborativeFeatures(apiClient, workingDir);
}
//# sourceMappingURL=collaborative-features.js.map