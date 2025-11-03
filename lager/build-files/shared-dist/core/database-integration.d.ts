import { OqoolAPIClient } from './api-client.js';
export type DatabaseType = 'postgresql' | 'mysql' | 'mongodb' | 'sqlite' | 'redis' | 'mariadb' | 'mssql';
export interface DatabaseConfig {
    type: DatabaseType;
    host?: string;
    port?: number;
    database?: string;
    username?: string;
    password?: string;
    connectionString?: string;
    ssl?: boolean;
    poolSize?: number;
    timeout?: number;
}
export interface Table {
    name: string;
    schema?: string;
    columns: Column[];
    primaryKey?: string[];
    foreignKeys?: ForeignKey[];
    indexes?: Index[];
}
export interface Column {
    name: string;
    type: string;
    nullable: boolean;
    default?: any;
    unique?: boolean;
    autoIncrement?: boolean;
    length?: number;
    precision?: number;
    scale?: number;
}
export interface ForeignKey {
    column: string;
    referencedTable: string;
    referencedColumn: string;
    onDelete?: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION';
    onUpdate?: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION';
}
export interface Index {
    name: string;
    columns: string[];
    unique: boolean;
    type?: 'BTREE' | 'HASH' | 'GIN' | 'GIST';
}
export interface MigrationFile {
    id: string;
    name: string;
    timestamp: number;
    up: string;
    down: string;
    executed: boolean;
}
export interface QueryResult {
    success: boolean;
    rows?: any[];
    rowCount?: number;
    error?: string;
    executionTime?: number;
}
export interface SchemaGenerationOptions {
    includeTimestamps?: boolean;
    includeSoftDelete?: boolean;
    useUUID?: boolean;
    generateRelations?: boolean;
    ormType?: 'prisma' | 'typeorm' | 'sequelize' | 'mongoose' | 'none';
}
export declare class DatabaseIntegration {
    private projectRoot;
    private client;
    private config?;
    private migrationsDir;
    private schemasDir;
    constructor(projectRoot: string, client: OqoolAPIClient);
    /**
     * تكوين الاتصال بقاعدة البيانات
     */
    configure(config: DatabaseConfig): Promise<void>;
    /**
     * تهيئة المشروع لقاعدة البيانات
     */
    initializeDatabase(dbType: DatabaseType, ormType?: string): Promise<void>;
    /**
     * توليد schema من وصف طبيعي باستخدام AI
     */
    generateSchemaFromDescription(description: string, options?: SchemaGenerationOptions): Promise<Table[]>;
    /**
     * توليد ملفات Schema حسب ORM
     */
    generateSchemaFiles(tables: Table[], ormType?: string): Promise<void>;
    /**
     * إنشاء migration جديد
     */
    createMigration(name: string, tables?: Table[]): Promise<string>;
    /**
     * تنفيذ migrations
     */
    runMigrations(): Promise<void>;
    /**
     * التراجع عن آخر migration
     */
    rollbackMigration(): Promise<void>;
    /**
     * توليد query من وصف طبيعي
     */
    generateQueryFromNaturalLanguage(description: string, dbType?: DatabaseType): Promise<string>;
    /**
     * تحسين query موجود
     */
    optimizeQuery(query: string, dbType?: DatabaseType): Promise<{
        optimized: string;
        improvements: string[];
    }>;
    /**
     * شرح query معقد
     */
    explainQuery(query: string): Promise<string>;
    /**
     * توليد بيانات تجريبية للجداول
     */
    generateSeedData(tables: Table[], rowsPerTable?: number): Promise<Record<string, any[]>>;
    /**
     * إنشاء ملف seed
     */
    createSeedFile(tableName: string, data: any[]): Promise<string>;
    /**
     * توليد ملف إعدادات قاعدة البيانات
     */
    private generateDatabaseConfig;
    /**
     * توليد ملف الاتصال بقاعدة البيانات
     */
    private generateConnectionFile;
    /**
     * توليد .env template
     */
    private generateEnvTemplate;
    /**
     * الحصول على dependencies لقاعدة البيانات
     */
    private getDependencies;
    /**
     * توليد Prisma schema
     */
    private generatePrismaSchema;
    /**
     * توليد TypeORM schema
     */
    private generateTypeORMSchema;
    /**
     * توليد Sequelize schema
     */
    private generateSequelizeSchema;
    /**
     * توليد Mongoose schema
     */
    private generateMongooseSchema;
    /**
     * توليد SQL schema
     */
    private generateSQLSchema;
    /**
     * توليد CREATE TABLE SQL
     */
    private generateCreateTableSQL;
    /**
     * الحصول على قائمة migrations
     */
    private getMigrations;
    private mapToPrismaType;
    private mapToTypeScriptType;
    private mapToSequelizeType;
    private mapToMongooseType;
    private toPascalCase;
}
export declare function createDatabaseIntegration(projectRoot: string, client: OqoolAPIClient): DatabaseIntegration;
//# sourceMappingURL=database-integration.d.ts.map