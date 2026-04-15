# Mobile 吉祥物功能完整實現報告

## 📋 需求概述

在 Mobile 版本（CSS Media Query `@media (max-width: 768px)`）中實現完整的吉祥物功能，包括：
1. ✅ 保留吉祥物顯示（不被隱藏）
2. ✅ 添加對話氣泡（Speech Bubble）
3. ✅ 實現隨機台詞邏輯（三句廣東話）
4. ✅ 符合「零硬編碼」規範（使用 i18n 系統）

---

## 🎯 實現方案

### 1. 翻譯鍵值添加

**文件**: `translations.json`  
**語言**: zh-TW（繁體中文）、zh-HK（廣東話）

```json
{
  "zh-TW": {
    "mascot.mobile.line1": "帶埋我出發啦！",
    "mascot.mobile.line2": "行得未呀？",
    "mascot.mobile.line3": "仲等？機會唔等人"
  },
  "zh-HK": {
    "mascot.mobile.line1": "帶埋我出發啦！",
    "mascot.mobile.line2": "行得未呀？",
    "mascot.mobile.line3": "仲等？機會唔等人"
  }
}
```

**設計原則**:
- ✅ 遵循項目「零硬編碼」規範
- ✅ 使用 `data-i18n` 屬性綁定
- ✅ 支持多語言切換（未來可擴展到其他語言）

---

### 2. HTML 結構修改

#### **Desktop 端結構**（保持不變）
```html
<!-- Desktop Jumbo Mascot -->
<div id="heroJumboMascot" style="...">
  <img src="./assets/jumbo-gif/jumbo-wave-transparent.gif?v=3" ...>
  
  <!-- Desktop Speech Bubble -->
  <div id="heroSpeechBubble" style="...">
    <div data-i18n="hero.jumbo.greeting1">...</div>
    <div data-i18n="hero.jumbo.message1">...</div>
  </div>
</div>
```

#### **Mobile 端結構**（新增）
```html
<!-- Mobile Jumbo Mascot - Alternative position for mobile devices -->
<div id="heroJumboMascotMobile" style="position:fixed;bottom:120px;right:15px;cursor:pointer;transition:all 0.3s ease;z-index:9998;">
  <img src="./assets/jumbo-gif/jumbo-wave-transparent.gif?v=3" alt="Jumbo Mascot Mobile" loading="lazy" 
       style="width:clamp(60px,10vw,100px);height:auto;filter:drop-shadow(0 8px 20px rgba(123,47,190,0.4));animation:jumboFloat 3s ease-in-out infinite;">
  
  <!-- Mobile Speech Bubble - Positioned to the left of mascot -->
  <div id="heroSpeechBubbleMobileAlt" style="position:fixed;bottom:120px;right:calc(15px + 100px + 15px);min-width:160px;pointer-events:auto;opacity:1;transform:scale(1) translateX(10px);transition:opacity 0.4s ease, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);">
    <div style="background:#fff;border:2px solid #7B2FBE;border-radius:12px;padding:8px 12px;text-align:center;box-shadow:0 4px 15px rgba(123,47,190,0.15);font-size:13px;max-width:180px;">
      <div id="mobileMascotPhrase" data-i18n="mascot.mobile.line1" style="color:#1a1a1a;font-weight:500;letter-spacing:0.2px;"></div>
      
      <!-- Arrow pointing left to mascot -->
      <div style="position:absolute;top:50%;left:-6px;margin-top:-6px;width:0;height:0;border-top:6px solid transparent;border-bottom:6px solid transparent;border-right:6px solid #7B2FBE;"></div>
    </div>
  </div>
</div>
```

**關鍵設計決策**:
- ✅ **獨立元素**: Mobile 和 Desktop 使用不同的 DOM 元素，避免 CSS 衝突
- ✅ **響應式定位**: 
  - Desktop: 吉祥物在右下角，氣泡在上方
  - Mobile: 吉祥物在右下角，氣泡在左側（避免遮擋內容）
- ✅ **觸控友好**: 吉祥物尺寸適應屏幕寬度（`clamp(60px,10vw,100px)`）
- ✅ **視覺一致性**: 保持與 Desktop 相同的紫色主題（`#7B2FBE`）

---

### 3. CSS 樣式規則

#### **Desktop 默認樣式**（隱藏 Mobile 吉祥物）
```css
/* Desktop Default - Hide mobile mascot */
#heroJumboMascotMobile {
  display: none !important;
}

#heroSpeechBubbleMobileAlt {
  display: none !important;
}
```

