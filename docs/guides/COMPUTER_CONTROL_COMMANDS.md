# 🤖 Computer Control System - دليل الأوامر الشامل

**النظام:** Computer Control System
**التاريخ:** 2025-11-03
**الموقع:** `@oqool/shared`

---

## 📋 جدول المحتويات

1. [نظرة عامة](#نظرة-عامة)
2. [Computer Control Agent](#computer-control-agent)
3. [Operations Executor](#operations-executor)
4. [System Monitor](#system-monitor)
5. [أمثلة الاستخدام](#أمثلة-الاستخدام)
6. [إرشادات الأمان](#إرشادات-الأمان)

---

## نظرة عامة

نظام التحكم الكامل بالحاسوب يتكون من ثلاثة مكونات رئيسية:

- **Computer Control Agent**: وكيل ذكي مع أنظمة أمان متقدمة
- **Operations Executor**: منفذ العمليات المتعدد المنصات
- **System Monitor**: مراقب النظام في الوقت الفعلي

---

## Computer Control Agent

### 🎯 المفهوم الأساسي

وكيل ذكي يمكنه تنفيذ أي عملية على الحاسوب مع أنظمة أمان وتأكيد متقدمة.

### 📦 الاستيراد

```typescript
import { ComputerControlAgent } from '@oqool/shared/agents';
```

### ⚙️ الإعداد الأساسي

```typescript
const agent = new ComputerControlAgent({
  apiKeys: {
    deepseek: 'YOUR_DEEPSEEK_KEY',
    claude: 'YOUR_CLAUDE_KEY',
    openai: 'YOUR_OPENAI_KEY',
  },
  provider: 'auto',
  workingDirectory: process.cwd(),
  logDirectory: '.oqool/logs',
  enableAutoStop: true,
  enableDeadManSwitch: true,
  deadManSwitchInterval: 30000, // 30 ثانية
});
```

### 🔐 إعداد سياسات الأمان

```typescript
const securityPolicy = {
  allowedOperations: {
    fileOperations: {
      read: true, // قراءة بدون تأكيد
      write: 'confirm', // كتابة مع تأكيد
      delete: 'confirm', // حذف مع تأكيد
      execute: 'confirm', // تنفيذ مع تأكيد
    },
    systemOperations: {
      installPackages: 'confirm',
      modifyRegistry: false, // ممنوع
      sudo: 'confirm',
      processManagement: 'confirm',
    },
    networkOperations: {
      httpRequests: true,
      openPorts: 'confirm',
      ssh: 'confirm',
    },
  },
  protectedPaths: ['/etc', '/System', 'C:\\Windows', '/home/*/.ssh', '~/.ssh'],
  trustedSources: ['https://github.com', 'https://npmjs.com'],
  autoApprove: {
    enabled: true,
    learns: true,
    patterns: ['npm install', 'git clone'],
  },
};

agent.updateSecurityPolicy(securityPolicy);
```

---

## 🎮 الأوامر الرئيسية

### 1. تنفيذ عملية واحدة

```typescript
const operation = {
  id: 'unique-id',
  type: 'file-read',
  level: 'safe',
  command: 'cat /path/to/file.txt',
  description: 'قراءة محتوى الملف',
};

const result = await agent.execute(operation);
```

### 2. تنفيذ مهمة معقدة

```typescript
await agent.executeTask('Build and Deploy', async () => {
  // تثبيت الحزم
  await agent.execute({
    type: 'package-install',
    command: 'npm install',
    level: 'medium',
  });

  // بناء المشروع
  await agent.execute({
    type: 'system-command',
    command: 'npm run build',
    level: 'medium',
  });

  // رفع على Git
  await agent.execute({
    type: 'git-operation',
    command: 'git push origin main',
    level: 'critical',
  });
});
```

### 3. الإيقاف والاستئناف

```typescript
// إيقاف مؤقت
agent.pause();

// استئناف
agent.resume();

// إيقاف تام
agent.stop();
```

### 4. نظام التوقف الطارئ

```typescript
// إيقاف طارئ مع rollback
const stopResult = await agent.emergencyStop('pause', 'سبب الإيقاف');

console.log('العمليات المتوقفة:', stopResult.stoppedOperations);
console.log('عمليات الاستعادة:', stopResult.rollbacks);
console.log('تقرير الإيقاف:', stopResult.reportPath);
```

**مستويات التوقف الطارئ:**

- `pause`: إيقاف مؤقت، يمكن الاستئناف
- `soft`: إيقاف ناعم، انتظار إكمال العمليات الجارية
- `hard`: إيقاف قوي، إنهاء فوري للعمليات
- `emergency`: طوارئ، مع rollback للعمليات الحرجة
- `panic`: ذعر، إيقاف فوري + rollback + تقرير مفصل

### 5. Dead Man Switch

```typescript
// تفعيل نظام Dead Man Switch
agent.enableDeadManSwitch(30000); // 30 ثانية

// إعادة ضبط المؤقت
agent.heartbeat();

// إيقاف
agent.disableDeadManSwitch();
```

### 6. مراقبة الحالة

```typescript
// حالة الوكيل
const isActive = agent.isAgentActive();
const isPaused = agent.isAgentPaused();

// الحصول على حالة النظام
const systemState = await agent.getSystemState();
console.log('استخدام CPU:', systemState.cpuUsage);
console.log('استخدام الذاكرة:', systemState.memoryUsage);
console.log('العمليات الجارية:', systemState.activeOperations);
```

### 7. السجلات والتاريخ

```typescript
// الحصول على سجل العمليات
const history = agent.getOperationHistory();

// الحصول على عملية محددة
const operation = agent.getOperation('operation-id');

// تصدير السجلات
await agent.exportLogs('/path/to/logs.json');
```

### 8. Snapshots والاستعادة

```typescript
// إنشاء snapshot
const snapshotId = await agent.createSnapshot('before-deploy');

// استعادة من snapshot
await agent.restoreFromSnapshot(snapshotId);

// قائمة بجميع snapshots
const snapshots = agent.listSnapshots();
```

---

## 📝 أنواع العمليات

### 1. عمليات الملفات

#### قراءة ملف

```typescript
{
  type: 'file-read',
  level: 'safe',
  command: 'cat /path/to/file.txt',
  description: 'قراءة محتوى الملف'
}
```

#### كتابة ملف

```typescript
{
  type: 'file-write',
  level: 'medium',
  command: 'echo "content" > /path/to/file.txt',
  description: 'كتابة إلى ملف'
}
```

#### حذف ملف

```typescript
{
  type: 'file-delete',
  level: 'critical',
  command: 'rm /path/to/file.txt',
  description: 'حذف ملف',
  metadata: {
    backup: true  // نسخ احتياطي قبل الحذف
  }
}
```

#### نسخ/نقل ملف

```typescript
{
  type: 'file-copy',
  level: 'medium',
  command: 'cp source.txt dest.txt',
  description: 'نسخ ملف'
}

{
  type: 'file-move',
  level: 'medium',
  command: 'mv old.txt new.txt',
  description: 'نقل ملف'
}
```

### 2. عمليات المجلدات

```typescript
// إنشاء مجلد
{
  type: 'dir-create',
  level: 'safe',
  command: 'mkdir -p /path/to/dir',
  description: 'إنشاء مجلد'
}

// حذف مجلد
{
  type: 'dir-delete',
  level: 'critical',
  command: 'rm -rf /path/to/dir',
  description: 'حذف مجلد',
  metadata: {
    backup: true,
    confirm: true
  }
}
```

### 3. عمليات العمليات (Processes)

```typescript
// بدء عملية
{
  type: 'process-start',
  level: 'medium',
  command: 'node app.js',
  description: 'بدء تطبيق Node.js'
}

// إنهاء عملية
{
  type: 'process-kill',
  level: 'critical',
  command: 'kill 1234',
  description: 'إنهاء عملية برقم PID'
}
```

### 4. عمليات الشبكة

```typescript
{
  type: 'network-request',
  level: 'safe',
  command: 'curl https://api.example.com',
  description: 'طلب HTTP',
  metadata: {
    method: 'GET',
    timeout: 5000
  }
}
```

### 5. أوامر النظام

```typescript
{
  type: 'system-command',
  level: 'medium',
  command: 'npm run build',
  description: 'تشغيل أمر npm'
}
```

### 6. تثبيت الحزم

```typescript
{
  type: 'package-install',
  level: 'medium',
  command: 'npm install express',
  description: 'تثبيت حزمة npm'
}
```

### 7. إدارة الخدمات

```typescript
{
  type: 'service-manage',
  level: 'critical',
  command: 'systemctl restart nginx',
  description: 'إعادة تشغيل خدمة nginx'
}
```

### 8. عمليات Git

```typescript
{
  type: 'git-operation',
  level: 'medium',
  command: 'git commit -m "Update"',
  description: 'إنشاء commit'
}
```

### 9. استعلامات قواعد البيانات

```typescript
{
  type: 'database-query',
  level: 'critical',
  command: 'SELECT * FROM users',
  description: 'استعلام قاعدة بيانات',
  metadata: {
    database: 'postgres',
    host: 'localhost',
    port: 5432
  }
}
```

---

## Operations Executor

### 📦 الاستيراد

```typescript
import { OperationsExecutor, createOperationsExecutor } from '@oqool/shared/core';
```

### ⚙️ الإعداد

```typescript
const executor = createOperationsExecutor('/working/directory');
```

---

## 🔧 عمليات الملفات

### 1. قراءة ملف

```typescript
const content = await executor.readFile('/path/to/file.txt');
console.log(content);
```

### 2. كتابة ملف

```typescript
await executor.writeFile('/path/to/file.txt', 'محتوى الملف', {
  overwrite: true,
  backup: true,
  permissions: 0o644,
});
```

### 3. نسخ ملف

```typescript
await executor.copyFile('/source/file.txt', '/dest/file.txt', {
  overwrite: false,
  backup: true,
});
```

### 4. نقل ملف

```typescript
await executor.moveFile('/old/path.txt', '/new/path.txt');
```

### 5. حذف ملف

```typescript
await executor.deleteFile('/path/to/file.txt', {
  backup: true, // نسخ إلى سلة المحذوفات
});
```

### 6. فحص وجود ملف

```typescript
const exists = await executor.fileExists('/path/to/file.txt');
```

### 7. معلومات الملف

```typescript
const info = await executor.getFileInfo('/path/to/file.txt');
console.log('الحجم:', info.size);
console.log('آخر تعديل:', info.modified);
```

---

## 📁 عمليات المجلدات

### 1. إنشاء مجلد

```typescript
await executor.createDirectory('/path/to/dir', {
  recursive: true, // إنشاء المجلدات الأب
  permissions: 0o755,
});
```

### 2. حذف مجلد

```typescript
await executor.deleteDirectory('/path/to/dir', {
  recursive: true, // حذف المحتويات
  backup: true,
});
```

### 3. قائمة الملفات

```typescript
const files = await executor.listDirectory('/path/to/dir', {
  recursive: true,
  filter: (file) => file.endsWith('.ts'),
});
```

---

## 🖥️ عمليات العمليات (Process Operations)

### 1. تشغيل أمر

```typescript
const result = await executor.executeCommand('ls -la', {
  cwd: '/home/user',
  env: { NODE_ENV: 'production' },
  timeout: 30000,
});

console.log('الإخراج:', result.output);
console.log('الحالة:', result.success);
```

### 2. تشغيل عملية

```typescript
const result = await executor.spawnProcess('node', ['app.js'], {
  cwd: '/app',
  detached: false,
  timeout: 60000,
});
```

### 3. تشغيل عملية في الخلفية

```typescript
const process = await executor.spawnProcess('node', ['server.js'], {
  detached: true,
});

console.log('PID:', process.pid);
```

### 4. إنهاء عملية

```typescript
await executor.killProcess(1234); // PID
```

---

## 🌐 عمليات الشبكة

### 1. طلب GET

```typescript
const response = await executor.httpRequest('https://api.example.com/data', {
  method: 'GET',
  headers: {
    Authorization: 'Bearer token',
  },
  timeout: 5000,
});

console.log('البيانات:', response.output);
```

### 2. طلب POST

```typescript
const response = await executor.httpRequest('https://api.example.com/create', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: {
    name: 'John',
    email: 'john@example.com',
  },
});
```

### 3. تحميل ملف

```typescript
await executor.downloadFile('https://example.com/file.zip', '/local/path/file.zip');
```

---

## 🔀 عمليات Git

### 1. Clone

```typescript
await executor.gitClone('https://github.com/user/repo.git', '/local/path', {
  branch: 'main',
  depth: 1,
});
```

### 2. Pull

```typescript
await executor.gitPull('/repo/path', {
  remote: 'origin',
  branch: 'main',
});
```

### 3. Commit

```typescript
await executor.gitCommit('/repo/path', 'رسالة الـ commit', {
  author: 'Name <email@example.com>',
});
```

### 4. Push

```typescript
await executor.gitPush('/repo/path', {
  remote: 'origin',
  branch: 'main',
});
```

### 5. أمر Git مخصص

```typescript
await executor.gitCommand('/repo/path', 'status --short');
```

---

## 🐳 عمليات Docker

### 1. تشغيل حاوية

```typescript
await executor.dockerRun('nginx:latest', {
  container: 'my-nginx',
  ports: ['80:80', '443:443'],
  volumes: ['/host/data:/container/data'],
  env: {
    NGINX_PORT: '80',
  },
});
```

### 2. إيقاف حاوية

```typescript
await executor.dockerStop('my-nginx');
```

### 3. إزالة حاوية

```typescript
await executor.dockerRemove('my-nginx');
```

### 4. قائمة الحاويات

```typescript
await executor.dockerPs();
```

### 5. أمر Docker مخصص

```typescript
await executor.dockerCommand('logs my-nginx');
```

---

## 💾 عمليات قواعد البيانات

### 1. استعلام

```typescript
const result = await executor.databaseQuery('SELECT * FROM users WHERE id = 1', {
  host: 'localhost',
  port: 5432,
  database: 'mydb',
  user: 'postgres',
  password: 'password',
});

console.log('النتائج:', result.output);
```

### 2. استعلام آمن (Prepared Statement)

```typescript
await executor.databaseQuery(
  'INSERT INTO users (name, email) VALUES ($1, $2)',
  {
    host: 'localhost',
    database: 'mydb',
    // ... credentials
  },
  ['John Doe', 'john@example.com']
);
```

---

## System Monitor

### 📦 الاستيراد

```typescript
import { SystemMonitor, createSystemMonitor } from '@oqool/shared/core';
```

### ⚙️ الإعداد

```typescript
const monitor = createSystemMonitor({
  interval: 5000, // كل 5 ثواني
  alerts: {
    cpuThreshold: 80, // تنبيه عند 80% CPU
    memoryThreshold: 90, // تنبيه عند 90% Memory
    diskThreshold: 95, // تنبيه عند 95% Disk
  },
  history: {
    enabled: true,
    maxEntries: 1000, // الاحتفاظ بـ 1000 قراءة
    saveInterval: 60000, // حفظ كل دقيقة
  },
});
```

---

## 📊 المراقبة والمقاييس

### 1. بدء المراقبة

```typescript
monitor.start();
```

### 2. إيقاف المراقبة

```typescript
monitor.stop();
```

### 3. الحصول على المقاييس الحالية

```typescript
const metrics = await monitor.getCurrentMetrics();

// CPU
console.log('استخدام CPU:', metrics.cpu.usage + '%');
console.log('عدد الأنوية:', metrics.cpu.cores);
console.log('متوسط التحميل:', metrics.cpu.loadAverage);

// Memory
console.log('الذاكرة المستخدمة:', (metrics.memory.used / 1024 / 1024 / 1024).toFixed(2) + ' GB');
console.log('نسبة الاستخدام:', metrics.memory.usagePercent + '%');

// Disk
console.log('المساحة المتاحة:', (metrics.disk.free / 1024 / 1024 / 1024).toFixed(2) + ' GB');
console.log('نسبة الاستخدام:', metrics.disk.usagePercent + '%');

// Network
console.log('سرعة التحميل:', metrics.network.downloadSpeed + ' KB/s');
console.log('سرعة الرفع:', metrics.network.uploadSpeed + ' KB/s');

// Processes
console.log('عدد العمليات:', metrics.processes.total);
```

### 4. مراقبة CPU

```typescript
const cpuMetrics = await monitor.getCPUMetrics();

console.log('الاستخدام الكلي:', cpuMetrics.usage);
console.log('الاستخدام لكل نواة:', cpuMetrics.perCore);
console.log('درجة الحرارة:', cpuMetrics.temperature);
```

### 5. مراقبة الذاكرة

```typescript
const memoryMetrics = await monitor.getMemoryMetrics();

console.log('الكلي:', memoryMetrics.total);
console.log('المستخدم:', memoryMetrics.used);
console.log('المتاح:', memoryMetrics.available);
console.log('Swap المستخدم:', memoryMetrics.swap.used);
```

### 6. مراقبة القرص

```typescript
const diskMetrics = await monitor.getDiskMetrics();

console.log('المساحة الكلية:', diskMetrics.total);
console.log('المستخدم:', diskMetrics.used);
console.log('المتاح:', diskMetrics.free);

// جميع الأقسام
diskMetrics.partitions.forEach((partition) => {
  console.log(`${partition.mountpoint}: ${partition.usagePercent}%`);
});

// سرعة القراءة/الكتابة
if (diskMetrics.io) {
  console.log('سرعة القراءة:', diskMetrics.io.readSpeed);
  console.log('سرعة الكتابة:', diskMetrics.io.writeSpeed);
}
```

### 7. مراقبة الشبكة

```typescript
const networkMetrics = await monitor.getNetworkMetrics();

console.log('البيانات المستلمة:', networkMetrics.totalBytesReceived);
console.log('البيانات المرسلة:', networkMetrics.totalBytesSent);

// جميع الواجهات
networkMetrics.interfaces.forEach((iface) => {
  console.log(`${iface.name}: ${iface.status}`);
  console.log(`  IP: ${iface.ip}`);
  console.log(`  السرعة: ${iface.speed} Mbps`);
});
```

### 8. مراقبة العمليات

```typescript
const processMetrics = await monitor.getProcessMetrics();

console.log('العمليات الكلية:', processMetrics.total);
console.log('العمليات الجارية:', processMetrics.running);

// أكثر العمليات استهلاكاً للـ CPU
processMetrics.topByCPU.forEach((proc, i) => {
  console.log(`${i + 1}. ${proc.name} (PID: ${proc.pid}): ${proc.cpu}%`);
});

// أكثر العمليات استهلاكاً للذاكرة
processMetrics.topByMemory.forEach((proc, i) => {
  console.log(`${i + 1}. ${proc.name}: ${(proc.memory / 1024 / 1024).toFixed(2)} MB`);
});
```

---

## 🔔 نظام التنبيهات

### 1. الاستماع للتنبيهات

```typescript
monitor.on('alert', (alert) => {
  console.log(`🚨 تنبيه [${alert.severity}]: ${alert.message}`);
  console.log('القيمة:', alert.value);
  console.log('الحد:', alert.threshold);

  // اتخاذ إجراء
  if (alert.severity === 'critical') {
    // إيقاف العمليات غير الضرورية
    // إرسال إشعار
    // حفظ snapshot
  }
});
```

### 2. تخصيص حدود التنبيهات

```typescript
monitor.setAlertThresholds({
  cpuThreshold: 85,
  memoryThreshold: 92,
  diskThreshold: 98,
  processCountThreshold: 500,
});
```

### 3. قائمة التنبيهات

```typescript
const alerts = monitor.getAlerts();

alerts.forEach((alert) => {
  console.log(`[${alert.timestamp}] ${alert.message}`);
});
```

### 4. مسح التنبيهات

```typescript
monitor.clearAlerts();
```

---

## 📈 السجل والتاريخ

### 1. الحصول على السجل

```typescript
const history = monitor.getHistory();

history.forEach((entry) => {
  console.log(`[${new Date(entry.timestamp)}] CPU: ${entry.cpu.usage}%`);
});
```

### 2. تصدير السجل

```typescript
await monitor.exportHistory('/path/to/metrics-history.json');
```

### 3. تصدير بصيغة CSV

```typescript
await monitor.exportHistoryCSV('/path/to/metrics.csv');
```

### 4. إحصائيات عامة

```typescript
const stats = monitor.getStatistics();

console.log('متوسط استخدام CPU:', stats.cpu.average);
console.log('أعلى استخدام CPU:', stats.cpu.peak);
console.log('متوسط استخدام الذاكرة:', stats.memory.average);
console.log('عدد التنبيهات:', stats.alerts.total);
```

---

## أمثلة الاستخدام

### مثال 1: مراقبة وتنفيذ تلقائي

```typescript
import { ComputerControlAgent, createSystemMonitor } from '@oqool/shared';

// إعداد المراقب
const monitor = createSystemMonitor({
  interval: 10000,
  alerts: { cpuThreshold: 80, memoryThreshold: 90 },
});

// إعداد الوكيل
const agent = new ComputerControlAgent({
  apiKeys: { deepseek: 'key' },
  enableAutoStop: true,
});

// بدء المراقبة
monitor.start();

// التفاعل مع التنبيهات
monitor.on('alert', async (alert) => {
  if (alert.severity === 'critical') {
    // إيقاف طارئ
    await agent.emergencyStop('soft', `High ${alert.type}`);

    // تنظيف الذاكرة
    if (alert.type === 'memory') {
      await agent.execute({
        type: 'system-command',
        command: 'sync; echo 3 > /proc/sys/vm/drop_caches',
        level: 'critical',
        description: 'Clear cache',
      });
    }
  }
});
```

### مثال 2: أتمتة النشر (Deployment)

```typescript
import { ComputerControlAgent } from '@oqool/shared/agents';

const agent = new ComputerControlAgent({
  apiKeys: { claude: 'key' },
  workingDirectory: '/app',
});

await agent.executeTask('Deploy Application', async () => {
  // 1. Pull latest code
  await agent.execute({
    type: 'git-operation',
    command: 'git pull origin main',
    level: 'medium',
    description: 'Update code',
  });

  // 2. Install dependencies
  await agent.execute({
    type: 'package-install',
    command: 'npm ci',
    level: 'medium',
    description: 'Install packages',
  });

  // 3. Run tests
  await agent.execute({
    type: 'system-command',
    command: 'npm test',
    level: 'safe',
    description: 'Run tests',
  });

  // 4. Build
  await agent.execute({
    type: 'system-command',
    command: 'npm run build',
    level: 'medium',
    description: 'Build application',
  });

  // 5. Restart service
  await agent.execute({
    type: 'service-manage',
    command: 'systemctl restart myapp',
    level: 'critical',
    description: 'Restart application',
  });
});
```

### مثال 3: نسخ احتياطي تلقائي

```typescript
import { createOperationsExecutor } from '@oqool/shared/core';

const executor = createOperationsExecutor();

async function dailyBackup() {
  const timestamp = new Date().toISOString().split('T')[0];
  const backupDir = `/backups/${timestamp}`;

  // إنشاء مجلد النسخ الاحتياطي
  await executor.createDirectory(backupDir);

  // نسخ قاعدة البيانات
  await executor.executeCommand(`pg_dump mydb > ${backupDir}/database.sql`);

  // نسخ الملفات
  await executor.copyFile('/app/data', `${backupDir}/data`, { recursive: true });

  // ضغط
  await executor.executeCommand(`tar -czf ${backupDir}.tar.gz ${backupDir}`);

  // رفع إلى السحابة
  await executor.executeCommand(`aws s3 cp ${backupDir}.tar.gz s3://backups/`);

  console.log('✅ تم النسخ الاحتياطي بنجاح');
}

// تشغيل يومياً
setInterval(dailyBackup, 24 * 60 * 60 * 1000);
```

### مثال 4: مراقبة الأداء وإنشاء تقارير

```typescript
import { createSystemMonitor } from '@oqool/shared/core';

const monitor = createSystemMonitor({
  interval: 60000, // كل دقيقة
  history: { enabled: true, maxEntries: 1440 }, // 24 ساعة
});

monitor.start();

// إنشاء تقرير يومي
setInterval(
  async () => {
    const stats = monitor.getStatistics();
    const alerts = monitor.getAlerts();

    const report = `
📊 تقرير الأداء اليومي
=====================

CPU:
  - المتوسط: ${stats.cpu.average.toFixed(2)}%
  - الأعلى: ${stats.cpu.peak.toFixed(2)}%

الذاكرة:
  - المتوسط: ${stats.memory.average.toFixed(2)}%
  - الأعلى: ${stats.memory.peak.toFixed(2)}%

القرص:
  - المساحة المتاحة: ${stats.disk.freeSpace} GB

التنبيهات:
  - إجمالي التنبيهات: ${stats.alerts.total}
  - تنبيهات حرجة: ${stats.alerts.critical}

الوقت: ${new Date().toISOString()}
  `;

    // حفظ التقرير
    await fs.writeFile('/logs/daily-report.txt', report);

    // إرسال بالبريد
    // sendEmail('admin@example.com', 'Daily Report', report);
  },
  24 * 60 * 60 * 1000
);
```

### مثال 5: نظام CI/CD كامل

```typescript
import { ComputerControlAgent, createSystemMonitor } from '@oqool/shared';

class CICDPipeline {
  private agent: ComputerControlAgent;
  private monitor: SystemMonitor;

  constructor() {
    this.agent = new ComputerControlAgent({
      apiKeys: { deepseek: process.env.DEEPSEEK_KEY },
      enableAutoStop: true,
    });

    this.monitor = createSystemMonitor({
      interval: 5000,
      alerts: { cpuThreshold: 90, memoryThreshold: 95 },
    });
  }

  async runPipeline(repoUrl: string, branch: string) {
    const snapshotId = await this.agent.createSnapshot('before-pipeline');

    try {
      // 1. Clone
      await this.agent.execute({
        type: 'git-operation',
        command: `git clone ${repoUrl} /tmp/repo`,
        level: 'medium',
      });

      // 2. Install
      await this.agent.execute({
        type: 'package-install',
        command: 'npm ci',
        level: 'medium',
      });

      // 3. Lint
      await this.agent.execute({
        type: 'system-command',
        command: 'npm run lint',
        level: 'safe',
      });

      // 4. Test
      await this.agent.execute({
        type: 'system-command',
        command: 'npm test',
        level: 'safe',
      });

      // 5. Build
      await this.agent.execute({
        type: 'system-command',
        command: 'npm run build',
        level: 'medium',
      });

      // 6. Deploy
      await this.agent.execute({
        type: 'system-command',
        command: './deploy.sh',
        level: 'critical',
      });

      console.log('✅ Pipeline completed successfully');
    } catch (error) {
      console.error('❌ Pipeline failed:', error);

      // Rollback
      await this.agent.restoreFromSnapshot(snapshotId);
      await this.agent.emergencyStop('soft', 'Pipeline failure');
    }
  }
}
```

---

## إرشادات الأمان

### ⚠️ تحذيرات مهمة

1. **لا تقم أبداً بتعطيل أنظمة الأمان** إلا إذا كنت متأكداً تماماً
2. **استخدم دائماً `confirm` للعمليات الحرجة** مثل الحذف وتعديل النظام
3. **فعّل النسخ الاحتياطي التلقائي** قبل العمليات الخطرة
4. **راقب السجلات بانتظام** لاكتشاف أي نشاط مشبوه
5. **استخدم Dead Man Switch** للعمليات الطويلة
6. **احفظ snapshots قبل التغييرات الكبيرة**

### 🔒 أفضل الممارسات

#### 1. إعداد الأمان الصحيح

```typescript
const secureConfig = {
  allowedOperations: {
    fileOperations: {
      read: true,
      write: 'confirm',
      delete: 'confirm',
      execute: 'confirm',
    },
    systemOperations: {
      installPackages: 'confirm',
      modifyRegistry: false, // ممنوع تماماً
      sudo: 'confirm',
      processManagement: 'confirm',
    },
    networkOperations: {
      httpRequests: true,
      openPorts: 'confirm',
      ssh: 'confirm',
    },
  },
  protectedPaths: [
    '/etc',
    '/System',
    '/bin',
    '/sbin',
    '/usr/bin',
    '/usr/sbin',
    'C:\\Windows',
    'C:\\Program Files',
  ],
  autoApprove: {
    enabled: true,
    learns: true, // يتعلم من قراراتك
    patterns: [], // ابدأ بقائمة فارغة
  },
};
```

#### 2. استخدام Snapshots

```typescript
// قبل أي عملية حرجة
const snapshot = await agent.createSnapshot('before-operation');

try {
  // تنفيذ العملية
  await dangerousOperation();
} catch (error) {
  // استعادة في حالة الفشل
  await agent.restoreFromSnapshot(snapshot);
}
```

#### 3. المراقبة المستمرة

```typescript
const monitor = createSystemMonitor({
  interval: 5000,
  alerts: {
    cpuThreshold: 80,
    memoryThreshold: 90,
    diskThreshold: 95,
  },
});

monitor.on('alert', async (alert) => {
  if (alert.severity === 'critical') {
    // إيقاف فوري
    await agent.emergencyStop('emergency', alert.message);

    // إشعار المسؤول
    await notifyAdmin(alert);
  }
});

monitor.start();
```

#### 4. تسجيل كل شيء

```typescript
// تفعيل السجلات المفصلة
agent.on('operation:start', (op) => {
  console.log(`[START] ${op.description} (${op.id})`);
});

agent.on('operation:complete', (op) => {
  console.log(`[DONE] ${op.description} in ${op.duration}ms`);
});

agent.on('operation:error', (op, error) => {
  console.error(`[ERROR] ${op.description}: ${error.message}`);
});

// حفظ السجلات دورياً
setInterval(async () => {
  await agent.exportLogs(`/logs/agent-${Date.now()}.json`);
}, 3600000); // كل ساعة
```

#### 5. التعامل مع الأخطاء

```typescript
try {
  await agent.executeTask('Critical Task', async () => {
    // عمليات خطرة
  });
} catch (error) {
  // 1. تسجيل الخطأ
  console.error('Task failed:', error);

  // 2. محاولة rollback
  await agent.emergencyStop('emergency', error.message);

  // 3. إشعار الفريق
  await notifyTeam(error);

  // 4. حفظ حالة النظام للتحليل
  const state = await agent.getSystemState();
  await fs.writeFile('/logs/error-state.json', JSON.stringify(state));
}
```

---

## 📞 الدعم والمساعدة

### الحصول على المساعدة

```typescript
// حالة الوكيل
const status = agent.getStatus();
console.log('الوكيل نشط:', status.isActive);
console.log('الوكيل متوقف:', status.isPaused);
console.log('العمليات الجارية:', status.activeOperations);

// معلومات النظام
const systemInfo = await monitor.getSystemInfo();
console.log('المنصة:', systemInfo.platform);
console.log('المعمارية:', systemInfo.arch);
console.log('الإصدار:', systemInfo.version);

// الأخطاء الأخيرة
const errors = agent.getRecentErrors();
errors.forEach((error) => {
  console.error(`[${error.timestamp}] ${error.message}`);
});
```

### الإبلاغ عن مشكلة

إذا واجهت مشكلة:

1. قم بتصدير السجلات: `agent.exportLogs('/logs/debug.json')`
2. احفظ حالة النظام: `monitor.exportHistory('/logs/metrics.json')`
3. ابحث عن الأخطاء في السجلات
4. تواصل مع فريق الدعم

---

**آخر تحديث:** 2025-11-03
**الإصدار:** 1.0.0
**المسؤول:** Claude Code

---

## 🎯 ملخص سريع

### أهم الأوامر للبداية السريعة:

```typescript
// 1. إعداد الوكيل
const agent = new ComputerControlAgent({
  apiKeys: { deepseek: 'key' },
});

// 2. تنفيذ عملية
await agent.execute({
  type: 'system-command',
  command: 'npm install',
  level: 'medium',
});

// 3. بدء المراقبة
const monitor = createSystemMonitor();
monitor.start();

// 4. الحصول على المقاييس
const metrics = await monitor.getCurrentMetrics();

// 5. إيقاف طارئ
await agent.emergencyStop('soft', 'reason');
```

---

**استمتع باستخدام Computer Control System! 🚀**
