# 🔐 أوامر إدارة الحساب في Oqool

## 1️⃣ عرض حالة الحساب الحالي

```bash
# من داخل المجلد
cd /media/amir/MO881/oqool-monorepo
node packages/cli/dist/index.js status
```

---

## 2️⃣ تسجيل الدخول (Login)

### الطريقة الأولى: بدون API Key (يستخدم .env)

```bash
node packages/cli/dist/index.js login
```

سيستخدم `ANTHROPIC_API_KEY` من ملف `.env`

### الطريقة الثانية: مع API Key مباشرة

```bash
node packages/cli/dist/index.js login YOUR_API_KEY_HERE
```

### الطريقة الثالثة: مع URL مخصص

```bash
node packages/cli/dist/index.js login --url https://custom-backend.com YOUR_API_KEY
```

---

## 3️⃣ تسجيل الخروج (Logout)

```bash
node packages/cli/dist/index.js logout
```

يحذف جميع بيانات الحساب المحفوظة

---

## 4️⃣ التحقق من إعدادات API الحالية

```bash
# عرض محتوى .env
cat .env | grep API_KEY
```

النتيجة المتوقعة:

```
GEMINI_API_KEY=AIzaSy...
ANTHROPIC_API_KEY=sk-ant-api03-...
DEEPSEEK_API_KEY=sk-ed4ef...
OPENAI_API_KEY=sk-proj-...
```

---

## 5️⃣ إنشاء حساب جديد

### ⚠️ ملاحظة مهمة:

Oqool CLI **لا يحتاج حساب منفصل**! يعمل مباشرة مع:

1. **Claude API** (Anthropic)
2. **Gemini API** (Google)
3. **DeepSeek API**
4. **OpenAI API**

### خطوات الحصول على API Keys:

#### 🔹 Claude (Anthropic) - لديك بالفعل ✅

```
✅ موجود في .env
ANTHROPIC_API_KEY=sk-ant-api03-iWwHA5niIIhqhPrs...
```

#### 🔹 Gemini (Google) - لديك بالفعل ✅

```
✅ موجود في .env
GEMINI_API_KEY=AIzaSyDSkXfyJbFxv3U-Ctin36QlOpSIHaAQG1M
```

#### 🔹 DeepSeek - لديك بالفعل ✅

```
✅ موجود في .env
DEEPSEEK_API_KEY=sk-ed4efd58cd314c119a3e0b98ebc91ac0
```

#### 🔹 OpenAI - لديك بالفعل ✅

```
✅ موجود في .env
OPENAI_API_KEY=sk-proj-BtdsgjkmEUKgLH3X...
```

---

## 6️⃣ اختبار الاتصال

```bash
# اختبار Claude
node packages/cli/dist/index.js generate "say hello"

# اختبار جميع المزودين
node test-claude-models.mjs
```

---

## 7️⃣ الأوامر السريعة

```bash
# الدخول للمجلد
cd /media/amir/MO881/oqool-monorepo

# عرض الحالة
node packages/cli/dist/index.js status

# بدء المحادثة
node packages/cli/dist/index.js chat

# توليد كود
node packages/cli/dist/index.js generate "اكتب دالة تجمع رقمين"

# عرض بنية المشروع
node packages/cli/dist/index.js structure

# تحليل ملف
node packages/cli/dist/index.js analyze file.js
```

---

## 8️⃣ إنشاء اختصار (Optional)

### في Linux/Mac:

```bash
# إضافة للـ .bashrc أو .zshrc
echo 'alias oqool="node /media/amir/MO881/oqool-monorepo/packages/cli/dist/index.js"' >> ~/.bashrc
source ~/.bashrc

# الآن يمكنك استخدام:
oqool status
oqool chat
oqool generate "your prompt"
```

### في Windows:

```powershell
# إنشاء ملف oqool.bat في مجلد في PATH
@echo off
node "C:\path\to\oqool-monorepo\packages\cli\dist\index.js" %*
```

---

## 9️⃣ معلومات حسابك الحالي

### API Keys المتوفرة:

- ✅ Claude (Anthropic) - 8 نماذج متاحة
- ✅ Gemini (Google)
- ✅ DeepSeek
- ✅ OpenAI

### النماذج المتاحة في حساب Claude:

1. Claude Sonnet 4.5 (الأحدث)
2. Claude Haiku 4.5 (سريع)
3. Claude Opus 4.1 (قوي)
4. Claude Sonnet 4
5. Claude Opus 4
6. Claude 3.7 Sonnet (سريع جداً)
7. Claude 3.5 Haiku (**مستخدم حالياً**)
8. Claude 3 Haiku (الأسرع)

---

## 🔟 التحقق من الرصيد

### Claude:

https://console.anthropic.com/settings/billing

### OpenAI:

https://platform.openai.com/account/billing

### DeepSeek:

https://platform.deepseek.com/usage

### Gemini:

https://aistudio.google.com/app/apikey

---

## ⚡ أمثلة عملية

```bash
# 1. توليد API client
node packages/cli/dist/index.js generate "Create a REST API client with axios"

# 2. محادثة تفاعلية
node packages/cli/dist/index.js chat

# 3. تحليل مشروع
node packages/cli/dist/index.js analyze packages/cli/src/*.ts

# 4. إنشاء مشروع من قالب
node packages/cli/dist/index.js template-create react-app my-new-app

# 5. عرض جميع القوالب
node packages/cli/dist/index.js templates
```

---

## 🆘 حل المشاكل

### مشكلة: "ANTHROPIC_API_KEY غير موجود"

```bash
# تحقق من .env
cat .env | grep ANTHROPIC

# إذا فارغ، أضف:
echo 'ANTHROPIC_API_KEY=sk-ant-api03-...' >> .env
```

### مشكلة: "404 model not found"

```bash
# اختبر النماذج المتاحة
node test-claude-models.mjs

# ثم حدّث النموذج في الملفات حسب النتيجة
```

### مشكلة: "command not found"

```bash
# استخدم المسار الكامل
node /media/amir/MO881/oqool-monorepo/packages/cli/dist/index.js status
```
