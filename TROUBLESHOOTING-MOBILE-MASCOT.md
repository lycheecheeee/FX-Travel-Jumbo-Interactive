# 🔍 Mobile 吉祥物看不到？完整診斷指南

## ❗ 重要：為什麼您可能看不到修改

### 最常見原因：**瀏覽器緩存**

即使 Git commit 成功，瀏覽器可能仍在使用舊的緩存文件！

---

## ✅ 立即解決步驟

### 步驟 1: 強制清除瀏覽器緩存

#### Windows/Linux:
```
Ctrl + Shift + R
或
Ctrl + F5
```

#### Mac:
```
Cmd + Shift + R
或
Cmd + Option + R
```

### 步驟 2: 完全清除緩存（如果步驟 1 無效）

1. 按 `F12` 打開開發者工具
2. **右鍵點擊**刷新按鈕
3. 選擇 **"清空緩存並硬性重新載入"** (Empty Cache and Hard Reload)

或者：

1. 按 `F12` → 切換到 **Application** 標籤
2. 左側選單選擇 **Storage**
3. 點擊 **"Clear site data"** 按鈕

### 步驟 3: 確認在正確的環境測試

#### Desktop 端測試（寬度 > 768px）:
- ✅ 應該看到 **Desktop 吉祥物**（右上角）
- ❌ **不應該**看到 Mobile 吉祥物

#### Mobile 端測試（寬度 ≤ 768px）:
1. 按 `F12` 打開開發者工具
2. 按 `Ctrl + Shift + M` 切換到設備模擬模式
3. 選擇一個移動設備（如 iPhone 12, Pixel 5）
4. 確保寬度 ≤ 768px
5. **刷新頁面** (Ctrl + R)

- ✅ 應該看到 **Mobile 吉祥物**（右下角）
- ✅ 應該看到 **對話氣泡**（吉祥物左側）
- ❌ **不應該**看到 Desktop 吉祥物

---

## 🔧 手動驗證代碼是否存在

### 方法 1: 檢查 HTML 元素

在瀏覽器控制台（F12 → Console）輸入：

```javascript
// 檢查 Mobile 吉祥物是否存在
document.getElementById('heroJumboMascotMobile')

// 預期輸出：
// <div id="heroJumboMascotMobile" style="...">...</div>
// 或 null（如果不存在）
```

```javascript
// 檢查台詞元素是否存在
document.getElementById('mobileMascotPhrase')
document.getElementById('mobileMascotPhraseAlt')

// 預期輸出：
// <div id="mobileMascotPhrase" data-i18n="mascot.mobile.line1">...</div>
```

### 方法 2: 檢查 CSS 規則

在控制台輸入：

```javascript
// 獲取 Mobile 吉祥物元素
const mascot = document.getElementById('heroJumboMascotMobile');

if (mascot) {
    // 檢查計算後的樣式
    const style = window.getComputedStyle(mascot);
    console.log('Display:', style.display);
    console.log('Visibility:', style.visibility);
    console.log('Opacity:', style.opacity);
    console.log('Z-index:', style.zIndex);
} else {
    console.error('❌ Mobile mascot element NOT FOUND!');
}
```

**預期輸出（Mobile 模式下）**:
```
Display: block
Visibility: visible
Opacity: 1
Z-index: 9998
```

**如果是 Desktop 模式**，應該顯示：
```
Display: none  ← 這是正常的！
```

### 方法 3: 檢查 JavaScript 是否執行

在控制台輸入：

```javascript
// 檢查吉祥物初始化日誌
// 應該能看到以下輸出：
// [Mascot] Initializing mobile mascot with random phrases
// [Mascot] Mobile mascot initialized successfully
```

如果沒有看到這些日誌，表示 JavaScript 未執行。

---

## 🐛 常見問題排查

### 問題 1: 元素存在但不可見

**症狀**: `getElementById` 返回元素，但頁面上看不到

**可能原因**:
1. CSS `display: none` 仍然生效
2. 元素被其他層覆蓋（z-index 問題）
3. 元素在視窗外（position 錯誤）

**解決方案**:
```javascript
const mascot = document.getElementById('heroJumboMascotMobile');
if (mascot) {
    // 強制顯示
    mascot.style.display = 'block';
    mascot.style.visibility = 'visible';
    mascot.style.opacity = '1';
    
    // 檢查是否在視窗內
    const rect = mascot.getBoundingClientRect();
    console.log('Element position:', rect);
    console.log('In viewport:', 
        rect.top >= 0 && 
        rect.left >= 0 && 
        rect.bottom <= window.innerHeight && 
        rect.right <= window.innerWidth
    );
}
```

### 問題 2: 台詞未顯示

**症狀**: 吉祥物可見，但對話氣泡是空的

**可能原因**:
1. i18n 系統未加載
2. translations.json 路徑錯誤
3. 翻譯鍵值不存在

**解決方案**:
```javascript
// 檢查 i18n 系統
console.log('i18n available:', !!window.i18n);
console.log('Current language:', window.i18n?.currentLang);

// 手動設置台詞
const phrase = document.getElementById('mobileMascotPhrase');
if (phrase) {
    phrase.textContent = '帶埋我出發啦！';
}
```

