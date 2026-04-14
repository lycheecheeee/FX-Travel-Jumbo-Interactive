# FX Travel Jumbo - 項目文件結構說明

## 📁 目錄結構總覽

```
FX-Travel-Jumbo-Interactive/
├── 📦 dist/                      # 部署版本 (Production Build)
│   ├── index.html               # 主頁面 (最新版本)
│   ├── assets/                  # 所有靜態資源
│   ├── js/                      # JavaScript 文件
│   ├── styles/                  # CSS 樣式文件
│   ├── manifest.json            # PWA 清單
│   ├── sw.js                    # Service Worker
│   ├── robots.txt               # SEO 爬蟲配置
│   └── sitemap.xml              # 網站地圖
│
├── 📚 archive/                   # 歷史版本存檔
│   ├── minisite-interactive-v3-full.html
│   ├── minisite-interactive-v3-refactored.html
│   ├── minisite-interactive-final_20260414_v1.html
│   └── minisite-interactive-final_20260414_v2.html
│
├── 🎨 src/                       # React 源碼 (開發用)
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   └── Login.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── 🖼️ assets/                    # 原始資源文件
│   ├── Section 1_Hero video/    # 英雄區域視頻
│   ├── Section 2_highlight/     # 高亮區域圖片
│   ├── Section 3_Core Feature/  # 核心功能截圖和視頻
│   ├── app-icon/                # 應用圖標
│   ├── jumbo-gif/               # Jumbo 吉祥物動畫
│   ├── sounds/                  # 音效文件
│   └── VO/                      # 語音文件
│
├── 🔧 js/                        # JavaScript 工具
│   ├── i18n.js                  # 國際化基礎庫
│   └── i18n-dynamic.js          # 動態語言切換
│
├── 💅 styles/                    # CSS 樣式
│   └── main.css                 # 主樣式文件
│
├── ⚙️ 配置文件
│   ├── vercel.json              # Vercel 部署配置
│   ├── vite.config.js           # Vite 構建配置
│   ├── tailwind.config.js       # Tailwind CSS 配置
│   ├── postcss.config.js        # PostCSS 配置
│   ├── package.json             # NPM 依賴配置
│   ├── manifest.json            # PWA 清單
│   ├── sw.js                    # Service Worker
│   ├── robots.txt               # SEO 配置
│   └── sitemap.xml              # 網站地圖
│
├── 🌍 國際化相關
│   ├── translations.json        # 翻譯數據
│   ├── cantonese-to-written-mapping.json  # 廣東話映射
│   ├── generate-translations.js # 翻譯生成腳本
│   ├── check-translations.js    # 翻譯檢查腳本
│   ├── convert-cantonese-to-written.js    # 轉換腳本 (JS)
│   └── convert-cantonese-to-written.py    # 轉換腳本 (Python)
│
├── 🎤 TTS 語音生成
│   ├── generate_tts_vo.py       # TTS 生成腳本
│   ├── play_tts_vo.ps1          # 播放 TTS 腳本
│   ├── check_tts_voices.ps1     # 檢查語音腳本
│   ├── generate_cantonese_vo.bat # 批量生成批處理
│   └── install_edge_tts.bat     # 安裝 Edge TTS
│
├── 📝 文檔
│   ├── README-MODERN.md         # 項目說明
│   ├── I18N-GUIDE.md            # 國際化指南
│   ├── DEVELOPMENT-TOOLS.md     # 開發工具說明
│   ├── QA-REPORT.md             # QA 測試報告
│   ├── FIX-REPORT.md            # 修復報告
│   ├── FIXES_LANGUAGE_BUTTON.md # 語言按鈕修復
│   ├── BUBBLE-SIMPLIFICATION.md # 氣泡簡化說明
│   ├── VERCEL-AUDIO-FIX.md      # Vercel 音頻修復
│   ├── VERCEL-AUDIO-404-FIX.md  # Vercel 404 修復
│   └── ISSUES.md                # 已知問題
│
├── 🖥️ 服務器
│   └── server/
│       └── index.js             # Node.js 服務器
│
├── 🎨 創意版本
│   └── super-creative-version/  # 實驗性功能版本
│
└── 🗂️ 其他
    ├── .env                     # 環境變量
    ├── .gitignore               # Git 忽略配置
    ├── screenshot.png           # 項目截圖
    ├── temp-full-translations.html  # 臨時翻譯文件
    └── minisite-interactive-v3-full.html  # 待歸檔文件
```

## 📂 主要文件夾說明

### 1. **dist/** - 部署版本
- **用途**: 包含最終部署到 Vercel 的所有文件
- **內容**: HTML、CSS、JS、圖片、視頻等所有生產環境資源
- **部署**: Vercel 會自動從這個文件夾部署

### 2. **archive/** - 歷史版本
- **用途**: 保存舊版本的 HTML 文件,方便參考和回滾
- **建議**: 每次重大更新後將舊版本移到此處

### 3. **src/** - React 源碼
- **用途**: React 應用的源代碼 (如果未來要遷移到 React)
- **狀態**: 目前主要使用純 HTML/CSS/JS

### 4. **assets/** - 原始資源
- **用途**: 存放所有圖片、視頻、音頻等媒體文件
- **同步**: 部署時會複製到 `dist/assets/`

### 5. **js/** - JavaScript 工具
- **用途**: 共享的 JavaScript 模塊
- **主要功能**: 國際化 (i18n)、語言切換

### 6. **styles/** - CSS 樣式
- **用途**: 全局 CSS 樣式文件

## 🔄 工作流程

### 開發流程
1. 在根目錄的 HTML 文件中進行開發
2. 測試無誤後,複製到 `dist/index.html`
3. 確保 `dist/` 包含所有必要資源 (assets, js, styles)
4. 提交到 Git

### 部署流程
1. 確保 `dist/` 文件夾是最新的
2. 推送到 GitHub
3. Vercel 自動從 `dist/` 部署

### 版本管理
1. 每次重大更新前,將當前版本移至 `archive/`
2. 命名格式: `minisite-interactive-YYYYMMDD_vX.html`
3. 保留最近的 3-5 個版本即可

## 🛠️ 常用命令

```bash
# 啟動本地服務器 (開發)
npx http-server dist -p 5173 -c-1 --cors

# 檢查翻譯完整性
node check-translations.js

# 生成翻譯文件
node generate-translations.js

# 轉換廣東話到書面語
node convert-cantonese-to-written.js
# 或
python convert-cantonese-to-written.py
```

## 📋 待辦事項

- [ ] 將 `minisite-interactive-v3-full.html` 移至 archive
- [ ] 將 `temp-full-translations.html` 移至 archive 或删除
- [ ] 清理根目錄,只保留配置文件
- [ ] 添加自動化腳本來同步 dist 文件夾

## 💡 最佳實踐

1. **保持 dist 清潔**: 只包含部署所需的文件
2. **定期歸檔**: 每次重大更新後歸檔舊版本
3. **資源優化**: 壓縮圖片和視頻以減少加載時間
4. **文檔更新**: 每次修改後更新相關文檔
5. **版本標記**: 使用有意義的版本號和日期

---

最後更新: 2026-04-14
