import { OqoolAPIClient } from './api-client.js';
export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';
export interface APIEndpoint {
    name: string;
    method: HTTPMethod;
    url: string;
    description?: string;
    headers?: Record<string, string>;
    queryParams?: Record<string, any>;
    body?: any;
    auth?: AuthConfig;
    timeout?: number;
}
export interface AuthConfig {
    type: 'none' | 'bearer' | 'basic' | 'apikey' | 'oauth2';
    token?: string;
    username?: string;
    password?: string;
    apiKey?: string;
    apiKeyHeader?: string;
}
export interface TestCase {
    id: string;
    name: string;
    endpoint: APIEndpoint;
    expectedStatus: number;
    expectedHeaders?: Record<string, string>;
    expectedBody?: any;
    assertions?: Assertion[];
    setup?: () => Promise<void>;
    teardown?: () => Promise<void>;
}
export interface Assertion {
    type: 'status' | 'header' | 'body' | 'json' | 'schema' | 'performance' | 'custom';
    field?: string;
    operator: 'equals' | 'contains' | 'matches' | 'gt' | 'lt' | 'gte' | 'lte' | 'exists' | 'type';
    expected: any;
    actual?: any;
    passed?: boolean;
    message?: string;
}
export interface TestResult {
    testCase: string;
    success: boolean;
    status: number;
    statusText: string;
    headers: Record<string, string>;
    body: any;
    responseTime: number;
    assertions: Assertion[];
    error?: string;
    timestamp: number;
}
export interface TestSuite {
    id: string;
    name: string;
    description?: string;
    baseURL?: string;
    globalHeaders?: Record<string, string>;
    globalAuth?: AuthConfig;
    testCases: TestCase[];
    hooks?: {
        beforeAll?: () => Promise<void>;
        afterAll?: () => Promise<void>;
        beforeEach?: () => Promise<void>;
        afterEach?: () => Promise<void>;
    };
}
export interface TestSuiteResult {
    suite: string;
    total: number;
    passed: number;
    failed: number;
    skipped: number;
    duration: number;
    results: TestResult[];
    coverage?: number;
}
export interface LoadTestConfig {
    endpoint: APIEndpoint;
    duration: number;
    concurrency: number;
    rampUp?: number;
    thinkTime?: number;
}
export interface LoadTestResult {
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    averageResponseTime: number;
    minResponseTime: number;
    maxResponseTime: number;
    requestsPerSecond: number;
    percentiles: {
        p50: number;
        p90: number;
        p95: number;
        p99: number;
    };
    errors: Record<string, number>;
}
export declare class APITesting {
    private projectRoot;
    private client;
    private testsDir;
    private resultsDir;
    private testSuites;
    constructor(projectRoot: string, client: OqoolAPIClient);
    /**
     * إنشاء test suite جديد
     */
    createTestSuite(name: string, description?: string, baseURL?: string): Promise<TestSuite>;
    /**
     * إضافة test case للـ suite
     */
    addTestCase(suiteId: string, testCase: Omit<TestCase, 'id'>): Promise<void>;
    /**
     * توليد test suite من مجموعة endpoints
     */
    generateTestSuiteFromEndpoints(endpoints: APIEndpoint[], suiteName: string): Promise<TestSuite>;
    /**
     * توليد test cases لـ endpoint معين
     */
    generateTestCasesForEndpoint(endpoint: APIEndpoint): Promise<Omit<TestCase, 'id'>[]>;
    /**
     * تشغيل test suite
     */
    runTestSuite(suiteId: string): Promise<TestSuiteResult>;
    /**
     * تشغيل test case واحد
     */
    runTestCase(testCase: TestCase, baseURL?: string): Promise<TestResult>;
    /**
     * تنفيذ assertion
     */
    private runAssertion;
    /**
     * تشغيل load test
     */
    runLoadTest(config: LoadTestConfig): Promise<LoadTestResult>;
    /**
     * توليد test suite تلقائياً من OpenAPI/Swagger spec
     */
    generateTestSuiteFromOpenAPI(specPath: string, suiteName: string): Promise<TestSuite>;
    /**
     * توليد assertions ذكية باستخدام AI
     */
    generateSmartAssertions(endpoint: APIEndpoint, sampleResponse?: any): Promise<Assertion[]>;
    /**
     * اقتراح تحسينات للـ tests
     */
    suggestTestImprovements(suiteResult: TestSuiteResult): Promise<string[]>;
    /**
     * إجراء HTTP request
     */
    private makeRequest;
    /**
     * إضافة auth header
     */
    private addAuthHeader;
    /**
     * بناء URL مع query parameters
     */
    private buildURL;
    /**
     * الحصول على قيمة متداخلة من object
     */
    private getNestedValue;
    /**
     * التحقق من JSON Schema
     */
    private validateSchema;
    /**
     * حساب المتوسط
     */
    private average;
    /**
     * حساب percentile
     */
    private percentile;
    /**
     * Sleep helper
     */
    private sleep;
    /**
     * طباعة نتيجة test
     */
    private printTestResult;
    /**
     * طباعة ملخص test suite
     */
    private printTestSuiteSummary;
    /**
     * طباعة نتائج load test
     */
    private printLoadTestResult;
    /**
     * حفظ نتائج الاختبارات
     */
    private saveTestResults;
    /**
     * تصدير نتائج كـ HTML report
     */
    exportHTMLReport(result: TestSuiteResult, outputPath: string): Promise<void>;
}
export declare function createAPITesting(projectRoot: string, client: OqoolAPIClient): APITesting;
//# sourceMappingURL=api-testing.d.ts.map