#### **Mobile 端樣式**（`@media (max-width: 768px)`）
```css
@media (max-width: 768px) {
  /* Mobile Jumbo Mascot - Show only on mobile */
  #heroJumboMascotMobile {
    display: block !important;
  }
  
  /* Desktop Jumbo Mascot - Hide on mobile */
  #heroJumboMascot {
    display: none !important;
  }
  
  /* Mobile Speech Bubble - Show only on mobile */
  #heroSpeechBubbleMobileAlt {
    display: block !important;
  }
  
  /* Desktop Speech Bubble - Hide on mobile */
  #heroSpeechBubble {
    display: none !important;
  }
}
```

**層級管理**:
- ✅ `z-index: 9998` - 確保吉祥物在所有內容之上
- ✅ `pointer-events: auto` - 確保可點擊
- ✅ `!important` - 覆蓋任何潛在的衝突規則

---

### 4. JavaScript 邏輯實現

#### **核心功能**
1. **隨機初始台詞**: 頁面加載時隨機選擇一句台詞
2. **自動輪播**: 每 8 秒自動切換到下一句
3. **點擊切換**: 點擊吉祥物立即切換台詞
4. **淡入淡出動畫**: 台詞切換時有平滑過渡效果
5. **彈跳反饋**: 點擊時吉祥物有輕微放大效果

#### **代碼實現**
```javascript
(function() {
  'use strict';
  
  // Mobile mascot phrases (i18n keys)
  const mobilePhrases = [
    'mascot.mobile.line1',
    'mascot.mobile.line2',
    'mascot.mobile.line3'
  ];
  
  let currentPhraseIndex = 0;
  let phraseRotationInterval = null;
  
  // Function to update phrase with fade animation
  function updateMascotPhrase(newIndex) {
    const phraseEl1 = document.getElementById('mobileMascotPhrase');
    const phraseEl2 = document.getElementById('mobileMascotPhraseAlt');
    
    if (!phraseEl1 || !phraseEl2) return;
    
    // Fade out
    phraseEl1.style.transition = 'opacity 0.3s ease';
    phraseEl2.style.transition = 'opacity 0.3s ease';
    phraseEl1.style.opacity = '0';
    phraseEl2.style.opacity = '0';
    
    setTimeout(() => {
      // Update text content via i18n
      const newKey = mobilePhrases[newIndex];
      
      // Check if i18n system is available
      if (window.i18n && window.i18n.translations) {
        const lang = window.i18n.currentLang || 'zh-TW';
        const translation = window.i18n.translations[lang]?.[newKey] || newKey;
        phraseEl1.textContent = translation;
        phraseEl2.textContent = translation;
      } else {
        // Fallback: fetch translations.json directly
        fetch('./translations.json')
          .then(res => res.json())
          .then(data => {
            const lang = document.documentElement.lang || 'zh-TW';
            const translation = data[lang]?.[newKey] || newKey;
            phraseEl1.textContent = translation;
            phraseEl2.textContent = translation;
          })
          .catch(err => {
            console.warn('[Mascot] Failed to load translations:', err);
            phraseEl1.textContent = newKey;
            phraseEl2.textContent = newKey;
          });
      }
      
      // Fade in
      setTimeout(() => {
        phraseEl1.style.opacity = '1';
        phraseEl2.style.opacity = '1';
      }, 50);
    }, 300);
    
    currentPhraseIndex = newIndex;
  }
  
  // Rotate to next phrase
  function rotateToNextPhrase() {
    const nextIndex = (currentPhraseIndex + 1) % mobilePhrases.length;
    updateMascotPhrase(nextIndex);
  }
  
  // Initialize on DOM ready
  function initMobileMascot() {
    const mascotMobile = document.getElementById('heroJumboMascotMobile');
    
    if (!mascotMobile) {
      console.log('[Mascot] Mobile mascot not found, skipping initialization');
      return;
    }
    
    console.log('[Mascot] Initializing mobile mascot with random phrases');
    
    // Set initial random phrase
    const initialIndex = Math.floor(Math.random() * mobilePhrases.length);
    updateMascotPhrase(initialIndex);
    
    // Add click handler to change phrase
    mascotMobile.addEventListener('click', () => {
      console.log('[Mascot] Mascot clicked, changing phrase');
      rotateToNextPhrase();
      
      // Add bounce animation
      mascotMobile.style.transform = 'scale(1.1)';
      setTimeout(() => {
        mascotMobile.style.transform = 'scale(1)';
      }, 200);
    });
    
    // Auto-rotate every 8 seconds
    phraseRotationInterval = setInterval(rotateToNextPhrase, 8000);
    
    console.log('[Mascot] Mobile mascot initialized successfully');
  }
  
  // Wait for DOM and i18n to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileMascot);
  } else {
    setTimeout(initMobileMascot, 100);
  }
  
  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    if (phraseRotationInterval) {
      clearInterval(phraseRotationInterval);
    }
  });
})();
```

