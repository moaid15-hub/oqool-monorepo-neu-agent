import React, { useState, useEffect } from 'react';
import { gitClient, GitStatus as GitStatusType } from '../../../features/git/git-client';
import './GitPanel.css';

export const GitPanel: React.FC = () => {
  const [status, setStatus] = useState<GitStatusType | null>(null);
  const [commitMessage, setCommitMessage] = useState('');
  const [workspacePath] = useState('/path/to/workspace'); // TODO: Get from context

  useEffect(() => {
    loadGitStatus();
  }, []);

  const loadGitStatus = async () => {
    try {
      const gitStatus = await gitClient.status(workspacePath);
      setStatus(gitStatus);
    } catch (error) {
      console.error('Error loading git status:', error);
    }
  };

  const handleCommit = async () => {
    if (!commitMessage.trim()) {return;}

    try {
      await gitClient.commit(workspacePath, commitMessage);
      setCommitMessage('');
      loadGitStatus();
    } catch (error) {
      console.error('Error committing:', error);
    }
  };

  const handleStage = async (file: string) => {
    try {
      await gitClient.stage(workspacePath, [file]);
      loadGitStatus();
    } catch (error) {
      console.error('Error staging file:', error);
    }
  };

  const handleUnstage = async (file: string) => {
    try {
      await gitClient.unstage(workspacePath, [file]);
      loadGitStatus();
    } catch (error) {
      console.error('Error unstaging file:', error);
    }
  };

  if (!status) {
    return (
      <div className="git-panel">
        <div className="git-loading">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div className="git-panel">
      <div className="git-header">
        <h3>🔀 Git</h3>
        <div className="git-branch">
          <span className="branch-icon">🌿</span>
          <span>{status.branch}</span>
        </div>
      </div>

      <div className="git-commit-section">
        <textarea
          className="commit-message"
          placeholder="رسالة Commit..."
          value={commitMessage}
          onChange={(e) => setCommitMessage(e.target.value)}
          rows={3}
        />
        <button className="commit-button" onClick={handleCommit} disabled={!commitMessage.trim()}>
          ✓ Commit
        </button>
      </div>

      <div className="git-changes">
        {status.staged.length > 0 && (
          <div className="changes-section">
            <div className="section-header">Staged ({status.staged.length})</div>
            {status.staged.map((file) => (
              <div key={file} className="change-item staged">
                <span className="file-icon">📄</span>
                <span className="file-name">{file}</span>
                <button
                  className="action-button"
                  onClick={() => handleUnstage(file)}
                  title="Unstage"
                >
                  −
                </button>
              </div>
            ))}
          </div>
        )}

        {status.modified.length > 0 && (
          <div className="changes-section">
            <div className="section-header">Modified ({status.modified.length})</div>
            {status.modified.map((file) => (
              <div key={file} className="change-item modified">
                <span className="file-icon">📝</span>
                <span className="file-name">{file}</span>
                <button className="action-button" onClick={() => handleStage(file)} title="Stage">
                  +
                </button>
              </div>
            ))}
          </div>
        )}

        {status.untracked.length > 0 && (
          <div className="changes-section">
            <div className="section-header">Untracked ({status.untracked.length})</div>
            {status.untracked.map((file) => (
              <div key={file} className="change-item untracked">
                <span className="file-icon">❓</span>
                <span className="file-name">{file}</span>
                <button className="action-button" onClick={() => handleStage(file)} title="Stage">
                  +
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
