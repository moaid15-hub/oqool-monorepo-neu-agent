# 🚀 دليل الأدوات الاحترافية في Oqool AI

## 📋 جدول المحتويات

- [الأدوات المثبتة](#الأدوات-المثبتة)
- [LangChain Integration](#1-langchain-integration)
- [Qdrant Vector Database](#2-qdrant-vector-database)
- [Playwright Testing](#3-playwright-testing)
- [Snyk Security](#4-snyk-security)
- [OpenTelemetry Monitoring](#5-opentelemetry-monitoring)
- [أمثلة الاستخدام](#أمثلة-الاستخدام)

---

## ✅ الأدوات المثبتة

| الأداة | الإصدار | الحزمة | الحالة |
|--------|---------|--------|--------|
| **LangChain** | 1.0.2 | `@oqool/shared` | ✅ مثبت |
| **Qdrant** | 1.15.1 | `@oqool/shared` | ✅ مثبت |
| **Playwright** | 1.56.1 | root | ✅ مثبت |
| **Snyk** | 1.1300.2 | root | ✅ مثبت |
| **OpenTelemetry** | 1.9.0 | `@oqool/shared` | ✅ مثبت |
| **Tree-sitter** | 0.21.1 | `@oqool/shared` | ✅ موجود مسبقاً |
| **Xterm.js** | 5.3.0 | `@oqool/desktop` | ✅ موجود مسبقاً |

---

## 1. LangChain Integration

### 📦 الحزم المثبتة

```bash
langchain@1.0.2
@langchain/core@1.0.2
@langchain/openai@1.0.0
```

### 🎯 الاستخدام

#### مثال 1: AI Agent متقدم

```typescript
import { OqoolLangChainAgent } from '@oqool/shared/integrations';

const agent = new OqoolLangChainAgent(process.env.OPENAI_API_KEY);
await agent.initialize();

// تحليل مشروع
const analysis = await agent.analyzeProject('/path/to/project', files);
console.log('Architecture:', analysis.architecture);
console.log('Issues:', analysis.issues);
console.log('Suggestions:', analysis.suggestions);
```

#### مثال 2: توليد كود

```typescript
const code = await agent.generateCode(
  'Create a REST API endpoint for user authentication',
  'typescript'
);
console.log(code);
```

#### مثال 3: مراجعة كود

```typescript
const review = await agent.reviewCode(`
  function calculate(a, b) {
    return a + b;
  }
`);

console.log('Rating:', review.rating);
console.log('Issues:', review.issues);
console.log('Refactored:', review.refactored);
```

### 🔑 المميزات

- ✅ AI workflows معقدة
- ✅ Memory management للمحادثات
- ✅ تحليل شامل للمشاريع
- ✅ توليد ومراجعة الكود
- ✅ مساعد برمجة تفاعلي

---

## 2. Qdrant Vector Database

### 📦 الحزم المثبتة

```bash
@qdrant/js-client-rest@1.15.1
```

### 🎯 الاستخدام

#### إعداد Qdrant Server

```bash
# باستخدام Docker
docker run -p 6333:6333 qdrant/qdrant
```

#### مثال 1: البحث الدلالي

```typescript
import { SemanticCodeSearch } from '@oqool/shared/integrations';

const search = new SemanticCodeSearch('http://localhost:6333');
await search.initialize();

// إضافة كود
await search.addCode(
  'auth_func_1',
  'function authenticate(user, password) { ... }',
  'src/auth.ts',
  'typescript',
  'User authentication function'
);

// البحث
const results = await search.searchSimilarCode('login function');
console.log(results);
```

#### مثال 2: اكتشاف الكود المكرر

```typescript
const duplicates = await search.findDuplicateCode(0.95, 'typescript');
console.log('Duplicate code found:', duplicates);
```

#### مثال 3: إحصائيات

```typescript
const stats = await search.getStats();
console.log('Total codes:', stats.totalCodes);
console.log('Languages:', stats.languages);
```

### 🔑 المميزات

- ✅ بحث دلالي في الكود (بالمعنى وليس النص)
- ✅ اكتشاف الكود المكرر
- ✅ Code similarity detection
- ✅ Context-aware completions
- ✅ دعم عدة لغات برمجة

---

## 3. Playwright Testing

### 📦 الحزم المثبتة

```bash
@playwright/test@1.56.1
```

### 🎯 الاستخدام

#### تشغيل الاختبارات

```bash
# تشغيل جميع الاختبارات
npx playwright test

# تشغيل في متصفح معين
npx playwright test --project=chromium

# تشغيل مع UI
npx playwright test --ui

# تشغيل مع debug
npx playwright test --debug
```

#### مثال: اختبار AI Completion

```typescript
import { test, expect } from '@playwright/test';

test('AI code completion works', async ({ page }) => {
  await page.goto('/');

  const editor = page.locator('.monaco-editor textarea');
  await editor.click();
  await page.keyboard.type('function calc');

  const suggestions = page.locator('.suggest-widget');
  await expect(suggestions).toBeVisible();
});
```

#### عرض التقارير

```bash
npx playwright show-report
```

### 🔑 المميزات

- ✅ E2E testing قوي
- ✅ Cross-browser testing (Chrome, Firefox, Safari)
- ✅ Screenshot & video recording
- ✅ Test generation تلقائي
- ✅ تقارير HTML تفاعلية

---

## 4. Snyk Security

### 📦 الحزم المثبتة

```bash
snyk@1.1300.2
```

### 🎯 الاستخدام

#### مسح الثغرات الأمنية

```bash
# تسجيل الدخول
npx snyk auth

# فحص المشروع
npx snyk test

# فحص مع تقرير JSON
npx snyk test --json > security-report.json

# إصلاح تلقائي
npx snyk fix
```

#### مسح Docker images

```bash
npx snyk container test oqool-ai:latest
```

#### مراقبة مستمرة

```bash
npx snyk monitor
```

### 🔑 المميزات

- ✅ كشف آلاف الثغرات الأمنية
- ✅ إصلاح تلقائي للمشاكل
- ✅ فحص Dependencies
- ✅ فحص Container images
- ✅ License compliance checking

---

## 5. OpenTelemetry Monitoring

### 📦 الحزم المثبتة

```bash
@opentelemetry/api@1.9.0
@opentelemetry/sdk-node@0.207.0
@opentelemetry/auto-instrumentations-node@0.66.0
```

### 🎯 الاستخدام

#### مثال 1: تتبع AI requests

```typescript
import { OqoolObservability } from '@oqool/shared/integrations';

const observability = new OqoolObservability();
await observability.initialize();

// تتبع AI request
await observability.trackAIRequest(
  'openai',
  'completion',
  async () => {
    return await openai.chat.completions.create({...});
  },
  { model: 'gpt-4', temperature: 0.7 }
);
```

#### مثال 2: تتبع Token usage

```typescript
observability.trackTokenUsage(
  'openai',
  'gpt-4',
  100,  // prompt tokens
  50,   // completion tokens
  150   // total tokens
);
```

#### مثال 3: تتبع Code generation

```typescript
await observability.trackCodeGeneration(
  'typescript',
  50,
  async () => {
    return await generateCode(...);
  }
);
```

### 🔑 المميزات

- ✅ تتبع شامل للأداء
- ✅ مراقبة AI requests والتكلفة
- ✅ Performance insights
- ✅ Error tracking
- ✅ Custom metrics

---

## 📊 أمثلة متقدمة

### مثال 1: AI-Powered Code Search

```typescript
import { SemanticCodeSearch, OqoolLangChainAgent } from '@oqool/shared/integrations';

// 1. فهرسة الكود في Qdrant
const search = new SemanticCodeSearch();
await search.initialize();

const files = getAllProjectFiles();
for (const file of files) {
  const code = readFileSync(file, 'utf-8');
  await search.addCode(file, code, file, detectLanguage(file));
}

// 2. البحث الذكي
const results = await search.semanticSearch('authentication logic');

// 3. تحليل النتائج بواسطة AI
const agent = new OqoolLangChainAgent();
await agent.initialize();

for (const result of results) {
  const review = await agent.reviewCode(result.code);
  console.log(`File: ${result.file}`);
  console.log(`Rating: ${review.rating}/10`);
  console.log(`Issues: ${review.issues.join(', ')}`);
}
```

### مثال 2: Monitoring & Analytics

```typescript
import { OqoolObservability, MetricsCollector } from '@oqool/shared/integrations';

const observability = new OqoolObservability();
const metrics = new MetricsCollector();

// تتبع جميع AI requests
async function generateCodeWithMonitoring(prompt: string) {
  return await observability.trackAIRequest(
    'openai',
    'code-generation',
    async () => {
      const startTime = Date.now();
      const result = await generateCode(prompt);
      const duration = Date.now() - startTime;

      // تسجيل metrics
      metrics.record('code_generation_duration', duration);
      metrics.record('generated_lines', countLines(result));

      return result;
    }
  );
}

// الحصول على إحصائيات
const stats = metrics.getAllStats();
console.log('Average generation time:', stats.code_generation_duration?.avg);
console.log('Total generated lines:', stats.generated_lines?.sum);
```

### مثال 3: Automated Testing Workflow

```bash
# 1. فحص الأمان
npx snyk test

# 2. تشغيل الاختبارات
npx playwright test

# 3. عرض التقارير
npx playwright show-report
```

---

## 🛠️ Scripts مفيدة

أضف هذه الـ scripts إلى `package.json`:

```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug",
    "security:scan": "snyk test",
    "security:fix": "snyk fix",
    "security:monitor": "snyk monitor",
    "monitor:start": "node dist/monitoring/index.js"
  }
}
```

---

## 📚 موارد إضافية

- [LangChain Docs](https://docs.langchain.com/)
- [Qdrant Docs](https://qdrant.tech/documentation/)
- [Playwright Docs](https://playwright.dev/)
- [Snyk Docs](https://docs.snyk.io/)
- [OpenTelemetry Docs](https://opentelemetry.io/docs/)

---

## 🎯 الخطوات التالية

### أدوات يُنصح بإضافتها:

1. **SonarQube** - لجودة الكود
2. **Biome** - linting سريع جداً
3. **Grafana + Prometheus** - dashboards متقدمة
4. **Vault** - إدارة آمنة للمفاتيح

### التحسينات المستقبلية:

- [ ] إضافة CI/CD pipeline مع الأدوات الجديدة
- [ ] Dashboard للمراقبة في الوقت الفعلي
- [ ] تكامل Snyk مع GitHub Actions
- [ ] Automated security reports
- [ ] Performance benchmarks

---

**🎉 تم تثبيت وتكوين 5 أدوات احترافية من أصل 17!**

الأدوات المثبتة:
1. ✅ LangChain
2. ✅ Qdrant Vector Database
3. ✅ Playwright
4. ✅ Snyk
5. ✅ OpenTelemetry

الأدوات الموجودة مسبقاً:
6. ✅ Tree-sitter
7. ✅ Xterm.js
8. ✅ esbuild (via Vite)
