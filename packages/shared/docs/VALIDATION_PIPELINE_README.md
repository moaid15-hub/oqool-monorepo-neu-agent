# 🔍 Validation Pipeline - دليل الاستخدام الشامل

نظام تحقق متكامل ومتعدد المراحل لفحص وتحسين جودة الكود.

---

## 📋 جدول المحتويات

1. [نظرة عامة](#نظرة-عامة)
2. [المميزات](#المميزات)
3. [التثبيت](#التثبيت)
4. [الاستخدام السريع](#الاستخدام-السريع)
5. [المراحل الخمسة](#المراحل-الخمسة)
6. [الإعدادات](#الإعدادات)
7. [Auto-Fix](#auto-fix)
8. [أمثلة متقدمة](#أمثلة-متقدمة)
9. [API Reference](#api-reference)

---

## 🎯 نظرة عامة

**Validation Pipeline** هو نظام تحقق متطور يفحص الكود عبر **5 مراحل** مختلفة:

```
الكود → Syntax → Types → Security → Performance → Style → النتيجة
```

### لماذا Validation Pipeline؟

✅ **متكامل** - يجمع كل أنواع الفحص في مكان واحد  
✅ **ذكي** - يستخدم priorities لتحديد الأهمية  
✅ **سريع** - يستخدم caching لتجنب التكرار  
✅ **مرن** - يمكن تخصيص كل مرحلة  
✅ **آمن** - يكتشف الثغرات الأمنية (OWASP Top 10)  
✅ **تلقائي** - يصلح الأخطاء تلقائياً عند الإمكان  

---

## 🚀 المميزات

### 1. Multi-Stage Validation
```typescript
✅ Syntax Check     (P1) - أخطاء الكتابة
✅ Type Check       (P2) - أخطاء الأنواع (TypeScript)
✅ Security Scan    (P1) - ثغرات أمنية (OWASP)
✅ Performance      (P3) - مشاكل الأداء
✅ Style Check      (P3) - نظافة الكود
```

### 2. Priority System
```typescript
P1 = Critical   → يوقف التنفيذ إذا فشل
P2 = Important  → يحذر ويكمل
P3 = Optional   → اقتراحات فقط
```

### 3. Auto-Fix Strategies
```typescript
auto     → إصلاح تلقائي فوري
suggest  → اقتراح الإصلاح فقط
manual   → يحتاج تدخل يدوي
confirm  → يسأل المستخدم أولاً
```

### 4. Smart Caching
```typescript
✅ يحفظ النتائج
✅ TTL configurable
✅ Auto-cleanup
✅ 10x+ faster على نفس الكود
```

---

## 📦 التثبيت

```bash
npm install typescript @typescript-eslint/parser eslint
```

ثم أضف الملفات:
```
validation-pipeline.ts
validation-pipeline-examples.ts
```

---

## ⚡ الاستخدام السريع

### مثال بسيط

```typescript
import { ValidationPipeline } from './validation-pipeline';

const pipeline = new ValidationPipeline();

const code = `
function login(user) {
  var query = 'SELECT * FROM users WHERE id=' + user;
  return eval(query);
}
`;

const result = await pipeline.validate(code, 'auth.js');

console.log(result.success);        // false
console.log(result.totalIssues);    // 3
console.log(result.criticalIssues); // 2
console.log(result.summary);
```

**النتيجة:**
```
❌ Syntax: 0 errors
✅ Types: 0 errors
❌ Security: 2 critical errors (SQL Injection, eval)
✅ Performance: 0 errors
⚠️  Style: 1 warning (var usage)

Total: 3 issues (2 critical)
```

---

## 🔍 المراحل الخمسة

### 1️⃣ Syntax Check (P1)

**يفحص:**
- أخطاء الكتابة
- أقواس غير مغلقة
- كلمات محجوزة
- بناء جملة خاطئ

**مثال:**
```typescript
const code = `
function test() {
  return "hello"  // ❌ فاصلة منقوطة ناقصة
}
`;
```

**النتيجة:**
```
❌ [P1] Syntax Error
   Line 3: Expected ';'
   Fix: Auto-fix available
```

---

### 2️⃣ Type Check (P2)

**يفحص:**
- أخطاء الأنواع (TypeScript)
- Missing type annotations
- Type mismatches
- Undefined variables

**مثال:**
```typescript
const code = `
function add(a: number, b: number): number {
  return a + b;
}

const result = add("5", "10"); // ❌ خطأ في النوع
`;
```

**النتيجة:**
```
❌ [P2] Type Error (TS2345)
   Line 5: Argument of type 'string' not assignable to 'number'
   Fix: Change to numbers or adjust function signature
```

---

### 3️⃣ Security Scan (P1)

**يفحص:**
- SQL Injection (CWE-89)
- XSS Vulnerabilities (CWE-79)
- Command Injection (CWE-78)
- eval() usage (CWE-95)
- Weak Crypto (CWE-327)
- Sensitive Data Exposure (CWE-200)

**مثال:**
```typescript
const code = `
function search(query) {
  // ❌ SQL Injection
  db.query('SELECT * FROM items WHERE name=' + query);
  
  // ❌ XSS
  element.innerHTML = query;
  
  // ❌ Dangerous eval
  return eval(query);
}
`;
```

**النتيجة:**
```
🔴 [CRITICAL] SQL Injection (CWE-89)
   Line 3: Direct string concatenation in SQL query
   Fix: Use parameterized queries

🔴 [CRITICAL] XSS Vulnerability (CWE-79)
   Line 6: Direct innerHTML assignment
   Fix: Use textContent or sanitize HTML

🔴 [CRITICAL] Dangerous Function (CWE-95)
   Line 9: eval() usage detected
   Fix: Remove eval() and use safer alternatives
```

---

### 4️⃣ Performance Analysis (P3)

**يفحص:**
- Nested loops (O(n²))
- Large allocations
- Inefficient patterns
- Memory leaks

**مثال:**
```typescript
const code = `
function findDuplicates(arr) {
  // ❌ O(n²) complexity
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j]) return true;
    }
  }
  return false;
}
`;
```

**النتيجة:**
```
⚠️  [MEDIUM] Performance Issue
   Line 3-7: Nested loops detected (O(n²) complexity)
   Suggestion: Use Set for O(n) complexity
   
   Better approach:
   const seen = new Set();
   for (const item of arr) {
     if (seen.has(item)) return true;
     seen.add(item);
   }
```

---

### 5️⃣ Style Check (P3)

**يفحص:**
- var usage (use const/let)
- == vs ===
- console.log في الكود
- Tabs vs Spaces
- Trailing whitespace

**مثال:**
```typescript
const code = `
var name = "John";
if (name == "John") {
	console.log("Match");
}
`;
```

**النتيجة:**
```
💡 [LOW] Style Issue
   Line 1: Use const or let instead of var
   Fix: Auto-fix → Replace with const

💡 [LOW] Style Issue
   Line 2: Use === instead of ==
   Fix: Auto-fix → Replace with ===

💡 [INFO] Style Issue
   Line 3: Tabs detected
   Fix: Auto-fix → Replace with spaces
```

---

## ⚙️ الإعدادات

### إعدادات افتراضية

```typescript
const pipeline = new ValidationPipeline({
  stages: {
    syntax: {
      enabled: true,
      priority: 'P1',
      autoFix: true,
      stopOnError: true,
      confirm: false
    },
    types: {
      enabled: true,
      priority: 'P2',
      autoFix: true,
      stopOnError: false,
      confirm: false
    },
    security: {
      enabled: true,
      priority: 'P1',
      autoFix: false,
      stopOnError: true,
      confirm: true // ⚠️ يسأل المستخدم
    },
    performance: {
      enabled: true,
      priority: 'P3',
      autoFix: false,
      stopOnError: false,
      confirm: false
    },
    style: {
      enabled: true,
      priority: 'P3',
      autoFix: true,
      stopOnError: false,
      confirm: false
    }
  },
  cache: {
    enabled: true,
    ttl: 3600 // 1 hour
  }
});
```

### إعدادات مخصصة

```typescript
// فقط Security + Style
const strictPipeline = new ValidationPipeline({
  stages: {
    syntax: { enabled: false },
    types: { enabled: false },
    security: {
      enabled: true,
      priority: 'P1',
      stopOnError: true
    },
    performance: { enabled: false },
    style: {
      enabled: true,
      autoFix: true
    }
  }
});

// تعديل مرحلة واحدة بعد الإنشاء
pipeline.configureStage('security', {
  autoFix: true,
  confirm: false
});
```

---

## 🔧 Auto-Fix

### Auto-Fix Strategies

```typescript
type FixStrategy = 
  | 'auto'     // تلقائي فوري
  | 'suggest'  // اقتراح فقط
  | 'manual'   // يدوي
  | 'confirm'; // يسأل المستخدم
```

### مثال: Auto-Fix مع Confirmation

```typescript
const result = await pipeline.validate(code, 'file.js', {
  onConfirm: async (issue) => {
    console.log(`⚠️  ${issue.message}`);
    console.log(`   Fix: ${issue.fix?.description}`);
    
    // اسأل المستخدم (CLI/GUI)
    const answer = await prompt('Apply fix? (y/n): ');
    return answer === 'y';
  }
});

if (result.success) {
  console.log('✅ Fixed code:');
  console.log(result.finalCode);
}
```

### ما يمكن إصلاحه تلقائياً؟

✅ **Syntax Errors** - أقواس، فواصل  
✅ **Type Errors** - إضافة type annotations  
✅ **Style Issues** - var→const, ==→===, tabs→spaces  
❌ **Security Issues** - يحتاج مراجعة بشرية  
❌ **Performance** - يحتاج إعادة كتابة  

---

## 💡 أمثلة متقدمة

### مثال 1: مع Progress Tracking

```typescript
await pipeline.validate(code, 'app.js', {
  onProgress: (stage, progress) => {
    const percent = Math.round(progress * 100);
    console.log(`[${percent}%] ${stage}...`);
  }
});
```

**النتيجة:**
```
[0%] syntax...
[20%] types...
[40%] security...
[60%] performance...
[80%] style...
[100%] Done!
```

---

### مثال 2: Batch Validation

```typescript
const files = [
  { path: 'auth.js', code: '...' },
  { path: 'api.js', code: '...' },
  { path: 'utils.js', code: '...' }
];

const results = await Promise.all(
  files.map(f => pipeline.validate(f.code, f.path))
);

// تقرير شامل
const report = {
  total: results.length,
  passed: results.filter(r => r.success).length,
  failed: results.filter(r => !r.success).length,
  issues: results.reduce((sum, r) => sum + r.totalIssues, 0)
};

console.log(report);
```

---

### مثال 3: Security-First Mode

```typescript
const securityPipeline = new ValidationPipeline({
  stages: {
    security: {
      enabled: true,
      priority: 'P1',
      stopOnError: true, // توقف عند أول ثغرة
      confirm: false
    }
  }
});

const result = await securityPipeline.validate(code, 'api.js');

if (!result.success) {
  const securityStage = result.stages.find(s => s.stage === 'security');
  
  console.log('🔴 Security Report:');
  securityStage.errors.forEach(err => {
    console.log(`[${err.cwe}] ${err.message}`);
    console.log(`Fix: ${err.fix?.description}`);
  });
}
```

---

### مثال 4: Custom Error Handler

```typescript
class ValidationError extends Error {
  constructor(public result: ValidationResult) {
    super(result.summary);
  }
}

async function validateOrThrow(code: string, file: string) {
  const result = await pipeline.validate(code, file);
  
  if (!result.success) {
    throw new ValidationError(result);
  }
  
  return result.finalCode;
}

try {
  const clean = await validateOrThrow(dirtyCode, 'app.js');
  fs.writeFileSync('app.js', clean);
} catch (err) {
  if (err instanceof ValidationError) {
    console.error('Validation failed:');
    console.error(err.result.summary);
  }
}
```

---

## 📚 API Reference

### ValidationPipeline Class

#### Constructor
```typescript
new ValidationPipeline(config?: PipelineConfig)
```

#### Methods

**validate()**
```typescript
async validate(
  code: string,
  filePath: string,
  options?: {
    skipCache?: boolean;
    onProgress?: (stage: ValidationStage, progress: number) => void;
    onConfirm?: (issue: ValidationIssue) => Promise<boolean>;
  }
): Promise<ValidationResult>
```

**configureStage()**
```typescript
configureStage(
  stage: ValidationStage,
  config: Partial<StageConfig>
): void
```

**clearCache()**
```typescript
clearCache(): void
```

**getConfig()**
```typescript
getConfig(): Required<PipelineConfig>
```

---

### Types

```typescript
type ValidationStage = 
  | 'syntax' 
  | 'types' 
  | 'security' 
  | 'performance' 
  | 'style';

type Severity = 
  | 'critical' 
  | 'high' 
  | 'medium' 
  | 'low' 
  | 'info';

type Priority = 'P1' | 'P2' | 'P3';

type FixStrategy = 
  | 'auto' 
  | 'suggest' 
  | 'manual' 
  | 'confirm';

interface ValidationResult {
  success: boolean;
  totalIssues: number;
  criticalIssues: number;
  stages: StageResult[];
  finalCode: string;
  originalCode: string;
  summary: string;
  duration: number;
}

interface ValidationIssue {
  stage: ValidationStage;
  severity: Severity;
  type: string;
  message: string;
  line?: number;
  column?: number;
  file?: string;
  code?: string;
  cwe?: string;
  fix?: {
    strategy: FixStrategy;
    description: string;
    suggestedCode?: string;
  };
}
```

---

## 🎯 Best Practices

### 1. استخدم Priorities بحكمة
```typescript
// Critical code → P1 فقط
const apiPipeline = new ValidationPipeline({
  stages: {
    security: { priority: 'P1', stopOnError: true },
    syntax: { priority: 'P1', stopOnError: true }
  }
});

// Development → كل شيء
const devPipeline = new ValidationPipeline(); // default
```

### 2. Cache للسرعة
```typescript
// تفعيل cache للملفات الكبيرة
const pipeline = new ValidationPipeline({
  cache: {
    enabled: true,
    ttl: 3600 // 1 hour
  }
});
```

### 3. تقارير مفصلة
```typescript
const result = await pipeline.validate(code, file);

// حفظ التقرير
fs.writeFileSync(
  `reports/${file}.json`,
  JSON.stringify(result, null, 2)
);
```

---

## 🔗 التكامل مع أنظمة أخرى

### مع Cache Manager
```typescript
import { getCacheManager } from './cache-manager';

const cache = getCacheManager();
const cacheKey = `validation:${filePath}`;

// تحقق من الـ cache أولاً
let result = await cache.get(cacheKey);

if (!result) {
  result = await pipeline.validate(code, filePath);
  await cache.set(cacheKey, result, 3600);
}
```

### مع Context Manager
```typescript
import { ContextManager } from './context-manager';

const context = new ContextManager(workDir);
const projectInfo = await context.analyzeProject();

// تخصيص الفحص حسب نوع المشروع
if (projectInfo.type === 'node') {
  pipeline.configureStage('security', {
    enabled: true,
    priority: 'P1'
  });
}
```

---

## 📊 إحصائيات الأداء

### Benchmarks

```
Code Size: 1KB
├─ Syntax:      ~10ms
├─ Types:       ~50ms (TypeScript)
├─ Security:    ~20ms
├─ Performance: ~15ms
└─ Style:       ~10ms
Total:          ~105ms

مع Cache:       ~1ms (100x faster!)
```

---

## 🆘 الأسئلة الشائعة

### Q: هل يدعم JavaScript فقط أم TypeScript أيضاً؟
✅ الاثنين! Type checking يعمل فقط مع .ts/.tsx

### Q: هل يمكن تعطيل مراحل معينة؟
✅ نعم، ضع `enabled: false` في config

### Q: هل Auto-Fix آمن؟
✅ لـ Style/Syntax نعم. لـ Security نستخدم `confirm` strategy

### Q: كيف أتكامل مع CI/CD؟
```typescript
const result = await pipeline.validate(code, file);
process.exit(result.success ? 0 : 1);
```

---

## 📝 License

MIT

---

## 🤝 المساهمة

نرحب بالمساهمات! افتح Issue أو Pull Request.

---

**تم بناء هذا النظام بـ ❤️ لـ Oqool AI**
