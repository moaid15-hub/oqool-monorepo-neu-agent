// team-collaboration.ts
// ============================================
// 🌐 Team Collaboration System
// ============================================
import fs from 'fs-extra';
import { join } from 'path';
import chalk from 'chalk';
export class TeamCollaboration {
    teamId;
    workingDirectory;
    teamDir;
    members = new Map();
    solutions = new Map();
    constructor(teamId, workingDirectory) {
        this.teamId = teamId;
        this.workingDirectory = workingDirectory;
        this.teamDir = join(workingDirectory, '.oqool', 'team', teamId);
    }
    // ============================================
    // 🎯 إنشاء Team
    // ============================================
    async create(teamName, creator) {
        await fs.ensureDir(this.teamDir);
        // إضافة المنشئ كـ admin
        creator.role = 'admin';
        this.members.set(creator.id, creator);
        // حفظ معلومات Team
        await fs.writeJSON(join(this.teamDir, 'info.json'), {
            id: this.teamId,
            name: teamName,
            createdAt: Date.now(),
            createdBy: creator.id
        }, { spaces: 2 });
        await this.saveMembers();
        console.log(chalk.green(`✅ تم إنشاء Team: ${teamName}`));
    }
    // ============================================
    // 👥 إضافة عضو
    // ============================================
    async addMember(member) {
        this.members.set(member.id, {
            ...member,
            joinedAt: Date.now()
        });
        await this.saveMembers();
        console.log(chalk.green(`✅ تمت إضافة ${member.name} للفريق`));
    }
    // ============================================
    // 💾 مشاركة حل
    // ============================================
    async shareSolution(errorId, solution, author, tags = []) {
        const solutionId = `sol_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
        const sharedSolution = {
            id: solutionId,
            errorId,
            solution,
            author,
            timestamp: Date.now(),
            votes: 0,
            tags
        };
        this.solutions.set(solutionId, sharedSolution);
        await this.saveSolutions();
        console.log(chalk.green(`✅ تمت مشاركة الحل مع الفريق`));
        return solutionId;
    }
    // ============================================
    // 🔍 البحث عن حل مشترك
    // ============================================
    async findSharedSolution(errorPattern) {
        for (const solution of this.solutions.values()) {
            if (solution.errorId.includes(errorPattern)) {
                return solution;
            }
        }
        return null;
    }
    // ============================================
    // 👍 التصويت على حل
    // ============================================
    async voteSolution(solutionId) {
        const solution = this.solutions.get(solutionId);
        if (solution) {
            solution.votes++;
            await this.saveSolutions();
        }
    }
    // ============================================
    // 📊 إحصائيات الفريق
    // ============================================
    getStats() {
        const members = this.members.size;
        const sharedSolutions = this.solutions.size;
        // حساب أكثر مساهم
        const contributions = new Map();
        for (const solution of this.solutions.values()) {
            contributions.set(solution.author, (contributions.get(solution.author) || 0) + 1);
        }
        let topContributor;
        let maxContributions = 0;
        for (const [author, count] of contributions.entries()) {
            if (count > maxContributions) {
                maxContributions = count;
                topContributor = author;
            }
        }
        // معدل النجاح
        const successfulSolutions = Array.from(this.solutions.values())
            .filter(s => s.votes > 0).length;
        const teamSuccessRate = sharedSolutions > 0
            ? Math.round((successfulSolutions / sharedSolutions) * 100)
            : 0;
        return {
            members,
            sharedSolutions,
            avgResponseTime: 0, // TODO: حساب من البيانات
            teamSuccessRate,
            topContributor
        };
    }
    // ============================================
    // 🎨 عرض إحصائيات
    // ============================================
    displayStats() {
        const stats = this.getStats();
        console.log(chalk.cyan('\n👥 إحصائيات الفريق:'));
        console.log(chalk.gray('━'.repeat(60)));
        console.log(chalk.blue(`📊 الأعضاء: ${stats.members}`));
        console.log(chalk.blue(`💡 الحلول المشتركة: ${stats.sharedSolutions}`));
        console.log(chalk.blue(`✅ معدل النجاح: ${stats.teamSuccessRate}%`));
        if (stats.topContributor) {
            console.log(chalk.green(`🏆 أكثر مساهمة: ${stats.topContributor}`));
        }
        console.log(chalk.gray('━'.repeat(60)) + '\n');
    }
    // ============================================
    // 💾 حفظ البيانات
    // ============================================
    async saveMembers() {
        await fs.writeJSON(join(this.teamDir, 'members.json'), Array.from(this.members.values()), { spaces: 2 });
    }
    async saveSolutions() {
        await fs.writeJSON(join(this.teamDir, 'solutions.json'), Array.from(this.solutions.values()), { spaces: 2 });
    }
    // ============================================
    // 📖 تحميل البيانات
    // ============================================
    async load() {
        try {
            // تحميل الأعضاء
            const membersPath = join(this.teamDir, 'members.json');
            if (await fs.pathExists(membersPath)) {
                const members = await fs.readJSON(membersPath);
                this.members = new Map(members.map(m => [m.id, m]));
            }
            // تحميل الحلول
            const solutionsPath = join(this.teamDir, 'solutions.json');
            if (await fs.pathExists(solutionsPath)) {
                const solutions = await fs.readJSON(solutionsPath);
                this.solutions = new Map(solutions.map(s => [s.id, s]));
            }
            console.log(chalk.gray('📚 تم تحميل بيانات الفريق'));
        }
        catch (error) {
            console.log(chalk.yellow('⚠️ تعذر تحميل بيانات الفريق'));
        }
    }
}
//# sourceMappingURL=team-collaboration.js.map