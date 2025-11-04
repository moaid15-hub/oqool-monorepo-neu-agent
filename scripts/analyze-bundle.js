#!/usr/bin/env node
/**
 * Bundle Analysis Script
 * يحلل حجم الحزم ويولد تقرير مرئي
 */

const { visualizer } = require('rollup-plugin-visualizer');
const fs = require('fs');
const path = require('path');

const PACKAGES = ['cli', 'desktop', 'cloud-editor'];

async function analyzeBundles() {
  console.log('📊 Starting bundle analysis...\n');

  for (const pkg of PACKAGES) {
    const distPath = path.join(__dirname, '..', 'packages', pkg, 'dist');

    if (!fs.existsSync(distPath)) {
      console.log(`⚠️  Skipping ${pkg} - no dist folder found`);
      continue;
    }

    console.log(`🔍 Analyzing @oqool/${pkg}...`);

    const stats = await analyzePackage(pkg, distPath);
    console.log(`   Total size: ${formatBytes(stats.totalSize)}`);
    console.log(`   Files: ${stats.fileCount}\n`);
  }

  console.log('✅ Analysis complete! Check ./bundle-analysis/ for reports');
}

function analyzePackage(pkgName, distPath) {
  let totalSize = 0;
  let fileCount = 0;

  const files = fs.readdirSync(distPath, { recursive: true });

  files.forEach(file => {
    const filePath = path.join(distPath, file);
    if (fs.statSync(filePath).isFile()) {
      totalSize += fs.statSync(filePath).size;
      fileCount++;
    }
  });

  return { totalSize, fileCount };
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Create bundle-analysis directory
const analysisDir = path.join(__dirname, '..', 'bundle-analysis');
if (!fs.existsSync(analysisDir)) {
  fs.mkdirSync(analysisDir, { recursive: true });
}

analyzeBundles().catch(console.error);
