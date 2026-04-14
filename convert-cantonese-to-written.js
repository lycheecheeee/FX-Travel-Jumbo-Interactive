#!/usr/bin/env node
/**
 * 將 minisite-interactive-final_20260414_v2.html 中 zh-TW 翻譯的廣東話口語
 * 轉換為正式書面語（繁體中文）
 * 
 * 使用方法:
 *   node convert-cantonese-to-written.js [html文件路徑]
 * 
 * 對照表位於: cantonese-to-written-mapping.json
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 讀取對照表
const mappingFile = path.join(__dirname, 'cantonese-to-written-mapping.json');
let replacements;

try {
    const mappingData = JSON.parse(fs.readFileSync(mappingFile, 'utf-8'));
    replacements = mappingData.replacements;
    console.log(`✅ 已載入對照表: ${replacements.length} 條規則`);
} catch (error) {
    console.error('❌ 無法讀取對照表文件:', error.message);
    process.exit(1);
}

function convertFile(filePath) {
    console.log(`🔄 開始處理: ${filePath}`);
    
    let content = fs.readFileSync(filePath, 'utf-8');
    let convertedCount = 0;
    
    // 找到 zh-TW 翻譯區塊的起始和結束位置
    const zhTwStartPattern = /'zh-TW':\s*\{/;
    const match = content.match(zhTwStartPattern);
    
    if (!match) {
        console.error('❌ 未找到 zh-TW 翻譯區塊');
        return false;
    }
    
    const startIndex = match.index;
    
    // 從 zh-TW 區塊開始，找到對應的閉合括號
    let braceCount = 0;
    let endIndex = startIndex;
    let foundOpen = false;
    
    for (let i = startIndex; i < content.length; i++) {
        if (content[i] === '{') {
            braceCount++;
            foundOpen = true;
        } else if (content[i] === '}') {
            braceCount--;
            if (foundOpen && braceCount === 0) {
                endIndex = i + 1;
                break;
            }
        }
    }
    
    if (endIndex === startIndex) {
        console.error('❌ 無法找到 zh-TW 區塊的結束位置');
        return false;
    }
    
    const zhTwBlock = content.substring(startIndex, endIndex);
    let newZhTwBlock = zhTwBlock;
    
    // 執行替換
    replacements.forEach(({ from, to }) => {
        const regex = new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
        const matches = newZhTwBlock.match(regex);
        
        if (matches && matches.length > 0) {
            console.log(`✅ 找到並替換: "${from}" → "${to}" (${matches.length} 處)`);
            newZhTwBlock = newZhTwBlock.replace(regex, to);
            convertedCount += matches.length;
        }
    });
    
    if (convertedCount === 0) {
        console.log('ℹ️  未發現需要替換的廣東話口語');
        return true;
    }
    
    // 組合新內容
    const newContent = content.substring(0, startIndex) + newZhTwBlock + content.substring(endIndex);
    
    // 寫回文件
    fs.writeFileSync(filePath, newContent, 'utf-8');
    
    console.log(`\n✅ 完成！共替換 ${convertedCount} 處廣東話口語`);
    console.log(`📁 文件已保存: ${filePath}`);
    
    return true;
}

// 主程序
const htmlFile = path.join(__dirname, 'minisite-interactive-final_20260414_v2.html');

if (!fs.existsSync(htmlFile)) {
    console.error(`❌ 文件不存在: ${htmlFile}`);
    process.exit(1);
}

convertFile(htmlFile);
