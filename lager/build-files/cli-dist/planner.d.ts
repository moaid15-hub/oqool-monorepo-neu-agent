export interface Task {
    id: string;
    description: string;
    status: 'pending' | 'in_progress' | 'completed' | 'failed';
    dependencies?: string[];
    result?: string;
    error?: string;
}
export interface Plan {
    goal: string;
    tasks: Task[];
    estimatedSteps: number;
}
export declare class IntelligentPlanner {
    private client;
    private currentPlan?;
    constructor(apiKey: string);
    createPlan(userRequest: string, projectContext: string): Promise<Plan>;
    private parsePlan;
    private displayPlan;
    updateTaskStatus(taskId: string, status: Task['status'], result?: string, error?: string): void;
    getNextTask(): Task | null;
    getPlanStatus(): {
        total: number;
        completed: number;
        failed: number;
        remaining: number;
        progress: number;
    } | null;
    replan(failedTask: Task, error: string): Promise<Plan | null>;
    getSummary(): string;
}
//# sourceMappingURL=planner.d.ts.map