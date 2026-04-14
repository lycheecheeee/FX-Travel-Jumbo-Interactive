# Check all installed TTS voices on the system
$synth = New-Object -ComObject SAPI.SpVoice
$voices = $synth.GetVoices()

Write-Host "=== Installed TTS Voices ===" -ForegroundColor Cyan
Write-Host "Total voices: $($voices.Count)`n" -ForegroundColor Yellow

for ($i = 0; $i -lt $voices.Count; $i++) {
    $voice = $voices.Item($i)
    Write-Host "Voice #$($i+1):" -ForegroundColor Green
    Write-Host "  Name: $($voice.GetDescription())" -ForegroundColor White
    Write-Host ""
}

Write-Host "=== Checking for Cantonese Voices ===" -ForegroundColor Cyan
$cantoneseFound = $false
for ($i = 0; $i -lt $voices.Count; $i++) {
    $voice = $voices.Item($i)
    $desc = $voice.GetDescription()
    if ($desc -match "Cantonese|HK|Hong Kong|粵語|广东话") {
        Write-Host "FOUND Cantonese voice: $desc" -ForegroundColor Green
        $cantoneseFound = $true
    }
}

if (-not $cantoneseFound) {
    Write-Host "No Cantonese voice found in system." -ForegroundColor Red
    Write-Host "`nSearching for TTS installations in C: and D: drives..." -ForegroundColor Yellow
    
    # Search common TTS installation paths
    $paths = @(
        "C:\Program Files\Common Files\Microsoft Shared\Speech",
        "C:\Program Files (x86)\Common Files\Microsoft Shared\Speech",
        "D:\Program Files\Common Files\Microsoft Shared\Speech",
        "D:\Program Files (x86)\Common Files\Microsoft Shared\Speech",
        "C:\Windows\Speech",
        "D:\Windows\Speech"
    )
    
    foreach ($path in $paths) {
        if (Test-Path $path) {
            Write-Host "Found TTS directory: $path" -ForegroundColor Green
            Get-ChildItem -Path $path -Recurse -Filter "*.dll" -ErrorAction SilentlyContinue | Select-Object -First 5 FullName
        }
    }
}
