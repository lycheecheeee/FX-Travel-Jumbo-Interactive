@echo off
echo Installing edge-tts for Cantonese TTS...
python -m pip install --user edge-tts
echo.
echo Installation complete! Now generating Cantonese TTS audio...
echo.

echo Generating Part 1: 計錯數?睇錯匯率?漏咗帳?
edge-tts --voice zh-HK-HiuMaanNeural --rate +10%% --pitch +5Hz --text "計錯數？睇錯匯率？漏咗帳？" --write-media part1.mp3

echo Generating Part 2: 外遊象寶,一App搞掂!
edge-tts --voice zh-HK-HiuMaanNeural --rate +15%% --pitch +8Hz --text "外遊象寶！一 App 搞掂！" --write-media part2.mp3

echo Generating Part 3: 外遊象寶——外幣好管家,旅遊好夥伴!
edge-tts --voice zh-HK-HiuMaanNeural --rate +10%% --pitch +5Hz --text "外遊象寶！外幣好管家！旅遊好夥伴！" --write-media part3.mp3

echo.
echo All parts generated! Playing audio...
echo.

start part1.mp3
timeout /t 3 /nobreak >nul
start part2.mp3
timeout /t 3 /nobreak >nul
start part3.mp3

echo.
echo === Cantonese TTS Preview Complete ===
echo Files saved as: part1.mp3, part2.mp3, part3.mp3
pause
