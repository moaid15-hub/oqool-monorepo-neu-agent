export interface OqoolConfig {
    apiKey: string;
    apiUrl: string;
    userId?: string;
    email?: string;
    plan?: string;
    lastSync?: string;
}
export declare function ensureConfigDir(): Promise<void>;
export declare function saveConfig(config: OqoolConfig): Promise<void>;
export declare function loadConfig(): Promise<OqoolConfig | null>;
export declare function hasApiKey(): Promise<boolean>;
export declare function getApiKey(): Promise<string | null>;
export declare function logout(): Promise<void>;
export declare function validateApiKey(apiKey: string): boolean;
export declare function displayAccountInfo(): Promise<void>;
//# sourceMappingURL=auth.d.ts.map