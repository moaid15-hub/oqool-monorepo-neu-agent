// multi-personality-ai-team.ts
// ============================================
// 🎭 Multi-Personality AI Team
// ============================================
import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';
export class MultiPersonalityAITeam {
    constructor(apiClient, workingDir = process.cwd()) {
        this.apiClient = apiClient;
        this.workingDir = workingDir;
        this.personalitiesPath = path.join(workingDir, '.oqool', 'ai-personalities');
        this.teamsPath = path.join(workingDir, '.oqool', 'ai-teams');
        this.initializeSystem();
    }
    /**
     * تهيئة النظام
     */
    async initializeSystem() {
        await fs.ensureDir(this.personalitiesPath);
        await fs.ensureDir(this.teamsPath);
        // إنشاء الشخصيات الافتراضية إذا لم تكن موجودة
        if (!await this.hasDefaultPersonalities()) {
            await this.createDefaultPersonalities();
        }
    }
    /**
     * التحقق من وجود الشخصيات الافتراضية
     */
    async hasDefaultPersonalities() {
        const files = await fs.readdir(this.personalitiesPath);
        return files.length > 0;
    }
    /**
     * إنشاء الشخصيات الافتراضية
     */
    async createDefaultPersonalities() {
        const defaultPersonalities = [
            {
                id: 'architect-alex',
                name: 'Alex المعماري',
                role: 'architect',
                personality: 'منظم، استراتيجي، يركز على البنية الشاملة',
                expertise: ['system-design', 'architecture', 'scalability', 'patterns'],
                strengths: ['تصميم النظم', 'التخطيط طويل المدى', 'تحليل المتطلبات'],
                weaknesses: ['التفاصيل الدقيقة', 'التنفيذ السريع'],
                communicationStyle: 'formal',
                bio: 'معماري نظم ذو خبرة 15 عاماً في تصميم الحلول المعقدة',
                active: true,
                performance: {
                    tasksCompleted: 0,
                    successRate: 0,
                    averageRating: 0,
                    lastActive: new Date().toISOString()
                }
            },
            {
                id: 'developer-sarah',
                name: 'Sarah المطورة',
                role: 'developer',
                personality: 'عملية، سريعة، تركز على التنفيذ النظيف',
                expertise: ['coding', 'debugging', 'optimization', 'best-practices'],
                strengths: ['كتابة كود نظيف', 'حل المشاكل', 'تحسين الأداء'],
                weaknesses: ['التصميم عالي المستوى', 'التوثيق'],
                communicationStyle: 'technical',
                bio: 'مطورة full-stack مع خبرة في JavaScript وPython',
                active: true,
                performance: {
                    tasksCompleted: 0,
                    successRate: 0,
                    averageRating: 0,
                    lastActive: new Date().toISOString()
                }
            },
            {
                id: 'reviewer-mike',
                name: 'Mike المراجع',
                role: 'reviewer',
                personality: 'دقيق، منهجي، يركز على الجودة',
                expertise: ['code-review', 'testing', 'standards', 'quality-assurance'],
                strengths: ['كشف الأخطاء', 'تحسين الكود', 'المعايير'],
                weaknesses: ['السرعة', 'الإبداع'],
                communicationStyle: 'technical',
                bio: 'خبير مراجعة كود ومهندس جودة برمجيات',
                active: true,
                performance: {
                    tasksCompleted: 0,
                    successRate: 0,
                    averageRating: 0,
                    lastActive: new Date().toISOString()
                }
            },
            {
                id: 'security-guardian',
                name: 'Guardian الأمني',
                role: 'security',
                personality: 'حذر، وقائي، يركز على الحماية',
                expertise: ['security', 'vulnerabilities', 'encryption', 'best-practices'],
                strengths: ['كشف الثغرات', 'تأمين الكود', 'المعايير الأمنية'],
                weaknesses: ['الأداء', 'سهولة الاستخدام'],
                communicationStyle: 'formal',
                bio: 'خبير أمن المعلومات وأمان التطبيقات',
                active: true,
                performance: {
                    tasksCompleted: 0,
                    successRate: 0,
                    averageRating: 0,
                    lastActive: new Date().toISOString()
                }
            },
            {
                id: 'tester-olivia',
                name: 'Olivia المختبرة',
                role: 'tester',
                personality: 'منهجية، شاملة، تركز على التغطية',
                expertise: ['testing', 'qa', 'automation', 'edge-cases'],
                strengths: ['كتابة اختبارات', 'كشف الأخطاء', 'التغطية الشاملة'],
                weaknesses: ['التصميم', 'الأداء'],
                communicationStyle: 'technical',
                bio: 'مهندسة اختبارات مع خبرة في الاختبار التلقائي',
                active: true,
                performance: {
                    tasksCompleted: 0,
                    successRate: 0,
                    averageRating: 0,
                    lastActive: new Date().toISOString()
                }
            }
        ];
        for (const personality of defaultPersonalities) {
            await this.savePersonality(personality);
        }
        console.log(chalk.green('✅ تم إنشاء الشخصيات الافتراضية للفريق'));
    }
    /**
     * إنشاء فريق AI جديد
     */
    async createTeam(name, description, projectType, complexity = 'moderate') {
        const spinner = ora('إنشاء فريق AI...').start();
        try {
            // الحصول على الشخصيات المتاحة
            const availablePersonalities = await this.getAvailablePersonalities();
            if (availablePersonalities.length === 0) {
                throw new Error('لا توجد شخصيات AI متاحة');
            }
            // اختيار الشخصيات للفريق
            const { selectedPersonalities } = await inquirer.prompt([
                {
                    type: 'checkbox',
                    name: 'selectedPersonalities',
                    message: 'اختر الشخصيات للفريق:',
                    choices: availablePersonalities.map(p => ({
                        name: `${p.name} (${p.role}) - ${p.bio}`,
                        value: p.id,
                        checked: p.active
                    })),
                    validate: (input) => input.length >= 2 || 'يجب اختيار شخصيتين على الأقل'
                }
            ]);
            // اختيار القائد
            const { leader } = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'leader',
                    message: 'اختر قائد الفريق:',
                    choices: selectedPersonalities.map((id) => {
                        const personality = availablePersonalities.find(p => p.id === id);
                        return {
                            name: `${personality?.name} (${personality?.role})`,
                            value: id
                        };
                    })
                }
            ]);
            // إنشاء الفريق
            const team = {
                id: this.generateId(),
                name,
                description,
                members: availablePersonalities.filter(p => selectedPersonalities.includes(p.id)),
                leader,
                projectType,
                complexity,
                createdAt: new Date().toISOString(),
                lastUsed: new Date().toISOString(),
                performance: {
                    overallScore: 0,
                    collaborationScore: 0,
                    efficiency: 0,
                    creativity: 0,
                    reliability: 0,
                    tasksCompleted: 0,
                    averageTime: 0
                },
                preferences: {
                    communication: 'hybrid',
                    decisionMaking: 'leader',
                    codeStyle: 'adaptive',
                    testingStrategy: 'balanced',
                    documentationLevel: 'standard'
                }
            };
            await this.saveTeam(team);
            spinner.succeed('تم إنشاء فريق AI بنجاح!');
            console.log(chalk.green(`\n🎭 فريق: ${name}`));
            console.log(chalk.cyan(`   الأعضاء: ${team.members.length} شخصية`));
            console.log(chalk.cyan(`   القائد: ${team.members.find(m => m.id === leader)?.name}`));
            console.log(chalk.gray(`   المعرف: ${team.id}\n`));
            return team;
        }
        catch (error) {
            spinner.fail('فشل في إنشاء الفريق');
            throw error;
        }
    }
    /**
     * بدء نقاش فريق
     */
    async startTeamDiscussion(teamId, topic, initialPrompt) {
        const spinner = ora('بدء النقاش...').start();
        try {
            const team = await this.getTeam(teamId);
            if (!team) {
                throw new Error('الفريق غير موجود');
            }
            const discussion = {
                id: this.generateId(),
                teamId,
                topic,
                messages: [],
                status: 'active',
                createdAt: new Date().toISOString()
            };
            // إضافة الرسالة الأولى من المستخدم
            discussion.messages.push({
                id: this.generateId(),
                personalityId: 'user',
                personalityName: 'المستخدم',
                message: initialPrompt,
                timestamp: new Date().toISOString(),
                type: 'proposal',
                confidence: 1.0,
                influence: 1.0
            });
            // بدء النقاش مع كل شخصية
            for (const personality of team.members) {
                const response = await this.getPersonalityResponse(personality, initialPrompt, team, discussion);
                discussion.messages.push({
                    id: this.generateId(),
                    personalityId: personality.id,
                    personalityName: personality.name,
                    message: response.message,
                    timestamp: new Date().toISOString(),
                    type: response.type,
                    confidence: response.confidence,
                    influence: this.calculateInfluence(personality, team)
                });
                // انتظار قصير للمحادثة الطبيعية
                await this.delay(1000);
            }
            // تحديث حالة الفريق
            team.lastUsed = new Date().toISOString();
            await this.saveTeam(team);
            // حفظ النقاش
            await this.saveDiscussion(discussion);
            spinner.succeed('تم بدء النقاش بنجاح!');
            // عرض ملخص النقاش
            this.displayDiscussionSummary(discussion);
            return discussion;
        }
        catch (error) {
            spinner.fail('فشل في بدء النقاش');
            throw error;
        }
    }
    /**
     * الحصول على رد الشخصية
     */
    async getPersonalityResponse(personality, prompt, team, discussion) {
        // بناء السياق للشخصية
        const context = this.buildPersonalityContext(personality, team, discussion);
        const messages = [
            {
                role: 'system',
                content: `أنت ${personality.name}, ${personality.role} في فريق AI.

${personality.personality}

دورك: ${this.getRoleDescription(personality.role)}
خبرتك: ${personality.expertise.join(', ')}
أسلوب التواصل: ${personality.communicationStyle}

${context}

رد بطريقة تتناسب مع شخصيتك ودورك في الفريق. كن مفيداً ومبنياً للفريق.`
            },
            {
                role: 'user',
                content: prompt
            }
        ];
        const response = await this.apiClient.sendChatMessage(messages);
        return {
            message: response.success ? response.message : 'أواجه صعوبة في الرد الآن',
            type: this.determineMessageType(response.message, personality),
            confidence: this.calculateConfidence(response.message, personality)
        };
    }
    /**
     * بناء سياق الشخصية
     */
    buildPersonalityContext(personality, team, discussion) {
        let context = `الفريق: ${team.name}\n`;
        context += `الموضوع: ${discussion.topic}\n`;
        context += `الأعضاء: ${team.members.map(m => m.name).join(', ')}\n`;
        context += `القائد: ${team.members.find(m => m.id === team.leader)?.name}\n\n`;
        // إضافة رسائل سابقة من الفريق
        if (discussion.messages.length > 1) {
            context += 'النقاش السابق:\n';
            for (const message of discussion.messages.slice(-3)) {
                if (message.personalityId !== personality.id) {
                    context += `${message.personalityName}: ${message.message}\n`;
                }
            }
            context += '\n';
        }
        context += `الآن دورك في ${this.getRoleDescription(personality.role).toLowerCase()}`;
        return context;
    }
    /**
     * تحديد نوع الرسالة
     */
    determineMessageType(message, personality) {
        const lowerMessage = message.toLowerCase();
        if (lowerMessage.includes('أقترح') || lowerMessage.includes('دعني أقترح')) {
            return 'proposal';
        }
        else if (lowerMessage.includes('أتفق') || lowerMessage.includes('موافق')) {
            return 'agreement';
        }
        else if (lowerMessage.includes('لا أتفق') || lowerMessage.includes('أختلف')) {
            return 'disagreement';
        }
        else if (lowerMessage.includes('سؤال') || lowerMessage.includes('?')) {
            return 'question';
        }
        else if (lowerMessage.includes('حل') || lowerMessage.includes('solution')) {
            return 'solution';
        }
        else {
            return 'opinion';
        }
    }
    /**
     * حساب الثقة
     */
    calculateConfidence(message, personality) {
        // حساب الثقة بناءً على خبرة الشخصية ووضوح الرد
        let confidence = 0.7;
        // زيادة الثقة للخبرات المتخصصة
        const messageLower = message.toLowerCase();
        for (const expertise of personality.expertise) {
            if (messageLower.includes(expertise)) {
                confidence += 0.1;
            }
        }
        // تقليل الثقة للردود القصيرة جداً
        if (message.length < 50) {
            confidence -= 0.2;
        }
        return Math.min(1.0, Math.max(0.0, confidence));
    }
    /**
     * حساب التأثير
     */
    calculateInfluence(personality, team) {
        let influence = 0.5;
        // زيادة التأثير للقائد
        if (personality.id === team.leader) {
            influence += 0.2;
        }
        // زيادة التأثير للأدوار المهمة
        if (personality.role === 'architect' || personality.role === 'security') {
            influence += 0.1;
        }
        // زيادة التأثير للأداء الجيد
        influence += (personality.performance.successRate / 100) * 0.2;
        return Math.min(1.0, influence);
    }
    /**
     * عرض ملخص النقاش
     */
    displayDiscussionSummary(discussion) {
        console.log(chalk.green('\n📋 ملخص النقاش:\n'));
        const teamMessages = discussion.messages.filter(m => m.personalityId !== 'user');
        const totalConfidence = teamMessages.reduce((sum, m) => sum + m.confidence, 0);
        const averageConfidence = teamMessages.length > 0 ? totalConfidence / teamMessages.length : 0;
        console.log(chalk.white(`   الموضوع: ${discussion.topic}`));
        console.log(chalk.white(`   الأعضاء: ${teamMessages.length}`));
        console.log(chalk.white(`   متوسط الثقة: ${(averageConfidence * 100).toFixed(1)}%`));
        console.log(chalk.cyan('\n   الآراء:'));
        for (const message of teamMessages.slice(0, 3)) {
            const confidenceBar = '█'.repeat(Math.floor(message.confidence * 10)) + '░'.repeat(10 - Math.floor(message.confidence * 10));
            console.log(chalk.gray(`     ${message.personalityName}: ${confidenceBar} ${(message.confidence * 100).toFixed(0)}%`));
            console.log(chalk.white(`       ${message.message.substring(0, 100)}...`));
        }
        if (teamMessages.length > 3) {
            console.log(chalk.gray(`     ... و ${teamMessages.length - 3} آراء أخرى`));
        }
    }
    /**
     * الحصول على الشخصيات المتاحة
     */
    async getAvailablePersonalities() {
        const files = await fs.readdir(this.personalitiesPath);
        const personalities = [];
        for (const file of files) {
            if (file.endsWith('.json')) {
                const personalityPath = path.join(this.personalitiesPath, file);
                const personality = await fs.readJson(personalityPath);
                personalities.push(personality);
            }
        }
        return personalities.sort((a, b) => a.name.localeCompare(b.name));
    }
    /**
     * الحصول على فريق
     */
    async getTeam(teamId) {
        const teamPath = path.join(this.teamsPath, `${teamId}.json`);
        if (await fs.pathExists(teamPath)) {
            return await fs.readJson(teamPath);
        }
        return null;
    }
    /**
     * حفظ فريق
     */
    async saveTeam(team) {
        const teamPath = path.join(this.teamsPath, `${team.id}.json`);
        await fs.writeJson(teamPath, team, { spaces: 2 });
    }
    /**
     * حفظ شخصية
     */
    async savePersonality(personality) {
        const personalityPath = path.join(this.personalitiesPath, `${personality.id}.json`);
        await fs.writeJson(personalityPath, personality, { spaces: 2 });
    }
    /**
     * حفظ نقاش
     */
    async saveDiscussion(discussion) {
        const discussionsPath = path.join(this.workingDir, '.oqool', 'team-discussions');
        await fs.ensureDir(discussionsPath);
        const discussionPath = path.join(discussionsPath, `${discussion.id}.json`);
        await fs.writeJson(discussionPath, discussion, { spaces: 2 });
    }
    /**
     * توليد معرف فريد
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    /**
     * وصف الدور
     */
    getRoleDescription(role) {
        const descriptions = {
            architect: 'تصميم البنية الشاملة والتخطيط الاستراتيجي',
            developer: 'كتابة وتنفيذ الكود والحلول التقنية',
            reviewer: 'مراجعة الكود وتحسين الجودة',
            tester: 'كتابة وتنفيذ الاختبارات',
            optimizer: 'تحسين الأداء والكفاءة',
            security: 'تأمين الكود وكشف الثغرات',
            documenter: 'كتابة التوثيق والشرح',
            mentor: 'الإرشاد والتدريب'
        };
        return descriptions[role] || 'مساهم في الفريق';
    }
    /**
     * تأخير
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    /**
     * عرض جميع الفرق
     */
    async listTeams() {
        const files = await fs.readdir(this.teamsPath);
        const teams = [];
        for (const file of files) {
            if (file.endsWith('.json')) {
                const teamPath = path.join(this.teamsPath, file);
                const team = await fs.readJson(teamPath);
                teams.push(team);
            }
        }
        if (teams.length === 0) {
            console.log(chalk.yellow('❌ لا توجد فرق AI حالياً'));
            console.log(chalk.cyan('💡 أنشئ فريق جديد: oqool-code team create'));
            return;
        }
        console.log(chalk.green('\n🎭 فرق AI المتاحة:\n'));
        teams.sort((a, b) => new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime());
        for (const team of teams) {
            const leaderName = team.members.find(m => m.id === team.leader)?.name || 'غير محدد';
            const membersCount = team.members.length;
            console.log(chalk.cyan(`📋 ${team.name}`));
            console.log(chalk.white(`   ${team.description}`));
            console.log(chalk.gray(`   القائد: ${leaderName} | الأعضاء: ${membersCount} | المشروع: ${team.projectType}`));
            console.log(chalk.gray(`   آخر استخدام: ${new Date(team.lastUsed).toLocaleString('ar')}`));
            console.log('');
        }
    }
    /**
     * الحصول على جميع الفرق
     */
    async getAllTeams() {
        const files = await fs.readdir(this.teamsPath);
        const teams = [];
        for (const file of files) {
            if (file.endsWith('.json')) {
                const teamPath = path.join(this.teamsPath, file);
                const team = await fs.readJson(teamPath);
                teams.push(team);
            }
        }
        return teams.sort((a, b) => new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime());
    }
    /**
     * عرض الشخصيات المتاحة
     */
    async listPersonalities() {
        const personalities = await this.getAvailablePersonalities();
        if (personalities.length === 0) {
            console.log(chalk.yellow('❌ لا توجد شخصيات AI'));
            return;
        }
        console.log(chalk.green('\n🎭 شخصيات AI المتاحة:\n'));
        for (const personality of personalities) {
            const roleName = this.getRoleDescription(personality.role);
            const expertise = personality.expertise.slice(0, 3).join(', ');
            const status = personality.active ? chalk.green('✓ نشط') : chalk.red('✗ غير نشط');
            console.log(chalk.cyan(`👤 ${personality.name}`));
            console.log(chalk.white(`   ${roleName}`));
            console.log(chalk.gray(`   خبرة: ${expertise}${personality.expertise.length > 3 ? '...' : ''}`));
            console.log(chalk.gray(`   أسلوب: ${personality.communicationStyle} | ${status}`));
            console.log(chalk.white(`   ${personality.bio}`));
            console.log('');
        }
    }
}
// مصنع لإنشاء instance
export function createMultiPersonalityAITeam(apiClient, workingDir) {
    return new MultiPersonalityAITeam(apiClient, workingDir);
}
//# sourceMappingURL=multi-personality-ai-team.js.map