/**
 * حالة المهمة
 */
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'blocked' | 'cancelled';
/**
 * أولوية المهمة
 */
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';
/**
 * معلومات مهمة
 */
export interface Task {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    createdAt: number;
    updatedAt: number;
    startedAt?: number;
    completedAt?: number;
    estimatedHours?: number;
    actualHours?: number;
    tags: string[];
    assignee?: string;
    dependencies: string[];
    progress: number;
}
/**
 * معلومات Milestone
 */
export interface Milestone {
    id: string;
    name: string;
    description: string;
    dueDate: number;
    tasks: string[];
    completed: boolean;
    progress: number;
}
/**
 * إحصائيات المشروع
 */
export interface ProjectStats {
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    blockedTasks: number;
    completionRate: number;
    averageTaskTime: number;
    estimatedCompletion?: number;
    velocity: number;
}
/**
 * تقرير التقدم
 */
export interface ProgressReport {
    generatedAt: number;
    period: {
        from: number;
        to: number;
    };
    stats: ProjectStats;
    milestones: Milestone[];
    recentTasks: Task[];
    blockers: Task[];
    recommendations: string[];
}
/**
 * متتبع التقدم
 */
export declare class ProgressTracker {
    private workingDir;
    private dataPath;
    private tasks;
    private milestones;
    constructor(workingDir: string);
    /**
     * تهيئة المتتبع
     */
    initialize(): Promise<void>;
    /**
     * إنشاء مهمة جديدة
     */
    createTask(title: string, options?: {
        description?: string;
        priority?: TaskPriority;
        estimatedHours?: number;
        tags?: string[];
        assignee?: string;
        dependencies?: string[];
    }): Promise<Task>;
    /**
     * تحديث حالة المهمة
     */
    updateTaskStatus(taskId: string, status: TaskStatus): Promise<void>;
    /**
     * تحديث تقدم المهمة
     */
    updateTaskProgress(taskId: string, progress: number): Promise<void>;
    /**
     * حذف مهمة
     */
    deleteTask(taskId: string): Promise<void>;
    /**
     * الحصول على مهمة
     */
    getTask(taskId: string | undefined): Task | undefined;
    /**
     * الحصول على جميع المهام
     */
    getAllTasks(filter?: {
        status?: TaskStatus;
        priority?: TaskPriority;
        tag?: string;
        assignee?: string;
    }): Task[];
    /**
     * إنشاء milestone
     */
    createMilestone(name: string, options?: {
        description?: string;
        dueDate?: number;
        tasks?: string[];
    }): Promise<Milestone>;
    /**
     * تحديث milestone
     */
    updateMilestone(milestoneId: string): Promise<void>;
    /**
     * إضافة مهمة إلى milestone
     */
    addTaskToMilestone(milestoneId: string, taskId: string): Promise<void>;
    /**
     * حساب الإحصائيات
     */
    calculateStats(): ProjectStats;
    /**
     * توليد تقرير تقدم
     */
    generateReport(period?: {
        from: number;
        to: number;
    }): Promise<ProgressReport>;
    /**
     * توليد توصيات
     */
    private generateRecommendations;
    /**
     * تصدير التقرير
     */
    exportReport(format: 'json' | 'markdown' | 'html', outputPath?: string): Promise<string>;
    /**
     * توليد تقرير Markdown
     */
    private generateMarkdownReport;
    /**
     * توليد تقرير HTML
     */
    private generateHTMLReport;
    /**
     * عرض ملخص
     */
    showSummary(): Promise<void>;
    /**
     * توليد معرف فريد
     */
    private generateId;
    /**
     * حفظ البيانات
     */
    private saveData;
    /**
     * تحميل البيانات
     */
    private loadData;
}
/**
 * إنشاء متتبع تقدم
 */
export declare function createProgressTracker(workingDir: string): ProgressTracker;
//# sourceMappingURL=progress-tracker.d.ts.map