# 🚀 كيفية تفعيل Computer Control Agent

## الطريقة الأساسية (خطوة بخطوة)

### 1️⃣ الاستيراد

```typescript
import { ComputerControlAgent } from '@oqool/shared/agents';
```

### 2️⃣ التفعيل الأساسي (أبسط طريقة)

```typescript
// التفعيل بأقل إعدادات
const agent = new ComputerControlAgent({
  apiKeys: {
    deepseek: process.env.DEEPSEEK_API_KEY, // أو أي مفتاح AI عندك
  },
});

// الآن الوكيل نشط! ✅
```

### 3️⃣ استخدامه مباشرة

```typescript
// تنفيذ أمر بسيط
await agent.execute({
  type: 'system-command',
  command: 'ls -la',
  level: 'safe',
  description: 'عرض الملفات',
});
```

---

## ⚙️ خيارات التفعيل

### الخيار 1: تفعيل بسيط (موصى به للبداية)

```typescript
const agent = new ComputerControlAgent({
  apiKeys: {
    deepseek: 'YOUR_KEY_HERE',
  },
});
```

### الخيار 2: تفعيل مع إعدادات أمان

```typescript
const agent = new ComputerControlAgent({
  apiKeys: {
    deepseek: 'YOUR_KEY_HERE',
  },
  securityPolicy: {
    allowedOperations: {
      fileOperations: {
        read: true,
        write: 'confirm', // يطلب تأكيد
        delete: 'confirm',
      },
    },
  },
});
```

### الخيار 3: تفعيل كامل مع كل الميزات

```typescript
const agent = new ComputerControlAgent({
  apiKeys: {
    deepseek: 'YOUR_KEY_HERE',
    claude: 'YOUR_CLAUDE_KEY', // اختياري
    openai: 'YOUR_OPENAI_KEY', // اختياري
  },
  provider: 'auto', // أو 'deepseek', 'claude', 'openai'
  workingDirectory: process.cwd(),
  logDirectory: '.oqool/logs',
  enableAutoStop: true, // إيقاف تلقائي عند مشاكل
  enableDeadManSwitch: true, // أمان إضافي
  deadManSwitchInterval: 30000, // 30 ثانية
});
```

---

## 🔑 الحصول على API Keys

### DeepSeek (موصى به - الأرخص)

1. اذهب إلى: https://platform.deepseek.com
2. سجل حساب
3. احصل على API Key
4. استخدمه في الكود

### Claude

1. اذهب إلى: https://console.anthropic.com
2. سجل حساب
3. احصل على API Key
4. استخدمه في الكود

### OpenAI

1. اذهب إلى: https://platform.openai.com
2. سجل حساب
3. احصل على API Key
4. استخدمه في الكود

---

## 📝 أمثلة تفعيل عملية

### مثال 1: تفعيل للاستخدام الشخصي

```typescript
import { ComputerControlAgent } from '@oqool/shared/agents';

// إنشاء وتفعيل
const agent = new ComputerControlAgent({
  apiKeys: {
    deepseek: process.env.DEEPSEEK_API_KEY,
  },
  workingDirectory: '/home/user/projects',
});

// استخدام فوري
await agent.execute({
  type: 'file-read',
  command: 'cat package.json',
  level: 'safe',
  description: 'قراءة package.json',
});

console.log('✅ الوكيل يعمل!');
```

### مثال 2: تفعيل للإنتاج (Production)

```typescript
import { ComputerControlAgent } from '@oqool/shared/agents';

const agent = new ComputerControlAgent({
  apiKeys: {
    deepseek: process.env.DEEPSEEK_API_KEY,
  },
  securityPolicy: {
    allowedOperations: {
      fileOperations: {
        read: true,
        write: 'confirm',
        delete: 'confirm',
      },
      systemOperations: {
        sudo: false, // ممنوع في الإنتاج
        installPackages: 'confirm',
      },
    },
    protectedPaths: ['/etc', '/System', '/home/*/.ssh'],
  },
  enableAutoStop: true,
  enableDeadManSwitch: true,
  logDirectory: '/var/log/oqool',
});

// إنشاء snapshot قبل أي عملية
const snapshot = await agent.createSnapshot('before-deploy');

try {
  await agent.executeTask('Deploy', async () => {
    // عمليات النشر
  });
} catch (error) {
  // استعادة في حالة الفشل
  await agent.restoreFromSnapshot(snapshot);
}
```

### مثال 3: تفعيل مع مراقبة

