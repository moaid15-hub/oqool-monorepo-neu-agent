export type NotificationType = 'info' | 'success' | 'warning' | 'error';
export type NotificationChannel = 'console' | 'slack' | 'discord' | 'email' | 'webhook';
export interface Notification {
    type: NotificationType;
    title: string;
    message: string;
    timestamp: string;
    metadata?: Record<string, any>;
}
export interface NotificationConfig {
    enabled: boolean;
    channels: NotificationChannel[];
    slack?: {
        webhookUrl: string;
        channel?: string;
        username?: string;
    };
    discord?: {
        webhookUrl: string;
        username?: string;
        avatarUrl?: string;
    };
    email?: {
        smtp: string;
        from: string;
        to: string[];
    };
    webhook?: {
        url: string;
        headers?: Record<string, string>;
    };
    filters?: {
        types?: NotificationType[];
        minLevel?: NotificationType;
    };
}
export declare class NotificationSystem {
    private config;
    private configPath;
    private history;
    constructor(workingDir?: string);
    /**
     * تحميل إعدادات الإشعارات
     */
    private loadConfig;
    /**
     * حفظ إعدادات الإشعارات
     */
    saveConfig(config: Partial<NotificationConfig>): Promise<void>;
    /**
     * إرسال إشعار
     */
    send(notification: Omit<Notification, 'timestamp'>): Promise<void>;
    /**
     * التحقق من ضرورة إرسال الإشعار
     */
    private shouldSend;
    /**
     * إرسال إلى Console
     */
    private sendToConsole;
    /**
     * إرسال إلى Slack
     */
    private sendToSlack;
    /**
     * إرسال إلى Discord
     */
    private sendToDiscord;
    /**
     * إرسال إلى Webhook مخصص
     */
    private sendToWebhook;
    /**
     * إرسال إلى Email (TODO: يحتاج تطبيق SMTP)
     */
    private sendToEmail;
    /**
     * الحصول على الأيقونة المناسبة
     */
    private getIcon;
    /**
     * الحصول على اللون المناسب للـ Console
     */
    private getColor;
    /**
     * الحصول على اللون المناسب لـ Slack
     */
    private getSlackColor;
    /**
     * الحصول على اللون المناسب لـ Discord (decimal)
     */
    private getDiscordColor;
    /**
     * الحصول على سجل الإشعارات
     */
    getHistory(limit?: number): Notification[];
    /**
     * مسح سجل الإشعارات
     */
    clearHistory(): void;
    /**
     * إشعارات جاهزة للأحداث الشائعة
     */
    notifySnapshotCreated(snapshotId: string, fileCount: number): Promise<void>;
    notifyBackupSuccess(backupName: string, size: string): Promise<void>;
    notifyBackupNeeded(daysSinceLastBackup: number): Promise<void>;
    notifyTooManySnapshots(count: number): Promise<void>;
    notifyError(operation: string, error: string): Promise<void>;
    notifyProjectGrowth(growthPercentage: number, currentSize: string): Promise<void>;
    notifyFrequentFileChange(file: string, changeCount: number): Promise<void>;
}
export declare function createNotificationSystem(workingDir?: string): NotificationSystem;
//# sourceMappingURL=notifications.d.ts.map