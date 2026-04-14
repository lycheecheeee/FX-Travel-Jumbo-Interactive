@echo off
chcp 65001 >nul
echo ========================================
echo   FX Travel Jumbo - 本地開發服務器
echo ========================================
echo.
echo 🚀 正在啟動服務器...
echo 📁 服務目錄: dist/
echo 🌐 訪問地址: http://localhost:5173
echo.
echo 💡 提示: 按 Ctrl+C 停止服務器
echo.

cd /d "%~dp0"
npx http-server dist -p 5173 -c-1 --cors -o
