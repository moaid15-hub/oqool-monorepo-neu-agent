import { OqoolAPIClient } from './api-client.js';
export interface TeamMember {
    id: string;
    name: string;
    email: string;
    role: 'owner' | 'admin' | 'member' | 'viewer';
    avatar?: string;
    lastActive: string;
    permissions: {
        canGenerate: boolean;
        canModify: boolean;
        canReview: boolean;
        canManage: boolean;
    };
}
export interface ProjectSession {
    id: string;
    name: string;
    description?: string;
    createdBy: string;
    createdAt: string;
    members: string[];
    files: string[];
    status: 'active' | 'paused' | 'completed';
    lastActivity: string;
    sharedCode: Map<string, string>;
}
export interface CodeReview {
    id: string;
    title: string;
    description: string;
    files: string[];
    reviewer: string;
    reviewee: string;
    status: 'pending' | 'in-progress' | 'approved' | 'rejected' | 'changes-requested';
    comments: ReviewComment[];
    createdAt: string;
    completedAt?: string;
}
export interface ReviewComment {
    id: string;
    file: string;
    line: number;
    type: 'suggestion' | 'issue' | 'praise';
    content: string;
    author: string;
    timestamp: string;
    resolved: boolean;
}
export interface TeamTemplate {
    id: string;
    name: string;
    description: string;
    category: string;
    files: Array<{
        path: string;
        content: string;
        variables: string[];
    }>;
    createdBy: string;
    tags: string[];
    usageCount: number;
    rating: number;
}
export declare class CollaborativeFeatures {
    private apiClient;
    private fileManager;
    private workingDir;
    constructor(apiClient: OqoolAPIClient, workingDir?: string);
    /**
     * إنشاء جلسة تعاون
     */
    createSession(name: string, description: string, members: string[]): Promise<ProjectSession>;
    /**
     * دعوة عضو للجلسة
     */
    inviteMember(sessionId: string, email: string, role?: TeamMember['role']): Promise<void>;
    /**
     * مشاركة كود في الجلسة
     */
    shareCode(sessionId: string, files: string[]): Promise<void>;
    /**
     * إنشاء مراجعة كود
     */
    createCodeReview(title: string, description: string, files: string[], reviewer: string): Promise<CodeReview>;
    /**
     * إضافة تعليق للمراجعة
     */
    addReviewComment(reviewId: string, file: string, line: number, type: ReviewComment['type'], content: string): Promise<void>;
    /**
     * إنشاء قالب فريق
     */
    createTeamTemplate(name: string, description: string, category: string, files: string[], tags?: string[]): Promise<TeamTemplate>;
    /**
     * البحث في قوالب الفريق
     */
    searchTeamTemplates(query: string): Promise<TeamTemplate[]>;
    /**
     * إنشاء تقرير تعاون
     */
    generateCollaborationReport(): Promise<void>;
    /**
     * الحصول على جلسة
     */
    private getSession;
    /**
     * حفظ جلسة
     */
    private saveSession;
    /**
     * الحصول على مراجعة
     */
    private getReview;
    /**
     * حفظ مراجعة
     */
    private saveReview;
    /**
     * الحصول على جميع الجلسات
     */
    private getAllSessions;
    /**
     * الحصول على جميع المراجعات
     */
    private getAllReviews;
    /**
     * الحصول على جميع القوالب
     */
    private getAllTemplates;
    /**
     * استخراج المتغيرات من المحتوى
     */
    private extractVariables;
    /**
     * توليد معرف فريد
     */
    private generateId;
    /**
     * الحصول على اسم الدور
     */
    private getRoleName;
    /**
     * الحصول على اسم الحالة
     */
    private getStatusName;
}
export declare function createCollaborativeFeatures(apiClient: OqoolAPIClient, workingDir?: string): CollaborativeFeatures;
//# sourceMappingURL=collaborative-features.d.ts.map