### 問題 3: 自動輪播未工作

**症狀**: 台詞顯示但不會自動切換

**檢查定時器**:
```javascript
// 在控制台查看是否有定時器運行
// 應該每 8 秒切換一次台詞

// 手動觸發切換
const event = new Event('click');
document.getElementById('heroJumboMascotMobile')?.dispatchEvent(event);
```

---

## 📱 快速測試流程

### 完整測試清單：

```
□ 1. 清除瀏覽器緩存 (Ctrl+Shift+R)
□ 2. 打開開發者工具 (F12)
□ 3. 切換到移動設備模式 (Ctrl+Shift+M)
□ 4. 選擇設備（iPhone 12 或類似）
□ 5. 刷新頁面 (Ctrl+R)
□ 6. 檢查控制台是否有 [Mascot] 日誌
□ 7. 檢查右下角是否有吉祥物 GIF
□ 8. 檢查吉祥物左側是否有白色對話氣泡
□ 9. 點擊吉祥物，台詞應該切換
□ 10. 等待 8 秒，台詞應該自動切換
```

---

## 🎯 使用調試頁面

我已創建了一個專門的調試頁面：

**文件**: `test-mobile-mascot.html`

**使用方法**:
1. 在瀏覽器中打開：`file:///d:/03_Work_Projects/FX-Travel-Jumbo-Interactive/test-mobile-mascot.html`
2. 按照頁面上的指示操作
3. 點擊「檢查吉祥物狀態」按鈕

---

## 🔥 終極解決方案：直接修改測試

如果以上方法都無效，讓我們直接在控制台中測試：

### 在 main page 控制台執行：

```javascript
// 1. 檢查當前屏幕寬度
console.log('Screen width:', window.innerWidth);
console.log('Is mobile?', window.innerWidth <= 768);

// 2. 查找所有吉祥物相關元素
console.log('Desktop mascot:', document.getElementById('heroJumboMascot'));
console.log('Mobile mascot:', document.getElementById('heroJumboMascotMobile'));
console.log('Desktop bubble:', document.getElementById('heroSpeechBubble'));
console.log('Mobile bubble:', document.getElementById('heroSpeechBubbleMobileAlt'));

// 3. 如果 Mobile 吉祥物存在但隱藏，強制顯示
const mobileMascot = document.getElementById('heroJumboMascotMobile');
if (mobileMascot) {
    mobileMascot.style.display = 'block';
    mobileMascot.style.opacity = '1';
    console.log('✅ Forced mobile mascot to display');
} else {
    console.error('❌ Mobile mascot element does not exist in DOM');
}

// 4. 檢查 CSS Media Query 是否生效
const isMobile = window.matchMedia('(max-width: 768px)').matches;
console.log('CSS thinks is mobile:', isMobile);
```

---

## 📊 預期行為對比表

| 項目 | Desktop (>768px) | Mobile (≤768px) |
|------|------------------|-----------------|
| `#heroJumboMascot` | ✅ 顯示 | ❌ 隱藏 (`display: none`) |
| `#heroJumboMascotMobile` | ❌ 隱藏 (`display: none`) | ✅ 顯示 |
| `#heroSpeechBubble` | ✅ 顯示（固定問候語） | ❌ 隱藏 |
| `#heroSpeechBubbleMobileAlt` | ❌ 隱藏 | ✅ 顯示（隨機台詞） |
| 吉祥物位置 | 右下角 | 右下角 |
| 氣泡位置 | 吉祥物上方 | 吉祥物左側 |
| 台詞內容 | 固定 | 隨機三句廣東話 |
| 自動輪播 | ❌ 無 | ✅ 每 8 秒 |
| 點擊切換 | ❌ 無 | ✅ 立即切換 |

---

## 💡 最後建議

如果仍然看不到：

1. **確認文件已保存**: 
   ```bash
   git status
   # 應該顯示 working tree clean
   ```

2. **檢查服務器是否運行**:
   ```bash
   # 如果使用 Vite 或其他開發服務器
   npm run dev
   ```

3. **直接訪問文件**:
   - 不要用 `localhost`
   - 直接用文件協議：`file:///d:/03_Work_Projects/FX-Travel-Jumbo-Interactive/dist/index.html`

4. **嘗試不同瀏覽器**:
   - Chrome
   - Firefox
   - Edge

5. **檢查網絡請求**:
   - F12 → Network 標籤
   - 刷新頁面
   - 確認 `translations.json` 已成功加載（狀態碼 200）

---

## 🆘 需要幫助？

如果以上所有步驟都無法解決問題，請提供：

1. **控制台截圖**（包含所有日誌）
2. **Network 標籤截圖**（顯示 translations.json 的加載狀態）
3. **Elements 標籤截圖**（顯示 `<body>` 內的吉祥物元素）
4. **屏幕寬度**（在控制台輸入 `window.innerWidth`）

我會根據這些信息進一步診斷！
