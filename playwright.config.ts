import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration for Oqool AI
 *
 * تكوين شامل لاختبارات E2E
 */
export default defineConfig({
  testDir: './tests/e2e',

  // الحد الأقصى لمدة الاختبار
  timeout: 30 * 1000,

  // إعادة المحاولة عند الفشل
  retries: process.env.CI ? 2 : 0,

  // عدد العمليات المتوازية
  workers: process.env.CI ? 1 : undefined,

  // Reporter
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/results.xml' }],
  ],

  use: {
    // Base URL للاختبارات
    baseURL: 'http://localhost:5173',

    // تسجيل trace عند الفشل
    trace: 'on-first-retry',

    // Screenshot عند الفشل
    screenshot: 'only-on-failure',

    // Video عند الفشل
    video: 'retain-on-failure',
  },

  // تكوين المتصفحات
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    // اختبارات Mobile
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  // Web Server
  webServer: {
    command: 'npm run dev:desktop',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
