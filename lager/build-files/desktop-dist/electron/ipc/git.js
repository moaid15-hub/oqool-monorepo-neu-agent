"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gitHandlers = gitHandlers;
const electron_1 = require("electron");
const simple_git_1 = __importDefault(require("simple-git"));
const logger_1 = require("../services/logger");
const gitInstances = new Map();
function getGitInstance(workspacePath) {
    if (!gitInstances.has(workspacePath)) {
        gitInstances.set(workspacePath, (0, simple_git_1.default)(workspacePath));
    }
    return gitInstances.get(workspacePath);
}
function gitHandlers() {
    electron_1.ipcMain.handle('git:status', async (_event, workspacePath) => {
        try {
            logger_1.logger.debug('Getting git status for:', workspacePath);
            const git = getGitInstance(workspacePath);
            const status = await git.status();
            return {
                success: true,
                status: {
                    branch: status.current || 'main',
                    ahead: status.ahead,
                    behind: status.behind,
                    staged: status.staged,
                    modified: status.modified,
                    untracked: status.not_added,
                    conflicted: status.conflicted,
                },
            };
        }
        catch (error) {
            logger_1.logger.error('Error getting git status:', error);
            return { success: false, error: error.message };
        }
    });
    electron_1.ipcMain.handle('git:commit', async (_event, workspacePath, message, files) => {
        try {
            logger_1.logger.debug('Committing changes:', workspacePath);
            const git = getGitInstance(workspacePath);
            if (files && files.length > 0) {
                await git.add(files);
            }
            await git.commit(message);
            return { success: true };
        }
        catch (error) {
            logger_1.logger.error('Error committing:', error);
            return { success: false, error: error.message };
        }
    });
    electron_1.ipcMain.handle('git:push', async (_event, workspacePath, remote, branch) => {
        try {
            logger_1.logger.debug('Pushing changes:', workspacePath);
            const git = getGitInstance(workspacePath);
            if (remote && branch) {
                await git.push(remote, branch);
            }
            else {
                await git.push();
            }
            return { success: true };
        }
        catch (error) {
            logger_1.logger.error('Error pushing:', error);
            return { success: false, error: error.message };
        }
    });
    electron_1.ipcMain.handle('git:pull', async (_event, workspacePath, remote, branch) => {
        try {
            logger_1.logger.debug('Pulling changes:', workspacePath);
            const git = getGitInstance(workspacePath);
            if (remote && branch) {
                await git.pull(remote, branch);
            }
            else {
                await git.pull();
            }
            return { success: true };
        }
        catch (error) {
            logger_1.logger.error('Error pulling:', error);
            return { success: false, error: error.message };
        }
    });
    electron_1.ipcMain.handle('git:diff', async (_event, workspacePath, filePath, staged) => {
        try {
            logger_1.logger.debug('Getting diff:', workspacePath);
            const git = getGitInstance(workspacePath);
            let diff;
            if (staged) {
                diff = await git.diff(['--cached', filePath || '']);
            }
            else {
                diff = await git.diff([filePath || '']);
            }
            return { success: true, diff };
        }
        catch (error) {
            logger_1.logger.error('Error getting diff:', error);
            return { success: false, error: error.message };
        }
    });
    electron_1.ipcMain.handle('git:branches', async (_event, workspacePath) => {
        try {
            logger_1.logger.debug('Getting branches:', workspacePath);
            const git = getGitInstance(workspacePath);
            const branchSummary = await git.branchLocal();
            const branches = branchSummary.all.map((name) => ({
                name,
                current: name === branchSummary.current,
            }));
            return { success: true, branches };
        }
        catch (error) {
            logger_1.logger.error('Error getting branches:', error);
            return { success: false, error: error.message };
        }
    });
    electron_1.ipcMain.handle('git:create-branch', async (_event, workspacePath, branchName, checkout) => {
        try {
            logger_1.logger.debug('Creating branch:', branchName);
            const git = getGitInstance(workspacePath);
            if (checkout) {
                await git.checkoutLocalBranch(branchName);
            }
            else {
                await git.branch([branchName]);
            }
            return { success: true };
        }
        catch (error) {
            logger_1.logger.error('Error creating branch:', error);
            return { success: false, error: error.message };
        }
    });
    electron_1.ipcMain.handle('git:checkout', async (_event, workspacePath, branchName) => {
        try {
            logger_1.logger.debug('Checking out branch:', branchName);
            const git = getGitInstance(workspacePath);
            await git.checkout(branchName);
            return { success: true };
        }
        catch (error) {
            logger_1.logger.error('Error checking out branch:', error);
            return { success: false, error: error.message };
        }
    });
    electron_1.ipcMain.handle('git:delete-branch', async (_event, workspacePath, branchName, force) => {
        try {
            logger_1.logger.debug('Deleting branch:', branchName);
            const git = getGitInstance(workspacePath);
            await git.deleteLocalBranch(branchName, force);
            return { success: true };
        }
        catch (error) {
            logger_1.logger.error('Error deleting branch:', error);
            return { success: false, error: error.message };
        }
    });
    electron_1.ipcMain.handle('git:log', async (_event, workspacePath, limit) => {
        try {
            logger_1.logger.debug('Getting log:', workspacePath);
            const git = getGitInstance(workspacePath);
            const log = await git.log({ maxCount: limit || 50 });
            const commits = log.all.map((commit) => ({
                hash: commit.hash,
                author: commit.author_name,
                email: commit.author_email,
                date: new Date(commit.date),
                message: commit.message,
                refs: commit.refs,
            }));
            return { success: true, commits };
        }
        catch (error) {
            logger_1.logger.error('Error getting log:', error);
            return { success: false, error: error.message };
        }
    });
    electron_1.ipcMain.handle('git:stage', async (_event, workspacePath, files) => {
        try {
            logger_1.logger.debug('Staging files:', files);
            const git = getGitInstance(workspacePath);
            await git.add(files);
            return { success: true };
        }
        catch (error) {
            logger_1.logger.error('Error staging files:', error);
            return { success: false, error: error.message };
        }
    });
    electron_1.ipcMain.handle('git:unstage', async (_event, workspacePath, files) => {
        try {
            logger_1.logger.debug('Unstaging files:', files);
            const git = getGitInstance(workspacePath);
            await git.reset(['HEAD', ...files]);
            return { success: true };
        }
        catch (error) {
            logger_1.logger.error('Error unstaging files:', error);
            return { success: false, error: error.message };
        }
    });
    electron_1.ipcMain.handle('git:discard', async (_event, workspacePath, files) => {
        try {
            logger_1.logger.debug('Discarding changes:', files);
            const git = getGitInstance(workspacePath);
            await git.checkout(['--', ...files]);
            return { success: true };
        }
        catch (error) {
            logger_1.logger.error('Error discarding changes:', error);
            return { success: false, error: error.message };
        }
    });
}
