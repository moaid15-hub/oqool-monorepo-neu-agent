# دليل الأدوات والإعداد | Tools Setup Guide

تم إعداد مجموعة شاملة من الأدوات لتحسين سير العمل والإنتاجية.

## 📦 الأدوات المضافة

### 1️⃣ إدارة العمليات - PM2

**الاستخدام:**
```bash
# تشغيل جميع التطبيقات
npm run pm2:start

# إيقاف التطبيقات
npm run pm2:stop

# إعادة التشغيل
npm run pm2:restart

# عرض اللوجات
npm run pm2:logs

# مراقبة الأداء
npm run pm2:monit
```

**الملفات:**
- `ecosystem.config.js` - تكوين PM2

---

### 2️⃣ Docker & Docker Compose

**الاستخدام:**
```bash
# بناء الصور
npm run docker:build

# تشغيل الحاويات
npm run docker:up

# إيقاف الحاويات
npm run docker:down

# عرض اللوجات
npm run docker:logs
```

**الخدمات المتوفرة:**
- `oqool-cloud` - Cloud Editor (Port 3000)
- `oqool-cli` - CLI في وضع API
- `redis` - للتخزين المؤقت (Port 6379)
- `postgres` - قاعدة بيانات (Port 5432)
- `nginx` - Reverse Proxy (Port 80/443)

**الملفات:**
- `Dockerfile` - Multi-stage build
- `docker-compose.yml` - تكوين الخدمات
- `nginx.conf` - إعدادات Nginx
- `.dockerignore` - الملفات المستبعدة

---

### 3️⃣ جودة الكود - ESLint & Prettier

**الاستخدام:**
```bash
# فحص الكود
npm run lint

# تنسيق الكود
npm run format

# التحقق من التنسيق
npm run format:check

# فحص الأنواع
npm run type-check
```

**الميزات:**
- ترتيب تلقائي للـ imports
- قواعد TypeScript محسّنة
- دعم Prettier integration
- قواعد مخصصة للاختبارات

**الملفات:**
- `.eslintrc.json` - قواعد ESLint
- `.prettierrc.json` - إعدادات Prettier
- `.prettierignore` - الملفات المستبعدة

---

### 4️⃣ تحليل الحزم - Bundle Analysis

**الاستخدام:**
```bash
# تحليل أحجام الحزم
npm run analyze

# التحقق من الحدود
npm run check:size
```

**حدود الحجم:**
- CLI: 2 MB
- Desktop: 5 MB
- Cloud Editor: 3 MB

**الملفات:**
- `scripts/analyze-bundle.js` - تحليل مفصل
- `scripts/check-bundle-size.js` - فحص الحدود

---

### 5️⃣ Task Runner - Taskfile & Makefile

**الاستخدام (Task):**
```bash
# عرض الأوامر المتاحة
task

# تثبيت
task install

# تطوير
task dev

# بناء
task build

# اختبار
task test

# CI كامل
task ci

# تجهيز للنشر
task release
```

**الاستخدام (Make):**
```bash
# عرض المساعدة
make help

# نفس الأوامر مع Make
make install
make dev
make build
```

**الملفات:**
- `Taskfile.yml` - Task runner config
- `Makefile` - Alternative for make

---

### 6️⃣ مراقبة الأخطاء - Sentry

**الإعداد:**
```bash
# في .env
SENTRY_DSN=your-sentry-dsn
SENTRY_ORG=your-org
SENTRY_PROJECT=oqool
```

**الاستخدام في الكود:**
```typescript
import { initSentry, captureError } from '@oqool/shared/sentry';

// تهيئة
initSentry({
  dsn: process.env.SENTRY_DSN,
  environment: 'production',
  release: '1.0.0',
});

// التقاط الأخطاء
try {
  // code
} catch (error) {
  captureError(error, { context: 'additional info' });
}
```

**الملفات:**
- `packages/shared/sentry.ts` - إعداد Sentry
- `sentry.config.js` - تكوين البناء
- `.github/workflows/sentry-release.yml` - أتمتة النشر

---

