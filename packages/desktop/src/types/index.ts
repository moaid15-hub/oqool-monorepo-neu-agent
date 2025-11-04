// Global Types for Oqool Desktop IDE

export interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileNode[];
  expanded?: boolean;
}

export interface EditorFile {
  path: string;
  content: string;
  language: string;
  isDirty: boolean;
  isActive: boolean;
}

export interface Terminal {
  id: string;
  name: string;
  cwd?: string;
}

export interface GitStatus {
  branch: string;
  ahead: number;
  behind: number;
  staged: string[];
  modified: string[];
  untracked: string[];
  conflicted: string[];
}

export interface GitCommit {
  hash: string;
  author: string;
  email: string;
  date: Date;
  message: string;
  refs: string;
}

export type AIPersonality =
  | 'alex'
  | 'sarah'
  | 'mike'
  | 'guardian'
  | 'olivia'
  | 'tom'
  | 'emma'
  | 'max';

export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

export interface AIPersonalityInfo {
  id: AIPersonality;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface Settings {
  editor: {
    fontSize: number;
    fontFamily: string;
    theme: string;
    tabSize: number;
    wordWrap: boolean;
    minimap: boolean;
  };
  terminal: {
    fontSize: number;
    fontFamily: string;
    shell: string;
  };
  ai: {
    defaultPersonality: AIPersonality;
    autoSuggest: boolean;
  };
  git: {
    autoFetch: boolean;
    autoCommitMessage: boolean;
  };
}
