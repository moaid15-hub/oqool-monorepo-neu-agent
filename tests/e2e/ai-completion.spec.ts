import { test, expect } from '@playwright/test';

/**
 * اختبارات AI Code Completion
 */
test.describe('Oqool AI - Code Completion', () => {
  test('should show AI suggestions when typing', async ({ page }) => {
    // فتح التطبيق
    await page.goto('/');

    // انتظار تحميل المحرر
    await page.waitForSelector('.monaco-editor', { timeout: 10000 });

    // النقر في المحرر
    const editor = page.locator('.monaco-editor textarea').first();
    await editor.click();

    // كتابة كود
    await page.keyboard.type('function calc');

    // انتظار ظهور الاقتراحات
    const suggestions = page.locator('.suggest-widget');
    await expect(suggestions).toBeVisible({ timeout: 5000 });

    // التحقق من وجود اقتراحات
    const suggestionItems = page.locator('.monaco-list-row');
    await expect(suggestionItems.first()).toBeVisible();

    // قبول الاقتراح الأول
    await page.keyboard.press('Enter');

    // التحقق من إضافة الكود
    const editorContent = await page.locator('.monaco-editor').textContent();
    expect(editorContent).toContain('function');
  });

  test('should generate code from description', async ({ page }) => {
    await page.goto('/');

    // فتح AI panel
    await page.click('[data-testid="ai-panel-button"]');

    // كتابة وصف
    const input = page.locator('[data-testid="ai-input"]');
    await input.fill('Create a function to calculate fibonacci sequence');

    // النقر على Generate
    await page.click('[data-testid="generate-button"]');

    // انتظار توليد الكود
    await page.waitForSelector('[data-testid="generated-code"]', { timeout: 10000 });

    // التحقق من الكود المولد
    const generatedCode = await page.locator('[data-testid="generated-code"]').textContent();
    expect(generatedCode).toContain('fibonacci');
    expect(generatedCode).toContain('function');
  });
});

/**
 * اختبارات Code Review
 */
test.describe('Oqool AI - Code Review', () => {
  test('should review code and show suggestions', async ({ page }) => {
    await page.goto('/');

    // كتابة كود في المحرر
    const editor = page.locator('.monaco-editor textarea').first();
    await editor.click();
    await page.keyboard.type(`
      function add(a, b) {
        var result = a + b;
        return result;
      }
    `);

    // فتح Code Review panel
    await page.click('[data-testid="review-button"]');

    // انتظار نتائج المراجعة
    await page.waitForSelector('[data-testid="review-results"]', { timeout: 10000 });

    // التحقق من الاقتراحات
    const suggestions = page.locator('[data-testid="suggestion-item"]');
    await expect(suggestions.first()).toBeVisible();
  });
});

/**
 * اختبارات Terminal
 */
test.describe('Oqool AI - Terminal', () => {
  test('should open terminal and execute commands', async ({ page }) => {
    await page.goto('/');

    // فتح Terminal
    await page.click('[data-testid="terminal-button"]');

    // انتظار تحميل Terminal
    await page.waitForSelector('.xterm', { timeout: 5000 });

    // كتابة أمر
    await page.keyboard.type('echo "Hello from Oqool AI"');
    await page.keyboard.press('Enter');

    // انتظار النتيجة
    await page.waitForTimeout(1000);

    // التحقق من النتيجة
    const terminalContent = await page.locator('.xterm').textContent();
    expect(terminalContent).toContain('Hello from Oqool AI');
  });
});

/**
 * اختبارات File Explorer
 */
test.describe('Oqool AI - File Explorer', () => {
  test('should open and navigate files', async ({ page }) => {
    await page.goto('/');

    // انتظار تحميل File Explorer
    await page.waitForSelector('[data-testid="file-explorer"]', { timeout: 5000 });

    // النقر على ملف
    const firstFile = page.locator('[data-testid="file-item"]').first();
    await firstFile.click();

    // التحقق من فتح الملف في المحرر
    await expect(page.locator('.monaco-editor')).toBeVisible();
  });

  test('should create new file', async ({ page }) => {
    await page.goto('/');

    // النقر على زر New File
    await page.click('[data-testid="new-file-button"]');

    // إدخال اسم الملف
    const input = page.locator('[data-testid="file-name-input"]');
    await input.fill('test.ts');

    // تأكيد
    await page.click('[data-testid="confirm-button"]');

    // التحقق من إنشاء الملف
    const fileItem = page.locator('[data-testid="file-item"]', { hasText: 'test.ts' });
    await expect(fileItem).toBeVisible();
  });
});

/**
 * اختبارات Performance
 */
test.describe('Oqool AI - Performance', () => {
  test('should load within acceptable time', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/');
    await page.waitForSelector('.monaco-editor', { timeout: 10000 });

    const loadTime = Date.now() - startTime;

    // يجب أن يتم التحميل في أقل من 5 ثواني
    expect(loadTime).toBeLessThan(5000);
  });

  test('should handle large files efficiently', async ({ page }) => {
    await page.goto('/');

    // فتح ملف كبير
    await page.click('[data-testid="open-large-file"]');

    const startTime = Date.now();
    await page.waitForSelector('.monaco-editor', { timeout: 10000 });
    const renderTime = Date.now() - startTime;

    // يجب أن يتم render الملف في أقل من 3 ثواني
    expect(renderTime).toBeLessThan(3000);
  });
});
