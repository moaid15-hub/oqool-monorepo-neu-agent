#!/usr/bin/env node
/**
 * 🧪 اختبار شامل لجميع نماذج Claude المتاحة
 * يختبر كل نموذج ويعرض التفاصيل الكاملة
 */

import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
import chalk from 'chalk';

dotenv.config();

const API_KEY = process.env.ANTHROPIC_API_KEY;

if (!API_KEY) {
  console.log(chalk.red('❌ ANTHROPIC_API_KEY غير موجود في .env'));
  process.exit(1);
}

console.log(chalk.cyan('🔑 API Key: ') + API_KEY.substring(0, 20) + '...\n');

const client = new Anthropic({ apiKey: API_KEY });

// قائمة جميع نماذج Claude الممكنة
const ALL_MODELS = [
  // Claude 4.x (الأحدث)
  { id: 'claude-sonnet-4-5-20250929', name: 'Claude Sonnet 4.5', tier: 'Latest' },
  { id: 'claude-haiku-4-5-20251001', name: 'Claude Haiku 4.5', tier: 'Latest' },
  { id: 'claude-opus-4-1-20250805', name: 'Claude Opus 4.1', tier: 'Latest' },
  { id: 'claude-sonnet-4-20250514', name: 'Claude Sonnet 4', tier: 'Latest' },
  { id: 'claude-opus-4-20250514', name: 'Claude Opus 4', tier: 'Latest' },

  // Claude 3.7
  { id: 'claude-3-7-sonnet-20250219', name: 'Claude 3.7 Sonnet', tier: 'Recent' },

  // Claude 3.5
  { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet (Oct 2024)', tier: 'Recent' },
  { id: 'claude-3-5-sonnet-20240620', name: 'Claude 3.5 Sonnet (Jun 2024)', tier: 'Recent' },
  { id: 'claude-3-5-haiku-20241022', name: 'Claude 3.5 Haiku', tier: 'Recent' },

  // Claude 3 (قديم)
  { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus', tier: 'Legacy' },
  { id: 'claude-3-sonnet-20240229', name: 'Claude 3 Sonnet', tier: 'Legacy' },
  { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku', tier: 'Legacy' },
];

const results = {
  available: [],
  notFound: [],
  errors: [],
};

console.log(chalk.bold.cyan('📋 اختبار جميع نماذج Claude...\n'));
console.log('━'.repeat(80) + '\n');

async function testModel(model) {
  const startTime = Date.now();

  try {
    const response = await client.messages.create({
      model: model.id,
      max_tokens: 50,
      messages: [{ role: 'user', content: 'Say hi in one word' }]
    });

    const endTime = Date.now();
    const duration = endTime - startTime;
    const content = response.content[0];
    const text = content.type === 'text' ? content.text : 'N/A';

    results.available.push({
      ...model,
      duration,
      response: text,
      usage: response.usage,
    });

    console.log(chalk.green('✅ ' + model.name.padEnd(35)) +
                chalk.gray(`[${model.tier}] `) +
                chalk.yellow(`${duration}ms`) +
                chalk.gray(` - "${text.substring(0, 20)}"`));

  } catch (error) {
    const errorMsg = error.message || error.toString();

    if (errorMsg.includes('404') || errorMsg.includes('not_found')) {
      results.notFound.push(model);
      console.log(chalk.red('❌ ' + model.name.padEnd(35)) +
                  chalk.gray(`[${model.tier}] `) +
                  chalk.red('غير متاح'));
    } else if (errorMsg.includes('401') || errorMsg.includes('authentication')) {
      results.errors.push({ ...model, error: 'Authentication Error' });
      console.log(chalk.red('🔐 ' + model.name.padEnd(35)) +
                  chalk.gray(`[${model.tier}] `) +
                  chalk.red('خطأ مصادقة'));
    } else if (errorMsg.includes('429') || errorMsg.includes('rate_limit')) {
      results.errors.push({ ...model, error: 'Rate Limited' });
      console.log(chalk.yellow('⏳ ' + model.name.padEnd(35)) +
                  chalk.gray(`[${model.tier}] `) +
                  chalk.yellow('تجاوز الحد'));
    } else if (errorMsg.includes('overloaded')) {
      results.errors.push({ ...model, error: 'Overloaded' });
      console.log(chalk.yellow('🔥 ' + model.name.padEnd(35)) +
                  chalk.gray(`[${model.tier}] `) +
                  chalk.yellow('مشغول'));
    } else {
      results.errors.push({ ...model, error: errorMsg });
      console.log(chalk.red('⚠️  ' + model.name.padEnd(35)) +
                  chalk.gray(`[${model.tier}] `) +
                  chalk.red(errorMsg.substring(0, 30)));
    }
  }
}

// اختبار جميع النماذج بالتوالي
for (const model of ALL_MODELS) {
  await testModel(model);
  // تأخير صغير لتجنب Rate Limiting
  await new Promise(resolve => setTimeout(resolve, 500));
}

// ملخص النتائج
console.log('\n' + '━'.repeat(80));
console.log(chalk.bold.cyan('\n📊 ملخص النتائج:\n'));

if (results.available.length > 0) {
  console.log(chalk.green.bold(`✅ النماذج المتاحة (${results.available.length}):\n`));

  // ترتيب حسب السرعة
  const sorted = [...results.available].sort((a, b) => a.duration - b.duration);

  sorted.forEach((model, index) => {
    const rank = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '  ';
    console.log(`${rank} ${chalk.green(model.name.padEnd(35))} ` +
                chalk.yellow(`${model.duration}ms`.padEnd(8)) +
                chalk.gray(`[${model.tier}]`) +
                chalk.blue(` Tokens: ${model.usage.input_tokens}→${model.usage.output_tokens}`));
  });

  console.log(chalk.cyan('\n💡 التوصيات:\n'));

  const fastest = sorted[0];
  const latest = results.available.filter(m => m.tier === 'Latest')[0];
  const cheapest = results.available.find(m => m.id.includes('haiku'));

  if (fastest) {
    console.log(chalk.green(`⚡ الأسرع: ${fastest.name} (${fastest.duration}ms)`));
  }
  if (latest) {
    console.log(chalk.blue(`🆕 الأحدث: ${latest.name}`));
  }
  if (cheapest) {
    console.log(chalk.yellow(`💰 الأرخص: ${cheapest.name}`));
  }
}

if (results.notFound.length > 0) {
  console.log(chalk.red.bold(`\n❌ النماذج غير المتاحة (${results.notFound.length}):\n`));
  results.notFound.forEach(model => {
    console.log(`   ${chalk.red(model.name)} ${chalk.gray(`[${model.tier}]`)}`);
  });
}

if (results.errors.length > 0) {
  console.log(chalk.yellow.bold(`\n⚠️  أخطاء أخرى (${results.errors.length}):\n`));
  results.errors.forEach(model => {
    console.log(`   ${chalk.yellow(model.name)}: ${chalk.gray(model.error)}`);
  });
}

// توصية للتحديث
console.log('\n' + '━'.repeat(80));
console.log(chalk.cyan.bold('\n🔧 خطوات التحديث:\n'));

if (results.available.length > 0) {
  const recommended = results.available[0];
  console.log(chalk.white('1. افتح الملفات التالية وحدّث اسم النموذج:\n'));
  console.log(chalk.gray('   packages/cli/src/local-oqool-client.ts'));
  console.log(chalk.gray('   packages/cli/src/agent-client.ts'));
  console.log(chalk.gray('   packages/shared/src/core/local-oqool-client.ts'));
  console.log(chalk.gray('   packages/shared/src/core/agent-client.ts\n'));

  console.log(chalk.white('2. استبدل النموذج بـ:\n'));
  console.log(chalk.green(`   model: '${recommended.id}'`));

  console.log(chalk.white('\n3. أعد البناء:\n'));
  console.log(chalk.gray('   cd packages/shared && npm run build'));
  console.log(chalk.gray('   cd packages/cli && npm run build'));
} else {
  console.log(chalk.red('⚠️  لا توجد نماذج متاحة! تحقق من:'));
  console.log(chalk.gray('   - صحة API Key'));
  console.log(chalk.gray('   - رصيد الحساب'));
  console.log(chalk.gray('   - حدود الاستخدام'));
}

console.log('\n' + '━'.repeat(80) + '\n');

// حفظ النتائج في ملف JSON
import { writeFileSync } from 'fs';
const reportFile = './claude-models-report.json';
writeFileSync(reportFile, JSON.stringify({
  timestamp: new Date().toISOString(),
  apiKey: API_KEY.substring(0, 20) + '...',
  results,
  recommendation: results.available[0]?.id || 'none',
}, null, 2));

console.log(chalk.gray(`📄 تم حفظ التقرير في: ${reportFile}\n`));
