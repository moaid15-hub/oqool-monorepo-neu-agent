# 🚀 دليل الأدوات الحرجة | Critical Tools Guide

تم إضافة مجموعة قوية من الأدوات لتحسين الأداء والأمان والإنتاجية.

## 📦 الأدوات المضافة

### 1️⃣ CLI Performance Tools

#### **ripgrep** - بحث أسرع 100x من grep
```bash
# البحث في الكود
rg "pattern" /path

# البحث مع التجاهل التلقائي لـ node_modules
rg "TODO" .

# البحث في نوع ملفات معين
rg -t ts "interface"

# البحث مع السياق
rg -C 3 "error"
```

**التكوين:** `.ripgreprc`

#### **fd** - بحث الملفات أسرع 10x
```bash
# البحث عن ملفات
fd "filename"

# البحث عن امتدادات معينة
fd -e ts -e tsx

# تنفيذ أمر على النتائج
fd -e js -x prettier --write
```

**التكوين:** `.fdignore`

---

### 2️⃣ AI Development Tools

#### **Ollama** - AI محلي مجاني
```bash
# تشغيل Ollama
ollama serve

# تحميل نماذج
ollama pull llama3.2
ollama pull codellama

# استخدام النموذج
ollama run llama3.2 "Hello"
ollama run codellama "write a fibonacci function"

# API
curl http://localhost:11434/api/generate -d '{
  "model": "llama3.2",
  "prompt": "Hello"
}'
```

**في الكود:**
```typescript
import { getOllamaClient } from '@oqool/shared/ollama-client';

const ollama = getOllamaClient();

// توليد كود
const code = await ollama.generateCode('typescript', 'create a user class');

// مراجعة كود
const review = await ollama.reviewCode(code, 'typescript');

// شرح كود
const explanation = await ollama.explainCode(code, 'typescript');
```

**الأوامر:**
- `scripts/setup-ollama.sh` - إعداد وتحميل النماذج

**التوفير:**
- Claude API: ~$3/1M tokens
- Ollama: **$0 (مجاني!)** 💰

---

#### **Whisper** - Voice Interface
```bash
# تحويل صوت إلى نص
whisper audio.mp3

# مع تحديد اللغة
whisper audio.mp3 --language ar

# مع نموذج محدد
whisper audio.mp3 --model medium

# تسجيل صوتي
oqool-code voice cmd  # أمر صوتي
oqool-code voice chat # محادثة صوتية
```

**في الكود:**
```typescript
import { getWhisperClient } from '@oqool/shared/whisper-client';

const whisper = getWhisperClient();

// تحويل ملف صوتي
const result = await whisper.transcribe('audio.mp3');
console.log(result.text);

// التقاط أمر صوتي
const command = await whisper.captureVoiceCommand(5); // 5 ثواني
```

---

### 3️⃣ Git Integration Tools

#### **LazyGit** - Git TUI داخل IDE
```bash
# فتح LazyGit
lazygit

# أو من git
git visual
```

**الاختصارات:**
- `c` - Commit
- `P` - Push
- `p` - Pull
- `s` - Stash
- `d` - Discard changes
- `<space>` - Stage/Unstage
- `a` - Stage all

**التكوين:** `.config/lazygit/config.yml`

---

#### **git-delta** - Diffs أجمل
```bash
# يعمل تلقائياً مع git diff
git diff

# مقارنة side-by-side
git diff --side-by-side

# عرض log
git log -p
```

**التكوين:** `.gitconfig-delta`

---

### 4️⃣ Code Intelligence Tools

#### **tokei** - إحصائيات فورية
```bash
# عرض إحصائيات المشروع
tokei

# تنسيق JSON
tokei -o json

# لغات محددة
tokei -t TypeScript,JavaScript

# من CLI
oqool-code stats overview
oqool-code stats health
oqool-code stats score
```

---

#### **bat** - عرض ملفات محسّن
```bash
# عرض ملف
bat file.ts

# مع أرقام الأسطر
bat -n file.ts

# بدون decorations
bat -p file.ts

# دمج ملفات
bat file1.ts file2.ts
```

**التكوين:** `.config/bat/config`

---

### 5️⃣ Security Tools

