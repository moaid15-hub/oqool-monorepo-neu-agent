export interface GitStatus {
    isRepo: boolean;
    branch: string;
    hasChanges: boolean;
    staged: string[];
    unstaged: string[];
    untracked: string[];
}
export interface CommitInfo {
    hash: string;
    message: string;
    author: string;
    date: string;
}
export declare class GitHelper {
    private workingDirectory;
    constructor(workingDirectory: string);
    getStatus(): Promise<GitStatus>;
    private isGitRepo;
    add(files: string[] | string): Promise<boolean>;
    commit(message: string): Promise<boolean>;
    push(remote?: string, branch?: string): Promise<boolean>;
    createPR(title: string, body: string, baseBranch?: string): Promise<boolean>;
    getRecentCommits(count?: number): Promise<CommitInfo[]>;
    getDiff(commit1?: string, commit2?: string): Promise<string>;
    smartCommit(): Promise<boolean>;
    private generateCommitMessage;
    private execGit;
    private execCommand;
    private checkCommand;
    displayStatus(): Promise<void>;
}
//# sourceMappingURL=git-helper.d.ts.map