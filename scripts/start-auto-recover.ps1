Write-Host "=== 0) 事前情報 ==="
git rev-parse --abbrev-ref HEAD
npm run | Out-Null

# ========== A) 不足の diag:write を自己修復（1コミット=1ファイル） ==========
Write-Host "=== A-1) scripts/diag-write.ps1 を確認・作成 ==="
$diagPath = "scripts/diag-write.ps1"
if (-not (Test-Path $diagPath)) {
  if (-not (Test-Path "scripts")) { New-Item -ItemType Directory -Path "scripts" | Out-Null }
  @'
param([string]$OutDir = "public")
try {
  $commit = (git rev-parse --short HEAD).Trim()
  $stamp  = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
  if (-not (Test-Path $OutDir)) { New-Item -ItemType Directory -Path $OutDir | Out-Null }
  "commit=$commit`ndatetime=$stamp" | Out-File -FilePath (Join-Path $OutDir "__diag_commit.txt") -Encoding utf8 -Force
  Write-Host ("[DIAG] wrote {0}\__diag_commit.txt => commit={1}, time={2}" -f $OutDir, $commit, $stamp)
  exit 0
} catch {
  Write-Host ("[DIAG][ERROR] {0}" -f $_.Exception.Message)
  exit 1
}
'@ | Out-File -FilePath $diagPath -Encoding utf8 -Force
  git add $diagPath
  git commit -m "chore: add diag-write script"
  Write-Host "✅ done: scripts/diag-write.ps1"
} else {
  Write-Host "exists: scripts/diag-write.ps1"
}

Write-Host "=== A-2) package.json に diag:write を追加（なければ） ==="
$pkg = Get-Content package.json -Raw | ConvertFrom-Json
if (-not $pkg.scripts) { $pkg | Add-Member -NotePropertyName scripts -NotePropertyValue @{} }
if (-not $pkg.scripts.'diag:write') {
  $pkg.scripts.'diag:write' = 'powershell -NoLogo -NoProfile -ExecutionPolicy Bypass -File scripts/diag-write.ps1'
  $pkg | ConvertTo-Json -Depth 100 | Out-File package.json -Encoding utf8
  git add package.json
  git commit -m "chore: add diag:write npm script"
  Write-Host "✅ done: package.json"
} else {
  Write-Host "exists: scripts.diag:write"
}

Write-Host "=== A-3) .env.local を確認（固定ポート 3005） ==="
$envPath = ".env.local"
$needEnvCommit = $false
if (-not (Test-Path $envPath)) {
  "VITE_DEV_PORT=3005" | Out-File -FilePath $envPath -Encoding utf8 -Force
  $needEnvCommit = $true
} else {
  $envTxt = Get-Content $envPath -Raw
  if ($envTxt -notmatch 'VITE_DEV_PORT=3005') {
    "VITE_DEV_PORT=3005" | Out-File -FilePath $envPath -Encoding utf8 -Force
    $needEnvCommit = $true
  }
}
if ($needEnvCommit) {
  git add $envPath
  git commit -m "chore: add .env.local with fixed dev port"
  Write-Host "✅ done: .env.local"
} else {
  Write-Host "ok: .env.local"
}

# ========== B) クリーン起動（ポート解放→キャッシュ掃除→診断→起動） ==========
Write-Host "=== B-1) ポート3005 解放 ==="
try {
  $conn = Get-NetTCPConnection -State Listen -LocalPort 3005 -ErrorAction SilentlyContinue
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
    Start-Sleep -Seconds 1
    Write-Host "[PORT] 3005 cleared"
  } else {
    Write-Host "[PORT] 3005 is free"
  }
} catch { Write-Host ("[PORT][ERROR] {0}" -f $_.Exception.Message) }

Write-Host "=== B-2) Viteキャッシュ掃除 ==="
if (Test-Path .\node_modules\.vite) { Remove-Item -Recurse -Force .\node_modules\.vite; Write-Host "[CLEAN] .vite cleared" }

Write-Host "=== B-3) 依存整合 & ガード ==="
npm install
npm run guard:precommit
if ($LASTEXITCODE -ne 0) { Write-Host "[FAIL] guard:precommit failed → 最初の赤1行を貼ってください。"; exit 1 }

Write-Host "=== B-4) 診断ファイル出力（最新コミット可視化）==="
npm run diag:write
if ($LASTEXITCODE -ne 0) { Write-Host "[WARN] diag:write failed (続行)" }

Write-Host "=== B-5) Dev起動（前面）==="
npm run dev