**技術要點**:
- ✅ **IIFE 模式**: 避免全局變量污染
- ✅ **'use strict'**: 嚴格模式防止常見錯誤
- ✅ **i18n 集成**: 優先使用 `window.i18n` 系統，fallback 到直接讀取 JSON
- ✅ **內存管理**: 頁面卸載時清除定時器，防止內存洩漏
- ✅ **錯誤處理**: 捕獲翻譯加載失敗，顯示原始 key 作為 fallback
- ✅ **性能優化**: 使用 `requestAnimationFrame` 風格的動畫（CSS transition）

---

## 🎨 視覺設計規範

### **對話氣泡樣式**

| 屬性 | Desktop | Mobile |
|------|---------|--------|
| 背景色 | `#ffffff` | `#ffffff` |
| 邊框 | `2px solid #7B2FBE` | `2px solid #7B2FBE` |
| 圓角 | `12px` | `12px` |
| 內邊距 | `10px 16px` | `8px 12px` |
| 最小寬度 | `200px` | `160px` |
| 最大寬度 | 無限制 | `180px` |
| 字體大小 | `15px` | `13px` |
| 陰影 | `0 4px 15px rgba(123,47,190,0.15)` | `0 4px 15px rgba(123,47,190,0.15)` |
| 箭頭方向 | 向下 | 向左 |
| 箭頭尺寸 | `8px` | `6px` |

### **吉祥物尺寸**

| 設備 | 寬度 | 位置 |
|------|------|------|
| Desktop | `clamp(80px, 15vw, 180px)` | 右下角 `bottom: clamp(80px,12vh,120px); right: clamp(15px,3vw,30px)` |
| Mobile | `clamp(60px, 10vw, 100px)` | 右下角 `bottom: 120px; right: 15px` |

### **動畫效果**

1. **浮動動畫** (`jumboFloat`):
   ```css
   animation: jumboFloat 3s ease-in-out infinite;
   ```
   - 持續時間: 3 秒
   - 緩動函數: `ease-in-out`
   - 無限循環

2. **台詞切換動畫**:
   - 淡出: 300ms
   - 淡入: 50ms 延遲後開始
   - 總過渡時間: ~350ms

3. **點擊反饋動畫**:
   - 縮放: `scale(1.0 → 1.1 → 1.0)`
   - 持續時間: 200ms

---

## 📱 響應式行為

### **Desktop (> 768px)**
- ✅ 顯示 `#heroJumboMascot`（Desktop 版本）
- ✅ 顯示 `#heroSpeechBubble`（固定台詞）
- ❌ 隱藏 `#heroJumboMascotMobile`
- ❌ 隱藏 `#heroSpeechBubbleMobileAlt`

### **Mobile (≤ 768px)**
- ❌ 隱藏 `#heroJumboMascot`
- ❌ 隱藏 `#heroSpeechBubble`
- ✅ 顯示 `#heroJumboMascotMobile`（Mobile 版本）
- ✅ 顯示 `#heroSpeechBubbleMobileAlt`（隨機台詞）

### **Tablet (769px - 1024px)**
- 繼承 Desktop 行為
- 可能需要調整吉祥物位置以避免與導航欄重疊

---

## 🔧 測試清單

### **功能測試**
- [ ] 頁面加載時隨機顯示一句台詞
- [ ] 每 8 秒自動切換到下一句台詞
- [ ] 點擊吉祥物立即切換台詞
- [ ] 台詞切換時有淡入淡出動畫
- [ ] 點擊時吉祥物有彈跳反饋
- [ ] 控制台無錯誤信息

### **視覺測試**
- [ ] Desktop 端顯示 Desktop 吉祥物
- [ ] Mobile 端顯示 Mobile 吉祥物
- [ ] 對話氣泡不遮擋主要內容
- [ ] 吉祥物和氣泡在不同屏幕尺寸下正確顯示
- [ ] 紫色主題一致（`#7B2FBE`）

### **交互測試**
- [ ] 吉祥物可點擊（觸控友好）
- [ ] 點擊區域 ≥ 44px × 44px
- [ ] 不會誤觸其他按鈕
- [ ] 滾動時吉祥物保持固定位置

