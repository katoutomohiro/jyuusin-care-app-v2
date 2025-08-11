# scripts/start-staff.ps1
# 目的: 職員向けの簡易起動。port解放→診断ファイル→dev起動 を自動実行（安全・軽量）
param(
  [int]$Port = 3005
)

Write-Host "=== STAFF START ==="

# 1) ポート解放
try {
  $conn = Get-NetTCPConnection -State Listen -LocalPort $Port -ErrorAction SilentlyContinue
  if ($conn) {
    $pids = ($conn | Select-Object -ExpandProperty OwningProcess -Unique)
    foreach ($pid in $pids) {
      try {
        $proc = Get-Process -Id $pid -ErrorAction SilentlyContinue
        if ($proc) {
          Write-Host ("[PORT] Stop PID={0} ({1})" -f $pid, $proc.ProcessName)
          Stop-Process -Id $pid -Force
        }
      } catch { Write-Host ("[PORT][WARN] {0}" -f $_.Exception.Message) }
    }
    Start-Sleep -s 1
  }
  Write-Host "[PORT] 3005 ready"
} catch { Write-Host ("[PORT][ERROR] {0}" -f $_.Exception.Message) }

# 2) 診断ファイル（最新コミット表示用）
try {
  $commit = (git rev-parse --short HEAD).Trim()
  $stamp  = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
  if (-not (Test-Path .\public)) { New-Item -ItemType Directory -Path .\public | Out-Null }
  "commit=$commit`ndatetime=$stamp" | Out-File -FilePath .\public\__diag_commit.txt -Encoding utf8 -Force
  Write-Host ("[DIAG] __diag_commit.txt => {0} ({1})" -f $commit, $stamp)
} catch { Write-Host ("[DIAG][WARN] {0}" -f $_.Exception.Message) }

# 3) 依存ざっくり整合（速さ優先：失敗しても続行）
try { npm install | Out-Null } catch { Write-Host "[NPM][WARN] npm install failed (continue)" }

# 4) ガード（速い範囲だけ）
try {
  npm run typecheck
  if ($LASTEXITCODE -ne 0) { Write-Host "[GUARD][WARN] typecheck errors"; }
} catch { Write-Host "[GUARD][WARN] typecheck failed (continue)" }

# 5) dev起動（前面）
Write-Host "[DEV] starting dev server on http://localhost:$Port"
npm run dev
