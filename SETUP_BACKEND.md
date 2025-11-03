# 🖥️ إعداد Backend Server لـ Oqool

## 📋 المتطلبات

1. Node.js >= 18
2. MongoDB أو PostgreSQL (اختياري)
3. Domain أو IP عام (للاستخدام السحابي)

---

## 🚀 طريقة 1: استخدام Backend محلي

### 1. إنشاء Backend بسيط

```bash
mkdir oqool-backend
cd oqool-backend
npm init -y
npm install express cors dotenv @anthropic-ai/sdk
```

### 2. إنشاء `server.js`

```javascript
// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// Endpoint للمحادثة
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    const response = await anthropic.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 8192,
      messages
    });

    res.json({
      success: true,
      message: response.content[0].text,
      usedProvider: 'claude'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Endpoint للحالة
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Oqool Backend running on http://localhost:${PORT}`);
});
```

### 3. تشغيل Backend

```bash
# في terminal منفصل
cd oqool-backend
node server.js
```

### 4. تحديث Oqool CLI للاستخدام Backend

```bash
cd /media/amir/MO881/oqool-monorepo

# تسجيل الدخول مع backend محلي
node packages/cli/dist/index.js login --url http://localhost:3000 your-api-key
```

---

## 🌍 طريقة 2: استخدام Backend سحابي

### خيارات Deploy:

#### A. Vercel (مجاني)
```bash
npm install -g vercel
cd oqool-backend
vercel deploy
```

#### B. Railway (مجاني)
1. اذهب إلى https://railway.app
2. أنشئ مشروع جديد
3. ارفع الكود
4. سيعطيك URL مثل: `https://your-app.up.railway.app`

#### C. Render (مجاني)
1. اذهب إلى https://render.com
2. أنشئ Web Service
3. ربط مع GitHub
4. Deploy تلقائي

---

## ⚙️ التكوين بعد Deploy

```bash
# في Oqool CLI
node packages/cli/dist/index.js login --url https://your-backend.com your-api-key
```

---

## ❓ هل تحتاج Backend؟

### ✅ نعم، إذا كنت تريد:
- مشاركة حساب مع الفريق
- تتبع الاستخدام والتكاليف
- Rate limiting مخصص
- تخزين المحادثات في قاعدة بيانات

### ❌ لا، إذا كنت:
- تستخدم CLI بشكل فردي (الوضع الحالي)
- لديك API Keys مباشرة
- تريد استخدام بسيط وسريع

---

## 💡 التوصية الحالية

**الإبقاء على الوضع الحالي (dev_mode)** لأنه:
- ✅ يعمل مباشرة مع Claude API
- ✅ لا يحتاج backend server
- ✅ أسرع وأبسط
- ✅ جميع الميزات متاحة

فقط استخدم:
```bash
node packages/cli/dist/index.js generate "your prompt"
node packages/cli/dist/index.js chat
```

ويعمل مباشرة! ✨
