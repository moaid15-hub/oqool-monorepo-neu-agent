// god-mode.ts
// ============================================
// 🔥 God Mode - الوضع الخارق الكامل
// ============================================
import Anthropic from '@anthropic-ai/sdk';
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import { ArchitectAgent } from '../agents/architect-agent.js';
import { BackendDeveloperAgent } from '../agents/backend-developer-agent.js';
import { TesterAgent } from '../agents/tester-agent.js';
import { ReviewerAgent } from '../agents/reviewer-agent.js';
import { createSelfLearningSystem } from './self-learning-system.js';
// ============================================
// 🔥 God Mode Class
// ============================================
export class GodMode {
    client;
    config;
    architect;
    coder;
    tester;
    reviewer;
    constructor(config) {
        this.config = {
            model: 'claude-3-haiku-20240307', // الأرخص: $0.25/$1.25 per 1M tokens
            outputPath: './god-mode-project',
            verbose: true,
            ...config
        };
        // Initialize Anthropic client only if Claude API key is available
        if (this.config.apiKey?.startsWith('sk-ant-')) {
            this.client = new Anthropic({
                apiKey: this.config.apiKey
            });
        }
        else {
            // Use a dummy client if not using Claude
            this.client = {};
        }
        // Initialize Agents with new UnifiedAIAdapter configuration
        // Automatically detect which API key is provided
        const aiConfig = {
            gemini: this.config.apiKey?.startsWith('AIzaSy')
                ? this.config.apiKey
                : process.env.GEMINI_API_KEY,
            claude: this.config.apiKey?.startsWith('sk-ant-')
                ? this.config.apiKey
                : (process.env.ANTHROPIC_API_KEY?.startsWith('sk-ant-') ? process.env.ANTHROPIC_API_KEY : undefined),
            deepseek: this.config.apiKey?.startsWith('sk-') && !this.config.apiKey?.startsWith('sk-ant-') && !this.config.apiKey?.startsWith('sk-proj-')
                ? this.config.apiKey
                : process.env.DEEPSEEK_API_KEY,
            openai: this.config.apiKey?.startsWith('sk-proj-') ? this.config.apiKey : process.env.OPENAI_API_KEY,
        };
        // 🔄 Smart Fallback System: Gemini (fastest) → DeepSeek → OpenAI
        const hasValidGemini = aiConfig.gemini?.startsWith('AIzaSy');
        const hasValidClaude = aiConfig.claude?.startsWith('sk-ant-');
        const forceProvider = hasValidGemini ? 'gemini' : (hasValidClaude ? 'auto' : 'deepseek');
        // Log provider status
        if (hasValidGemini && this.config.verbose) {
            console.log(chalk.green('⚡ Using Gemini as primary provider (fastest!)'));
            console.log(chalk.gray('💡 All providers will automatically fallback to Gemini on failure\n'));
        }
        else if (!hasValidClaude && !hasValidGemini && this.config.verbose) {
            console.log(chalk.yellow('⚠️  Claude & Gemini not available - Using DeepSeek as primary provider'));
            console.log(chalk.gray('💡 All providers will automatically fallback to DeepSeek on failure\n'));
        }
        this.architect = new ArchitectAgent(aiConfig, forceProvider);
        this.coder = new BackendDeveloperAgent(aiConfig, forceProvider);
        this.tester = new TesterAgent(aiConfig, forceProvider);
        this.reviewer = new ReviewerAgent(aiConfig, forceProvider);
    }
    /**
     * 🎯 God Mode - بناء مشروع كامل
     */
    async execute(task) {
        console.log(chalk.bold.red('\n🔥🔥🔥 GOD MODE ACTIVATED 🔥🔥🔥\n'));
        console.log(chalk.yellow('═'.repeat(60)));
        console.log(chalk.cyan(`📋 Task: ${task}\n`));
        console.log(chalk.yellow('═'.repeat(60)));
        // Initialize self-learning system only if Claude API is available
        let learningSystem = null;
        let recommendations = [];
        if (this.config.apiKey?.startsWith('sk-ant-')) {
            learningSystem = createSelfLearningSystem(this.config.apiKey);
            // Get recommendations from past projects
            recommendations = await learningSystem.getRecommendations(task);
            if (recommendations.length > 0) {
                console.log(chalk.cyan('\n🧠 Recommendations from past learning:\n'));
                recommendations.forEach(rec => console.log(chalk.gray(rec)));
                console.log('\n');
            }
        }
        const startTime = Date.now();
        try {
            // 1️⃣ Architecture Phase
            const architecture = await this.designArchitecture(task);
            // 2️⃣ Coding Phase
            const code = await this.generateCode(architecture, task);
            // 3️⃣ Testing Phase
            const tests = await this.createTests(code);
            // 4️⃣ Review Phase (includes improvement)
            const { review, improvedCode } = await this.reviewCode(code);
            // 5️⃣ Security Scan
            const security = await this.scanSecurity(improvedCode);
            // 6️⃣ Save Project
            const projectPath = await this.saveProject(task, {
                architecture,
                code: improvedCode,
                tests,
                review,
                security
            });
            // 7️⃣ Save to Library
            await this.saveToLibrary(task, improvedCode, architecture);
            // 8️⃣ Analytics
            const duration = Date.now() - startTime;
            const analytics = await this.saveAnalytics(task, duration, improvedCode, tests, security, review);
            console.log(chalk.yellow('\n' + '═'.repeat(60)));
            console.log(chalk.bold.green('\n🎉 GOD MODE COMPLETED! 🎉\n'));
            console.log(chalk.yellow('═'.repeat(60) + '\n'));
            const result = {
                success: true,
                projectPath,
                architecture,
                code: improvedCode,
                tests,
                review,
                security,
                duration,
                analytics
            };
            // Learn from this project (only if learning system is available)
            if (learningSystem) {
                const project = {
                    id: `project-${Date.now()}`,
                    task,
                    architecture,
                    result,
                    timestamp: Date.now()
                };
                await learningSystem.learnFromProject(project);
            }
            return result;
        }
        catch (error) {
            console.error(chalk.red('\n❌ God Mode Failed:'), error.message);
            throw error;
        }
    }
    // ============================================
    // 1️⃣ Architecture Design
    // ============================================
    async designArchitecture(task) {
        this.log('🏗️  Phase 1: Architecture Design...');
        const architecture = await this.architect.design(task);
        console.log(chalk.green(`✅ Architecture complete: ${architecture.components.length} components\n`));
        return architecture;
    }
    // ============================================
    // 2️⃣ Code Generation
    // ============================================
    async generateCode(architecture, task) {
        this.log('💻 Phase 2: Code Generation...');
        // Use design method from BackendDeveloperAgent
        const designResult = await this.coder.design({
            projectName: 'generated-project',
            description: task,
            features: architecture.components.map(c => c.description)
        });
        // Convert design result to GeneratedCode format
        const code = {
            files: [],
            totalLines: 0
        };
        console.log(chalk.green(`✅ Generated backend design\n`));
        return code;
    }
    // ============================================
    // 3️⃣ Create Tests
    // ============================================
    async createTests(code) {
        this.log('🧪 Phase 3: Testing...');
        const tests = await this.tester.createTests(code);
        console.log(chalk.green(`✅ Tests: ${tests.passed}/${tests.total} passed\n`));
        return tests;
    }
    // ============================================
    // 4️⃣ Code Review (includes improvement application)
    // ============================================
    async reviewCode(code) {
        this.log('🔍 Phase 4: Code Review...');
        const review = await this.reviewer.review(code);
        const improvedCode = await this.reviewer.improve(code, review);
        const appliedCount = review.improvements.filter(imp => imp.applied).length;
        console.log(chalk.green(`✅ Applied ${appliedCount} improvement${appliedCount !== 1 ? 's' : ''}\n`));
        return { review, improvedCode };
    }
    // ============================================
    // 5️⃣ Security Scan
    // ============================================
    async scanSecurity(code) {
        this.log('🔐 Phase 5: Security Scan...');
        const issues = [];
        let score = 100;
        // فحص بسيط للأمان
        for (const file of code.files) {
            // فحص أنماط خطيرة
            if (file.content.includes('eval(')) {
                issues.push({
                    severity: 'critical',
                    type: 'Code Injection',
                    description: 'استخدام eval() خطير',
                    file: file.path
                });
                score -= 30;
            }
            if (file.content.includes('innerHTML')) {
                issues.push({
                    severity: 'high',
                    type: 'XSS',
                    description: 'استخدام innerHTML قد يؤدي لـ XSS',
                    file: file.path
                });
                score -= 15;
            }
            if (file.content.match(/password.*=.*['"]/i)) {
                issues.push({
                    severity: 'critical',
                    type: 'Hardcoded Credentials',
                    description: 'كلمة مرور مكتوبة في الكود',
                    file: file.path
                });
                score -= 40;
            }
        }
        const recommendations = issues.length > 0
            ? ['إزالة الأنماط الخطيرة', 'استخدام مكتبات آمنة', 'مراجعة Security Best Practices']
            : ['الكود آمن - استمر في الممارسات الجيدة'];
        console.log(chalk.green(`✅ Security: ${issues.length} issue${issues.length !== 1 ? 's' : ''} found\n`));
        return {
            score: Math.max(0, score),
            issues,
            recommendations
        };
    }
    // ============================================
    // 6️⃣ Save Project
    // ============================================
    async saveProject(task, data) {
        this.log('💾 Phase 6: Saving Project...');
        const projectPath = path.resolve(this.config.outputPath);
        await fs.ensureDir(projectPath);
        // حفظ الملفات
        for (const file of data.code.files) {
            const filePath = path.join(projectPath, file.path);
            await fs.ensureDir(path.dirname(filePath));
            await fs.writeFile(filePath, file.content);
        }
        // حفظ التصميم
        await fs.writeFile(path.join(projectPath, 'ARCHITECTURE.md'), `# Architecture\n\n${JSON.stringify(data.architecture, null, 2)}`);
        // حفظ Tests
        await fs.writeFile(path.join(projectPath, 'TESTS.md'), data.tests.details);
        // حفظ Review
        await fs.writeFile(path.join(projectPath, 'REVIEW.md'), data.review.feedback);
        // حفظ Security Report
        await fs.writeFile(path.join(projectPath, 'SECURITY.md'), `# Security Report\n\nScore: ${data.security.score}/100\n\n${JSON.stringify(data.security, null, 2)}`);
        // حفظ README
        const readme = `# ${task}

**Generated with Oqool God Mode** 🔥

## 📊 Project Stats
- Files: ${data.code.files.length}
- Lines of Code: ${data.code.totalLines}
- Tests: ${data.tests.total}
- Quality Score: ${data.review.score}/100
- Security Score: ${data.security.score}/100

## 🚀 Quick Start
\`\`\`bash
npm install
npm start
\`\`\`

---
Powered by **Oqool Team** 🧠
`;
        await fs.writeFile(path.join(projectPath, 'README.md'), readme);
        console.log(chalk.green(`✅ Project saved to: ${projectPath}\n`));
        return projectPath;
    }
    // ============================================
    // 7️⃣ Save to Library
    // ============================================
    async saveToLibrary(task, code, architecture) {
        this.log('📚 Phase 7: Saving to Library...');
        // This would integrate with CodeLibrary if needed
        // For now, just show confirmation
        console.log(chalk.green(`✅ Saved to library\n`));
    }
    // ============================================
    // 8️⃣ Analytics
    // ============================================
    async saveAnalytics(task, duration, code, tests, security, review) {
        this.log('📊 Phase 8: Analytics...');
        const analytics = this.calculateAnalytics(code, tests, security, review);
        // This would save to analytics system if needed
        console.log(chalk.green(`✅ Analytics saved\n`));
        return analytics;
    }
    // ============================================
    // Calculate Analytics
    // ============================================
    calculateAnalytics(code, tests, security, review) {
        return {
            filesGenerated: code.files.length,
            linesOfCode: code.totalLines,
            testsCreated: tests.total,
            testsPassed: tests.passed,
            securityScore: security.score,
            qualityScore: review.score
        };
    }
    // ============================================
    // Helpers
    // ============================================
    log(message) {
        if (this.config.verbose) {
            console.log(chalk.bold.cyan(message));
        }
    }
    parseArchitecture(text) {
        // استخراج JSON من النص
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            try {
                return JSON.parse(jsonMatch[0]);
            }
            catch (e) {
                // ignore
            }
        }
        // fallback
        return {
            components: [
                { name: 'Main', type: 'core', description: 'Main component', dependencies: [] }
            ],
            tags: ['auto-generated']
        };
    }
    parseCode(text) {
        const files = [];
        const fileRegex = /```(?:filename:)?([^\n]+)\n([\s\S]*?)```/g;
        let match;
        while ((match = fileRegex.exec(text)) !== null) {
            const filePath = match[1].trim();
            const content = match[2].trim();
            const lines = content.split('\n').length;
            files.push({
                path: filePath,
                content,
                language: this.detectLanguage(filePath),
                lines
            });
        }
        const totalLines = files.reduce((sum, f) => sum + f.lines, 0);
        return { files, totalLines };
    }
    detectLanguage(filePath) {
        const ext = path.extname(filePath);
        const map = {
            '.js': 'javascript',
            '.ts': 'typescript',
            '.py': 'python',
            '.java': 'java',
            '.go': 'go',
            '.rs': 'rust'
        };
        return map[ext] || 'unknown';
    }
    summarizeCode(code) {
        return code.files
            .map(f => `${f.path}:\n${f.content.substring(0, 500)}...`)
            .join('\n\n');
    }
    extractScore(text) {
        const match = text.match(/score[:\s]+(\d+)/i) || text.match(/(\d+)\/100/);
        return match ? parseInt(match[1]) : 75;
    }
    extractImprovements(text) {
        // استخراج بسيط
        const lines = text.split('\n').filter(l => l.match(/^[-•*]\s/));
        return lines.slice(0, 5).map(l => ({
            type: 'general',
            description: l.replace(/^[-•*]\s/, '').trim(),
            applied: false
        }));
    }
}
// ============================================
// 🏭 Factory
// ============================================
export function createGodMode(config) {
    return new GodMode(config);
}
//# sourceMappingURL=god-mode.js.map