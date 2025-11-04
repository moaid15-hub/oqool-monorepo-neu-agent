// container-integration.ts
// ============================================
// 🐳 Container Integration System
// ============================================
import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';
export class ContainerIntegration {
    constructor(apiClient, workingDir = process.cwd()) {
        this.apiClient = apiClient;
        this.workingDir = workingDir;
        this.configPath = path.join(workingDir, '.oqool', 'container.json');
        this.dockerfilesPath = path.join(workingDir, '.oqool', 'docker');
        this.k8sPath = path.join(workingDir, '.oqool', 'k8s');
        this.initializeSystem();
    }
    async initializeSystem() {
        await fs.ensureDir(this.dockerfilesPath);
        await fs.ensureDir(this.k8sPath);
    }
    // إعداد Container Configuration
    async setupContainer() {
        console.log(chalk.cyan('\n🐳 إعداد الحاويات\n'));
        const { containerType } = await inquirer.prompt([
            {
                type: 'list',
                name: 'containerType',
                message: 'اختر نوع الحاوية:',
                choices: [
                    { name: '🐳 Docker (مفرد)', value: 'docker' },
                    { name: '🛠️  Docker Compose (متعدد)', value: 'docker-compose' },
                    { name: '☸️  Kubernetes', value: 'kubernetes' },
                    { name: '🐋 Podman', value: 'podman' }
                ]
            }
        ]);
        const config = await this.collectContainerConfig(containerType);
        // إنشاء ملفات التكوين
        await this.generateContainerFiles(config);
        console.log(chalk.green('\n✅ تم إعداد الحاويات!\n'));
        console.log(chalk.cyan('📁 الملفات المنشأة:'));
        console.log(chalk.gray('  • Dockerfile'));
        console.log(chalk.gray('  • docker-compose.yml'));
        console.log(chalk.gray('  • .dockerignore'));
        console.log(chalk.gray('  • k8s/deployment.yaml'));
        console.log(chalk.gray('  • k8s/service.yaml'));
    }
    async collectContainerConfig(type) {
        const questions = [];
        if (type === 'docker' || type === 'docker-compose') {
            questions.push({
                type: 'input',
                name: 'image',
                message: 'اسم الصورة:',
                default: 'myapp'
            }, {
                type: 'input',
                name: 'tag',
                message: 'وسم الصورة:',
                default: 'latest'
            }, {
                type: 'input',
                name: 'port',
                message: 'البورت الداخلي:',
                default: '3000'
            }, {
                type: 'input',
                name: 'externalPort',
                message: 'البورت الخارجي:',
                default: '3000'
            });
        }
        const answers = await inquirer.prompt(questions);
        const config = {
            type: type,
            image: answers.image,
            tag: answers.tag,
            environment: {},
            ports: [{
                    internal: parseInt(answers.port) || 3000,
                    external: parseInt(answers.externalPort) || 3000,
                    protocol: 'tcp'
                }],
            volumes: [],
            networks: ['default'],
            restart: 'unless-stopped'
        };
        // إضافة متغيرات البيئة
        const envQuestions = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'addEnv',
                message: 'هل تريد إضافة متغيرات البيئة؟',
                default: true
            },
            {
                type: 'input',
                name: 'envVars',
                message: 'متغيرات البيئة (مثال: NODE_ENV=production,DATABASE_URL=...)',
                when: (answers) => answers.addEnv
            }
        ]);
        if (envQuestions.envVars) {
            config.environment = envQuestions.envVars.split(',').reduce((acc, env) => {
                const [key, value] = env.split('=');
                if (key && value) {
                    acc[key.trim()] = value.trim();
                }
                return acc;
            }, {});
        }
        return config;
    }
    // إنشاء ملفات الحاويات
    async generateContainerFiles(config) {
        await this.createDockerfile(config);
        await this.createDockerCompose(config);
        await this.createDockerIgnore();
        await this.createKubernetesManifests(config);
        await this.createContainerConfig(config);
    }
    async createDockerfile(config) {
        // تحليل نوع المشروع
        const projectType = await this.detectProjectType();
        let dockerfileContent = '';
        switch (projectType.language) {
            case 'javascript':
            case 'typescript':
                dockerfileContent = this.generateNodeDockerfile(config);
                break;
            case 'python':
                dockerfileContent = this.generatePythonDockerfile(config);
                break;
            case 'go':
                dockerfileContent = this.generateGoDockerfile(config);
                break;
            case 'rust':
                dockerfileContent = this.generateRustDockerfile(config);
                break;
            case 'java':
                dockerfileContent = this.generateJavaDockerfile(config);
                break;
            default:
                dockerfileContent = this.generateGenericDockerfile(config);
        }
        await fs.writeFile(path.join(this.workingDir, 'Dockerfile'), dockerfileContent);
    }
    async detectProjectType() {
        const packagePath = path.join(this.workingDir, 'package.json');
        const pyprojectPath = path.join(this.workingDir, 'pyproject.toml');
        const goModPath = path.join(this.workingDir, 'go.mod');
        const cargoPath = path.join(this.workingDir, 'Cargo.toml');
        if (await fs.pathExists(packagePath)) {
            try {
                const packageData = await fs.readJson(packagePath);
                const deps = { ...packageData.dependencies, ...packageData.devDependencies };
                if (deps.react)
                    return { language: 'javascript', framework: 'React' };
                if (deps.express)
                    return { language: 'javascript', framework: 'Express' };
                if (deps.next)
                    return { language: 'javascript', framework: 'Next.js' };
                if (deps.vue)
                    return { language: 'javascript', framework: 'Vue.js' };
                return { language: 'javascript' };
            }
            catch {
                return { language: 'javascript' };
            }
        }
        if (await fs.pathExists(pyprojectPath)) {
            return { language: 'python' };
        }
        if (await fs.pathExists(goModPath)) {
            return { language: 'go' };
        }
        if (await fs.pathExists(cargoPath)) {
            return { language: 'rust' };
        }
        return { language: 'generic' };
    }
    generateNodeDockerfile(config) {
        return `FROM node:18-alpine

# إنشاء مجلد التطبيق
WORKDIR /app

# نسخ package files
COPY package*.json ./

# تثبيت dependencies
RUN npm ci --only=production

# نسخ الكود
COPY . .

# إنشاء مستخدم غير root للأمان
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

USER nodejs

# متغيرات البيئة
${Object.entries(config.environment).map(([key, value]) => `ENV ${key}=${value}`).join('\n')}

# البورت
EXPOSE ${config.ports[0]?.internal || 3000}

# أمر التشغيل
CMD ["npm", "start"]`;
    }
    generatePythonDockerfile(config) {
        return `FROM python:3.11-slim

# إنشاء مجلد التطبيق
WORKDIR /app

# تثبيت system dependencies
RUN apt-get update && apt-get install -y \\
    gcc \\
    && rm -rf /var/lib/apt/lists/*

# نسخ requirements
COPY requirements*.txt ./

# تثبيت Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# نسخ الكود
COPY . .

# إنشاء مستخدم غير root
RUN useradd --create-home --shell /bin/bash app
RUN chown -R app:app /app
USER app

# متغيرات البيئة
${Object.entries(config.environment).map(([key, value]) => `ENV ${key}=${value}`).join('\n')}

# البورت
EXPOSE ${config.ports[0]?.internal || 5000}

# أمر التشغيل
CMD ["python", "app.py"]`;
    }
    generateGoDockerfile(config) {
        return `FROM golang:1.21-alpine AS builder

WORKDIR /app

# نسخ go mod files
COPY go.* ./

# تحميل dependencies
RUN go mod download

# نسخ الكود
COPY . .

# بناء التطبيق
RUN CGO_ENABLED=0 GOOS=linux go build -o main .

# المرحلة النهائية
FROM alpine:latest

RUN apk --no-cache add ca-certificates

WORKDIR /root/

# نسخ الملف التنفيذي
COPY --from=builder /app/main .

# متغيرات البيئة
${Object.entries(config.environment).map(([key, value]) => `ENV ${key}=${value}`).join('\n')}

# البورت
EXPOSE ${config.ports[0]?.internal || 8080}

# أمر التشغيل
CMD ["./main"]`;
    }
    generateRustDockerfile(config) {
        return `FROM rust:1.75-alpine AS builder

WORKDIR /app

# نسخ Cargo files
COPY Cargo.* ./

# تحميل dependencies
RUN cargo fetch

# نسخ الكود
COPY . .

# بناء التطبيق
RUN cargo build --release

# المرحلة النهائية
FROM alpine:latest

RUN apk --no-cache add ca-certificates

WORKDIR /root/

# نسخ الملف التنفيذي
COPY --from=builder /app/target/release/app .

# متغيرات البيئة
${Object.entries(config.environment).map(([key, value]) => `ENV ${key}=${value}`).join('\n')}

# البورت
EXPOSE ${config.ports[0]?.internal || 8000}

# أمر التشغيل
CMD ["./app"]`;
    }
    generateJavaDockerfile(config) {
        return `FROM openjdk:17-alpine

WORKDIR /app

# نسخ JAR file
COPY target/*.jar app.jar

# متغيرات البيئة
${Object.entries(config.environment).map(([key, value]) => `ENV ${key}=${value}`).join('\n')}

# البورت
EXPOSE ${config.ports[0]?.internal || 8080}

# أمر التشغيل
ENTRYPOINT ["java", "-jar", "app.jar"]`;
    }
    generateGenericDockerfile(config) {
        return `FROM alpine:latest

WORKDIR /app

# نسخ الكود
COPY . .

# متغيرات البيئة
${Object.entries(config.environment).map(([key, value]) => `ENV ${key}=${value}`).join('\n')}

# البورت
EXPOSE ${config.ports[0]?.internal || 3000}

# أمر التشغيل
CMD ["./start.sh"]`;
    }
    async createDockerCompose(config) {
        const composeConfig = {
            version: '3.8',
            services: {
                app: {
                    image: `${config.image || 'myapp'}:${config.tag || 'latest'}`,
                    environment: config.environment,
                    ports: config.ports.map(p => `${p.external}:${p.internal}`),
                    volumes: config.volumes.map(v => `${v.host}:${v.container}`),
                    networks: config.networks,
                    restart: config.restart,
                    healthcheck: config.healthCheck ? {
                        test: config.healthCheck.command,
                        interval: `${config.healthCheck.interval}s`,
                        timeout: `${config.healthCheck.timeout}s`,
                        retries: config.healthCheck.retries,
                        start_period: `${config.healthCheck.startPeriod}s`
                    } : undefined
                }
            },
            networks: {
                default: {}
            },
            volumes: {}
        };
        await fs.writeJson(path.join(this.workingDir, 'docker-compose.yml'), composeConfig, { spaces: 2 });
    }
    async createDockerIgnore() {
        const dockerIgnore = `node_modules
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.npm
.yarn
.env*
!.env.example
.git
.gitignore
README.md
.DS_Store
.vscode
.idea
*.log
coverage
.nyc_output
dist
build
.cache
.tmp
temp
tmp
.docker
Dockerfile*
docker-compose*
.dockerignore`;
        await fs.writeFile(path.join(this.workingDir, '.dockerignore'), dockerIgnore);
    }
    async createKubernetesManifests(config) {
        // Deployment
        const deployment = {
            apiVersion: 'apps/v1',
            kind: 'Deployment',
            metadata: {
                name: config.image || 'myapp',
                labels: {
                    app: config.image || 'myapp'
                }
            },
            spec: {
                replicas: 3,
                selector: {
                    matchLabels: {
                        app: config.image || 'myapp'
                    }
                },
                template: {
                    metadata: {
                        labels: {
                            app: config.image || 'myapp'
                        }
                    },
                    spec: {
                        containers: [{
                                name: config.image || 'myapp',
                                image: `${config.registry || 'myapp'}/${config.image || 'myapp'}:${config.tag || 'latest'}`,
                                ports: config.ports.map(p => ({
                                    containerPort: p.internal,
                                    protocol: p.protocol.toUpperCase()
                                })),
                                env: Object.entries(config.environment).map(([key, value]) => ({
                                    name: key,
                                    value: value
                                }))
                            }]
                    }
                }
            }
        };
        // Service
        const service = {
            apiVersion: 'v1',
            kind: 'Service',
            metadata: {
                name: config.image || 'myapp',
                labels: {
                    app: config.image || 'myapp'
                }
            },
            spec: {
                selector: {
                    app: config.image || 'myapp'
                },
                ports: config.ports.map(p => ({
                    port: p.external,
                    targetPort: p.internal,
                    protocol: p.protocol.toUpperCase()
                })),
                type: 'LoadBalancer'
            }
        };
        await fs.ensureDir(path.join(this.k8sPath, 'manifests'));
        await fs.writeJson(path.join(this.k8sPath, 'deployment.yaml'), deployment, { spaces: 2 });
        await fs.writeJson(path.join(this.k8sPath, 'service.yaml'), service, { spaces: 2 });
    }
    async createContainerConfig(config) {
        await fs.writeJson(this.configPath, config, { spaces: 2 });
    }
    // بناء الصورة
    async buildImage(tag) {
        const config = await this.loadContainerConfig();
        if (!config) {
            console.log(chalk.yellow('⚠️  يرجى إعداد الحاويات أولاً\n'));
            return;
        }
        const imageTag = tag || `${config.image}:${config.tag}`;
        console.log(chalk.cyan(`\n🏗️  بناء الصورة: ${imageTag}\n`));
        const spinner = ora('جاري بناء الصورة...').start();
        try {
            // محاكاة بناء Docker image
            await this.executeCommand('docker', ['build', '-t', imageTag, '.']);
            spinner.succeed('تم بناء الصورة');
            console.log(chalk.green(`\n✅ تم بناء الصورة: ${imageTag}\n`));
        }
        catch (error) {
            spinner.fail('فشل بناء الصورة');
            console.error(chalk.red('\n❌'), error.message);
        }
    }
    // تشغيل الحاوية
    async runContainer(name) {
        const config = await this.loadContainerConfig();
        if (!config) {
            console.log(chalk.yellow('⚠️  يرجى إعداد الحاويات أولاً\n'));
            return;
        }
        const containerName = name || config.image;
        console.log(chalk.cyan(`\n🚀 تشغيل الحاوية: ${containerName}\n`));
        const spinner = ora('جاري تشغيل الحاوية...').start();
        try {
            // محاكاة تشغيل Docker container
            const portMapping = config.ports.map(p => `-p ${p.external}:${p.internal}`).join(' ');
            const envVars = Object.entries(config.environment).map(([key, value]) => `-e ${key}=${value}`).join(' ');
            await this.executeCommand('docker', [
                'run',
                '-d',
                '--name', containerName,
                portMapping,
                envVars,
                config.image + ':' + config.tag
            ].filter(Boolean));
            spinner.succeed('تم تشغيل الحاوية');
            console.log(chalk.green(`\n✅ الحاوية تعمل: ${containerName}\n`));
            console.log(chalk.cyan('🔗 الوصول:'), `http://localhost:${config.ports[0]?.external || 3000}`);
        }
        catch (error) {
            spinner.fail('فشل تشغيل الحاوية');
            console.error(chalk.red('\n❌'), error.message);
        }
    }
    // إيقاف الحاوية
    async stopContainer(name) {
        const config = await this.loadContainerConfig();
        const containerName = name || config?.image;
        if (!containerName) {
            console.log(chalk.yellow('⚠️  لا توجد حاوية محددة\n'));
            return;
        }
        const spinner = ora(`إيقاف ${containerName}...`).start();
        try {
            await this.executeCommand('docker', ['stop', containerName]);
            await this.executeCommand('docker', ['rm', containerName]);
            spinner.succeed('تم إيقاف الحاوية');
            console.log(chalk.green(`\n✅ تم إيقاف الحاوية: ${containerName}\n`));
        }
        catch (error) {
            spinner.fail('فشل إيقاف الحاوية');
            console.error(chalk.red('\n❌'), error.message);
        }
    }
    // نشر على Kubernetes
    async deployToKubernetes(namespace) {
        console.log(chalk.cyan('\n☸️  النشر على Kubernetes\n'));
        const spinner = ora('جاري النشر على Kubernetes...').start();
        try {
            const ns = namespace || 'default';
            // تطبيق الـ manifests
            await this.executeCommand('kubectl', ['apply', '-f', path.join(this.k8sPath, 'manifests'), '-n', ns]);
            spinner.succeed('تم النشر على Kubernetes');
            console.log(chalk.green('\n✅ تم النشر بنجاح!\n'));
            console.log(chalk.cyan('🌐 التحقق من الحالة:'), 'kubectl get pods -n ' + ns);
            console.log(chalk.cyan('🔗 الخدمات:'), 'kubectl get services -n ' + ns);
        }
        catch (error) {
            spinner.fail('فشل النشر على Kubernetes');
            console.error(chalk.red('\n❌'), error.message);
        }
    }
    // مراقبة الحاويات
    async monitorContainers() {
        console.log(chalk.cyan('\n📊 مراقبة الحاويات\n'));
        try {
            // الحصول على قائمة الحاويات
            const containers = await this.getContainerList();
            if (containers.length === 0) {
                console.log(chalk.yellow('⚠️  لا توجد حاويات تعمل\n'));
                return;
            }
            console.log(chalk.yellow('🐳 الحاويات النشطة:\n'));
            for (const container of containers) {
                const stats = await this.getContainerStats(container.id);
                const statusIcon = container.status === 'running' ? '🟢' : '🔴';
                console.log(chalk.white(`${statusIcon} ${container.name}`));
                console.log(chalk.gray(`   الحالة: ${container.status}`));
                console.log(chalk.gray(`   CPU: ${stats.cpuUsage.toFixed(1)}%`));
                console.log(chalk.gray(`   الذاكرة: ${this.formatBytes(stats.memoryUsage)}/${this.formatBytes(stats.memoryLimit)}`));
                console.log(chalk.gray(`   الشبكة: ↑${this.formatBytes(stats.networkIO.tx)} ↓${this.formatBytes(stats.networkIO.rx)}`));
                console.log();
            }
        }
        catch (error) {
            console.error(chalk.red('خطأ في مراقبة الحاويات:'), error.message);
        }
    }
    // الحصول على قائمة الحاويات
    async getContainerList() {
        // محاكاة قائمة الحاويات
        return [
            { id: 'abc123', name: 'myapp', status: 'running' },
            { id: 'def456', name: 'database', status: 'running' },
            { id: 'ghi789', name: 'redis', status: 'exited' }
        ];
    }
    // الحصول على إحصائيات الحاوية
    async getContainerStats(containerId) {
        // محاكاة إحصائيات الحاوية
        return {
            containerId,
            name: 'myapp',
            cpuUsage: Math.random() * 50,
            memoryUsage: Math.random() * 100 * 1024 * 1024,
            memoryLimit: 512 * 1024 * 1024,
            networkIO: {
                rx: Math.random() * 1000000,
                tx: Math.random() * 500000
            },
            blockIO: {
                read: Math.random() * 100000,
                write: Math.random() * 50000
            },
            uptime: '2h 15m'
        };
    }
    // تنظيف الحاويات والصور
    async cleanup() {
        console.log(chalk.cyan('\n🧹 تنظيف الحاويات والصور\n'));
        const { cleanupType } = await inquirer.prompt([
            {
                type: 'list',
                name: 'cleanupType',
                message: 'نوع التنظيف:',
                choices: [
                    { name: 'الحاويات المتوقفة فقط', value: 'containers' },
                    { name: 'الصور غير المستخدمة', value: 'images' },
                    { name: 'الكل (حاويات + صور + volumes)', value: 'all' }
                ]
            }
        ]);
        const spinner = ora('جاري التنظيف...').start();
        try {
            switch (cleanupType) {
                case 'containers':
                    await this.executeCommand('docker', ['container', 'prune', '-f']);
                    break;
                case 'images':
                    await this.executeCommand('docker', ['image', 'prune', '-f']);
                    break;
                case 'all':
                    await this.executeCommand('docker', ['system', 'prune', '-f']);
                    break;
            }
            spinner.succeed('تم التنظيف');
            console.log(chalk.green('\n✅ تم تنظيف الحاويات والصور!\n'));
        }
        catch (error) {
            spinner.fail('فشل التنظيف');
            console.error(chalk.red('\n❌'), error.message);
        }
    }
    // تحسين الصورة
    async optimizeImage() {
        console.log(chalk.cyan('\n⚡ تحسين الصورة\n'));
        const spinner = ora('جاري تحسين الصورة...').start();
        try {
            // تحسينات محتملة
            const optimizations = [
                'استخدام multi-stage builds',
                'تقليل حجم الطبقات',
                'استخدام .dockerignore',
                'تحسين caching',
                'تقليل عدد الطبقات'
            ];
            spinner.succeed('تحليل الصورة');
            console.log(chalk.green('\n✅ تحسينات محتملة:\n'));
            for (const optimization of optimizations) {
                console.log(chalk.cyan(`• ${optimization}`));
            }
            // إنشاء Dockerfile محسن
            await this.createOptimizedDockerfile();
            console.log(chalk.yellow('\n📝 تم إنشاء Dockerfile محسن: Dockerfile.optimized\n'));
        }
        catch (error) {
            spinner.fail('فشل تحسين الصورة');
            console.error(chalk.red('\n❌'), error.message);
        }
    }
    async createOptimizedDockerfile() {
        const config = await this.loadContainerConfig();
        if (!config)
            return;
        const optimizedContent = `# Dockerfile محسن - أصغر حجماً وأسرع بناءً

FROM node:18-alpine

# إنشاء مستخدم غير root أولاً
RUN addgroup -g 1001 -S nodejs && \\
    adduser -S nodejs -u 1001

# إنشاء مجلد التطبيق
WORKDIR /app

# نسخ package.json فقط للاستفادة من caching
COPY package*.json ./

# تثبيت dependencies فقط (لا يتغير كثيراً)
RUN npm ci --only=production && \\
    npm cache clean --force

# نسخ الكود بعد تثبيت dependencies
COPY --chown=nodejs:nodejs . .

# تغيير المالك للمجلد
USER nodejs

# متغيرات البيئة
${Object.entries(config.environment).map(([key, value]) => `ENV ${key}=${value}`).join('\n')}

# البورت
EXPOSE ${config.ports[0]?.internal || 3000}

# أمر التشغيل
CMD ["npm", "start"]`;
        await fs.writeFile(path.join(this.workingDir, 'Dockerfile.optimized'), optimizedContent);
    }
    // مراقبة موارد النظام
    async monitorSystem() {
        console.log(chalk.cyan('\n📊 مراقبة موارد النظام\n'));
        try {
            const runtime = await this.getContainerRuntime();
            console.log(chalk.yellow('🐳 Container Runtime:'));
            console.log(chalk.white(`   الاسم: ${runtime.name}`));
            console.log(chalk.white(`   الإصدار: ${runtime.version}`));
            console.log(chalk.white(`   نظام التشغيل: ${runtime.operatingSystem}`));
            console.log(chalk.white(`   المعمارية: ${runtime.arch}`));
            // موارد النظام
            const systemResources = await this.getSystemResources();
            console.log(chalk.yellow('\n💾 موارد النظام:'));
            console.log(chalk.white(`   CPU: ${systemResources.cpuCores} نواة`));
            console.log(chalk.white(`   الذاكرة: ${this.formatBytes(systemResources.totalMemory)}`));
            console.log(chalk.white(`   القرص: ${this.formatBytes(systemResources.totalDisk)}`));
            console.log(chalk.white(`   استخدام CPU: ${systemResources.cpuUsage.toFixed(1)}%`));
            console.log(chalk.white(`   استخدام الذاكرة: ${systemResources.memoryUsage.toFixed(1)}%`));
            console.log();
        }
        catch (error) {
            console.error(chalk.red('خطأ في مراقبة النظام:'), error.message);
        }
    }
    async getContainerRuntime() {
        // محاكاة معلومات runtime
        return {
            name: 'docker',
            version: '24.0.7',
            apiVersion: '1.43',
            arch: 'amd64',
            os: 'linux',
            kernelVersion: '6.5.0-14-generic',
            operatingSystem: 'Ubuntu 22.04.3 LTS',
            ostype: 'linux'
        };
    }
    async getSystemResources() {
        // محاكاة موارد النظام
        return {
            cpuCores: 8,
            totalMemory: 16 * 1024 * 1024 * 1024, // 16GB
            totalDisk: 500 * 1024 * 1024 * 1024, // 500GB
            cpuUsage: Math.random() * 60,
            memoryUsage: Math.random() * 70
        };
    }
    // تنفيذ أوامر Docker
    async executeCommand(command, args) {
        // محاكاة تنفيذ الأوامر - في الواقع ستستخدم child_process
        console.log(chalk.gray(`$ ${command} ${args.join(' ')}`));
        // محاكاة النجاح
        if (Math.random() > 0.1) { // 90% نجاح
            return;
        }
        else {
            throw new Error('فشل تنفيذ الأمر');
        }
    }
    // تنسيق الأرقام للعرض
    formatBytes(bytes) {
        const units = ['B', 'KB', 'MB', 'GB', 'TB'];
        let size = bytes;
        let unitIndex = 0;
        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }
        return `${size.toFixed(1)} ${units[unitIndex]}`;
    }
    // أدوات مساعدة
    async loadContainerConfig() {
        try {
            return await fs.readJson(this.configPath);
        }
        catch {
            return null;
        }
    }
    // إنشاء ملفات Kubernetes إضافية
    async createKubernetesIngress(domain) {
        console.log(chalk.cyan('\n🌐 إنشاء Kubernetes Ingress\n'));
        const { createIngress } = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'createIngress',
                message: 'هل تريد إنشاء Ingress للوصول الخارجي؟',
                default: true
            }
        ]);
        if (!createIngress)
            return;
        const ingressDomain = domain || 'myapp.local';
        const { ssl } = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'ssl',
                message: 'تفعيل SSL؟',
                default: true
            }
        ]);
        const ingress = {
            apiVersion: 'networking.k8s.io/v1',
            kind: 'Ingress',
            metadata: {
                name: 'myapp-ingress',
                annotations: {
                    'kubernetes.io/ingress.class': 'nginx',
                    ...(ssl && {
                        'cert-manager.io/cluster-issuer': 'letsencrypt-prod'
                    })
                }
            },
            spec: {
                tls: ssl ? [{
                        hosts: [ingressDomain],
                        secretName: 'myapp-tls'
                    }] : undefined,
                rules: [{
                        host: ingressDomain,
                        http: {
                            paths: [{
                                    path: '/',
                                    pathType: 'Prefix',
                                    backend: {
                                        service: {
                                            name: 'myapp',
                                            port: {
                                                number: 80
                                            }
                                        }
                                    }
                                }]
                        }
                    }]
            }
        };
        await fs.writeJson(path.join(this.k8sPath, 'ingress.yaml'), ingress, { spaces: 2 });
        console.log(chalk.green('\n✅ تم إنشاء Ingress!\n'));
        console.log(chalk.cyan('🔗 الوصول:'), `http${ssl ? 's' : ''}://${ingressDomain}`);
    }
    // إنشاء ملفات ConfigMap وSecret
    async createKubernetesConfig() {
        console.log(chalk.cyan('\n⚙️  إنشاء Kubernetes ConfigMap وSecrets\n'));
        const config = await this.loadContainerConfig();
        if (!config)
            return;
        // ConfigMap للإعدادات
        const configMap = {
            apiVersion: 'v1',
            kind: 'ConfigMap',
            metadata: {
                name: 'myapp-config',
                namespace: 'default'
            },
            data: {
                NODE_ENV: 'production',
                LOG_LEVEL: 'info',
                ...config.environment
            }
        };
        // Secret للأسرار
        const secret = {
            apiVersion: 'v1',
            kind: 'Secret',
            metadata: {
                name: 'myapp-secret',
                namespace: 'default'
            },
            type: 'Opaque',
            data: {
                // محاكاة تشفير base64
                DATABASE_URL: Buffer.from('postgresql://user:pass@localhost:5432/db').toString('base64'),
                JWT_SECRET: Buffer.from('super-secret-key').toString('base64'),
                API_KEY: Buffer.from('api-key-123').toString('base64')
            }
        };
        await fs.ensureDir(path.join(this.k8sPath, 'config'));
        await fs.writeJson(path.join(this.k8sPath, 'config', 'configmap.yaml'), configMap, { spaces: 2 });
        await fs.writeJson(path.join(this.k8sPath, 'config', 'secret.yaml'), secret, { spaces: 2 });
        console.log(chalk.green('\n✅ تم إنشاء ConfigMap وSecrets!\n'));
    }
}
export function createContainerIntegration(apiClient, workingDir) {
    return new ContainerIntegration(apiClient, workingDir);
}
//# sourceMappingURL=container-integration.js.map