### 7️⃣ GitHub Actions & Git Automation

**Workflows:**

1. **CI** (`.github/workflows/ci.yml`)
   - يعمل على: Push & Pull Requests
   - الخطوات: Lint → Type Check → Test → Build

2. **Release** (`.github/workflows/release.yml`)
   - يعمل على: Tags (v*)
   - الخطوات: Build → Test → Create Release → Publish

3. **Docker Publish** (`.github/workflows/docker-publish.yml`)
   - يعمل على: Push to main & Tags
   - ينشر على: GitHub Container Registry

4. **Sentry Release** (`.github/workflows/sentry-release.yml`)
   - يعمل على: Tags (v*)
   - ينشر source maps إلى Sentry

**Git Hooks (Husky):**

```bash
# تفعيل Husky
npm run prepare

# Pre-commit hook
# يشغل: lint + type-check + check:size

# Commit-msg hook
# يتحقق من: Conventional Commits format
# مثال: feat(cli): add new command
```

**صيغ الـ Commits المقبولة:**
- `feat(scope): message` - ميزة جديدة
- `fix(scope): message` - إصلاح خطأ
- `docs(scope): message` - توثيق
- `refactor(scope): message` - إعادة هيكلة
- `test(scope): message` - اختبارات
- `chore(scope): message` - مهام عامة
- `ci(scope): message` - CI/CD

---

## 🚀 سير العمل الموصى به

### للتطوير:
```bash
# 1. تثبيت
npm install

# 2. تطوير
task dev  # أو npm run dev

# 3. فحص قبل الكوميت
npm run precommit
```

### للبناء والنشر:
```bash
# 1. بناء
task build

# 2. اختبار
task test

# 3. تحليل
npm run analyze

# 4. CI كامل
task ci

# 5. نشر مع Docker
task docker:build
task docker:up
```

### للمراقبة:
```bash
# PM2 monitoring
npm run pm2:monit

# Docker logs
npm run docker:logs

# Sentry Dashboard
# زيارة sentry.io
```

---

## 📊 أدوات إضافية مقترحة

### للتثبيت يدوياً (اختياري):

1. **GitHub CLI (gh)**
```bash
# Ubuntu/Debian
sudo apt install gh

# macOS
brew install gh

# الاستخدام
gh auth login
gh pr create
gh issue list
```

2. **Task (Task Runner)**
```bash
# Ubuntu/Debian
sudo snap install task --classic

# macOS
brew install go-task/tap/go-task
```

3. **GPU Monitoring (للـ ML/AI)**
```bash
# nvitop
pip install nvitop

# gpustat
pip install gpustat
```

4. **ngrok (للـ tunneling)**
```bash
# تحميل من ngrok.com
brew install ngrok  # macOS
```

---

## 🔧 متغيرات البيئة

انسخ `.env.example` إلى `.env` وقم بتعديل القيم:

```bash
cp .env.example .env
```

**المتغيرات المطلوبة:**
- `ANTHROPIC_API_KEY` - Claude API
- `DEEPSEEK_API_KEY` - DeepSeek API
- `OPENAI_API_KEY` - OpenAI API (اختياري)
- `SENTRY_DSN` - Sentry monitoring
- `DB_PASSWORD` - Database password

---

## 📝 ملاحظات

1. **PM2** مناسب للإنتاج على الخادم
2. **Docker** مناسب للعزل والنشر السحابي
3. **GitHub Actions** يعمل تلقائياً على كل push/tag
4. **Husky** يتحقق من الكود قبل كل commit
5. **Sentry** يراقب الأخطاء في الإنتاج

---

## 🆘 استكشاف الأخطاء

### مشكلة: Husky لا يعمل
```bash
npm run prepare
chmod +x .husky/pre-commit
chmod +x .husky/commit-msg
```

### مشكلة: Docker build فشل
```bash
docker system prune -a
npm run docker:build
```

### مشكلة: PM2 لا يبدأ
```bash
pm2 kill
pm2 flush
npm run pm2:start
```

---

تم! جميع الأدوات جاهزة للاستخدام.
