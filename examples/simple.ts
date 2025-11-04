// مثال بسيط - تنفيذ أوامر مباشرة
import { OperationsExecutor } from '@oqool/shared/core';

const executor = new OperationsExecutor(process.cwd());

async function main() {
  console.log('🎯 تنفيذ أوامر مباشرة\n');

  // تنفيذ أمر
  const result = await executor.executeCommand('ls -la');

  if (result.success) {
    console.log('✅ النتيجة:');
    console.log(result.output);
  } else {
    console.log('❌ خطأ:', result.error);
  }
}

main();
