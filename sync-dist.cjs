#!/usr/bin/env node

/**
 * 同步腳本 - 將最新版本的 HTML 和資源複製到 dist 文件夾
 * 使用方法: node sync-dist.js
 */

const fs = require('fs');
const path = require('path');

// 配置
const SOURCE_HTML = 'archive/minisite-interactive-final_20260414_v2.html';
const DIST_DIR = 'dist';
const DIST_HTML = path.join(DIST_DIR, 'index.html');

// 需要同步的文件夾
const FOLDERS_TO_SYNC = ['assets', 'js', 'styles'];

// 需要同步的文件
const FILES_TO_SYNC = [
  'manifest.json',
  'sw.js',
  'robots.txt',
  'sitemap.xml',
  'translations.json'
];

console.log('🔄 開始同步 dist 文件夾...\n');

// 確保 dist 目錄存在
if (!fs.existsSync(DIST_DIR)) {
  console.log('📁 創建 dist 目錄...');
  fs.mkdirSync(DIST_DIR, { recursive: true });
}

// 複製 HTML 文件
if (fs.existsSync(SOURCE_HTML)) {
  console.log(`📄 複製 ${SOURCE_HTML} -> ${DIST_HTML}`);
  fs.copyFileSync(SOURCE_HTML, DIST_HTML);
  console.log('✅ HTML 文件複製完成\n');
} else {
  console.error(`❌ 找不到源文件: ${SOURCE_HTML}`);
  process.exit(1);
}

// 同步文件夾
FOLDERS_TO_SYNC.forEach(folder => {
  const sourcePath = folder;
  const destPath = path.join(DIST_DIR, folder);
  
  if (fs.existsSync(sourcePath)) {
    console.log(`📂 同步文件夾: ${folder}/`);
    copyFolderRecursive(sourcePath, destPath);
    console.log(`✅ ${folder}/ 同步完成\n`);
  } else {
    console.warn(`⚠️  找不到文件夾: ${folder}/\n`);
  }
});

// 同步文件
FILES_TO_SYNC.forEach(file => {
  const sourcePath = file;
  const destPath = path.join(DIST_DIR, file);
  
  if (fs.existsSync(sourcePath)) {
    console.log(`📋 複製文件: ${file}`);
    fs.copyFileSync(sourcePath, destPath);
  } else {
    console.warn(`⚠️  找不到文件: ${file}`);
  }
});

console.log('\n✨ dist 文件夾同步完成!');
console.log(`📊 文件大小: ${(fs.statSync(DIST_HTML).size / 1024).toFixed(2)} KB`);

/**
 * 遞歸複製文件夾
 */
function copyFolderRecursive(src, dest) {
  // 確保目標目錄存在
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  // 讀取源目錄內容
  const items = fs.readdirSync(src);
  
  items.forEach(item => {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);
    
    const stats = fs.statSync(srcPath);
    
    if (stats.isDirectory()) {
      // 遞歸複製子目錄
      copyFolderRecursive(srcPath, destPath);
    } else {
      // 複製文件
      fs.copyFileSync(srcPath, destPath);
    }
  });
}
