# Script quét BOM trong dự án
$bomFiles = @()
$scannedCount = 0

Write-Host "=== BẮT ĐẦU QUÉT BOM ===" -ForegroundColor Cyan
Write-Host ""

# Quét Backend
Write-Host "Đang quét Backend..." -ForegroundColor Yellow
Get-ChildItem -Path ".\BE" -Include *.ts,*.tsx,*.js,*.jsx,*.json -Recurse -ErrorAction SilentlyContinue | ForEach-Object {
    $scannedCount++
    try {
        $bytes = [System.IO.File]::ReadAllBytes($_.FullName)
        if ($bytes.Count -ge 3 -and $bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF) {
            $bomFiles += $_.FullName
            Write-Host "  [BOM] $($_.FullName)" -ForegroundColor Red
        }
    } catch {
        # Skip files that can't be read
    }
}

# Quét Frontend
Write-Host "Đang quét Frontend..." -ForegroundColor Yellow
Get-ChildItem -Path ".\FE" -Include *.ts,*.tsx,*.js,*.jsx,*.json -Recurse -ErrorAction SilentlyContinue | ForEach-Object {
    $scannedCount++
    try {
        $bytes = [System.IO.File]::ReadAllBytes($_.FullName)
        if ($bytes.Count -ge 3 -and $bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF) {
            $bomFiles += $_.FullName
            Write-Host "  [BOM] $($_.FullName)" -ForegroundColor Red
        }
    } catch {
        # Skip files that can't be read
    }
}

Write-Host ""
Write-Host "=== KẾT QUẢ ===" -ForegroundColor Cyan
Write-Host "Đã quét: $scannedCount files" -ForegroundColor White
Write-Host "Phát hiện BOM: $($bomFiles.Count) files" -ForegroundColor $(if ($bomFiles.Count -gt 0) { "Red" } else { "Green" })

if ($bomFiles.Count -gt 0) {
    Write-Host ""
    Write-Host "Files có BOM:" -ForegroundColor Yellow
    $bomFiles | ForEach-Object { 
        $relativePath = $_.Replace((Get-Location).Path + "\", "")
        Write-Host "  - $relativePath" -ForegroundColor White
    }
    
    # Lưu vào file
    $bomFiles | Out-File -FilePath "bom-files.txt" -Encoding UTF8
    Write-Host ""
    Write-Host "✓ Đã lưu danh sách vào: bom-files.txt" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "✓ Không tìm thấy file nào có BOM!" -ForegroundColor Green
}
