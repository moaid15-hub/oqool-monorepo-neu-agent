// ============================================
// 🚀 Computer Control Agent - البداية السريعة
// ============================================

import { config } from 'dotenv';
import { ComputerControlAgent } from '@oqool/shared/agents';
import { createSystemMonitor } from '@oqool/shared/core';

// تحميل متغيرات البيئة من .env
config();

async function main() {
  console.log('\n🤖 تفعيل Computer Control Agent...\n');

  // ============================================
  // 1️⃣ التفعيل الأساسي
  // ============================================

  const agent = new ComputerControlAgent({
    apiKeys: {
      // ضع مفتاح API هنا (أو استخدم process.env)
      deepseek: process.env.DEEPSEEK_API_KEY || 'YOUR_DEEPSEEK_KEY_HERE',
      // يمكنك إضافة مفاتيح أخرى (اختياري):
      // claude: process.env.CLAUDE_API_KEY,
      // openai: process.env.OPENAI_API_KEY,
    },
    workingDirectory: process.cwd(),
    logDirectory: '.oqool/logs',
  });

  console.log('✅ تم تفعيل الوكيل بنجاح!\n');

  // ============================================
  // 2️⃣ فحص الحالة
  // ============================================

  const status = agent.getStatus();
  console.log('📊 حالة الوكيل:', status.active ? '🟢 نشط' : '🔴 غير نشط');
  console.log('📈 تفاصيل الحالة:');
  console.log(`   - نشط: ${status.active}`);
  console.log(`   - متوقف: ${status.paused}`);
  console.log(`   - عدد العمليات: ${status.operations.total}\n`);

  // ============================================
  // 3️⃣ تنفيذ أوامر بسيطة
  // ============================================

  console.log('🧪 اختبار 1: تنفيذ أمر بسيط...');

  try {
    const result1 = await agent.execute('pwd');
    console.log('✅ النتيجة:', result1);
  } catch (error) {
    console.error('❌ خطأ:', error);
  }

  console.log();

  // ============================================
  // 4️⃣ تنفيذ عمليات ملفات
  // ============================================

  console.log('🧪 اختبار 2: عرض الملفات...');

  try {
    const result2 = await agent.execute('ls -la');
    console.log('✅ تم تنفيذ الأمر بنجاح');
  } catch (error) {
    console.error('❌ خطأ:', error);
  }

  console.log();

  // ============================================
  // 5️⃣ تنفيذ أمر آخر
  // ============================================

  console.log('🧪 اختبار 3: فحص المساحة...');

  try {
    const result3 = await agent.execute('df -h .');
    console.log('✅ تم تنفيذ الأمر بنجاح');
  } catch (error) {
    console.error('❌ خطأ:', error);
  }

  console.log();

  // ============================================
  // 6️⃣ فحص السجل
  // ============================================

  console.log('📜 السجل:');
  const history = agent.getHistory(10);
  console.log(`   - عدد العمليات المنفذة: ${history.length}`);

  if (history.length > 0) {
    console.log('   - آخر عملية:');
    const lastOp = history[0];
    console.log(`     • المعرف: ${lastOp.id}`);
    console.log(`     • الأمر: ${lastOp.command}`);
    console.log(`     • الحالة: ${lastOp.status}`);
  }

  console.log();

  // ============================================
  // 7️⃣ تفعيل المراقبة (اختياري)
  // ============================================

  console.log('📊 تفعيل مراقبة النظام...');

  const monitor = createSystemMonitor({
    interval: 5000,
    alerts: {
      cpuThreshold: 80,
      memoryThreshold: 90,
    },
  });

  // الاستماع للتنبيهات
  monitor.on('alert', (alert) => {
    console.log(`🚨 تنبيه [${alert.severity}]: ${alert.message}`);
  });

  monitor.start();
  console.log('✅ المراقبة نشطة!\n');

  // الحصول على مقاييس النظام
  const metrics = await monitor.getCurrentMetrics();
  console.log('📈 مقاييس النظام الحالية:');
  console.log(`   - استخدام CPU: ${metrics.cpu.usage.toFixed(2)}%`);
  console.log(`   - استخدام الذاكرة: ${metrics.memory.usagePercent.toFixed(2)}%`);
  console.log(`   - استخدام القرص: ${metrics.disk.usagePercent.toFixed(2)}%`);
  console.log(`   - عدد العمليات: ${metrics.processes.total}\n`);

  // إيقاف المراقبة بعد 5 ثواني
  setTimeout(() => {
    monitor.stop();
    console.log('🛑 تم إيقاف المراقبة\n');
  }, 5000);

  // انتظر 6 ثواني لإعطاء المراقبة فرصة للإيقاف
  await new Promise((resolve) => setTimeout(resolve, 6000));

  // ============================================
  // 8️⃣ الملخص النهائي
  // ============================================

  console.log('═══════════════════════════════════════════');
  console.log('✅ اكتملت جميع الاختبارات بنجاح!');
  console.log('═══════════════════════════════════════════');
  console.log('\n📚 الخطوات التالية:');
  console.log('   1. راجع COMPUTER_CONTROL_COMMANDS.md للأوامر الكاملة');
  console.log('   2. راجع HOW_TO_ACTIVATE_AGENT.md للتفاصيل');
  console.log('   3. ابدأ باستخدام الوكيل في مشاريعك!\n');

  // إيقاف الوكيل
  await agent.shutdown();
}

// تشغيل المثال
main().catch((error) => {
  console.error('❌ خطأ في التشغيل:', error);
  process.exit(1);
});