### **多語言測試**
- [ ] 切換到繁體中文（zh-TW）時台詞正確顯示
- [ ] 切換到廣東話（zh-HK）時台詞正確顯示
- [ ] 切換到其他語言時有合理的 fallback

### **性能測試**
- [ ] 頁面加載時間无明显增加
- [ ] 定時器在頁面卸載時正確清除
- [ ] 無內存洩漏（長時間運行測試）

---

## 🚀 部署建議

### **1. 清除瀏覽器緩存**
```
Ctrl + Shift + R (Windows/Linux)
Cmd + Shift + R (Mac)
```

### **2. 檢查控制台輸出**
應看到以下日誌：
```
[Mascot] Initializing mobile mascot with random phrases
[Mascot] Mobile mascot initialized successfully
```

### **3. 實際測試**
- **Desktop**: 打開開發者工具，切換到移動設備模擬模式
- **Mobile**: 使用真實設備測試觸摸響應
- **不同語言**: 切換語言驗證台詞正確更新

### **4. 調試技巧**
如果台詞未正確顯示：
1. 檢查控制台是否有 `[Mascot] Failed to load translations` 錯誤
2. 確認 `translations.json` 已正確部署
3. 檢查 `window.i18n` 對象是否存在
4. 驗證 `data-i18n` 屬性是否正確設置

---

## 📊 技術架構圖

```
┌─────────────────────────────────────┐
│         HTML Structure              │
├─────────────────────────────────────┤
│  #heroJumboMascot (Desktop)         │
│    ├─ <img> (GIF animation)         │
│    └─ #heroSpeechBubble             │
│         └─ Fixed greeting           │
│                                     │
│  #heroJumboMascotMobile (Mobile)    │
│    ├─ <img> (GIF animation)         │
│    └─ #heroSpeechBubbleMobileAlt    │
│         └─ #mobileMascotPhrase      │
│              (Dynamic via i18n)     │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│         CSS Rules                   │
├─────────────────────────────────────┤
│  Desktop Default:                   │
│    #heroJumboMascotMobile {         │
│      display: none !important;      │
│    }                                │
│                                     │
│  @media (max-width: 768px):         │
│    #heroJumboMascot {               │
│      display: none !important;      │
│    }                                │
│    #heroJumboMascotMobile {         │
│      display: block !important;     │
│    }                                │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│      JavaScript Logic               │
├─────────────────────────────────────┤
│  1. Initialize on DOM ready         │
│  2. Select random initial phrase    │
│  3. Start 8s rotation interval      │
│  4. Add click event listener        │
│  5. Update via i18n system          │
│  6. Apply fade animations           │
│  7. Cleanup on page unload          │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│      i18n Integration               │
├─────────────────────────────────────┤
│  Priority 1: window.i18n API        │
│  Priority 2: Fetch translations.json│
│  Fallback: Display raw key          │
└─────────────────────────────────────┘
```

---

## 🎯 符合項目規範

### ✅ **零硬編碼政策**
- 所有台詞通過 `translations.json` 管理
- 使用 `data-i18n` 屬性綁定
- 支持動態語言切換

### ✅ **無障礙規範 (WCAG)**
- 吉祥物有 `alt` 屬性
- 足夠的對比度（白色背景 + 黑色文字）
- 觸控區域 ≥ 44px × 44px

### ✅ **性能優化**
- GIF 圖片使用 `loading="lazy"`
- CSS 動畫使用 GPU 加速（`transform`, `opacity`）
- 定時器在頁面卸載時清除

### ✅ **響應式設計**
- 使用 `clamp()` 實現流式尺寸
- Media Query 精確控制顯示/隱藏
- 適應各種屏幕尺寸

---

## 📝 相關文件

1. **translations.json** - 多語言翻譯數據
2. **dist/index.html** - 主頁面文件（HTML + CSS + JS）
3. **js/i18n-dynamic.js** - i18n 翻譯系統

---

## 🔮 未來擴展建議

1. **更多台詞**: 在 `translations.json` 中添加更多台詞，增加趣味性
2. **季節性台詞**: 根據日期顯示特殊台詞（節日、活動等）
3. **用戶互動**: 記錄用戶點擊次數，解鎖隱藏台詞
4. **音效反饋**: 點擊時播放輕微音效
5. **多語言擴展**: 為英文、日文、韓文添加對應台詞

---

**實現完成時間**: 2026-04-14  
**實現版本**: v1.0  
**測試狀態**: 待用戶驗證 ✅
