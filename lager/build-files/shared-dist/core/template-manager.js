// template-manager.ts
// ============================================
// 📋 نظام القوالب (Templates System)
// ============================================
import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import { FileManager } from './file-manager.js';
// ============================================
// 📋 مدير القوالب
// ============================================
export class TemplateManager {
    workingDir;
    templatesPath;
    fileManager;
    builtInTemplates;
    constructor(workingDir = process.cwd()) {
        this.workingDir = workingDir;
        this.templatesPath = path.join(workingDir, '.oqool', 'templates');
        this.fileManager = new FileManager(workingDir);
        this.builtInTemplates = new Map();
        this.loadBuiltInTemplates();
    }
    /**
     * تحميل القوالب المدمجة
     */
    loadBuiltInTemplates() {
        // Express API Template
        this.builtInTemplates.set('express-api', {
            name: 'express-api',
            description: 'Express.js REST API with TypeScript',
            language: 'typescript',
            category: 'backend',
            variables: [
                { name: 'projectName', description: 'اسم المشروع', required: true },
                { name: 'author', description: 'اسم المطور', defaultValue: 'Your Name' },
                { name: 'port', description: 'رقم المنفذ', defaultValue: '3000' }
            ],
            files: [
                {
                    path: 'src/index.ts',
                    content: `import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

const app = express();
const PORT = process.env.PORT || {{port}};

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '{{projectName}} is running!' });
});

app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to {{projectName}} API' });
});

// Start server
app.listen(PORT, () => {
  console.log(\`🚀 {{projectName}} running on port \${PORT}\`);
});

export default app;
`
                },
                {
                    path: 'package.json',
                    content: `{
  "name": "{{projectName}}",
  "version": "1.0.0",
  "description": "Express.js REST API",
  "main": "dist/index.js",
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "keywords": ["express", "api", "typescript"],
  "author": "{{author}}",
  "license": "MIT"
}
`
                },
                {
                    path: 'tsconfig.json',
                    content: `{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020"],
    "moduleResolution": "node",
    "esModuleInterop": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
`
                },
                {
                    path: '.gitignore',
                    content: `node_modules/
dist/
.env
*.log
.DS_Store
`
                },
                {
                    path: 'README.md',
                    content: `# {{projectName}}

Express.js REST API built with TypeScript.

## Installation

\`\`\`bash
npm install
\`\`\`

## Development

\`\`\`bash
npm run dev
\`\`\`

## Build

\`\`\`bash
npm run build
npm start
\`\`\`

## Author

{{author}}
`
                }
            ],
            dependencies: {
                'express': '^4.18.2',
                'cors': '^2.8.5',
                'helmet': '^7.1.0'
            },
            devDependencies: {
                '@types/express': '^4.17.21',
                '@types/cors': '^2.8.17',
                '@types/node': '^20.10.5',
                'typescript': '^5.3.3',
                'tsx': '^4.7.0'
            },
            tags: ['express', 'api', 'backend', 'typescript']
        });
        // React Component Template
        this.builtInTemplates.set('react-component', {
            name: 'react-component',
            description: 'React Component with TypeScript',
            language: 'typescript',
            category: 'frontend',
            variables: [
                { name: 'componentName', description: 'اسم المكون', required: true },
                { name: 'hasState', description: 'هل يحتاج state؟', defaultValue: 'true' }
            ],
            files: [
                {
                    path: '{{componentName}}.tsx',
                    content: `import React{{ hasState === 'true' ? ', { useState }' : '' }} from 'react';
import './{{componentName}}.css';

interface {{componentName}}Props {
  title?: string;
}

const {{componentName}}: React.FC<{{componentName}}Props> = ({ title = 'Hello' }) => {
{{ hasState === 'true' ? '  const [count, setCount] = useState(0);' : '' }}

  return (
    <div className="{{componentName}}">
      <h1>{title}</h1>
{{ hasState === 'true' ? '      <p>Count: {count}</p>\n      <button onClick={() => setCount(count + 1)}>Increment</button>' : '      <p>{{componentName}} Component</p>' }}
    </div>
  );
};

export default {{componentName}};
`
                },
                {
                    path: '{{componentName}}.css',
                    content: `.{{componentName}} {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.{{componentName}} h1 {
  color: #333;
  margin-bottom: 16px;
}

.{{componentName}} button {
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.{{componentName}} button:hover {
  background-color: #0056b3;
}
`
                },
                {
                    path: '{{componentName}}.test.tsx',
                    content: `import { render, screen } from '@testing-library/react';
import {{componentName}} from './{{componentName}}';

describe('{{componentName}}', () => {
  it('renders correctly', () => {
    render(<{{componentName}} />);
    expect(screen.getByText(/{{componentName}}/i)).toBeInTheDocument();
  });
});
`
                }
            ],
            dependencies: {
                'react': '^18.2.0'
            },
            devDependencies: {
                '@types/react': '^18.2.0',
                '@testing-library/react': '^14.0.0'
            },
            tags: ['react', 'component', 'frontend', 'typescript']
        });
        // Node.js CLI Template
        this.builtInTemplates.set('nodejs-cli', {
            name: 'nodejs-cli',
            description: 'Node.js CLI Tool with Commander',
            language: 'typescript',
            category: 'cli',
            variables: [
                { name: 'cliName', description: 'اسم الأداة', required: true },
                { name: 'author', description: 'اسم المطور', defaultValue: 'Your Name' }
            ],
            files: [
                {
                    path: 'src/cli.ts',
                    content: `#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';

const program = new Command();

program
  .name('{{cliName}}')
  .description('{{cliName}} - A powerful CLI tool')
  .version('1.0.0');

program
  .command('hello <name>')
  .description('Say hello to someone')
  .action((name: string) => {
    console.log(chalk.green(\`Hello, \${name}! Welcome to {{cliName}}!\`));
  });

program
  .command('info')
  .description('Show info about {{cliName}}')
  .action(() => {
    console.log(chalk.cyan('\\n{{cliName}} CLI Tool'));
    console.log(chalk.white('Author: {{author}}'));
    console.log(chalk.white('Version: 1.0.0\\n'));
  });

program.parse(process.argv);
`
                },
                {
                    path: 'package.json',
                    content: `{
  "name": "{{cliName}}",
  "version": "1.0.0",
  "description": "A powerful CLI tool",
  "type": "module",
  "main": "dist/cli.js",
  "bin": {
    "{{cliName}}": "./bin/{{cliName}}.js"
  },
  "scripts": {
    "build": "tsc",
    "dev": "tsx src/cli.ts",
    "start": "node dist/cli.js"
  },
  "keywords": ["cli", "tool"],
  "author": "{{author}}",
  "license": "MIT"
}
`
                },
                {
                    path: 'bin/{{cliName}}.js',
                    content: `#!/usr/bin/env node
import '../dist/cli.js';
`
                },
                {
                    path: 'tsconfig.json',
                    content: `{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020"],
    "moduleResolution": "node",
    "esModuleInterop": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
`
                },
                {
                    path: 'README.md',
                    content: `# {{cliName}}

A powerful CLI tool built with Node.js and TypeScript.

## Installation

\`\`\`bash
npm install
npm run build
npm link
\`\`\`

## Usage

\`\`\`bash
{{cliName}} hello John
{{cliName}} info
\`\`\`

## Author

{{author}}
`
                }
            ],
            dependencies: {
                'commander': '^11.1.0',
                'chalk': '^5.3.0'
            },
            devDependencies: {
                '@types/node': '^20.10.5',
                'typescript': '^5.3.3',
                'tsx': '^4.7.0'
            },
            tags: ['cli', 'tool', 'nodejs', 'typescript']
        });
        // TypeScript Library Template
        this.builtInTemplates.set('ts-library', {
            name: 'ts-library',
            description: 'TypeScript Library with exports',
            language: 'typescript',
            category: 'library',
            variables: [
                { name: 'libraryName', description: 'اسم المكتبة', required: true },
                { name: 'author', description: 'اسم المطور', defaultValue: 'Your Name' }
            ],
            files: [
                {
                    path: 'src/index.ts',
                    content: `/**
 * {{libraryName}} - A TypeScript library
 * @author {{author}}
 */

export interface Config {
  enabled: boolean;
  options?: Record<string, any>;
}

export class {{libraryName}} {
  private config: Config;

  constructor(config: Config = { enabled: true }) {
    this.config = config;
  }

  /**
   * Initialize the library
   */
  init(): void {
    console.log('{{libraryName}} initialized');
  }

  /**
   * Get configuration
   */
  getConfig(): Config {
    return this.config;
  }

  /**
   * Update configuration
   */
  setConfig(config: Partial<Config>): void {
    this.config = { ...this.config, ...config };
  }
}

export default {{libraryName}};
`
                },
                {
                    path: 'package.json',
                    content: `{
  "name": "{{libraryName}}",
  "version": "1.0.0",
  "description": "A TypeScript library",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "type": "module",
  "scripts": {
    "build": "tsc",
    "test": "jest",
    "prepublishOnly": "npm run build"
  },
  "keywords": ["typescript", "library"],
  "author": "{{author}}",
  "license": "MIT",
  "files": [
    "dist"
  ]
}
`
                },
                {
                    path: 'tsconfig.json',
                    content: `{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020"],
    "moduleResolution": "node",
    "declaration": true,
    "declarationMap": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
`
                },
                {
                    path: 'README.md',
                    content: `# {{libraryName}}

A TypeScript library.

## Installation

\`\`\`bash
npm install {{libraryName}}
\`\`\`

## Usage

\`\`\`typescript
import {{libraryName}} from '{{libraryName}}';

const lib = new {{libraryName}}({ enabled: true });
lib.init();
\`\`\`

## Author

{{author}}
`
                }
            ],
            devDependencies: {
                '@types/node': '^20.10.5',
                'typescript': '^5.3.3',
                'jest': '^29.7.0'
            },
            tags: ['typescript', 'library', 'npm']
        });
    }
    /**
     * استبدال المتغيرات في النص
     */
    replaceVariables(content, variables) {
        let result = content;
        // استبدال {{variableName}}
        for (const [key, value] of Object.entries(variables)) {
            const regex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g');
            result = result.replace(regex, value);
        }
        // معالجة الشروط {{ condition ? 'true' : 'false' }}
        const conditionalRegex = /\{\{\s*(\w+)\s*===\s*'(\w+)'\s*\?\s*'([^']+)'\s*:\s*'([^']*)'\s*\}\}/g;
        result = result.replace(conditionalRegex, (match, varName, compareValue, trueValue, falseValue) => {
            return variables[varName] === compareValue ? trueValue : falseValue;
        });
        return result;
    }
    /**
     * إنشاء مشروع من قالب
     */
    async createFromTemplate(templateName, options) {
        try {
            // البحث عن القالب
            let template = this.builtInTemplates.get(templateName);
            if (!template) {
                // محاولة تحميل من القوالب المخصصة
                template = await this.loadCustomTemplate(templateName);
            }
            if (!template) {
                console.log(chalk.red(`❌ القالب "${templateName}" غير موجود`));
                return false;
            }
            console.log(chalk.cyan(`\n📋 إنشاء مشروع من قالب: ${template.description}\n`));
            // تحضير المتغيرات
            const variables = {
                projectName: options.projectName,
                ...options.variables
            };
            // ملء المتغيرات المطلوبة
            for (const variable of template.variables) {
                if (!variables[variable.name]) {
                    if (variable.required) {
                        console.log(chalk.red(`❌ المتغير "${variable.name}" مطلوب`));
                        return false;
                    }
                    variables[variable.name] = variable.defaultValue || '';
                }
            }
            // تحديد مجلد الإخراج
            const outputDir = options.outputDir || path.join(this.workingDir, options.projectName);
            // إنشاء المجلد
            await fs.ensureDir(outputDir);
            // إنشاء الملفات
            let createdCount = 0;
            for (const file of template.files) {
                // استبدال المتغيرات في المسار
                const filePath = this.replaceVariables(file.path, variables);
                const fullPath = path.join(outputDir, filePath);
                // استبدال المتغيرات في المحتوى
                const content = this.replaceVariables(file.content, variables);
                // إنشاء المجلدات
                await fs.ensureDir(path.dirname(fullPath));
                // كتابة الملف
                await fs.writeFile(fullPath, content, 'utf8');
                console.log(chalk.green(`  ✓ ${filePath}`));
                createdCount++;
            }
            // إنشاء package.json إذا كان القالب يحتوي على dependencies
            if (template.dependencies || template.devDependencies) {
                const packageJsonPath = path.join(outputDir, 'package.json');
                if (await fs.pathExists(packageJsonPath)) {
                    // تحديث package.json الموجود
                    const packageJson = await fs.readJSON(packageJsonPath);
                    if (template.dependencies) {
                        packageJson.dependencies = {
                            ...packageJson.dependencies,
                            ...template.dependencies
                        };
                    }
                    if (template.devDependencies) {
                        packageJson.devDependencies = {
                            ...packageJson.devDependencies,
                            ...template.devDependencies
                        };
                    }
                    if (template.scripts) {
                        packageJson.scripts = {
                            ...packageJson.scripts,
                            ...template.scripts
                        };
                    }
                    await fs.writeJSON(packageJsonPath, packageJson, { spaces: 2 });
                }
            }
            console.log(chalk.green(`\n✅ تم إنشاء ${createdCount} ملف بنجاح!\n`));
            // تهيئة Git
            if (options.initGit) {
                console.log(chalk.cyan('🔧 تهيئة Git...\n'));
                // TODO: استخدام GitManager
            }
            // تثبيت Dependencies
            if (options.installDeps && (template.dependencies || template.devDependencies)) {
                console.log(chalk.cyan('📦 تثبيت المكتبات...\n'));
                console.log(chalk.yellow('💡 قم بتشغيل: npm install\n'));
            }
            console.log(chalk.cyan(`📁 المشروع جاهز في: ${outputDir}\n`));
            return true;
        }
        catch (error) {
            console.log(chalk.red(`❌ فشل إنشاء المشروع: ${error.message}`));
            return false;
        }
    }
    /**
     * تحميل قالب مخصص
     */
    async loadCustomTemplate(name) {
        try {
            const templatePath = path.join(this.templatesPath, `${name}.json`);
            if (await fs.pathExists(templatePath)) {
                return await fs.readJSON(templatePath);
            }
            return undefined;
        }
        catch (error) {
            return undefined;
        }
    }
    /**
     * حفظ قالب مخصص
     */
    async saveAsTemplate(name, template) {
        try {
            await fs.ensureDir(this.templatesPath);
            const templatePath = path.join(this.templatesPath, `${name}.json`);
            await fs.writeJSON(templatePath, template, { spaces: 2 });
            console.log(chalk.green(`✅ تم حفظ القالب: ${name}`));
            return true;
        }
        catch (error) {
            console.log(chalk.red(`❌ فشل حفظ القالب: ${error.message}`));
            return false;
        }
    }
    /**
     * قراءة جميع الملفات في مجلد بشكل متكرر
     */
    async getAllFiles(dir, baseDir = dir) {
        const files = [];
        const items = await fs.readdir(dir);
        for (const item of items) {
            const fullPath = path.join(dir, item);
            const stats = await fs.stat(fullPath);
            if (stats.isDirectory()) {
                const subFiles = await this.getAllFiles(fullPath, baseDir);
                files.push(...subFiles);
            }
            else {
                const relativePath = path.relative(baseDir, fullPath);
                files.push(relativePath);
            }
        }
        return files;
    }
    /**
     * إنشاء قالب من مشروع موجود
     */
    async createTemplateFromProject(projectPath, name, description, options = {}) {
        try {
            console.log(chalk.cyan(`\n📦 إنشاء قالب من: ${projectPath}\n`));
            const files = [];
            // قراءة جميع الملفات
            const allFiles = await this.getAllFiles(projectPath);
            // استثناء المجلدات غير المرغوبة
            const excludeDirs = ['node_modules', 'dist', '.git', '.oqool'];
            for (const file of allFiles) {
                // تحقق من الاستثناءات
                if (excludeDirs.some(dir => file.includes(dir))) {
                    continue;
                }
                const fullPath = path.join(projectPath, file);
                const content = await fs.readFile(fullPath, 'utf8');
                files.push({
                    path: file,
                    content
                });
                console.log(chalk.gray(`  • ${file}`));
            }
            // إنشاء القالب
            const template = {
                name,
                description,
                language: options.language || 'typescript',
                category: options.category || 'other',
                files,
                variables: options.variables || [],
                tags: []
            };
            // حفظ القالب
            await this.saveAsTemplate(name, template);
            console.log(chalk.green(`\n✅ تم إنشاء القالب بنجاح! (${files.length} ملف)\n`));
            return true;
        }
        catch (error) {
            console.log(chalk.red(`❌ فشل إنشاء القالب: ${error.message}`));
            return false;
        }
    }
    /**
     * عرض جميع القوالب
     */
    async listTemplates() {
        console.log(chalk.cyan('\n📋 القوالب المتاحة:\n'));
        console.log(chalk.gray('═'.repeat(80)));
        // القوالب المدمجة
        if (this.builtInTemplates.size > 0) {
            console.log(chalk.white('\n📦 القوالب المدمجة:\n'));
            for (const [name, template] of this.builtInTemplates.entries()) {
                console.log(chalk.green(`  • ${name}`));
                console.log(chalk.gray(`    ${template.description}`));
                console.log(chalk.gray(`    اللغة: ${template.language} | الفئة: ${template.category}`));
                console.log(chalk.gray(`    الملفات: ${template.files.length}`));
                if (template.tags && template.tags.length > 0) {
                    console.log(chalk.gray(`    Tags: ${template.tags.join(', ')}`));
                }
                console.log('');
            }
        }
        // القوالب المخصصة
        try {
            if (await fs.pathExists(this.templatesPath)) {
                const customTemplates = await fs.readdir(this.templatesPath);
                const jsonTemplates = customTemplates.filter(f => f.endsWith('.json'));
                if (jsonTemplates.length > 0) {
                    console.log(chalk.white('\n🎨 القوالب المخصصة:\n'));
                    for (const file of jsonTemplates) {
                        const name = file.replace('.json', '');
                        const template = await this.loadCustomTemplate(name);
                        if (template) {
                            console.log(chalk.cyan(`  • ${name}`));
                            console.log(chalk.gray(`    ${template.description}`));
                            console.log(chalk.gray(`    اللغة: ${template.language} | الفئة: ${template.category}`));
                            console.log('');
                        }
                    }
                }
            }
        }
        catch (error) {
            // لا توجد قوالب مخصصة
        }
        console.log(chalk.gray('═'.repeat(80) + '\n'));
    }
    /**
     * عرض تفاصيل قالب
     */
    async showTemplateDetails(templateName) {
        let template = this.builtInTemplates.get(templateName);
        if (!template) {
            template = await this.loadCustomTemplate(templateName);
        }
        if (!template) {
            console.log(chalk.red(`❌ القالب "${templateName}" غير موجود`));
            return;
        }
        console.log(chalk.cyan(`\n📋 تفاصيل القالب: ${template.name}\n`));
        console.log(chalk.gray('═'.repeat(80)));
        console.log(chalk.white(`📝 الوصف: ${template.description}`));
        console.log(chalk.white(`🔤 اللغة: ${template.language}`));
        console.log(chalk.white(`📁 الفئة: ${template.category}`));
        console.log(chalk.white(`📄 عدد الملفات: ${template.files.length}`));
        if (template.variables.length > 0) {
            console.log(chalk.white('\n🔧 المتغيرات:'));
            for (const variable of template.variables) {
                const required = variable.required ? chalk.red(' (مطلوب)') : '';
                const defaultVal = variable.defaultValue ? chalk.gray(` [افتراضي: ${variable.defaultValue}]`) : '';
                console.log(chalk.white(`  • ${variable.name}${required}${defaultVal}`));
                console.log(chalk.gray(`    ${variable.description}`));
            }
        }
        if (template.files.length > 0) {
            console.log(chalk.white('\n📂 الملفات:'));
            for (const file of template.files) {
                console.log(chalk.gray(`  • ${file.path}`));
                if (file.description) {
                    console.log(chalk.gray(`    ${file.description}`));
                }
            }
        }
        if (template.dependencies && Object.keys(template.dependencies).length > 0) {
            console.log(chalk.white('\n📦 Dependencies:'));
            for (const [name, version] of Object.entries(template.dependencies)) {
                console.log(chalk.gray(`  • ${name}@${version}`));
            }
        }
        if (template.tags && template.tags.length > 0) {
            console.log(chalk.white(`\n🏷️  Tags: ${template.tags.join(', ')}`));
        }
        console.log(chalk.gray('\n═'.repeat(80) + '\n'));
    }
    /**
     * حذف قالب مخصص
     */
    async deleteTemplate(name) {
        try {
            // لا يمكن حذف القوالب المدمجة
            if (this.builtInTemplates.has(name)) {
                console.log(chalk.red('❌ لا يمكن حذف القوالب المدمجة'));
                return false;
            }
            const templatePath = path.join(this.templatesPath, `${name}.json`);
            if (await fs.pathExists(templatePath)) {
                await fs.remove(templatePath);
                console.log(chalk.green(`✅ تم حذف القالب: ${name}`));
                return true;
            }
            else {
                console.log(chalk.red(`❌ القالب "${name}" غير موجود`));
                return false;
            }
        }
        catch (error) {
            console.log(chalk.red(`❌ فشل حذف القالب: ${error.message}`));
            return false;
        }
    }
    /**
     * البحث في القوالب
     */
    async searchTemplates(query) {
        const results = [];
        const lowerQuery = query.toLowerCase();
        // البحث في القوالب المدمجة
        for (const template of this.builtInTemplates.values()) {
            if (template.name.toLowerCase().includes(lowerQuery) ||
                template.description.toLowerCase().includes(lowerQuery) ||
                template.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))) {
                results.push(template);
            }
        }
        // البحث في القوالب المخصصة
        try {
            if (await fs.pathExists(this.templatesPath)) {
                const customTemplates = await fs.readdir(this.templatesPath);
                for (const file of customTemplates.filter(f => f.endsWith('.json'))) {
                    const name = file.replace('.json', '');
                    const template = await this.loadCustomTemplate(name);
                    if (template) {
                        if (template.name.toLowerCase().includes(lowerQuery) ||
                            template.description.toLowerCase().includes(lowerQuery) ||
                            template.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))) {
                            results.push(template);
                        }
                    }
                }
            }
        }
        catch (error) {
            // تجاهل الأخطاء
        }
        return results;
    }
    /**
     * عرض نتائج البحث
     */
    displaySearchResults(results, query) {
        if (results.length === 0) {
            console.log(chalk.yellow(`\n⚠️  لا توجد نتائج لـ: "${query}"\n`));
            return;
        }
        console.log(chalk.cyan(`\n🔍 نتائج البحث عن "${query}" (${results.length}):\n`));
        console.log(chalk.gray('─'.repeat(80)));
        for (const template of results) {
            console.log(chalk.green(`  • ${template.name}`));
            console.log(chalk.gray(`    ${template.description}`));
            console.log(chalk.gray(`    اللغة: ${template.language} | الفئة: ${template.category}`));
            console.log('');
        }
        console.log(chalk.gray('─'.repeat(80) + '\n'));
    }
}
// تصدير instance
export function createTemplateManager(workingDir) {
    return new TemplateManager(workingDir);
}
//# sourceMappingURL=template-manager.js.map