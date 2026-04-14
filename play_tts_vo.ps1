# 15s TVC VO Script - PowerShell TTS
# This script uses Windows Speech API to play Cantonese TTS

Add-Type -AssemblyName System.Speech

$speaker = New-Object System.Speech.Synthesis.SpeechSynthesizer

# List available voices
Write-Host "=== Available Voices ===" -ForegroundColor Cyan
$speaker.GetInstalledVoices() | ForEach-Object {
    Write-Host $_.VoiceInfo.Name -ForegroundColor Green
}

# Try to select Chinese/Cantonese voice
$chineseVoice = $speaker.GetInstalledVoices() | Where-Object { 
    $_.VoiceInfo.Culture.Name -like "zh-*" 
} | Select-Object -First 1

if ($chineseVoice) {
    Write-Host "`nUsing voice: $($chineseVoice.VoiceInfo.Name)" -ForegroundColor Yellow
    $speaker.SelectVoice($chineseVoice.VoiceInfo.Name)
} else {
    Write-Host "`nWarning: No Chinese voice found, using default" -ForegroundColor Red
}

# Set speech rate (-10 to 10, 0 is normal)
# For excited tone: faster rate + higher pitch effect
$speaker.Rate = 2  # Slightly faster for energy
$speaker.Volume = 100

Write-Host "`n=== Playing TVC Script ===" -ForegroundColor Cyan
Write-Host "Part 1 (0-2s): [Sound Effect Only]" -ForegroundColor Gray
Start-Sleep -Seconds 2

Write-Host "Part 2 (2-5s): 計錯數?睇錯匯率?漏咗帳?" -ForegroundColor White
$speaker.Speak("計錯數? 睇錯匯率? 漏咗帳?")
Start-Sleep -Milliseconds 300

Write-Host "Part 3 (5-9s): 外遊象寶,一App搞掂!" -ForegroundColor White
$speaker.Speak("外遊象寶! 一 App 搞掂!")
Start-Sleep -Milliseconds 300

Write-Host "Part 4 (9-13s): 外遊象寶——外幣好管家,旅遊好夥伴!" -ForegroundColor White
$speaker.Speak("外遊象寶! 外幣好管家! 旅遊好夥伴!")
Start-Sleep -Milliseconds 500

Write-Host "Part 5 (13-15s): [Jumbo Sound Effect]" -ForegroundColor Gray

Write-Host "`n=== Playback Complete ===" -ForegroundColor Cyan
Write-Host "Note: This is a TTS preview. For production, use professional recording." -ForegroundColor Yellow
