import { OqoolAPIClient } from './api-client.js';
export interface CollaborationSession {
    id: string;
    name: string;
    description: string;
    host: CollaborationUser;
    members: CollaborationUser[];
    status: 'active' | 'paused' | 'ended';
    files: SharedFile[];
    chat: ChatMessage[];
    voiceChannel?: VoiceChannel;
    screenShare?: ScreenShare;
    createdAt: string;
    settings: SessionSettings;
}
export interface CollaborationUser {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: 'host' | 'editor' | 'viewer';
    status: 'online' | 'away' | 'offline';
    permissions: UserPermissions;
    cursor?: CursorPosition;
    selection?: TextSelection;
}
export interface UserPermissions {
    canEdit: boolean;
    canComment: boolean;
    canInvite: boolean;
    canManage: boolean;
    canScreenShare: boolean;
    canVoice: boolean;
}
export interface SharedFile {
    path: string;
    content: string;
    language: string;
    lastModified: string;
    lastModifiedBy: string;
    collaborators: string[];
    conflicts: FileConflict[];
    lock?: FileLock;
}
export interface FileConflict {
    id: string;
    line: number;
    content: string;
    userId: string;
    timestamp: string;
    resolved: boolean;
}
export interface FileLock {
    userId: string;
    userName: string;
    timestamp: string;
    expires: string;
}
export interface ChatMessage {
    id: string;
    userId: string;
    userName: string;
    message: string;
    timestamp: string;
    type: 'text' | 'file' | 'code' | 'system';
    file?: string;
    line?: number;
}
export interface VoiceChannel {
    id: string;
    participants: string[];
    muted: string[];
    deafened: string[];
    recording: boolean;
}
export interface ScreenShare {
    userId: string;
    userName: string;
    active: boolean;
    viewers: string[];
}
export interface CursorPosition {
    file: string;
    line: number;
    column: number;
    timestamp: string;
}
export interface TextSelection {
    file: string;
    start: {
        line: number;
        column: number;
    };
    end: {
        line: number;
        column: number;
    };
    timestamp: string;
}
export interface SessionSettings {
    maxMembers: number;
    allowGuests: boolean;
    requireApproval: boolean;
    autoSave: boolean;
    conflictResolution: 'manual' | 'auto' | 'merge';
    notifications: boolean;
    recording: boolean;
}
export interface CollaborationEvent {
    type: 'file_edit' | 'cursor_move' | 'user_join' | 'user_leave' | 'chat_message' | 'voice_join' | 'screen_share';
    userId: string;
    data: any;
    timestamp: string;
}
export declare class RealTimeCollaboration {
    private apiClient;
    private workingDir;
    private sessionsPath;
    private activeSession?;
    private ws?;
    private eventListeners;
    constructor(apiClient: OqoolAPIClient, workingDir?: string);
    private initializeSystem;
    createSession(name: string, description: string, members?: string[]): Promise<void>;
    joinSession(sessionId: string): Promise<void>;
    inviteMembers(emails: string[]): Promise<void>;
    shareFile(filePath: string): Promise<void>;
    shareMultipleFiles(pattern: string): Promise<void>;
    sendChatMessage(message: string, type?: 'text' | 'code' | 'file', file?: string, line?: number): Promise<void>;
    startScreenShare(): Promise<void>;
    stopScreenShare(): Promise<void>;
    createVoiceChannel(): Promise<void>;
    joinVoiceChannel(): Promise<void>;
    showSessionStatus(): Promise<void>;
    private startFileWatching;
    private watchFile;
    private connectWebSocket;
    private handleFileEdit;
    private handleCursorMove;
    private handleUserJoin;
    private handleChatMessage;
    private addEventListener;
    private broadcastEvent;
    private sendInvitation;
    private detectLanguage;
    private getSessionDuration;
    endSession(): Promise<void>;
    private saveSession;
    private loadSession;
}
export declare function createRealTimeCollaboration(apiClient: OqoolAPIClient, workingDir?: string): RealTimeCollaboration;
//# sourceMappingURL=realtime-collaboration.d.ts.map