```typescript
import { ComputerControlAgent } from '@oqool/shared/agents';
import { createSystemMonitor } from '@oqool/shared/core';

// تفعيل الوكيل
const agent = new ComputerControlAgent({
  apiKeys: {
    deepseek: process.env.DEEPSEEK_API_KEY,
  },
});

// تفعيل المراقب
const monitor = createSystemMonitor({
  interval: 5000,
  alerts: {
    cpuThreshold: 80,
    memoryThreshold: 90,
  },
});

monitor.start();

// الربط بين الوكيل والمراقب
monitor.on('alert', async (alert) => {
  if (alert.severity === 'critical') {
    await agent.emergencyStop('soft', `High ${alert.type}`);
  }
});

console.log('✅ النظام الكامل يعمل!');
```

---

## 🧪 اختبار التفعيل

بعد التفعيل، جرب هذا الكود للتأكد:

```typescript
// 1. فحص حالة الوكيل
const isActive = agent.isAgentActive();
console.log('الوكيل نشط:', isActive); // يجب أن يكون: true

// 2. تنفيذ أمر بسيط
const result = await agent.execute({
  type: 'system-command',
  command: 'echo "Hello from Agent!"',
  level: 'safe',
  description: 'اختبار',
});

console.log('النتيجة:', result);

// 3. فحص السجل
const history = agent.getOperationHistory();
console.log('عدد العمليات:', history.length);

// إذا نجحت كل الخطوات = الوكيل يعمل بنجاح! ✅
```

---

## 🎯 ملف كامل جاهز للاستخدام

احفظ هذا في ملف `agent-test.ts`:

```typescript
import { ComputerControlAgent } from '@oqool/shared/agents';

async function main() {
  console.log('🚀 بدء تفعيل الوكيل...');

  // التفعيل
  const agent = new ComputerControlAgent({
    apiKeys: {
      deepseek: process.env.DEEPSEEK_API_KEY,
    },
    workingDirectory: process.cwd(),
  });

  console.log('✅ تم التفعيل!');

  // اختبار
  console.log('🧪 اختبار الوكيل...');

  const result = await agent.execute({
    type: 'system-command',
    command: 'pwd',
    level: 'safe',
    description: 'عرض المجلد الحالي',
  });

  console.log('📂 المجلد الحالي:', result.result);

  // فحص الحالة
  const status = agent.getStatus();
  console.log('📊 حالة الوكيل:', {
    نشط: status.isActive,
    متوقف: status.isPaused,
    عدد_العمليات: status.activeOperations,
  });

  console.log('✅ كل شيء يعمل بنجاح!');
}

main().catch(console.error);
```

تشغيله:

```bash
# ضع API Key في المتغيرات البيئية
export DEEPSEEK_API_KEY="your-key-here"

# شغل الملف
npx tsx agent-test.ts
```

---

## ❓ المشاكل الشائعة والحلول

### مشكلة: "Cannot find module '@oqool/shared/agents'"

**الحل:**

```bash
cd /media/amir/MO881/oqool-monorepo
npm install
npm run build
```

### مشكلة: "API Key not found"

**الحل:**

```bash
# ضع المفتاح في ملف .env
echo "DEEPSEEK_API_KEY=your-key-here" >> .env

# أو استخدمه مباشرة في الكود
const agent = new ComputerControlAgent({
  apiKeys: {
    deepseek: 'sk-xxxxxxxxxxxxx'  // المفتاح مباشرة
  }
});
```

### مشكلة: "Permission denied"

**الحل:**

```typescript
// أضف sudo إذا احتجت
const agent = new ComputerControlAgent({
  apiKeys: { deepseek: 'key' },
  securityPolicy: {
    allowedOperations: {
      systemOperations: {
        sudo: 'confirm', // اسمح بـ sudo مع تأكيد
      },
    },
  },
});
```

---

## 📚 الخطوات التالية

بعد التفعيل، يمكنك:

1. **تنفيذ عمليات بسيطة:**

   ```typescript
   await agent.execute({
     type: 'file-read',
     command: 'cat file.txt',
     level: 'safe',
   });
   ```

2. **تنفيذ مهام معقدة:**

   ```typescript
   await agent.executeTask('Build Project', async () => {
     // خطوات البناء
   });
   ```

3. **إضافة أمان:**

   ```typescript
   agent.updateSecurityPolicy({
     protectedPaths: ['/important/path'],
   });
   ```

4. **تفعيل المراقبة:**
   ```typescript
   const monitor = createSystemMonitor();
   monitor.start();
   ```

---

## 🎓 ملخص سريع

```typescript
// 1. استيراد
import { ComputerControlAgent } from '@oqool/shared/agents';

// 2. تفعيل
const agent = new ComputerControlAgent({
  apiKeys: { deepseek: 'YOUR_KEY' },
});

// 3. استخدام
await agent.execute({
  type: 'system-command',
  command: 'ls',
  level: 'safe',
});

// ✅ هذا كل شيء!
```

---

**الوكيل الآن جاهز للاستخدام! 🎉**

للمزيد من التفاصيل، راجع: `COMPUTER_CONTROL_COMMANDS.md`
