# 🎯 دليل Commitizen - Professional Commits Guide

**التاريخ**: 2025-11-04
**الحالة**: ✅ مُفعّل

---

## 📋 جدول المحتويات

1. [ما هو Commitizen؟](#what-is-commitizen)
2. [التثبيت](#installation)
3. [الاستخدام](#usage)
4. [أنواع Commits](#commit-types)
5. [أمثلة](#examples)
6. [Commit Hooks](#hooks)
7. [Best Practices](#best-practices)

---

## 🤔 ما هو Commitizen؟ {#what-is-commitizen}

**Commitizen** هو أداة تساعدك على كتابة رسائل commit احترافية ومتسقة باستخدام معيار **Conventional Commits**.

### الفوائد:
- ✅ رسائل commit منظمة ومتسقة
- ✅ توليد CHANGELOG تلقائياً
- ✅ Semantic Versioning تلقائي
- ✅ التحقق من صحة الرسائل
- ✅ تحسين التعاون بين المطورين
- ✅ سهولة تتبع التغييرات

---

## 📦 التثبيت {#installation}

تم التثبيت بالفعل! المكتبات المثبتة:

```json
{
  "commitizen": "^4.3.1",
  "cz-conventional-changelog": "^3.3.0",
  "@commitlint/cli": "^20.1.0",
  "@commitlint/config-conventional": "^20.0.0",
  "husky": "^9.1.7"
}
```

---

## 🚀 الاستخدام {#usage}

### الطريقة الأولى: npm run commit

بدلاً من `git commit`، استخدم:

```bash
# إضافة الملفات
git add .

# استخدام commitizen
npm run commit
```

سيظهر لك معالج تفاعلي:

```
? Select the type of change that you're committing: (Use arrow keys)
❯ feat:     A new feature
  fix:      A bug fix
  docs:     Documentation only changes
  style:    Changes that do not affect the meaning of the code
  refactor: A code change that neither fixes a bug nor adds a feature
  perf:     A code change that improves performance
  test:     Adding missing tests or correcting existing tests
```

### الطريقة الثانية: git cz

```bash
git add .
git cz
```

---

## 📝 أنواع Commits {#commit-types}

### 1. **feat** - ميزة جديدة
استخدم عند إضافة ميزة جديدة.

```bash
feat: add Arabic text normalization
feat(cli): add new command for text processing
```

### 2. **fix** - إصلاح خطأ
استخدم عند إصلاح bug.

```bash
fix: resolve RTL text display issue
fix(desktop): fix electron build error
```

### 3. **docs** - توثيق
استخدم عند تحديث التوثيق فقط.

```bash
docs: update README with Arabic tools
docs(api): add JSDoc comments
```

### 4. **style** - تنسيق
استخدم للتغييرات التي لا تؤثر على المعنى (مسافات، فواصل، إلخ).

```bash
style: format code with prettier
style: fix indentation
```

### 5. **refactor** - إعادة هيكلة
استخدم عند إعادة كتابة الكود دون تغيير الوظيفة.

```bash
refactor: simplify Arabic text validation
refactor(core): extract common utilities
```

### 6. **perf** - تحسين الأداء
استخدم عند تحسين الأداء.

```bash
perf: optimize text normalization algorithm
perf(cache): implement LRU cache
```

### 7. **test** - اختبارات
استخدم عند إضافة أو تعديل الاختبارات.

```bash
test: add unit tests for Arabic utils
test(e2e): add integration tests
```

### 8. **build** - بناء
استخدم للتغييرات في نظام البناء أو dependencies.

```bash
build: update typescript to 5.3
build(deps): upgrade electron to 28.0
```

### 9. **ci** - CI/CD
استخدم للتغييرات في ملفات CI/CD.

```bash
ci: add GitHub Actions workflow
ci(deploy): update deployment script
```

### 10. **chore** - مهام
استخدم للمهام الأخرى التي لا تعدل الكود المصدري.

```bash
chore: update .gitignore
chore(deps): update dev dependencies
```

### 11. **revert** - تراجع
استخدم عند التراجع عن commit سابق.

```bash
revert: revert "feat: add feature X"
```

---

## 💡 أمثلة {#examples}

### مثال 1: إضافة ميزة جديدة

```bash
git add packages/shared/src/utils/arabic-text.ts
npm run commit

# في المعالج:
? Type: feat
? Scope: shared
? Subject: add comprehensive Arabic text utilities
? Body: - Add 15+ functions for Arabic text processing
       - Support BiDi, normalization, transliteration
       - Include type definitions
? Breaking changes: No
? Affects open issues: No
```

**الناتج**:
```
feat(shared): add comprehensive Arabic text utilities

- Add 15+ functions for Arabic text processing
- Support BiDi, normalization, transliteration
- Include type definitions
```

### مثال 2: إصلاح bug

```bash
git add packages/desktop/electron/main.ts
npm run commit

# في المعالج:
? Type: fix
? Scope: desktop
? Subject: resolve electron build entry point error
? Body: Fix package.json main path to point to dist/electron/main.js
? Breaking changes: No
? Affects open issues: Closes #42
```

**الناتج**:
```
fix(desktop): resolve electron build entry point error

Fix package.json main path to point to dist/electron/main.js

Closes #42
```

### مثال 3: تحديث التوثيق

```bash
git add docs/ARABIC_TEXT_UTILITIES.md
npm run commit

# في المعالج:
? Type: docs
? Scope:
? Subject: add comprehensive Arabic text utilities documentation
? Body: - 700+ lines of bilingual documentation
       - 15+ practical examples
       - Complete API reference
? Breaking changes: No
? Affects open issues: No
```

**الناتج**:
```
docs: add comprehensive Arabic text utilities documentation

- 700+ lines of bilingual documentation
- 15+ practical examples
- Complete API reference
```

### مثال 4: Breaking Change

```bash
npm run commit

# في المعالج:
? Type: feat
? Scope: api
? Subject: redesign API interface
? Body: Complete API redesign with new method signatures
? Breaking changes: Yes
? Breaking changes description:
  BREAKING CHANGE: API methods now return Promises instead of sync values
? Affects open issues: No
```

**الناتج**:
```
feat(api): redesign API interface

Complete API redesign with new method signatures

BREAKING CHANGE: API methods now return Promises instead of sync values
```

---

## 🪝 Commit Hooks {#hooks}

تم إعداد **husky** للتحقق من رسائل commit تلقائياً.

### commit-msg Hook

يتحقق من أن رسالة commit تتبع معيار Conventional Commits:

```bash
# ✅ صحيح
git commit -m "feat: add new feature"

# ❌ خطأ - سيتم رفضه
git commit -m "added new feature"
# Error: subject may not be empty
```

### pre-commit Hook (اختياري)

يمكن إضافة فحوصات قبل الـ commit:

```bash
# .husky/pre-commit
npm run lint
npm run format
npm test
```

---

## ✅ Best Practices {#best-practices}

### 1. اكتب رسائل واضحة ومختصرة

```bash
# ✅ جيد
feat: add user authentication

# ❌ سيء
feat: add stuff
```

### 2. استخدم Scope للتوضيح

```bash
# ✅ جيد
feat(cli): add new command
fix(desktop): resolve window sizing

# ⚠️ مقبول لكن أقل وضوحاً
feat: add new command
fix: resolve window sizing
```

### 3. اشرح "لماذا" وليس "ماذا"

```bash
# ✅ جيد
fix(auth): handle expired tokens correctly

Users were getting logged out unexpectedly because
expired tokens weren't being refreshed properly.

# ❌ سيء
fix: update auth code
```

### 4. استخدم Body للتفاصيل

```bash
feat(api): implement caching layer

- Add Redis-based cache
- Cache frequently accessed data
- Reduce database load by 40%
- Configurable TTL per endpoint
```

### 5. اربط بالـ Issues

```bash
fix(ui): resolve modal z-index conflict

Closes #123
Refs #124, #125
```

### 6. استخدم Breaking Changes بحذر

```bash
feat(api)!: redesign authentication API

BREAKING CHANGE: Authentication endpoints now require
Bearer token instead of API key. Update your clients
to use the new format: Authorization: Bearer <token>

Migration guide: docs/MIGRATION.md
```

### 7. Commits صغيرة ومركزة

```bash
# ✅ جيد - commits منفصلة
git commit -m "feat: add Arabic normalization"
git commit -m "feat: add Arabic transliteration"
git commit -m "docs: update Arabic utils docs"

# ❌ سيء - commit واحدة كبيرة
git commit -m "feat: add all Arabic features and docs"
```

---

## 🎨 أمثلة من المشروع الحالي

### الـ commits الأخيرة:

```bash
✨ e0ad2f6 - docs: تقرير إكمال أدوات النصوص العربية
📚 1034782 - docs: إضافة توثيق شامل لأدوات النصوص العربية
✨ ec2d60d - feat: إضافة أدوات النصوص العربية الشاملة
🛠️ c6c3659 - chore: إضافة أدوات التطوير والأتمتة الكاملة
✅ f51a3d0 - fix: إصلاح شامل 100% من Core Systems
```

### يمكن تحسينها إلى:

```bash
docs(reports): add Arabic tools completion report
docs(arabic): add comprehensive utilities documentation
feat(shared): add comprehensive Arabic text utilities
chore(tools): setup development and automation tools
fix(core): resolve all type conflicts (100% systems working)
```

---

## 🔧 التكوين

### package.json

```json
{
  "scripts": {
    "commit": "cz",
    "prepare": "husky"
  },
  "config": {
    "commitizen": {
      "path": "cz-conventional-changelog"
    }
  }
}
```

### commitlint.config.js

```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', 'fix', 'docs', 'style', 'refactor',
        'perf', 'test', 'build', 'ci', 'chore', 'revert'
      ]
    ],
    'subject-case': [0], // السماح بالعربية
    'header-max-length': [2, 'always', 100]
  }
};
```

---

## 📊 فوائد Conventional Commits

### 1. CHANGELOG التلقائي

```bash
# استخدام standard-version أو semantic-release
npm install --save-dev standard-version

# توليد CHANGELOG
npm run release
```

**CHANGELOG.md**:
```markdown
## [2.0.0] - 2025-11-04

### Features
* **shared**: add comprehensive Arabic text utilities

### Bug Fixes
* **desktop**: resolve electron build entry point error

### Documentation
* add comprehensive Arabic text utilities documentation

### BREAKING CHANGES
* **api**: API methods now return Promises
```

### 2. Semantic Versioning التلقائي

```bash
feat:     → 1.0.0 → 1.1.0  (minor)
fix:      → 1.0.0 → 1.0.1  (patch)
BREAKING: → 1.0.0 → 2.0.0  (major)
```

### 3. تصفية Commits

```bash
# عرض جميع الميزات
git log --oneline --grep="^feat"

# عرض جميع الإصلاحات
git log --oneline --grep="^fix"

# عرض التغييرات في scope معين
git log --oneline --grep="^.*\(cli\)"
```

---

## 🚨 الأخطاء الشائعة

### خطأ 1: نسيان النوع

```bash
# ❌ خطأ
git commit -m "add new feature"

# ✅ صحيح
git commit -m "feat: add new feature"
```

### خطأ 2: استخدام صيغة الماضي

```bash
# ❌ خطأ
git commit -m "feat: added new feature"

# ✅ صحيح
git commit -m "feat: add new feature"
```

### خطأ 3: Subject طويل

```bash
# ❌ خطأ
git commit -m "feat: add a very long feature description that exceeds the maximum allowed character limit"

# ✅ صحيح
git commit -m "feat: add comprehensive feature

Detailed description goes in the body,
not in the subject line."
```

### خطأ 4: نوع خاطئ

```bash
# ❌ خطأ
git commit -m "feature: add new feature"

# ✅ صحيح
git commit -m "feat: add new feature"
```

---

## 🎓 الخلاصة

### الأوامر الأساسية:

```bash
# 1. إضافة الملفات
git add .

# 2. استخدام commitizen
npm run commit

# 3. Push
git push
```

### القواعد الذهبية:

1. ✅ استخدم **npm run commit** بدلاً من git commit
2. ✅ اختر **النوع المناسب** (feat, fix, docs, etc.)
3. ✅ اكتب **subject واضح** ومختصر
4. ✅ أضف **body للتفاصيل**
5. ✅ اربط بـ **Issues** عند الحاجة
6. ✅ استخدم **Breaking Changes** عند الضرورة

---

## 📞 المراجع

- **Conventional Commits**: https://www.conventionalcommits.org/
- **Commitizen**: https://github.com/commitizen/cz-cli
- **Commitlint**: https://commitlint.js.org/
- **Husky**: https://typicode.github.io/husky/

---

**تم الإنشاء**: 2025-11-04
**الحالة**: ✅ جاهز للاستخدام

🤖 Generated with [Claude Code](https://claude.com/claude-code)
