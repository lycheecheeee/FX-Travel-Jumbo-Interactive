#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
將 minisite-interactive-final_20260414_v2.html 中 zh-TW 翻譯的廣東話口語
轉換為正式書面語（繁體中文）
"""

import re

# 廣東話口語 → 書面語 對照表
cantonese_to_written = {
    # 常用口語詞
    '有嘢講': '有話要說',
    '唔使': '不用',
    '交俾': '交給',
    '幫緊你': '正在幫你',
    '睇下': '看看',
    '幾時': '何時',
    '邊個': '誰',
    '點解': '為什麼',
    '做咩': '做什麼',
    '係咪': '是不是',
    '有冇': '有沒有',
    '知唔知': '知不知道',
    '得唔得': '可不可以',
    '好唔好': '好不好',
    '幾多': '多少',
    '幾耐': '多久',
    '幾遠': '多遠',
    '幾大': '多大',
    '幾細': '多小',
    '幾高': '多高',
    '幾低': '多低',
    '幾快': '多快',
    '幾慢': '多慢',
    '幾重': '多重',
    '幾輕': '多輕',
    '幾貴': '多貴',
    '幾平': '多便宜',
    '玩得幾盡': '玩得有多盡興',
    '睇得幾清': '看得有多清楚',
    '叫外賣': '叫外送',
    '盯緊': '密切關注',
    '小氣簿': '小氣記錄簿',
    '晚點付': '稍後付款',
    '塞得滿滿': '裝得滿滿',
    '比雞起得還早': '比公雞起得還早',
    '花錢買罪受': '花費金錢卻承受辛苦',
}

def convert_cantonese_to_written(text):
    """將文本中的廣東話口語轉換為書面語"""
    for cantonese, written in cantonese_to_written.items():
        text = text.replace(cantonese, written)
    return text

def process_html_file(input_file, output_file=None):
    """處理 HTML 文件，轉換 zh-TW 翻譯區塊"""
    if output_file is None:
        output_file = input_file
    
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 找到 zh-TW 翻譯區塊
    pattern = r"('zh-TW':\s*\{)(.*?)(\},)"
    match = re.search(pattern, content, re.DOTALL)
    
    if not match:
        print("❌ 未找到 zh-TW 翻譯區塊")
        return False
    
    zh_tw_block = match.group(2)
    
    # 提取所有翻譯條目
    entries_pattern = r"'([^']+)':\s*'([^']*)'"
    entries = re.findall(entries_pattern, zh_tw_block)
    
    converted_count = 0
    new_entries = []
    
    for key, value in entries:
        original_value = value
        converted_value = convert_cantonese_to_written(value)
        
        if original_value != converted_value:
            print(f"✅ 轉換: '{key}'")
            print(f"   原: {original_value}")
            print(f"   新: {converted_value}")
            converted_count += 1
        
        # 轉義特殊字符以便寫回
        escaped_value = converted_value.replace("'", "\\'")
        new_entries.append(f"    '{key}': '{escaped_value}'")
    
    # 重新組合 zh-TW 區塊
    new_zh_tw_block = '\n'.join(new_entries)
    
    # 替換原文
    new_content = content[:match.start(2)] + new_zh_tw_block + content[match.end(2):]
    
    # 寫入文件
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"\n✅ 完成！共轉換 {converted_count} 條翻譯")
    return True

if __name__ == '__main__':
    input_file = 'minisite-interactive-final_20260414_v2.html'
    print(f"🔄 開始處理: {input_file}")
    process_html_file(input_file)
