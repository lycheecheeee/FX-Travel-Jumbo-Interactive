@echo off
chcp 65001 >nul
echo ========================================
echo   FX Travel Jumbo - 端口管理工具
echo ========================================
echo.

set PORT=5173

echo 🔍 檢查端口 %PORT% 使用情況...
echo.

for /f "tokens=5" %%a in ('netstat -ano ^| findstr :%PORT%') do (
    echo ⚠️  發現進程占用端口 %PORT%: PID=%%a
    echo.
    set /p choice="是否終止該進程? (Y/N): "
    if /i "!choice!"=="Y" (
        taskkill /F /PID %%a >nul 2>&1
        if errorlevel 1 (
            echo ❌ 終止失敗,可能需要管理員權限
        ) else (
            echo ✅ 成功終止進程 PID=%%a
        )
    ) else (
        echo ℹ️  已取消操作
    )
    goto :end
)

echo ✅ 端口 %PORT% 可用,無需清理
echo.

:end
echo.
echo 💡 提示: 現在可以運行 start-dev.bat 啟動服務器
pause
