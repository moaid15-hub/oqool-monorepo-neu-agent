export interface CacheEntry<T = any> {
    key: string;
    value: T;
    timestamp: number;
    ttl: number;
    size: number;
}
export interface CacheOptions {
    ttl?: number;
    maxSize?: number;
    enableDisk?: boolean;
}
export interface CacheStats {
    hits: number;
    misses: number;
    size: number;
    itemsCount: number;
    hitRate: number;
}
export declare class CacheManager {
    private memoryCache;
    private diskCachePath;
    private stats;
    private options;
    private readonly DEFAULT_TTL;
    private readonly DEFAULT_MAX_SIZE;
    private readonly CACHE_VERSION;
    constructor(options?: CacheOptions);
    /**
     * تهيئة نظام الـ cache
     */
    private init;
    /**
     * توليد مفتاح hash
     */
    private generateKey;
    /**
     * حساب حجم البيانات
     */
    private calculateSize;
    /**
     * التحقق من صلاحية الـ entry
     */
    private isValid;
    /**
     * الحصول من الـ memory cache
     */
    private getFromMemory;
    /**
     * الحصول من الـ disk cache
     */
    private getFromDisk;
    /**
     * الحفظ في الـ memory cache
     */
    private setInMemory;
    /**
     * الحفظ في الـ disk cache
     */
    private setOnDisk;
    /**
     * الحصول من الـ cache
     */
    get<T>(key: string): Promise<T | null>;
    /**
     * الحفظ في الـ cache
     */
    set<T>(key: string, value: T, ttl?: number): Promise<void>;
    /**
     * حذف من الـ cache
     */
    delete(key: string): Promise<void>;
    /**
     * مسح الـ cache بالكامل
     */
    clear(): Promise<void>;
    /**
     * تنظيف الـ cache من العناصر المنتهية
     */
    private cleanup;
    /**
     * فرض الحد الأقصى للحجم
     */
    private enforceMaxSize;
    /**
     * تحديث نسبة الـ hit rate
     */
    private updateHitRate;
    /**
     * الحصول على إحصائيات الـ cache
     */
    getStats(): CacheStats;
    /**
     * cache AI response
     */
    cacheAIResponse(prompt: string, response: string): Promise<void>;
    /**
     * الحصول على AI response من cache
     */
    getAIResponse(prompt: string): Promise<string | null>;
    /**
     * cache file analysis
     */
    cacheAnalysis(filePath: string, analysis: any): Promise<void>;
    /**
     * الحصول على file analysis من cache
     */
    getAnalysis(filePath: string): Promise<any | null>;
    /**
     * cache git info
     */
    cacheGitInfo(repo: string, info: any): Promise<void>;
    /**
     * الحصول على git info من cache
     */
    getGitInfo(repo: string): Promise<any | null>;
}
export declare function getCacheManager(options?: CacheOptions): CacheManager;
export declare function createCacheManager(options?: CacheOptions): CacheManager;
//# sourceMappingURL=cache-manager.d.ts.map