// index.ts
// ============================================
// 🚀 نقطة الدخول الرئيسية
// ============================================

import { runCLI } from './cli.js';

// تشغيل CLI
runCLI();

// تصدير الوحدات للاستخدام البرمجي
export * from './auth.js';
export * from './file-manager.js';
export * from './ui.js';
export * from './auto-tester.js';
export * from './code-library.js';
export * from './analytics.js';

// Re-export from shared package (includes api-client, self-learning-system, and all core features)
export * from '@oqool/shared/core';
export * from '@oqool/shared/agents';
