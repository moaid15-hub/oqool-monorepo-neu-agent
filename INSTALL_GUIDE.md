# 🚀 دليل تنصيب أدوات Claude و AI Coding

## 🤔 ماذا تريد تنصيب؟

---

## 1️⃣ **Claude Code (من Anthropic)**

### التنصيب على Linux:

```bash
# الطريقة 1: باستخدام npm (موصى به)
npm install -g @anthropic-ai/claude-code

# الطريقة 2: باستخدام npx (بدون تنصيب)
npx @anthropic-ai/claude-code

# الطريقة 3: تحميل مباشر
curl -fsSL https://raw.githubusercontent.com/anthropics/claude-code/main/install.sh | bash
```

### الاستخدام:
```bash
# تشغيل Claude Code
claude-code

# مع ملف محدد
claude-code your-file.py

# في مجلد محدد
claude-code /path/to/project
```

### الإعداد:
```bash
# إضافة API Key
export ANTHROPIC_API_KEY="sk-ant-api03-..."

# أو في .bashrc
echo 'export ANTHROPIC_API_KEY="sk-ant-api03-..."' >> ~/.bashrc
```

---

## 2️⃣ **Cursor IDE (محرر كود بالذكاء الاصطناعي)**

### التنصيب على Linux:

```bash
# تحميل .AppImage
wget https://download.cursor.sh/linux/appImage/x64 -O cursor.AppImage

# إعطاء صلاحيات التشغيل
chmod +x cursor.AppImage

# تشغيل
./cursor.AppImage
```

### أو باستخدام Snap:
```bash
sudo snap install cursor --classic
```

### أو باستخدام .deb:
```bash
# تحميل
wget https://download.cursor.sh/linux/debian/x64 -O cursor.deb

# تنصيب
sudo dpkg -i cursor.deb
sudo apt-get install -f
```

### التشغيل:
```bash
cursor
# أو
cursor /path/to/project
```

---

## 3️⃣ **Coder (Cloud IDE)**

### تنصيب Coder Server:

```bash
# تحميل وتنصيب
curl -fsSL https://coder.com/install.sh | sh

# تشغيل
coder server
```

### أو باستخدام Docker:
```bash
docker run -it --rm \
  -p 3000:3000 \
  -v ~/.config:/home/coder/.config \
  codercom/code-server:latest
```

---

## 4️⃣ **Oqool CLI (المشروع الحالي)**

### التنصيب من المشروع:

```bash
# الانتقال للمشروع
cd /media/amir/MO881/oqool-monorepo

# تنصيب Dependencies
npm install

# بناء المشروع
cd packages/shared && npm run build
cd ../cli && npm run build

# إنشاء alias للاستخدام السريع
echo 'alias oqool="node /media/amir/MO881/oqool-monorepo/packages/cli/dist/index.js"' >> ~/.bashrc
source ~/.bashrc

# الاستخدام
oqool generate "your prompt"
oqool chat
```

### أو التنصيب عالمياً (npm link):
```bash
cd /media/amir/MO881/oqool-monorepo/packages/cli
npm link

# الاستخدام في أي مكان
oqool status
```

---

## 5️⃣ **Continue.dev (VS Code Extension)**

### للـ VS Code:
```bash
# تنصيب VS Code أولاً
sudo snap install code --classic

# ثم من VS Code
# Extensions → Search "Continue" → Install
```

### أو من Terminal:
```bash
code --install-extension Continue.continue
```

### الإعداد:
```json
// في ~/.continue/config.json
{
  "models": [{
    "provider": "anthropic",
    "model": "claude-3-5-haiku-20241022",
    "apiKey": "sk-ant-api03-..."
  }]
}
```

---

## 🎯 التوصية حسب الاستخدام

### للبرمجة العامة:
```bash
# Cursor (الأفضل والأسهل)
wget https://download.cursor.sh/linux/appImage/x64 -O cursor.AppImage
chmod +x cursor.AppImage
./cursor.AppImage
```

### لـ Terminal فقط:
```bash
# Oqool CLI (المشروع الحالي)
cd /media/amir/MO881/oqool-monorepo
bash START_HERE.sh
```

### لـ VS Code:
```bash
# Continue Extension
code --install-extension Continue.continue
```

---

## 🔧 التحقق من التنصيب

```bash
# Claude Code
claude-code --version

# Cursor
cursor --version

# Coder
coder version

# Oqool
oqool status
```

---

## 📝 الإعداد الأولي

### 1. إعداد API Keys:

```bash
# في .bashrc أو .zshrc
export ANTHROPIC_API_KEY="sk-ant-api03-iWwHA5niIIhqhPrs7yvxncE..."
export GEMINI_API_KEY="AIzaSyDSkXfyJbFxv3U-Ctin36QlOpSIHaAQG1M"
export DEEPSEEK_API_KEY="sk-ed4efd58cd314c119a3e0b98ebc91ac0"
export OPENAI_API_KEY="sk-proj-BtdsgjkmEUKgLH3X..."

# حفظ
source ~/.bashrc
```

### 2. اختبار الاتصال:

```bash
# Claude Code
echo "print('Hello')" | claude-code

# Oqool
node packages/cli/dist/index.js generate "say hello"
```

---

## 🆘 حل المشاكل

### مشكلة: "command not found"
```bash
# تأكد من المسار
which claude-code
which cursor

# أضف إلى PATH
export PATH="$PATH:/path/to/bin"
```

### مشكلة: "permission denied"
```bash
# أعطِ صلاحيات
chmod +x cursor.AppImage
chmod +x /usr/local/bin/claude-code
```

### مشكلة: "API key not found"
```bash
# تحقق من المتغيرات
echo $ANTHROPIC_API_KEY

# إذا فارغ، أضف:
export ANTHROPIC_API_KEY="your-key-here"
```

---

## 🎁 بونص: Aliases مفيدة

```bash
# أضف لـ ~/.bashrc
alias oqool='node /media/amir/MO881/oqool-monorepo/packages/cli/dist/index.js'
alias claude='npx @anthropic-ai/claude-code'
alias ai-chat='oqool chat'
alias ai-gen='oqool generate'

# حفظ
source ~/.bashrc

# الاستخدام
ai-gen "create a function"
ai-chat
```

---

## 📊 المقارنة

| الأداة | النوع | السعر | الأفضل لـ |
|--------|-------|-------|----------|
| **Cursor** | IDE كامل | $20/شهر | البرمجة العامة |
| **Claude Code** | CLI | مجاني + API | Terminal |
| **Continue** | Extension | مجاني + API | VS Code |
| **Oqool** | CLI محلي | مجاني + API | CLI مخصص |

---

## ✅ أيهم تختار؟

### إذا كنت تحب VS Code:
→ **Continue Extension**

### إذا تريد IDE قوي:
→ **Cursor**

### إذا تحب Terminal:
→ **Oqool CLI** أو **Claude Code**

### إذا تريد أفضل تجربة:
→ **Cursor** (الأكثر تكاملاً)

---

**اختر ما يناسبك وأخبرني لأساعدك في التنصيب!** 🚀
