#!/usr/bin/env node
/**
 * Bundle Size Checker
 * يتحقق من أن حجم الحزم لا يتجاوز الحد المسموح
 */

const fs = require('fs');
const path = require('path');

// حدود الحجم (بالـ KB)
const SIZE_LIMITS = {
  cli: 2000,      // 2 MB
  desktop: 5000,  // 5 MB
  'cloud-editor': 3000 // 3 MB
};

let hasError = false;

console.log('🔍 Checking bundle sizes...\n');

Object.entries(SIZE_LIMITS).forEach(([pkg, limitKB]) => {
  const distPath = path.join(__dirname, '..', 'packages', pkg, 'dist');

  if (!fs.existsSync(distPath)) {
    console.log(`⚠️  Skipping ${pkg} - no dist folder`);
    return;
  }

  const size = getDirSize(distPath);
  const sizeKB = Math.round(size / 1024);
  const percent = Math.round((sizeKB / limitKB) * 100);

  const status = sizeKB <= limitKB ? '✅' : '❌';
  const color = sizeKB <= limitKB ? '' : '\x1b[31m';
  const reset = '\x1b[0m';

  console.log(`${status} @oqool/${pkg}:`);
  console.log(`   ${color}${sizeKB} KB / ${limitKB} KB (${percent}%)${reset}`);

  if (sizeKB > limitKB) {
    hasError = true;
    console.log(`   ⚠️  Exceeds limit by ${sizeKB - limitKB} KB!`);
  }
  console.log('');
});

if (hasError) {
  console.log('❌ Bundle size check failed!\n');
  process.exit(1);
} else {
  console.log('✅ All bundles within size limits!\n');
}

function getDirSize(dirPath) {
  let size = 0;

  function traverse(currentPath) {
    const items = fs.readdirSync(currentPath);

    items.forEach(item => {
      const itemPath = path.join(currentPath, item);
      const stats = fs.statSync(itemPath);

      if (stats.isFile()) {
        size += stats.size;
      } else if (stats.isDirectory()) {
        traverse(itemPath);
      }
    });
  }

  traverse(dirPath);
  return size;
}
