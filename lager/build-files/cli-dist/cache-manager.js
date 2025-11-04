// cache-manager.ts
// ============================================
// ⚡ نظام الـ Cache المتقدم
// ============================================
import fs from 'fs-extra';
import path from 'path';
import crypto from 'crypto';
import os from 'os';
// ============================================
// ⚡ مدير الـ Cache
// ============================================
export class CacheManager {
    constructor(options = {}) {
        this.DEFAULT_TTL = 3600; // 1 ساعة
        this.DEFAULT_MAX_SIZE = 100; // 100 MB
        this.CACHE_VERSION = '1.0.0';
        this.memoryCache = new Map();
        this.diskCachePath = path.join(os.tmpdir(), 'oqool-code-cache');
        this.options = {
            ttl: options.ttl || this.DEFAULT_TTL,
            maxSize: options.maxSize || this.DEFAULT_MAX_SIZE,
            enableDisk: options.enableDisk ?? true
        };
        this.stats = {
            hits: 0,
            misses: 0,
            size: 0,
            itemsCount: 0,
            hitRate: 0
        };
        this.init();
    }
    /**
     * تهيئة نظام الـ cache
     */
    async init() {
        // إنشاء مجلد cache على الـ disk
        if (this.options.enableDisk) {
            await fs.ensureDir(this.diskCachePath);
        }
        // تنظيف دوري
        setInterval(() => this.cleanup(), 60000); // كل دقيقة
    }
    /**
     * توليد مفتاح hash
     */
    generateKey(input) {
        return crypto.createHash('sha256').update(input).digest('hex');
    }
    /**
     * حساب حجم البيانات
     */
    calculateSize(value) {
        return Buffer.byteLength(JSON.stringify(value), 'utf8');
    }
    /**
     * التحقق من صلاحية الـ entry
     */
    isValid(entry) {
        const now = Date.now();
        const age = (now - entry.timestamp) / 1000; // بالثواني
        return age < entry.ttl;
    }
    /**
     * الحصول من الـ memory cache
     */
    getFromMemory(key) {
        const entry = this.memoryCache.get(key);
        if (!entry) {
            return null;
        }
        if (!this.isValid(entry)) {
            this.memoryCache.delete(key);
            return null;
        }
        this.stats.hits++;
        return entry.value;
    }
    /**
     * الحصول من الـ disk cache
     */
    async getFromDisk(key) {
        if (!this.options.enableDisk) {
            return null;
        }
        try {
            const filePath = path.join(this.diskCachePath, `${key}.json`);
            if (!(await fs.pathExists(filePath))) {
                return null;
            }
            const data = await fs.readJSON(filePath);
            const entry = data;
            if (!this.isValid(entry)) {
                await fs.remove(filePath);
                return null;
            }
            // نقل للـ memory cache للوصول السريع
            this.memoryCache.set(key, entry);
            this.stats.hits++;
            return entry.value;
        }
        catch (error) {
            return null;
        }
    }
    /**
     * الحفظ في الـ memory cache
     */
    setInMemory(key, value, ttl) {
        const entry = {
            key,
            value,
            timestamp: Date.now(),
            ttl,
            size: this.calculateSize(value)
        };
        this.memoryCache.set(key, entry);
        this.stats.itemsCount = this.memoryCache.size;
        this.stats.size += entry.size;
    }
    /**
     * الحفظ في الـ disk cache
     */
    async setOnDisk(key, value, ttl) {
        if (!this.options.enableDisk) {
            return;
        }
        try {
            const entry = {
                key,
                value,
                timestamp: Date.now(),
                ttl,
                size: this.calculateSize(value)
            };
            const filePath = path.join(this.diskCachePath, `${key}.json`);
            await fs.writeJSON(filePath, entry);
        }
        catch (error) {
            // تجاهل أخطاء الكتابة
        }
    }
    /**
     * الحصول من الـ cache
     */
    async get(key) {
        const hashedKey = this.generateKey(key);
        // محاولة من الـ memory أولاً
        const fromMemory = this.getFromMemory(hashedKey);
        if (fromMemory !== null) {
            return fromMemory;
        }
        // محاولة من الـ disk
        const fromDisk = await this.getFromDisk(hashedKey);
        if (fromDisk !== null) {
            return fromDisk;
        }
        this.stats.misses++;
        this.updateHitRate();
        return null;
    }
    /**
     * الحفظ في الـ cache
     */
    async set(key, value, ttl) {
        const hashedKey = this.generateKey(key);
        const cacheTTL = ttl || this.options.ttl;
        // حفظ في الـ memory
        this.setInMemory(hashedKey, value, cacheTTL);
        // حفظ في الـ disk للبيانات الكبيرة
        const valueSize = this.calculateSize(value);
        if (valueSize > 1024 * 100) { // أكبر من 100 KB
            await this.setOnDisk(hashedKey, value, cacheTTL);
        }
        // التحقق من الحد الأقصى للحجم
        await this.enforceMaxSize();
    }
    /**
     * حذف من الـ cache
     */
    async delete(key) {
        const hashedKey = this.generateKey(key);
        // حذف من الـ memory
        this.memoryCache.delete(hashedKey);
        // حذف من الـ disk
        if (this.options.enableDisk) {
            const filePath = path.join(this.diskCachePath, `${hashedKey}.json`);
            await fs.remove(filePath).catch(() => { });
        }
        this.stats.itemsCount = this.memoryCache.size;
    }
    /**
     * مسح الـ cache بالكامل
     */
    async clear() {
        // مسح الـ memory
        this.memoryCache.clear();
        // مسح الـ disk
        if (this.options.enableDisk) {
            await fs.emptyDir(this.diskCachePath);
        }
        // إعادة تعيين الإحصائيات
        this.stats = {
            hits: 0,
            misses: 0,
            size: 0,
            itemsCount: 0,
            hitRate: 0
        };
    }
    /**
     * تنظيف الـ cache من العناصر المنتهية
     */
    async cleanup() {
        // تنظيف الـ memory
        for (const [key, entry] of this.memoryCache.entries()) {
            if (!this.isValid(entry)) {
                this.memoryCache.delete(key);
            }
        }
        // تنظيف الـ disk
        if (this.options.enableDisk) {
            try {
                const files = await fs.readdir(this.diskCachePath);
                for (const file of files) {
                    if (!file.endsWith('.json'))
                        continue;
                    const filePath = path.join(this.diskCachePath, file);
                    const data = await fs.readJSON(filePath);
                    const entry = data;
                    if (!this.isValid(entry)) {
                        await fs.remove(filePath);
                    }
                }
            }
            catch (error) {
                // تجاهل الأخطاء
            }
        }
        this.stats.itemsCount = this.memoryCache.size;
    }
    /**
     * فرض الحد الأقصى للحجم
     */
    async enforceMaxSize() {
        const maxSizeBytes = this.options.maxSize * 1024 * 1024; // تحويل لـ bytes
        if (this.stats.size <= maxSizeBytes) {
            return;
        }
        // حذف العناصر الأقدم
        const entries = Array.from(this.memoryCache.entries())
            .sort((a, b) => a[1].timestamp - b[1].timestamp);
        while (this.stats.size > maxSizeBytes && entries.length > 0) {
            const [key, entry] = entries.shift();
            this.memoryCache.delete(key);
            this.stats.size -= entry.size;
        }
        this.stats.itemsCount = this.memoryCache.size;
    }
    /**
     * تحديث نسبة الـ hit rate
     */
    updateHitRate() {
        const total = this.stats.hits + this.stats.misses;
        this.stats.hitRate = total > 0 ? (this.stats.hits / total) * 100 : 0;
    }
    /**
     * الحصول على إحصائيات الـ cache
     */
    getStats() {
        this.updateHitRate();
        return { ...this.stats };
    }
    /**
     * cache AI response
     */
    async cacheAIResponse(prompt, response) {
        const key = `ai:${prompt}`;
        await this.set(key, response, 3600 * 24); // 24 ساعة
    }
    /**
     * الحصول على AI response من cache
     */
    async getAIResponse(prompt) {
        const key = `ai:${prompt}`;
        return await this.get(key);
    }
    /**
     * cache file analysis
     */
    async cacheAnalysis(filePath, analysis) {
        const key = `analysis:${filePath}`;
        await this.set(key, analysis, 3600); // 1 ساعة
    }
    /**
     * الحصول على file analysis من cache
     */
    async getAnalysis(filePath) {
        const key = `analysis:${filePath}`;
        return await this.get(key);
    }
    /**
     * cache git info
     */
    async cacheGitInfo(repo, info) {
        const key = `git:${repo}`;
        await this.set(key, info, 300); // 5 دقائق
    }
    /**
     * الحصول على git info من cache
     */
    async getGitInfo(repo) {
        const key = `git:${repo}`;
        return await this.get(key);
    }
}
// تصدير instance واحد (Singleton)
let globalCacheManager = null;
export function getCacheManager(options) {
    if (!globalCacheManager) {
        globalCacheManager = new CacheManager(options);
    }
    return globalCacheManager;
}
export function createCacheManager(options) {
    return new CacheManager(options);
}
//# sourceMappingURL=cache-manager.js.map