# 🚀 البدء السريع | Quick Start

## الأوامر الأساسية

```bash
# 1️⃣ التثبيت
npm install

# 2️⃣ التطوير
npm run dev              # جميع الحزم
npm run dev:cli          # CLI فقط
npm run dev:cloud        # Cloud Editor فقط

# 3️⃣ البناء
npm run build            # بناء الكل
npm run build:cli        # CLI فقط

# 4️⃣ الاختبار
npm test                 # تشغيل الاختبارات
npm run test:watch       # وضع المراقبة

# 5️⃣ جودة الكود
npm run lint             # فحص الكود
npm run format           # تنسيق الكود
npm run type-check       # فحص الأنواع
```

## أوامر Docker

```bash
# بناء وتشغيل
npm run docker:build
npm run docker:up

# المراقبة
npm run docker:logs

# الإيقاف
npm run docker:down
```

## أوامر PM2 (للإنتاج)

```bash
# تشغيل
npm run pm2:start

# مراقبة
npm run pm2:monit

# اللوجات
npm run pm2:logs
```

## Task Runner (أسرع)

```bash
# عرض الأوامر
task

# تطوير
task dev

# بناء
task build

# CI كامل
task ci
```

## قبل الـ Commit

```bash
npm run precommit
```

سيتم تشغيل: lint + type-check + size check

## المزيد من التفاصيل

راجع `TOOLS_SETUP.md` للشرح الكامل
