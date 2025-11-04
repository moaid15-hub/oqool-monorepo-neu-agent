export interface TeamMember {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'developer' | 'viewer';
    joinedAt: number;
}
export interface SharedSolution {
    id: string;
    errorId: string;
    solution: string;
    author: string;
    timestamp: number;
    votes: number;
    tags: string[];
}
export interface TeamStats {
    members: number;
    sharedSolutions: number;
    avgResponseTime: number;
    teamSuccessRate: number;
    topContributor?: string;
}
export declare class TeamCollaboration {
    private teamId;
    private workingDirectory;
    private teamDir;
    private members;
    private solutions;
    constructor(teamId: string, workingDirectory: string);
    create(teamName: string, creator: TeamMember): Promise<void>;
    addMember(member: TeamMember): Promise<void>;
    shareSolution(errorId: string, solution: string, author: string, tags?: string[]): Promise<string>;
    findSharedSolution(errorPattern: string): Promise<SharedSolution | null>;
    voteSolution(solutionId: string): Promise<void>;
    getStats(): TeamStats;
    displayStats(): void;
    private saveMembers;
    private saveSolutions;
    load(): Promise<void>;
}
//# sourceMappingURL=team-collaboration.d.ts.map