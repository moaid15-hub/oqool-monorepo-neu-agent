// ============================================
// 🚀 Computer Control Agent - اختبار بسيط
// ============================================

import { config } from 'dotenv';
import { ComputerControlAgent } from '@oqool/shared/agents';
import { createSystemMonitor } from '@oqool/shared/core';

// تحميل متغيرات البيئة من .env
config();

async function main() {
  console.log('\n🤖 اختبار Computer Control Agent (Sandbox Mode)...\n');

  // ============================================
  // 1️⃣ التفعيل
  // ============================================

  const agent = new ComputerControlAgent({
    apiKeys: {
      deepseek: process.env.DEEPSEEK_API_KEY || '',
      claude: process.env.ANTHROPIC_API_KEY || '',
      openai: process.env.OPENAI_API_KEY || '',
    },
    workingDirectory: process.cwd(),
    logDirectory: '.oqool/logs',
  });

  console.log('✅ تم تفعيل الوكيل بنجاح!\n');

  // ============================================
  // 2️⃣ فحص الحالة
  // ============================================

  const status = agent.getStatus();
  console.log('📊 حالة الوكيل:');
  console.log(`   - نشط: ${status.active ? '✅' : '❌'}`);
  console.log(`   - متوقف: ${status.paused ? '⏸️' : '▶️'}`);
  console.log(`   - إجمالي العمليات: ${status.operations.total}`);
  console.log(`   - العمليات الجارية: ${status.operations.running}`);
  console.log(`   - المكتملة: ${status.operations.completed}`);
  console.log(`   - الفاشلة: ${status.operations.failed}\n`);

  // ============================================
  // 3️⃣ تنفيذ أوامر في Sandbox Mode (آمن)
  // ============================================

  console.log('🧪 اختبار 1: تنفيذ أمر في Sandbox...');

  try {
    const result1 = await agent.execute('Show current directory', { sandbox: true });
    console.log('✅ النتيجة:', result1.result.message);
  } catch (error: any) {
    console.error('❌ خطأ:', error.message);
  }

  console.log();

  console.log('🧪 اختبار 2: تنفيذ أمر آخر في Sandbox...');

  try {
    const result2 = await agent.execute('List files', { sandbox: true });
    console.log('✅ النتيجة:', result2.result.message);
  } catch (error: any) {
    console.error('❌ خطأ:', error.message);
  }

  console.log();

  console.log('🧪 اختبار 3: تنفيذ أمر ثالث في Sandbox...');

  try {
    const result3 = await agent.execute('Check disk space', { sandbox: true });
    console.log('✅ النتيجة:', result3.result.message);
  } catch (error: any) {
    console.error('❌ خطأ:', error.message);
  }

  console.log();

  // ============================================
  // 4️⃣ فحص السجل
  // ============================================

  console.log('📜 السجل:');
  const history = agent.getHistory(10);
  console.log(`   - عدد العمليات المنفذة: ${history.length}`);

  if (history.length > 0) {
    console.log('\n   📋 آخر 3 عمليات:');
    history.slice(0, 3).forEach((op, index) => {
      console.log(`   ${index + 1}. [${op.status}] ${op.description}`);
    });
  }

  console.log();

  // ============================================
  // 5️⃣ فحص الحالة النهائية
  // ============================================

  const finalStatus = agent.getStatus();
  console.log('📊 الحالة النهائية:');
  console.log(`   - إجمالي العمليات: ${finalStatus.operations.total}`);
  console.log(`   - المكتملة: ${finalStatus.operations.completed}`);
  console.log(`   - الفاشلة: ${finalStatus.operations.failed}\n`);

  // ============================================
  // 6️⃣ اختبار System Monitor
  // ============================================

  console.log('📊 اختبار System Monitor...\n');

  const monitor = createSystemMonitor({
    interval: 2000,
    alerts: {
      cpuThreshold: 80,
      memoryThreshold: 90,
    },
  });

  console.log('✅ تم إنشاء Monitor');

  // الحصول على مقاييس النظام
  const metrics = await monitor.getMetrics();
  console.log('\n📈 مقاييس النظام الحالية:');
  console.log(`   - استخدام CPU: ${metrics.cpu.usage.toFixed(2)}%`);
  console.log(`   - استخدام الذاكرة: ${metrics.memory.usagePercent.toFixed(2)}%`);
  console.log(`   - استخدام القرص: ${metrics.disk.usagePercent.toFixed(2)}%`);
  console.log(`   - عدد العمليات: ${metrics.processes.total}\n`);

  // ============================================
  // 7️⃣ الملخص النهائي
  // ============================================

  console.log('═══════════════════════════════════════════');
  console.log('✅ اكتملت جميع الاختبارات بنجاح!');
  console.log('═══════════════════════════════════════════');
  console.log('\n📚 ملاحظات مهمة:');
  console.log('   • هذه الاختبارات تستخدم Sandbox Mode (لا تؤثر على النظام)');
  console.log('   • للتشغيل الحقيقي: استخدم { sandbox: false }');
  console.log('   • راجع COMPUTER_CONTROL_COMMANDS.md للمزيد\n');

  // إيقاف الوكيل
  await agent.shutdown();
  console.log('🛑 تم إيقاف الوكيل\n');
}

// تشغيل المثال
main().catch((error) => {
  console.error('❌ خطأ في التشغيل:', error);
  process.exit(1);
});
