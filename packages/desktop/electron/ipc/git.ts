import { ipcMain, IpcMainInvokeEvent } from 'electron';
import simpleGit, { SimpleGit } from 'simple-git';
import { logger } from '../services/logger';

const gitInstances = new Map<string, SimpleGit>();

function getGitInstance(workspacePath: string): SimpleGit {
  if (!gitInstances.has(workspacePath)) {
    gitInstances.set(workspacePath, simpleGit(workspacePath));
  }
  return gitInstances.get(workspacePath)!;
}

export function gitHandlers() {
  ipcMain.handle('git:status', async (_event: IpcMainInvokeEvent, workspacePath: string) => {
    try {
      logger.debug('Getting git status for:', workspacePath);
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
    } catch (error: any) {
      logger.error('Error getting git status:', error);
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle(
    'git:commit',
    async (
      _event: IpcMainInvokeEvent,
      workspacePath: string,
      message: string,
      files?: string[]
    ) => {
      try {
        logger.debug('Committing changes:', workspacePath);
        const git = getGitInstance(workspacePath);

        if (files && files.length > 0) {
          await git.add(files);
        }

        await git.commit(message);
        return { success: true };
      } catch (error: any) {
        logger.error('Error committing:', error);
        return { success: false, error: error.message };
      }
    }
  );

  ipcMain.handle(
    'git:push',
    async (_event: IpcMainInvokeEvent, workspacePath: string, remote?: string, branch?: string) => {
      try {
        logger.debug('Pushing changes:', workspacePath);
        const git = getGitInstance(workspacePath);

        if (remote && branch) {
          await git.push(remote, branch);
        } else {
          await git.push();
        }

        return { success: true };
      } catch (error: any) {
        logger.error('Error pushing:', error);
        return { success: false, error: error.message };
      }
    }
  );

  ipcMain.handle(
    'git:pull',
    async (_event: IpcMainInvokeEvent, workspacePath: string, remote?: string, branch?: string) => {
      try {
        logger.debug('Pulling changes:', workspacePath);
        const git = getGitInstance(workspacePath);

        if (remote && branch) {
          await git.pull(remote, branch);
        } else {
          await git.pull();
        }

        return { success: true };
      } catch (error: any) {
        logger.error('Error pulling:', error);
        return { success: false, error: error.message };
      }
    }
  );

  ipcMain.handle(
    'git:diff',
    async (
      _event: IpcMainInvokeEvent,
      workspacePath: string,
      filePath?: string,
      staged?: boolean
    ) => {
      try {
        logger.debug('Getting diff:', workspacePath);
        const git = getGitInstance(workspacePath);

        let diff: string;
        if (staged) {
          diff = await git.diff(['--cached', filePath || '']);
        } else {
          diff = await git.diff([filePath || '']);
        }

        return { success: true, diff };
      } catch (error: any) {
        logger.error('Error getting diff:', error);
        return { success: false, error: error.message };
      }
    }
  );

  ipcMain.handle('git:branches', async (_event: IpcMainInvokeEvent, workspacePath: string) => {
    try {
      logger.debug('Getting branches:', workspacePath);
      const git = getGitInstance(workspacePath);
      const branchSummary = await git.branchLocal();

      const branches = branchSummary.all.map((name) => ({
        name,
        current: name === branchSummary.current,
      }));

      return { success: true, branches };
    } catch (error: any) {
      logger.error('Error getting branches:', error);
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle(
    'git:create-branch',
    async (
      _event: IpcMainInvokeEvent,
      workspacePath: string,
      branchName: string,
      checkout?: boolean
    ) => {
      try {
        logger.debug('Creating branch:', branchName);
        const git = getGitInstance(workspacePath);

        if (checkout) {
          await git.checkoutLocalBranch(branchName);
        } else {
          await git.branch([branchName]);
        }

        return { success: true };
      } catch (error: any) {
        logger.error('Error creating branch:', error);
        return { success: false, error: error.message };
      }
    }
  );

  ipcMain.handle(
    'git:checkout',
    async (_event: IpcMainInvokeEvent, workspacePath: string, branchName: string) => {
      try {
        logger.debug('Checking out branch:', branchName);
        const git = getGitInstance(workspacePath);
        await git.checkout(branchName);
        return { success: true };
      } catch (error: any) {
        logger.error('Error checking out branch:', error);
        return { success: false, error: error.message };
      }
    }
  );

  ipcMain.handle(
    'git:delete-branch',
    async (
      _event: IpcMainInvokeEvent,
      workspacePath: string,
      branchName: string,
      force?: boolean
    ) => {
      try {
        logger.debug('Deleting branch:', branchName);
        const git = getGitInstance(workspacePath);
        await git.deleteLocalBranch(branchName, force);
        return { success: true };
      } catch (error: any) {
        logger.error('Error deleting branch:', error);
        return { success: false, error: error.message };
      }
    }
  );

  ipcMain.handle(
    'git:log',
    async (_event: IpcMainInvokeEvent, workspacePath: string, limit?: number) => {
      try {
        logger.debug('Getting log:', workspacePath);
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
      } catch (error: any) {
        logger.error('Error getting log:', error);
        return { success: false, error: error.message };
      }
    }
  );

  ipcMain.handle(
    'git:stage',
    async (_event: IpcMainInvokeEvent, workspacePath: string, files: string[]) => {
      try {
        logger.debug('Staging files:', files);
        const git = getGitInstance(workspacePath);
        await git.add(files);
        return { success: true };
      } catch (error: any) {
        logger.error('Error staging files:', error);
        return { success: false, error: error.message };
      }
    }
  );

  ipcMain.handle(
    'git:unstage',
    async (_event: IpcMainInvokeEvent, workspacePath: string, files: string[]) => {
      try {
        logger.debug('Unstaging files:', files);
        const git = getGitInstance(workspacePath);
        await git.reset(['HEAD', ...files]);
        return { success: true };
      } catch (error: any) {
        logger.error('Error unstaging files:', error);
        return { success: false, error: error.message };
      }
    }
  );

  ipcMain.handle(
    'git:discard',
    async (_event: IpcMainInvokeEvent, workspacePath: string, files: string[]) => {
      try {
        logger.debug('Discarding changes:', files);
        const git = getGitInstance(workspacePath);
        await git.checkout(['--', ...files]);
        return { success: true };
      } catch (error: any) {
        logger.error('Error discarding changes:', error);
        return { success: false, error: error.message };
      }
    }
  );
}
