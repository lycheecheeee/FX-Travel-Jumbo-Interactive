# FX Travel Jumbo - 外遊象寶

> 專為旅人設計的財務管理 App Landing Page

## 🚀 快速開始

### 方法 1: 使用啟動腳本 (推薦)

**Windows:**
```bash
# 雙擊運行
start-dev.bat

# 或命令行運行
.\start-dev.bat
```

**Mac/Linux:**
```bash
chmod +x start-dev.sh
./start-dev.sh
```

### 方法 2: 使用 NPM 命令

```bash
# 1. 同步 dist 文件夾
npm run sync

# 2. 啟動本地服務器 (端口 5173)
npm start

# 3. 打開瀏覽器訪問
http://localhost:5173
```

### 方法 3: 手動啟動

```bash
# 同步資源
node sync-dist.cjs

# 啟動服務器
npx http-server dist -p 5173 -c-1 --cors
```

### 部署到 Vercel

```bash
# 1. 確保 dist 文件夾是最新的
node sync-dist.cjs

# 2. 提交到 Git
git add .
git commit -m "更新部署版本"
git push

# 3. Vercel 會自動從 dist/ 部署
```

## 📁 項目結構

詳細的文件結構說明請查看 [PROJECT-STRUCTURE.md](./PROJECT-STRUCTURE.md)

**主要目錄:**
- `dist/` - 部署版本 (Production)
- `archive/` - 歷史版本存檔
- `assets/` - 原始資源文件
- `src/` - React 源碼 (未來使用)

## 🛠️ 常用命令

### 開發相關

```bash
# 啟動開發服務器 (端口 5173)
npm start
# 或
.\start-dev.bat        # Windows
./start-dev.sh         # Mac/Linux

# 同步 dist 文件夾
npm run sync
# 或
node sync-dist.cjs

# 檢查端口占用
.\check-port.bat       # Windows
```

### 國際化相關

```bash
# 檢查翻譯完整性
node check-translations.js

# 生成翻譯文件
node generate-translations.js

# 轉換廣東話到書面語
node convert-cantonese-to-written.js
# 或
python convert-cantonese-to-written.py
```

### 部署相關

```bash
# 一鍵部署 (同步 + Git 提交 + 推送)
npm run deploy

# 手動部署
npm run sync           # 同步 dist
git add .              # 添加文件
git commit -m "更新"   # 提交
git push               # 推送
```

## 📝 文檔

- [項目結構說明](./PROJECT-STRUCTURE.md) - 完整的文件結構和說明
- [國際化指南](./I18N-GUIDE.md) - 多語言支持說明
- [開發工具](./DEVELOPMENT-TOOLS.md) - 開發工具介紹
- [QA 報告](./QA-REPORT.md) - 測試報告

## 🎯 功能特點

- ✅ 多語言支持 (繁體中文、廣東話、簡體中文、英文、日文、韓文)
- ✅ 響應式設計 (Mobile/Tablet/Desktop)
- ✅ Framer Motion 風格動畫
- ✅ PWA 支持
- ✅ SEO 優化
- ✅ 性能優化 (圖片懶加載、資源壓縮)

## 📊 最新版本

- **版本**: v2 (2026-04-14)
- **文件大小**: ~338 KB
- **部署狀態**: ✅ 就緒

---

最後更新: 2026-04-14
