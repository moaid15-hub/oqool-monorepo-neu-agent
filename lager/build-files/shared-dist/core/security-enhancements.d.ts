import { OqoolAPIClient } from './api-client.js';
export interface SecurityConfig {
    enabled: boolean;
    scanOnGenerate: boolean;
    scanOnExecute: boolean;
    blockMalicious: boolean;
    allowedCommands: string[];
    blockedPatterns: string[];
    maxFileSize: number;
    allowedExtensions: string[];
    encryptionKey?: string;
}
export interface SecurityScanResult {
    safe: boolean;
    issues: SecurityIssue[];
    score: number;
    recommendations: string[];
}
export interface SecurityIssue {
    type: 'malicious' | 'vulnerable' | 'suspicious' | 'policy';
    severity: 'critical' | 'high' | 'medium' | 'low';
    file: string;
    line?: number;
    description: string;
    cwe?: string;
    fix?: string;
}
export interface CodeSignature {
    hash: string;
    algorithm: string;
    timestamp: string;
    author: string;
    verified: boolean;
}
export declare class SecurityEnhancements {
    private config;
    private apiClient;
    private workingDir;
    constructor(apiClient: OqoolAPIClient, workingDir?: string);
    /**
     * تحميل التكوين الافتراضي
     */
    private loadDefaultConfig;
    /**
     * فحص الأمان للكود المُولد
     */
    scanGeneratedCode(code: string, fileName: string): Promise<SecurityScanResult>;
    /**
     * فحص الأمان قبل التنفيذ
     */
    scanBeforeExecution(filePath: string): Promise<SecurityScanResult>;
    /**
     * توقيع الكود رقمياً
     */
    signCode(filePath: string, author: string): Promise<CodeSignature>;
    /**
     * التحقق من توقيع الكود
     */
    verifyCodeSignature(filePath: string): Promise<boolean>;
    /**
     * تشفير الملفات الحساسة
     */
    encryptSensitiveFile(filePath: string, key?: string): Promise<string>;
    /**
     * فك تشفير الملفات
     */
    decryptSensitiveFile(encryptedPath: string, key?: string): Promise<string>;
    /**
     * فحص التبعيات بحثاً عن ثغرات أمنية
     */
    scanDependencies(): Promise<{
        safe: boolean;
        vulnerabilities: Array<{
            package: string;
            version: string;
            severity: string;
            description: string;
            fix: string;
        }>;
    }>;
    /**
     * إنشاء تقرير أمان شامل
     */
    generateSecurityReport(): Promise<void>;
    /**
     * فحص أوامر النظام
     */
    private containsSystemCommands;
    /**
     * فحص المنافذ المفتوحة
     */
    private containsOpenPorts;
    /**
     * فحص الوصول لمتغيرات البيئة
     */
    private containsEnvAccess;
    /**
     * فحص التشفير غير الآمن
     */
    private containsInsecureCrypto;
    /**
     * فحص التحقق من المدخلات
     */
    private hasInputValidation;
    /**
     * فحص الملفات القابلة للتنفيذ
     */
    private isExecutableFile;
    /**
     * فحص إضافي للملفات القابلة للتنفيذ
     */
    private scanExecutableFile;
    /**
     * توليد التوصيات
     */
    private generateRecommendations;
    /**
     * توليد مفتاح تشفير
     */
    private generateEncryptionKey;
    /**
     * تحديث التكوين
     */
    updateConfig(newConfig: Partial<SecurityConfig>): Promise<void>;
}
export declare function createSecurityEnhancements(apiClient: OqoolAPIClient, workingDir?: string): SecurityEnhancements;
//# sourceMappingURL=security-enhancements.d.ts.map