#### **trivy** - فحص أمني شامل
```bash
# فحص المشروع
trivy fs .

# فحص Docker image
trivy image myimage:latest

# فحص الثغرات فقط
trivy fs --severity CRITICAL,HIGH .

# من CLI
oqool-code security vuln
oqool-code security vuln --docker myimage:latest
```

**التكوين:** `.trivyignore`

---

#### **gitleaks** - كشف الأسرار
```bash
# فحص المشروع
gitleaks detect

# فحص الملفات فقط (بدون git history)
gitleaks detect --no-git

# فحص commit محدد
gitleaks detect --log-opts="--since=1 week ago"

# من CLI
oqool-code security secrets
oqool-code security audit
oqool-code security score
```

**التكوين:** `.gitleaks.toml`

---

## 🚀 البدء السريع

### 1. التثبيت
```bash
cd /home/amir/Dokumente/oqool-monorepo

# تثبيت جميع الأدوات
chmod +x scripts/install-dev-tools.sh
./scripts/install-dev-tools.sh
```

### 2. إعداد Ollama
```bash
chmod +x scripts/setup-ollama.sh
./scripts/setup-ollama.sh
```

### 3. إعداد Git Tools
```bash
chmod +x scripts/setup-git-tools.sh
./scripts/setup-git-tools.sh
```

---

## 📊 أوامر CLI الجديدة

### Voice Commands
```bash
oqool-code voice transcribe audio.mp3
oqool-code voice cmd              # أمر صوتي
oqool-code voice chat             # محادثة صوتية
```

### Statistics
```bash
oqool-code stats overview
oqool-code stats languages
oqool-code stats health
oqool-code stats score
```

### Security
```bash
oqool-code security secrets
oqool-code security vuln
oqool-code security audit
oqool-code security score
```

---

## ⚙️ التكامل

### GitHub Actions
تم إضافة workflow للفحص الأمني التلقائي:
- `.github/workflows/security-scan.yml`

يعمل على:
- Push إلى main/develop
- Pull requests
- Weekly schedule (Mondays)

### Pre-commit Hooks
```bash
# يتم الفحص تلقائياً قبل كل commit:
# - Gitleaks (secrets)
# - ESLint
# - Type check
# - Bundle size
```

---

## 💰 التوفير المالي

### مقارنة التكاليف (لـ 1M tokens):

| الأداة | التكلفة السابقة | التكلفة الآن | التوفير |
|--------|-----------------|--------------|---------|
| **Ollama** | $3-15 (Claude) | **$0** | **100%** |
| **Whisper** | $0.006/min (API) | **$0** | **100%** |
| **ripgrep** | - | - | 100x أسرع |
| **fd** | - | - | 10x أسرع |

**التوفير السنوي المقدر:** $1,000+

---

## 🎯 حالات الاستخدام

### 1. Development Workflow
```bash
# البحث في الكود
rg "TODO" .

# عرض ملف
bat src/index.ts

# إحصائيات
tokei

# git workflow
git visual
```

### 2. AI-Powered Coding
```bash
# توليد كود محلياً
ollama run codellama "write a REST API endpoint"

# مراجعة كود
ollama run codellama "review this code: $(bat file.ts)"
```

### 3. Voice Commands
```bash
# أمر صوتي للبحث
oqool-code voice cmd
# > "search for all typescript files"

# محادثة مع AI
oqool-code voice chat
```

### 4. Security Audits
```bash
# فحص شامل
oqool-code security audit

# فحص سريع
gitleaks detect && trivy fs .
```

---

## 📚 موارد إضافية

- [Ollama Models](https://ollama.com/library)
- [Whisper Documentation](https://github.com/openai/whisper)
- [ripgrep Guide](https://github.com/BurntSushi/ripgrep/blob/master/GUIDE.md)
- [LazyGit Keybindings](https://github.com/jesseduffield/lazygit#keybindings)
- [Trivy Documentation](https://aquasecurity.github.io/trivy/)
- [Gitleaks Documentation](https://github.com/gitleaks/gitleaks)

---

## ✅ الخلاصة

تم إضافة **8 أدوات حرجة** لتحسين:
- ⚡ **الأداء**: 100x أسرع في البحث
- 💰 **التكلفة**: $0 بدلاً من $3-15/1M tokens
- 🔒 **الأمان**: فحص تلقائي للثغرات والأسرار
- 🎨 **الإنتاجية**: Git TUI, Voice commands, AI محلي

**كل شيء جاهز الآن!** 🎉
