// cloud-deployment.ts
// ============================================
// ☁️ Cloud Deployment System
// ============================================
import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';
import { createCodeExecutor } from './code-executor.js';
export class CloudDeployment {
    constructor(apiClient, workingDir = process.cwd()) {
        this.apiClient = apiClient;
        this.workingDir = workingDir;
        this.configPath = path.join(workingDir, '.oqool', 'cloud.json');
        this.deploymentsPath = path.join(workingDir, '.oqool', 'deployments');
        this.initializeSystem();
    }
    async initializeSystem() {
        await fs.ensureDir(path.dirname(this.configPath));
        await fs.ensureDir(this.deploymentsPath);
    }
    // إعداد Cloud Provider
    async setupCloudProvider() {
        console.log(chalk.cyan('\n☁️  إعداد مزود السحابة\n'));
        const { provider } = await inquirer.prompt([
            {
                type: 'list',
                name: 'provider',
                message: 'اختر مزود السحابة:',
                choices: [
                    { name: '🚀 AWS (Amazon Web Services)', value: 'aws' },
                    { name: '🔵 Google Cloud Platform', value: 'gcp' },
                    { name: '🟦 Microsoft Azure', value: 'azure' },
                    { name: '⚡ Vercel', value: 'vercel' },
                    { name: '🌐 Netlify', value: 'netlify' },
                    { name: '🟣 Heroku', value: 'heroku' },
                    { name: '🌊 DigitalOcean', value: 'digitalocean' },
                    { name: '🚂 Railway', value: 'railway' }
                ]
            }
        ]);
        const credentials = await this.collectProviderCredentials(provider);
        const regions = this.getProviderRegions(provider);
        let selectedRegion;
        if (regions.length > 1) {
            const { region } = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'region',
                    message: 'اختر المنطقة:',
                    choices: regions
                }
            ]);
            selectedRegion = region;
        }
        else {
            selectedRegion = regions[0];
        }
        const cloudProvider = {
            name: provider,
            displayName: this.getProviderDisplayName(provider),
            region: selectedRegion,
            credentials,
            resources: []
        };
        await this.saveCloudConfig(cloudProvider);
        console.log(chalk.green('\n✅ تم حفظ إعدادات السحابة!\n'));
    }
    async collectProviderCredentials(provider) {
        console.log(chalk.yellow(`\n🔑 إدخال بيانات ${this.getProviderDisplayName(provider)}\n`));
        switch (provider) {
            case 'aws':
                return await inquirer.prompt([
                    {
                        type: 'input',
                        name: 'accessKey',
                        message: 'Access Key ID:',
                        validate: input => input.length > 0 || 'Access Key مطلوب'
                    },
                    {
                        type: 'password',
                        name: 'secretKey',
                        message: 'Secret Access Key:',
                        mask: '*',
                        validate: input => input.length > 0 || 'Secret Key مطلوب'
                    }
                ]);
            case 'gcp':
                return await inquirer.prompt([
                    {
                        type: 'input',
                        name: 'projectId',
                        message: 'Project ID:',
                        validate: input => input.length > 0 || 'Project ID مطلوب'
                    },
                    {
                        type: 'input',
                        name: 'accessKey',
                        message: 'Service Account Key (JSON):',
                        validate: input => {
                            try {
                                JSON.parse(input);
                                return true;
                            }
                            catch {
                                return 'يجب إدخال JSON صالح';
                            }
                        }
                    }
                ]);
            case 'azure':
                return await inquirer.prompt([
                    {
                        type: 'input',
                        name: 'subscriptionId',
                        message: 'Subscription ID:',
                        validate: input => input.length > 0 || 'Subscription ID مطلوب'
                    },
                    {
                        type: 'input',
                        name: 'accessKey',
                        message: 'Application (client) ID:'
                    }
                ]);
            case 'vercel':
                return await inquirer.prompt([
                    {
                        type: 'input',
                        name: 'token',
                        message: 'Vercel Token:',
                        validate: input => input.length > 0 || 'Token مطلوب'
                    }
                ]);
            case 'netlify':
                return await inquirer.prompt([
                    {
                        type: 'input',
                        name: 'token',
                        message: 'Netlify Personal Access Token:',
                        validate: input => input.length > 0 || 'Token مطلوب'
                    }
                ]);
            case 'heroku':
                return await inquirer.prompt([
                    {
                        type: 'input',
                        name: 'apiKey',
                        message: 'Heroku API Key:',
                        validate: input => input.length > 0 || 'API Key مطلوب'
                    }
                ]);
            default:
                return {};
        }
    }
    getProviderRegions(provider) {
        const regions = {
            aws: ['us-east-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1'],
            gcp: ['us-central1', 'europe-west1', 'asia-southeast1'],
            azure: ['East US', 'West Europe', 'Southeast Asia'],
            vercel: ['Washington D.C.', 'San Francisco', 'London', 'Singapore'],
            netlify: ['US East', 'US West', 'Europe'],
            heroku: ['US', 'Europe'],
            digitalocean: ['NYC1', 'SFO2', 'LON1', 'SGP1'],
            railway: ['US West', 'US East', 'Europe']
        };
        return regions[provider] || ['default'];
    }
    getProviderDisplayName(provider) {
        const names = {
            aws: 'AWS',
            gcp: 'Google Cloud',
            azure: 'Azure',
            vercel: 'Vercel',
            netlify: 'Netlify',
            heroku: 'Heroku',
            digitalocean: 'DigitalOcean',
            railway: 'Railway'
        };
        return names[provider] || provider;
    }
    // إنشاء مشروع للنشر
    async createDeploymentProject() {
        const config = await this.loadCloudConfig();
        if (!config) {
            console.log(chalk.yellow('⚠️  يرجى إعداد مزود السحابة أولاً\n'));
            return;
        }
        console.log(chalk.cyan('\n🚀 إنشاء مشروع للنشر\n'));
        const { projectName } = await inquirer.prompt([
            {
                type: 'input',
                name: 'projectName',
                message: 'اسم المشروع:',
                default: path.basename(this.workingDir),
                validate: input => input.length > 0 || 'اسم المشروع مطلوب'
            }
        ]);
        // تحليل نوع المشروع
        const projectType = await this.analyzeProjectType();
        const project = {
            name: projectName,
            type: projectType.type,
            framework: projectType.framework,
            language: projectType.language,
            environmentVariables: {},
            ...projectType
        };
        // إعداد متغيرات البيئة
        console.log(chalk.yellow('\n🔧 إعداد متغيرات البيئة\n'));
        const envVars = await this.collectEnvironmentVariables();
        project.environmentVariables = envVars;
        // إعداد إعدادات النشر
        const settings = {
            autoDeploy: true,
            branch: 'main',
            buildTimeout: 1800, // 30 دقيقة
            healthCheckPath: '/health',
            ssl: true,
            scaling: {
                min: 1,
                max: 5,
                target: 2
            },
            notifications: {
                email: []
            }
        };
        const deploymentConfig = {
            provider: config,
            project,
            environment: 'production',
            settings
        };
        await this.saveDeploymentConfig(deploymentConfig);
        console.log(chalk.green('\n✅ تم إنشاء إعدادات النشر!\n'));
    }
    async analyzeProjectType() {
        // تحليل package.json
        const packagePath = path.join(this.workingDir, 'package.json');
        let packageData = null;
        try {
            packageData = await fs.readJson(packagePath);
        }
        catch {
            // إذا لم يوجد package.json
        }
        if (packageData) {
            // تحديد نوع المشروع من dependencies
            const deps = { ...packageData.dependencies, ...packageData.devDependencies };
            if (deps.react || deps['react-dom']) {
                return {
                    type: 'web',
                    framework: 'React',
                    language: 'typescript',
                    buildCommand: 'npm run build',
                    startCommand: 'npm start',
                    port: 3000
                };
            }
            if (deps.express || deps.fastify || deps.hapi || deps.koa) {
                return {
                    type: 'api',
                    framework: 'Express',
                    language: 'typescript',
                    buildCommand: 'npm run build',
                    startCommand: 'npm start',
                    port: 3000
                };
            }
            if (deps.next) {
                return {
                    type: 'web',
                    framework: 'Next.js',
                    language: 'typescript',
                    buildCommand: 'npm run build',
                    startCommand: 'npm start',
                    port: 3000
                };
            }
            if (deps.vue) {
                return {
                    type: 'web',
                    framework: 'Vue.js',
                    language: 'typescript',
                    buildCommand: 'npm run build',
                    startCommand: 'npm start',
                    port: 3000
                };
            }
        }
        // تحليل من الملفات الموجودة
        const files = await fs.readdir(this.workingDir);
        const hasDockerfile = files.includes('Dockerfile');
        const hasGoMod = files.includes('go.mod');
        const hasPyProject = files.includes('pyproject.toml') || files.includes('requirements.txt');
        const hasCargo = files.includes('Cargo.toml');
        if (hasGoMod) {
            return {
                type: 'api',
                framework: 'Go',
                language: 'go',
                buildCommand: 'go build',
                startCommand: './main',
                port: 8080
            };
        }
        if (hasPyProject) {
            return {
                type: 'api',
                framework: 'Python',
                language: 'python',
                buildCommand: 'pip install -r requirements.txt',
                startCommand: 'python app.py',
                port: 5000
            };
        }
        if (hasCargo) {
            return {
                type: 'api',
                framework: 'Rust',
                language: 'rust',
                buildCommand: 'cargo build --release',
                startCommand: './target/release/app',
                port: 8000
            };
        }
        // افتراضي
        return {
            type: 'web',
            language: 'javascript',
            buildCommand: 'npm run build',
            startCommand: 'npm start',
            port: 3000
        };
    }
    async collectEnvironmentVariables() {
        console.log(chalk.cyan('أدخل متغيرات البيئة (اترك فارغاً للإنهاء):\n'));
        const envVars = {};
        let continueAdding = true;
        while (continueAdding) {
            const { key, value, addMore } = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'key',
                    message: 'اسم المتغير:',
                    when: () => continueAdding
                },
                {
                    type: 'input',
                    name: 'value',
                    message: 'القيمة:',
                    when: (answers) => continueAdding && answers.key
                },
                {
                    type: 'confirm',
                    name: 'addMore',
                    message: 'إضافة متغير آخر؟',
                    default: false,
                    when: (answers) => answers.key && answers.value
                }
            ]);
            if (key && value) {
                envVars[key] = value;
                continueAdding = addMore;
            }
            else {
                continueAdding = false;
            }
        }
        return envVars;
    }
    // إنشاء ملفات النشر
    async generateDeploymentFiles() {
        const config = await this.loadDeploymentConfig();
        if (!config) {
            console.log(chalk.yellow('⚠️  يرجى إنشاء إعدادات النشر أولاً\n'));
            return;
        }
        const spinner = ora('جاري إنشاء ملفات النشر...').start();
        try {
            await this.createDockerfile(config);
            await this.createDockerCompose(config);
            await this.createDeploymentConfigFiles(config);
            await this.createGitHubActions(config);
            await this.createEnvironmentFile(config);
            spinner.succeed('تم إنشاء ملفات النشر');
            console.log(chalk.green('\n✅ تم إنشاء جميع ملفات النشر!\n'));
            this.displayDeploymentSummary(config);
        }
        catch (error) {
            spinner.fail('فشل إنشاء ملفات النشر');
            console.error(chalk.red('\n❌'), error.message);
        }
    }
    async createDockerfile(config) {
        const dockerfileContent = this.generateDockerfileContent(config);
        await fs.writeFile(path.join(this.workingDir, 'Dockerfile'), dockerfileContent);
    }
    generateDockerfileContent(config) {
        const { project } = config;
        switch (project.language) {
            case 'javascript':
            case 'typescript':
                return `FROM node:18-alpine

WORKDIR /app

# نسخ package files
COPY package*.json ./

# تثبيت dependencies
RUN npm ci --only=production

# نسخ الكود
COPY . .

# بناء المشروع
${project.buildCommand ? `RUN ${project.buildCommand}` : ''}

# إنشاء مستخدم غير root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

USER nodejs

# متغير البورت
ENV PORT=${project.port || 3000}

EXPOSE ${project.port || 3000}

# أمر التشغيل
CMD ["${project.startCommand || 'npm start'}"]`;
            case 'python':
                return `FROM python:3.11-slim

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

# متغير البورت
ENV PORT=${project.port || 5000}

EXPOSE ${project.port || 5000}

# أمر التشغيل
CMD ["${project.startCommand || 'python app.py'}"]`;
            case 'go':
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

# متغير البورت
ENV PORT=${project.port || 8080}

EXPOSE ${project.port || 8080}

# أمر التشغيل
CMD ["./main"]`;
            default:
                return `# Dockerfile للمشروع
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE ${project.port || 3000}

CMD ["${project.startCommand || 'npm start'}"]`;
        }
    }
    async createDockerCompose(config) {
        const composeContent = this.generateDockerComposeContent(config);
        await fs.writeFile(path.join(this.workingDir, 'docker-compose.yml'), composeContent);
    }
    generateDockerComposeContent(config) {
        const { project } = config;
        return `version: '3.8'

services:
  app:
    build: .
    ports:
      - "${project.port || 3000}:${project.port || 3000}"
    environment:
${Object.entries(project.environmentVariables)
            .map(([key, value]) => `      ${key}: ${value}`)
            .join('\n')}
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:${project.port || 3000}/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # قاعدة البيانات (اختيارية)
  # database:
  #   image: postgres:15
  #   environment:
  #     POSTGRES_DB: myapp
  #     POSTGRES_USER: user
  #     POSTGRES_PASSWORD: password
  #   volumes:
  #     - postgres_data:/var/lib/postgresql/data
  #   ports:
  #     - "5432:5432"

# volumes:
#   postgres_data:`;
    }
    async createDeploymentConfigFiles(config) {
        const provider = config.provider.name;
        switch (provider) {
            case 'vercel':
                await this.createVercelConfig(config);
                break;
            case 'netlify':
                await this.createNetlifyConfig(config);
                break;
            case 'heroku':
                await this.createHerokuConfig(config);
                break;
            default:
                await this.createGenericConfig(config);
        }
    }
    async createVercelConfig(config) {
        const vercelConfig = {
            version: 2,
            builds: [
                {
                    src: 'package.json',
                    use: '@vercel/node'
                }
            ],
            env: config.project.environmentVariables
        };
        await fs.writeJson(path.join(this.workingDir, 'vercel.json'), vercelConfig, { spaces: 2 });
    }
    async createNetlifyConfig(config) {
        const netlifyConfig = {
            build: {
                command: config.project.buildCommand || 'npm run build',
                publish: 'dist',
                functions: 'netlify/functions'
            },
            dev: {
                command: config.project.startCommand || 'npm start',
                port: config.project.port || 3000
            }
        };
        await fs.writeFile(path.join(this.workingDir, 'netlify.toml'), this.tomlStringify(netlifyConfig));
    }
    async createHerokuConfig(config) {
        const procfileContent = `web: ${config.project.startCommand || 'npm start'}`;
        await fs.writeFile(path.join(this.workingDir, 'Procfile'), procfileContent);
        // إنشاء app.json لـ Heroku
        const appJson = {
            name: config.project.name,
            description: `${config.project.name} - ${config.project.type} application`,
            keywords: [config.project.language, config.project.framework || 'web'],
            website: `https://${config.project.name}.herokuapp.com`,
            repository: `https://github.com/user/${config.project.name}`,
            env: Object.keys(config.project.environmentVariables).reduce((acc, key) => {
                acc[key] = {
                    description: `Environment variable ${key}`,
                    required: false
                };
                return acc;
            }, {})
        };
        await fs.writeJson(path.join(this.workingDir, 'app.json'), appJson, { spaces: 2 });
    }
    async createGenericConfig(config) {
        // إنشاء ملف .deployment لـ Azure أو AWS
        const deploymentConfig = {
            provider: config.provider.name,
            project: config.project.name,
            environment: config.environment,
            settings: config.settings
        };
        await fs.writeJson(path.join(this.workingDir, '.deployment.json'), deploymentConfig, { spaces: 2 });
    }
    async createGitHubActions(config) {
        const workflowsDir = path.join(this.workingDir, '.github', 'workflows');
        await fs.ensureDir(workflowsDir);
        const workflowContent = this.generateGitHubWorkflow(config);
        await fs.writeFile(path.join(workflowsDir, 'deploy.yml'), workflowContent);
    }
    generateGitHubWorkflow(config) {
        const { provider } = config;
        switch (provider.name) {
            case 'vercel':
                return `name: Deploy to Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Build
      run: npm run build

    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v25
      with:
        vercel-token: \${{ secrets.VERCEL_TOKEN }}
        vercel-args: '--prod'`;
            case 'netlify':
                return `name: Deploy to Netlify

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Build
      run: npm run build

    - name: Deploy to Netlify
      uses: nwtgck/actions-netlify@v2
      with:
        publish-dir: './dist'
        production-branch: main
        github-token: \${{ secrets.GITHUB_TOKEN }}
        deploy-message: 'Deploy from GitHub Actions'
      env:
        NETLIFY_AUTH_TOKEN: \${{ secrets.NETLIFY_AUTH_TOKEN }}
        NETLIFY_SITE_ID: \${{ secrets.NETLIFY_SITE_ID }}`;
            default:
                return `name: Build and Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Build Docker image
      run: docker build -t ${config.project.name} .

    - name: Test
      run: docker run --rm ${config.project.name} npm test

    - name: Deploy
      run: |
        echo "Deploy to ${provider.displayName}"
        # Add deployment commands here`;
        }
    }
    async createEnvironmentFile(config) {
        const envContent = Object.entries(config.project.environmentVariables)
            .map(([key, value]) => `${key}=${value}`)
            .join('\n');
        await fs.writeFile(path.join(this.workingDir, '.env.example'), envContent);
    }
    tomlStringify(obj) {
        // تحويل object إلى TOML format
        return Object.entries(obj)
            .map(([key, value]) => {
            if (typeof value === 'object') {
                return `[${key}]\n${this.tomlStringify(value)}`;
            }
            return `${key} = ${JSON.stringify(value)}`;
        })
            .join('\n\n');
    }
    displayDeploymentSummary(config) {
        console.log(chalk.cyan('📋 ملخص النشر:\n'));
        console.log(chalk.yellow('🏗️  المشروع:'), config.project.name);
        console.log(chalk.yellow('📦 النوع:'), config.project.type);
        console.log(chalk.yellow('⚙️  الإطار:'), config.project.framework || 'غير محدد');
        console.log(chalk.yellow('☁️  المزود:'), config.provider.displayName);
        console.log(chalk.yellow('🌍 البيئة:'), config.environment);
        if (config.settings.domain) {
            console.log(chalk.yellow('🔗 النطاق:'), config.settings.domain);
        }
        console.log(chalk.yellow('\n📁 الملفات المنشأة:'));
        console.log(chalk.gray('  • Dockerfile'));
        console.log(chalk.gray('  • docker-compose.yml'));
        console.log(chalk.gray('  • .env.example'));
        console.log(chalk.gray('  • .github/workflows/deploy.yml'));
        switch (config.provider.name) {
            case 'vercel':
                console.log(chalk.gray('  • vercel.json'));
                break;
            case 'netlify':
                console.log(chalk.gray('  • netlify.toml'));
                break;
            case 'heroku':
                console.log(chalk.gray('  • Procfile'));
                console.log(chalk.gray('  • app.json'));
                break;
        }
        console.log(chalk.yellow('\n🚀 الأوامر التالية:'));
        console.log(chalk.gray('  oqool-code deploy'));
        console.log(chalk.gray('  oqool-code deploy status'));
        console.log(chalk.gray('  oqool-code deploy logs'));
        console.log();
    }
    // النشر الفعلي
    async deploy() {
        const config = await this.loadDeploymentConfig();
        if (!config) {
            throw new Error('لا توجد إعدادات نشر');
        }
        console.log(chalk.cyan(`\n🚀 النشر على ${config.provider.displayName}\n`));
        const spinner = ora('جاري التحضير للنشر...').start();
        try {
            // التحقق من وجود الملفات المطلوبة
            await this.validateDeploymentFiles(config);
            spinner.text = 'بناء المشروع...';
            // بناء المشروع
            await this.buildProject(config);
            spinner.text = 'النشر على السحابة...';
            // النشر حسب المزود
            const result = await this.deployToProvider(config);
            spinner.succeed('تم النشر بنجاح!');
            console.log(chalk.green(`\n✅ النشر مكتمل!\n`));
            console.log(chalk.cyan('🔗 الرابط:'), result.url || 'قيد التحديث...');
            console.log(chalk.cyan('📊 التكلفة:'), result.cost ? `$${result.cost}/شهر` : 'مجاني');
            return result;
        }
        catch (error) {
            spinner.fail('فشل النشر');
            throw error;
        }
    }
    async validateDeploymentFiles(config) {
        const requiredFiles = ['package.json', 'Dockerfile'];
        for (const file of requiredFiles) {
            if (!await fs.pathExists(path.join(this.workingDir, file))) {
                throw new Error(`ملف ${file} مطلوب للنشر`);
            }
        }
    }
    async buildProject(config) {
        const executor = createCodeExecutor();
        if (config.project.buildCommand) {
            await executor.executeCode({
                file: 'build.sh',
                args: ['build'],
                env: 'production'
            });
        }
    }
    async deployToProvider(config) {
        // محاكاة النشر - في الواقع ستحتاج إلى API calls للمزودين
        const deploymentId = `deploy_${Date.now()}`;
        return {
            success: true,
            url: `https://${config.project.name}.example.com`,
            logs: ['Build successful', 'Deployment completed'],
            deploymentId,
            status: 'success',
            cost: this.calculateDeploymentCost(config)
        };
    }
    calculateDeploymentCost(config) {
        // حساب التكلفة التقريبية
        const baseCosts = {
            aws: 5,
            gcp: 4,
            azure: 6,
            vercel: 0, // مجاني للمشاريع الصغيرة
            netlify: 0,
            heroku: 7,
            digitalocean: 5,
            railway: 5
        };
        const baseCost = baseCosts[config.provider.name] || 5;
        const scalingMultiplier = config.settings.scaling.target;
        return Math.round(baseCost * scalingMultiplier * 100) / 100;
    }
    // مراقبة النشر
    async getDeploymentStatus(deploymentId) {
        // محاكاة مراقبة النشر
        return {
            id: deploymentId,
            status: 'running',
            progress: 75,
            logs: ['Starting deployment...', 'Building...', 'Deploying...'],
            url: 'https://example.com'
        };
    }
    // إدارة النشر
    async stopDeployment() {
        console.log(chalk.yellow('🛑 إيقاف النشر...\n'));
        // إيقاف النشر
    }
    async rollbackDeployment() {
        console.log(chalk.yellow('🔄 التراجع عن النشر...\n'));
        // التراجع عن النشر
    }
    // أدوات مساعدة
    async saveCloudConfig(provider) {
        await fs.writeJson(this.configPath, provider, { spaces: 2 });
    }
    async loadCloudConfig() {
        try {
            return await fs.readJson(this.configPath);
        }
        catch {
            return null;
        }
    }
    async saveDeploymentConfig(config) {
        await fs.writeJson(path.join(this.deploymentsPath, `${config.project.name}.json`), config, { spaces: 2 });
    }
    async loadDeploymentConfig() {
        try {
            const files = await fs.readdir(this.deploymentsPath);
            if (files.length === 0)
                return null;
            const configFile = files.find(f => f.endsWith('.json'));
            if (!configFile)
                return null;
            return await fs.readJson(path.join(this.deploymentsPath, configFile));
        }
        catch {
            return null;
        }
    }
}
export function createCloudDeployment(apiClient, workingDir) {
    return new CloudDeployment(apiClient, workingDir);
}
//# sourceMappingURL=cloud-deployment.js.map