# 端口配置說明

## 📋 固定端口分配

### 開發環境

| 服務 | 端口 | 用途 | 命令 |
|------|------|------|------|
| **HTTP Server** | `5173` | 本地開發服務器 | `npm start` 或 `start-dev.bat` |
| **Vite Dev** | `5174` | Vite 開發服務器 (備用) | `npm run dev` |
| **Node Server** | `54321` | Node.js API 服務器 | `npm run server` |

### 生產環境

| 服務 | 端口 | 用途 |
|------|------|------|
| **Vercel** | `443` | HTTPS 生產環境 | 自動分配 |

## 🔧 端口管理

### Windows

```bash
# 檢查端口占用
.\check-port.bat

# 手動檢查端口
netstat -ano | findstr :5173

# 終止占用進程
taskkill /F /PID <PID>
```

### Mac/Linux

```bash
# 檢查端口占用
lsof -i :5173

# 終止占用進程
kill -9 <PID>
```

## 💡 最佳實踐

1. **固定使用端口 5173** - 不要隨意更改
2. **啟動前檢查端口** - 運行 `check-port.bat`
3. **正常關閉服務器** - 使用 `Ctrl+C` 而不是強制終止
4. **避免多個實例** - 同時只運行一個服務器實例

## ⚠️ 常見問題

### 端口被占用

**解決方案 1:** 使用檢查腳本
```bash
.\check-port.bat
```

**解決方案 2:** 手動查找並終止
```bash
# Windows
netstat -ano | findstr :5173
taskkill /F /PID <找到的PID>

# Mac/Linux
lsof -ti:5173 | xargs kill -9
```

**解決方案 3:** 更換端口 (不推薦)
```bash
npx http-server dist -p 5174 -c-1 --cors
```

### 服務器無法啟動

檢查以下事項:
1. ✅ dist 文件夾是否存在
2. ✅ 端口 5173 是否可用
3. ✅ 是否有權限綁定端口
4. ✅ Node.js 是否正常安裝

## 📝 端口變更歷史

- **5173** - 主開發端口 (固定)
- **54321** - Node.js API 端口 (固定)
- ~~3000~~ - 已棄用 (改為 5173)
- ~~8080~~ - 已棄用 (改為 5173)

---

最後更新: 2026-04-14
