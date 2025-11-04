export interface TaskResult {
    design: string;
    code: string;
    tests: string;
    review: string;
    finalCode: string;
}
export interface AgentTeamConfig {
    apiKey: string;
    model?: string;
    verbose?: boolean;
}
export declare class AgentTeam {
    private config;
    private agents;
    constructor(config: AgentTeamConfig);
    collaborate(task: string): Promise<TaskResult>;
    showSummary(result: TaskResult): Promise<void>;
    saveResult(result: TaskResult, outputPath: string): Promise<void>;
}
export declare function createAgentTeam(config: AgentTeamConfig): AgentTeam;
//# sourceMappingURL=agent-team.d.ts.map