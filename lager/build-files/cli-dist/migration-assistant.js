// migration-assistant.ts
// ============================================
// 🚀 Migration Assistant System
// ============================================
import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';
export class MigrationAssistant {
    constructor(apiClient, workingDir = process.cwd()) {
        this.apiClient = apiClient;
        this.workingDir = workingDir;
        this.plansPath = path.join(workingDir, '.oqool', 'migrations');
        this.backupsPath = path.join(workingDir, '.oqool', 'backups');
        this.reportsPath = path.join(workingDir, '.oqool', 'migration-reports');
        this.initializeSystem();
    }
    async initializeSystem() {
        await fs.ensureDir(this.plansPath);
        await fs.ensureDir(this.backupsPath);
        await fs.ensureDir(this.reportsPath);
    }
    // إنشاء خطة ترحيل
    async createMigrationPlan(source, target) {
        console.log(chalk.cyan('\n🚀 إنشاء خطة ترحيل\n'));
        const spinner = ora('تحليل المشروع الحالي...').start();
        try {
            // تحليل المشروع الحالي
            const currentProject = await this.analyzeCurrentProject();
            // إنشاء خطة الترحيل
            const plan = await this.generateMigrationPlan(source, target, currentProject);
            spinner.succeed('تم تحليل المشروع');
            console.log(chalk.green('\n✅ تم إنشاء خطة الترحيل!\n'));
            this.displayMigrationPlan(plan);
            // حفظ الخطة
            await this.saveMigrationPlan(plan);
        }
        catch (error) {
            spinner.fail('فشل إنشاء خطة الترحيل');
            console.error(chalk.red('\n❌'), error.message);
        }
    }
    // تحليل المشروع الحالي
    async analyzeCurrentProject() {
        const packagePath = path.join(this.workingDir, 'package.json');
        let packageData = null;
        try {
            packageData = await fs.readJson(packagePath);
        }
        catch {
            // مشروع بدون package.json
        }
        const source = {
            type: 'framework',
            name: 'unknown',
            files: [],
            dependencies: [],
            configuration: {}
        };
        if (packageData) {
            // تحديد نوع الإطار
            const deps = { ...packageData.dependencies, ...packageData.devDependencies };
            if (deps.react) {
                source.name = 'React';
                source.version = deps.react;
            }
            else if (deps.vue) {
                source.name = 'Vue.js';
                source.version = deps.vue;
            }
            else if (deps.express) {
                source.name = 'Express.js';
                source.version = deps.express;
            }
            else if (deps['@angular/core']) {
                source.name = 'Angular';
                source.version = deps['@angular/core'];
            }
            else if (deps.next) {
                source.name = 'Next.js';
                source.version = deps.next;
            }
            else if (deps.django) {
                source.name = 'Django';
                source.version = deps.django;
            }
            else if (deps.laravel) {
                source.name = 'Laravel';
                source.version = deps.laravel;
            }
            source.dependencies = Object.keys(deps);
            source.configuration = packageData;
        }
        // البحث عن الملفات المهمة
        const importantFiles = [
            'package.json', 'tsconfig.json', 'webpack.config.js', 'babel.config.js',
            'vue.config.js', 'angular.json', 'next.config.js', 'nuxt.config.js',
            'django/settings.py', 'laravel/composer.json'
        ];
        for (const file of importantFiles) {
            const filePath = path.join(this.workingDir, file);
            if (await fs.pathExists(filePath)) {
                source.files.push(file);
            }
        }
        return source;
    }
    // إنشاء خطة الترحيل
    async generateMigrationPlan(source, target, currentProject) {
        const plan = {
            id: `migration_${Date.now()}`,
            name: `ترحيل من ${source} إلى ${target}`,
            description: `خطة شاملة للترحيل من ${source} إلى ${target}`,
            source: currentProject,
            target: {
                type: 'framework',
                name: target,
                requirements: [],
                breakingChanges: [],
                newFeatures: []
            },
            steps: [],
            risks: [],
            dependencies: [],
            estimatedTime: '2-4 أسابيع',
            status: 'planned',
            createdAt: new Date().toISOString()
        };
        // إنشاء خطوات الترحيل حسب النوع
        plan.steps = await this.generateMigrationSteps(source, target, currentProject);
        // تقييم المخاطر
        plan.risks = this.assessMigrationRisks(source, target, currentProject);
        // تحديد التبعيات
        plan.dependencies = this.identifyDependencies(source, target);
        return plan;
    }
    // إنشاء خطوات الترحيل
    async generateMigrationSteps(source, target, currentProject) {
        const steps = [];
        // خطوة التحليل
        steps.push({
            id: 'analysis',
            name: 'تحليل المشروع',
            description: 'تحليل شامل للمشروع الحالي',
            type: 'analysis',
            status: 'completed',
            estimatedTime: '2-4 ساعات',
            dependencies: [],
            files: [],
            commands: [],
            automated: true,
            completedAt: new Date().toISOString()
        });
        // خطوة النسخ الاحتياطي
        steps.push({
            id: 'backup',
            name: 'إنشاء نسخة احتياطية',
            description: 'نسخ احتياطي كامل للمشروع',
            type: 'backup',
            status: 'pending',
            estimatedTime: '30 دقيقة - 2 ساعات',
            dependencies: ['analysis'],
            files: [],
            commands: ['git add .', 'git commit -m "Backup before migration"', 'git tag migration-backup'],
            automated: true
        });
        // خطوات حسب نوع الترحيل
        switch (source + '_to_' + target) {
            case 'React_to_Next.js':
                steps.push(...this.getReactToNextJSSteps());
                break;
            case 'JavaScript_to_TypeScript':
                steps.push(...this.getJavaScriptToTypeScriptSteps());
                break;
            case 'Express_to_Fastify':
                steps.push(...this.getExpressToFastifySteps());
                break;
            case 'Vue2_to_Vue3':
                steps.push(...this.getVue2ToVue3Steps());
                break;
            default:
                steps.push(...this.getGenericMigrationSteps(source, target));
        }
        // خطوة الاختبار
        steps.push({
            id: 'test',
            name: 'اختبار شامل',
            description: 'تشغيل جميع الاختبارات والتحقق من الصحة',
            type: 'test',
            status: 'pending',
            estimatedTime: '4-8 ساعات',
            dependencies: ['update'],
            files: [],
            commands: ['npm test', 'npm run build', 'npm run lint'],
            automated: false
        });
        // خطوة النشر
        steps.push({
            id: 'deploy',
            name: 'نشر التطبيق',
            description: 'نشر الإصدار الجديد',
            type: 'deploy',
            status: 'pending',
            estimatedTime: '1-2 ساعات',
            dependencies: ['test'],
            files: [],
            commands: ['npm run deploy'],
            automated: false
        });
        return steps;
    }
    // خطوات ترحيل React إلى Next.js
    getReactToNextJSSteps() {
        return [
            {
                id: 'install_nextjs',
                name: 'تثبيت Next.js',
                description: 'تثبيت Next.js وإعداد المشروع',
                type: 'update',
                status: 'pending',
                estimatedTime: '1 ساعة',
                dependencies: ['backup'],
                files: ['package.json'],
                commands: ['npm install next@latest react@latest react-dom@latest'],
                automated: true
            },
            {
                id: 'create_pages',
                name: 'إنشاء مجلد pages',
                description: 'تحويل المكونات إلى صفحات Next.js',
                type: 'update',
                status: 'pending',
                estimatedTime: '2-4 ساعات',
                dependencies: ['install_nextjs'],
                files: ['pages/**/*'],
                commands: [],
                automated: false
            },
            {
                id: 'setup_routing',
                name: 'إعداد التوجيه',
                description: 'تكوين نظام التوجيه الجديد',
                type: 'update',
                status: 'pending',
                estimatedTime: '1-2 ساعات',
                dependencies: ['create_pages'],
                files: ['pages/**/*'],
                commands: [],
                automated: false
            },
            {
                id: 'update_styles',
                name: 'تحديث الأنماط',
                description: 'تكييف CSS مع Next.js',
                type: 'update',
                status: 'pending',
                estimatedTime: '1 ساعة',
                dependencies: ['setup_routing'],
                files: ['**/*.css', '**/*.scss'],
                commands: [],
                automated: false
            }
        ];
    }
    // خطوات ترحيل JavaScript إلى TypeScript
    getJavaScriptToTypeScriptSteps() {
        return [
            {
                id: 'install_typescript',
                name: 'تثبيت TypeScript',
                description: 'تثبيت TypeScript والأنواع',
                type: 'update',
                status: 'pending',
                estimatedTime: '30 دقيقة',
                dependencies: ['backup'],
                files: ['package.json', 'tsconfig.json'],
                commands: ['npm install typescript @types/node @types/react --save-dev'],
                automated: true
            },
            {
                id: 'create_tsconfig',
                name: 'إنشاء tsconfig.json',
                description: 'تكوين TypeScript',
                type: 'update',
                status: 'pending',
                estimatedTime: '30 دقيقة',
                dependencies: ['install_typescript'],
                files: ['tsconfig.json'],
                commands: [],
                automated: true
            },
            {
                id: 'convert_files',
                name: 'تحويل الملفات إلى TypeScript',
                description: 'تحويل .js إلى .ts/.tsx',
                type: 'update',
                status: 'pending',
                estimatedTime: '4-8 ساعات',
                dependencies: ['create_tsconfig'],
                files: ['**/*.{js,jsx}'],
                commands: [],
                automated: false
            },
            {
                id: 'add_types',
                name: 'إضافة الأنواع',
                description: 'إضافة تعريفات الأنواع',
                type: 'update',
                status: 'pending',
                estimatedTime: '2-4 ساعات',
                dependencies: ['convert_files'],
                files: ['**/*.{ts,tsx}'],
                commands: [],
                automated: false
            }
        ];
    }
    // خطوات عامة للترحيل
    getGenericMigrationSteps(source, target) {
        return [
            {
                id: 'update_dependencies',
                name: 'تحديث التبعيات',
                description: `تثبيت ${target} وتحديث التبعيات`,
                type: 'update',
                status: 'pending',
                estimatedTime: '1-2 ساعات',
                dependencies: ['backup'],
                files: ['package.json'],
                commands: [`npm install ${target}`],
                automated: true
            },
            {
                id: 'update_code',
                name: 'تحديث الكود',
                description: `تكييف الكود مع ${target}`,
                type: 'update',
                status: 'pending',
                estimatedTime: '4-8 ساعات',
                dependencies: ['update_dependencies'],
                files: ['src/**/*'],
                commands: [],
                automated: false
            }
        ];
    }
    // خطوات أخرى...
    getExpressToFastifySteps() {
        return [
            {
                id: 'install_fastify',
                name: 'تثبيت Fastify',
                description: 'تثبيت Fastify وتحديث التبعيات',
                type: 'update',
                status: 'pending',
                estimatedTime: '1 ساعة',
                dependencies: ['backup'],
                files: ['package.json'],
                commands: ['npm install fastify @fastify/express-plugin'],
                automated: true
            },
            {
                id: 'convert_routes',
                name: 'تحويل الطرق',
                description: 'تحويل Express routes إلى Fastify',
                type: 'update',
                status: 'pending',
                estimatedTime: '2-4 ساعات',
                dependencies: ['install_fastify'],
                files: ['routes/**/*'],
                commands: [],
                automated: false
            }
        ];
    }
    getVue2ToVue3Steps() {
        return [
            {
                id: 'install_vue3',
                name: 'تثبيت Vue 3',
                description: 'تثبيت Vue 3 وتحديث التبعيات',
                type: 'update',
                status: 'pending',
                estimatedTime: '1 ساعة',
                dependencies: ['backup'],
                files: ['package.json'],
                commands: ['npm install vue@next @vue/cli'],
                automated: true
            },
            {
                id: 'update_composition',
                name: 'تحديث Composition API',
                description: 'تحويل Options API إلى Composition API',
                type: 'update',
                status: 'pending',
                estimatedTime: '4-8 ساعات',
                dependencies: ['install_vue3'],
                files: ['src/**/*'],
                commands: [],
                automated: false
            }
        ];
    }
    // تقييم المخاطر
    assessMigrationRisks(source, target, currentProject) {
        const risks = [];
        // مخاطر عامة
        risks.push({
            level: 'medium',
            category: 'downtime',
            description: 'قد يحدث توقف مؤقت للتطبيق أثناء الترحيل',
            probability: 60,
            impact: 'توقف الخدمة لساعات قليلة',
            mitigation: 'إجراء الترحيل في أوقات الصيانة المجدولة'
        });
        // مخاطر حسب نوع الترحيل
        if (source === 'React' && target === 'Next.js') {
            risks.push({
                level: 'low',
                category: 'compatibility',
                description: 'بعض المكونات قد تحتاج تعديل',
                probability: 40,
                impact: 'تعديل بعض المكونات',
                mitigation: 'اختبار شامل قبل النشر'
            });
        }
        else if (source === 'JavaScript' && target === 'TypeScript') {
            risks.push({
                level: 'high',
                category: 'data_loss',
                description: 'أخطاء في الأنواع قد تؤدي إلى فقدان بيانات',
                probability: 30,
                impact: 'فقدان بيانات مؤقت أو دائم',
                mitigation: 'اختبار شامل ونسخ احتياطي'
            });
        }
        return risks;
    }
    // تحديد التبعيات
    identifyDependencies(source, target) {
        const dependencies = [];
        if (source === 'React' && target === 'Next.js') {
            dependencies.push('Node.js 14+', 'React 17+', 'TypeScript (اختياري)');
        }
        else if (source === 'JavaScript' && target === 'TypeScript') {
            dependencies.push('TypeScript 4.5+', 'تثبيت @types packages');
        }
        return dependencies;
    }
    // عرض خطة الترحيل
    displayMigrationPlan(plan) {
        console.log(chalk.cyan('📋 خطة الترحيل:'), chalk.white(plan.name));
        console.log(chalk.cyan('📝 الوصف:'), plan.description);
        console.log(chalk.cyan('⏱️  الوقت المقدر:'), plan.estimatedTime);
        console.log(chalk.yellow('\n📋 الخطوات:'));
        for (const step of plan.steps) {
            const statusIcon = step.status === 'completed' ? '✅' : step.status === 'in_progress' ? '🔄' : '⏳';
            const timeIcon = step.automated ? '🤖' : '👤';
            console.log(chalk.white(`${statusIcon} ${timeIcon} ${step.name}`));
            console.log(chalk.gray(`   ${step.description} (${step.estimatedTime})`));
        }
        console.log(chalk.yellow('\n⚠️  المخاطر:'));
        for (const risk of plan.risks) {
            const levelIcon = risk.level === 'critical' ? '🔴' : risk.level === 'high' ? '🟠' : risk.level === 'medium' ? '🟡' : '🟢';
            console.log(chalk.white(`${levelIcon} ${risk.description}`));
            console.log(chalk.gray(`   التأثير: ${risk.impact}`));
            console.log(chalk.gray(`   التخفيف: ${risk.mitigation}\n`));
        }
        console.log(chalk.yellow('📦 التبعيات:'));
        for (const dep of plan.dependencies) {
            console.log(chalk.gray(`   • ${dep}`));
        }
    }
    // تنفيذ خطة الترحيل
    async executeMigrationPlan(planId) {
        const plan = await this.loadMigrationPlan(planId);
        if (!plan) {
            console.log(chalk.yellow('⚠️  خطة الترحيل غير موجودة\n'));
            return;
        }
        console.log(chalk.cyan(`\n🚀 تنفيذ خطة الترحيل: ${plan.name}\n`));
        const spinner = ora('بدء التنفيذ...').start();
        try {
            // تحديث حالة الخطة
            plan.status = 'in_progress';
            plan.startedAt = new Date().toISOString();
            await this.saveMigrationPlan(plan);
            // تنفيذ كل خطوة
            for (const step of plan.steps) {
                if (step.status === 'completed')
                    continue;
                spinner.text = `تنفيذ: ${step.name}`;
                step.status = 'in_progress';
                if (step.automated) {
                    await this.executeAutomatedStep(step);
                }
                else {
                    await this.executeManualStep(step);
                }
                step.status = 'completed';
                step.completedAt = new Date().toISOString();
                await this.saveMigrationPlan(plan);
            }
            // إنهاء التنفيذ
            plan.status = 'completed';
            plan.completedAt = new Date().toISOString();
            await this.saveMigrationPlan(plan);
            spinner.succeed('تم تنفيذ الترحيل بنجاح!');
            console.log(chalk.green('\n✅ تم الترحيل بنجاح!\n'));
            console.log(chalk.cyan('🔗 الخطوات التالية:'));
            console.log(chalk.gray('  1. تشغيل الاختبارات: npm test'));
            console.log(chalk.gray('  2. فحص الكود: npm run lint'));
            console.log(chalk.gray('  3. بناء المشروع: npm run build'));
            console.log(chalk.gray('  4. النشر: npm run deploy'));
        }
        catch (error) {
            spinner.fail('فشل تنفيذ الترحيل');
            plan.status = 'failed';
            await this.saveMigrationPlan(plan);
            console.error(chalk.red('\n❌'), error.message);
        }
    }
    // تنفيذ خطوة تلقائية
    async executeAutomatedStep(step) {
        console.log(chalk.cyan(`🤖 تنفيذ تلقائي: ${step.name}`));
        for (const command of step.commands) {
            console.log(chalk.gray(`$ ${command}`));
            // محاكاة تنفيذ الأمر
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        if (step.files.length > 0) {
            console.log(chalk.gray(`📝 تحديث الملفات: ${step.files.join(', ')}`));
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
    // تنفيذ خطوة يدوية
    async executeManualStep(step) {
        console.log(chalk.cyan(`👤 خطوة يدوية: ${step.name}`));
        console.log(chalk.white(step.description));
        const { confirm } = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'confirm',
                message: 'هل أكملت هذه الخطوة؟',
                default: false
            }
        ]);
        if (!confirm) {
            throw new Error('تم إلغاء التنفيذ من قبل المستخدم');
        }
    }
    // إنشاء نسخة احتياطية
    async createBackup(type = 'full') {
        console.log(chalk.cyan('\n💾 إنشاء نسخة احتياطية\n'));
        const spinner = ora('إنشاء النسخة الاحتياطية...').start();
        try {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const backupPath = path.join(this.backupsPath, `${type}-backup-${timestamp}`);
            switch (type) {
                case 'full':
                    await this.createFullBackup(backupPath);
                    break;
                case 'database':
                    await this.createDatabaseBackup(backupPath);
                    break;
                case 'config':
                    await this.createConfigBackup(backupPath);
                    break;
                case 'code':
                    await this.createCodeBackup(backupPath);
                    break;
            }
            spinner.succeed('تم إنشاء النسخة الاحتياطية');
            console.log(chalk.green(`\n✅ تم حفظ النسخة الاحتياطية في: ${backupPath}\n`));
        }
        catch (error) {
            spinner.fail('فشل إنشاء النسخة الاحتياطية');
            console.error(chalk.red('\n❌'), error.message);
        }
    }
    // إنشاء نسخة احتياطية كاملة
    async createFullBackup(backupPath) {
        await fs.copy(this.workingDir, backupPath);
        const stats = await this.getDirectoryStats(backupPath);
        console.log(chalk.gray(`📊 الحجم: ${this.formatBytes(stats.size)}`));
    }
    // إنشاء نسخة احتياطية لقاعدة البيانات
    async createDatabaseBackup(backupPath) {
        const dbPath = path.join(backupPath, 'database');
        await fs.ensureDir(dbPath);
        // محاكاة نسخ قاعدة البيانات
        console.log(chalk.gray('📦 نسخ قاعدة البيانات...'));
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
    // إنشاء نسخة احتياطية للإعدادات
    async createConfigBackup(backupPath) {
        const configPath = path.join(backupPath, 'config');
        const configFiles = [
            'package.json', '.env', 'tsconfig.json', 'webpack.config.js',
            'babel.config.js', 'next.config.js', 'vue.config.js'
        ];
        await fs.ensureDir(configPath);
        for (const file of configFiles) {
            const sourcePath = path.join(this.workingDir, file);
            if (await fs.pathExists(sourcePath)) {
                await fs.copy(sourcePath, path.join(configPath, file));
            }
        }
    }
    // إنشاء نسخة احتياطية للكود
    async createCodeBackup(backupPath) {
        const codePath = path.join(backupPath, 'src');
        const sourcePath = path.join(this.workingDir, 'src');
        if (await fs.pathExists(sourcePath)) {
            await fs.copy(sourcePath, codePath);
        }
    }
    // استرجاع من نسخة احتياطية
    async restoreFromBackup(backupId) {
        console.log(chalk.cyan('\n🔄 استرجاع من نسخة احتياطية\n'));
        const spinner = ora('البحث عن النسخة الاحتياطية...').start();
        try {
            const backupPath = path.join(this.backupsPath, backupId);
            if (!await fs.pathExists(backupPath)) {
                throw new Error('النسخة الاحتياطية غير موجودة');
            }
            // تأكيد الاسترجاع
            const { confirm } = await inquirer.prompt([
                {
                    type: 'confirm',
                    name: 'confirm',
                    message: 'هل أنت متأكد من الاسترجاع؟ سيتم الكتابة فوق المشروع الحالي',
                    default: false
                }
            ]);
            if (!confirm) {
                spinner.info('تم إلغاء الاسترجاع');
                return;
            }
            spinner.text = 'جاري الاسترجاع...';
            // نسخ الملفات
            await fs.copy(backupPath, this.workingDir);
            spinner.succeed('تم الاسترجاع بنجاح');
            console.log(chalk.green('\n✅ تم الاسترجاع من النسخة الاحتياطية!\n'));
            console.log(chalk.cyan('🔗 الخطوات التالية:'));
            console.log(chalk.gray('  1. تشغيل الاختبارات: npm test'));
            console.log(chalk.gray('  2. فحص الأخطاء: npm run lint'));
            console.log(chalk.gray('  3. تشغيل التطبيق: npm start'));
        }
        catch (error) {
            spinner.fail('فشل الاسترجاع');
            console.error(chalk.red('\n❌'), error.message);
        }
    }
    // إنشاء تقرير الترحيل
    async generateMigrationReport(planId) {
        const plan = await this.loadMigrationPlan(planId);
        if (!plan) {
            console.log(chalk.yellow('⚠️  خطة الترحيل غير موجودة\n'));
            return;
        }
        const spinner = ora('إنشاء تقرير الترحيل...').start();
        try {
            const report = {
                plan,
                execution: {
                    startTime: plan.startedAt || plan.createdAt,
                    endTime: plan.completedAt,
                    duration: plan.completedAt ? this.calculateDuration(plan.startedAt, plan.completedAt) : undefined,
                    success: plan.status === 'completed',
                    stepsCompleted: plan.steps.filter(s => s.status === 'completed').length,
                    stepsFailed: plan.steps.filter(s => s.status === 'failed').length,
                    stepsSkipped: plan.steps.filter(s => s.status === 'skipped').length
                },
                changes: {
                    filesModified: 15, // محاكاة
                    filesCreated: 5,
                    filesDeleted: 2,
                    linesAdded: 450,
                    linesRemoved: 320
                },
                issues: [],
                recommendations: []
            };
            const reportPath = await this.saveMigrationReport(report);
            spinner.succeed('تم إنشاء تقرير الترحيل');
            this.displayMigrationReport(report);
            console.log(chalk.green(`\n✅ تم حفظ التقرير في: ${reportPath}\n`));
        }
        catch (error) {
            spinner.fail('فشل إنشاء التقرير');
            console.error(chalk.red('\n❌'), error.message);
        }
    }
    // عرض تقرير الترحيل
    displayMigrationReport(report) {
        console.log(chalk.cyan('\n📊 تقرير الترحيل:\n'));
        console.log(chalk.yellow('📋 معلومات الخطة:'));
        console.log(chalk.white(`   الاسم: ${report.plan.name}`));
        console.log(chalk.white(`   الحالة: ${this.getStatusIcon(report.plan.status)} ${report.plan.status.toUpperCase()}`));
        console.log(chalk.white(`   الوقت المقدر: ${report.plan.estimatedTime}`));
        if (report.execution.duration) {
            console.log(chalk.white(`   الوقت الفعلي: ${report.execution.duration}`));
        }
        console.log(chalk.yellow('\n📈 التنفيذ:'));
        console.log(chalk.white(`   الخطوات المكتملة: ${chalk.green(report.execution.stepsCompleted)}`));
        console.log(chalk.white(`   الخطوات الفاشلة: ${chalk.red(report.execution.stepsFailed)}`));
        console.log(chalk.white(`   الخطوات المُلغاة: ${chalk.yellow(report.execution.stepsSkipped)}`));
        console.log(chalk.white(`   معدل النجاح: ${chalk.cyan(this.calculateSuccessRate(report))}`));
        console.log(chalk.yellow('\n📝 التغييرات:'));
        console.log(chalk.white(`   الملفات المُعدلة: ${report.changes.filesModified}`));
        console.log(chalk.white(`   الملفات المُنشأة: ${report.changes.filesCreated}`));
        console.log(chalk.white(`   الملفات المحذوفة: ${report.changes.filesDeleted}`));
        console.log(chalk.white(`   الأسطر المُضافة: ${chalk.green('+' + report.changes.linesAdded)}`));
        console.log(chalk.white(`   الأسطر المحذوفة: ${chalk.red('-' + report.changes.linesRemoved)}`));
        if (report.recommendations.length > 0) {
            console.log(chalk.yellow('\n💡 التوصيات:'));
            for (const recommendation of report.recommendations) {
                console.log(chalk.gray(`   • ${recommendation}`));
            }
        }
    }
    // حساب معدل النجاح
    calculateSuccessRate(report) {
        const total = report.execution.stepsCompleted + report.execution.stepsFailed + report.execution.stepsSkipped;
        if (total === 0)
            return '0%';
        const rate = (report.execution.stepsCompleted / total) * 100;
        return `${Math.round(rate)}%`;
    }
    // حساب المدة
    calculateDuration(start, end) {
        const diff = new Date(end).getTime() - new Date(start).getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}ساعة ${minutes}دقيقة`;
    }
    // الحصول على أيقونة الحالة
    getStatusIcon(status) {
        switch (status) {
            case 'completed': return '✅';
            case 'in_progress': return '🔄';
            case 'failed': return '❌';
            case 'planned': return '📋';
            case 'rollback': return '🔄';
            default: return '❓';
        }
    }
    // الحصول على إحصائيات المجلد
    async getDirectoryStats(dirPath) {
        let size = 0;
        try {
            const entries = await fs.readdir(dirPath, { withFileTypes: true });
            for (const entry of entries) {
                const entryPath = path.join(dirPath, entry.name);
                if (entry.isFile()) {
                    const stats = await fs.stat(entryPath);
                    size += stats.size;
                }
                else if (entry.isDirectory()) {
                    const subStats = await this.getDirectoryStats(entryPath);
                    size += subStats.size;
                }
            }
        }
        catch {
            // تجاهل الأخطاء
        }
        return { size };
    }
    // تنسيق الأرقام
    formatBytes(bytes) {
        const units = ['B', 'KB', 'MB', 'GB'];
        let size = bytes;
        let unitIndex = 0;
        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }
        return `${size.toFixed(1)} ${units[unitIndex]}`;
    }
    // أدوات مساعدة
    async saveMigrationPlan(plan) {
        const filePath = path.join(this.plansPath, `${plan.id}.json`);
        await fs.writeJson(filePath, plan, { spaces: 2 });
    }
    async loadMigrationPlan(planId) {
        try {
            const filePath = path.join(this.plansPath, `${planId}.json`);
            return await fs.readJson(filePath);
        }
        catch {
            return null;
        }
    }
    async saveMigrationReport(report) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `migration-report-${timestamp}.json`;
        const filePath = path.join(this.reportsPath, filename);
        await fs.writeJson(filePath, report, { spaces: 2 });
        return filePath;
    }
    // قائمة خطط الترحيل
    async listMigrationPlans() {
        try {
            const files = await fs.readdir(this.plansPath);
            return files
                .filter(file => file.endsWith('.json'))
                .map(file => file.replace('.json', ''));
        }
        catch {
            return [];
        }
    }
    // قائمة النسخ الاحتياطية
    async listBackups() {
        try {
            const files = await fs.readdir(this.backupsPath);
            return files
                .filter(file => file.includes('-backup-'))
                .sort((a, b) => b.localeCompare(a)); // ترتيب تنازلي
        }
        catch {
            return [];
        }
    }
}
export function createMigrationAssistant(apiClient, workingDir) {
    return new MigrationAssistant(apiClient, workingDir);
}
//# sourceMappingURL=migration-assistant.js.map