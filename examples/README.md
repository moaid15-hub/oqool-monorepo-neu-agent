# 📚 Examples - أمثلة الاستخدام

أمثلة عملية لاستخدام أنظمة Oqool.

---

## 🚀 الأمثلة المتاحة

### 1. `simple.ts` - مثال بسيط وسريع

**الاستخدام:** تنفيذ أوامر Terminal مباشرة

```bash
npx tsx examples/simple.ts
```

**المميزات:**

- ✅ بسيط جداً (~15 سطر)
- ✅ سريع
- ✅ يستخدم Operations Executor مباشرة
- ✅ مثالي للبداية

**الكود:**

```typescript
import { OperationsExecutor } from '@oqool/shared/core';

const executor = new OperationsExecutor(process.cwd());
const result = await executor.executeCommand('ls -la');
console.log(result.output);
```

---

### 2. `agent-simple-test.ts` - اختبار Computer Control Agent

**الاستخدام:** اختبار الوكيل في وضع Sandbox

```bash
npx tsx examples/agent-simple-test.ts
```

**المميزات:**

- ✅ يختبر Computer Control Agent
- ✅ يستخدم Sandbox Mode (آمن)
- ✅ يختبر System Monitor
- ✅ يعرض مقاييس النظام

**ما يختبره:**

- تفعيل الوكيل
- فحص الحالة
- تنفيذ أوامر في Sandbox
- مراقبة النظام (CPU, Memory, Disk)

---

### 3. `agent-quick-start.ts` - دليل سريع شامل

**الاستخدام:** دليل كامل لاستخدام الوكيل

```bash
npx tsx examples/agent-quick-start.ts
```

**المميزات:**

- ✅ يغطي كل ميزات الوكيل
- ✅ أمثلة متعددة
- ✅ تعليقات توضيحية
- ✅ اختبار System Monitor

**ما يغطيه:**

- التفعيل الأساسي
- فحص الحالة
- تنفيذ أوامر
- السجل والتاريخ
- System Monitor
- Snapshots (اختياري)

---

## 🎯 أيهما تختار؟

### للبداية السريعة:

→ استخدم `simple.ts`

### لاختبار Computer Control Agent:

→ استخدم `agent-simple-test.ts`

### للتعلم الشامل:

→ استخدم `agent-quick-start.ts`

---

## 📝 ملاحظات

### متطلبات التشغيل:

```bash
# تأكد من وجود API Keys
export DEEPSEEK_API_KEY="your-key"
export ANTHROPIC_API_KEY="your-key"  # اختياري
export OPENAI_API_KEY="your-key"     # اختياري
```

### البناء أولاً:

```bash
npm run build
```

### التشغيل:

```bash
npx tsx examples/<filename>.ts
```

---

## 🔗 روابط مفيدة

- [QUICK_START.txt](../QUICK_START.txt) - دليل البداية السريعة
- [HOW_TO_ACTIVATE_AGENT.md](../HOW_TO_ACTIVATE_AGENT.md) - كيفية تفعيل الوكيل
- [COMPUTER_CONTROL_COMMANDS.md](../COMPUTER_CONTROL_COMMANDS.md) - دليل الأوامر الكامل
- [PROJECT_STATUS_REPORT.md](../PROJECT_STATUS_REPORT.md) - تقرير حالة المشروع

---

## 💡 نصائح

1. **ابدأ بـ simple.ts** - الأبسط والأسرع
2. **استخدم Sandbox Mode** - للاختبار الآمن
3. **اقرأ التوثيق** - راجع الملفات أعلاه
4. **جرب بنفسك** - عدّل الأمثلة واستكشف

---

**آخر تحديث:** 2025-11-03
