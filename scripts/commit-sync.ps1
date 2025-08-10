Param(
  [switch]$AutoStartDev
)

Write-Host "== Re-Run: dist commit check -> if mismatch then safe sync & restart =="

# 1) 現在HEADとブランチ
$BRANCH = (git rev-parse --abbrev-ref HEAD)
$HEAD_SHORT = (git rev-parse --short HEAD).Trim()
Write-Host ("[INFO] BRANCH={0}, HEAD={1}" -f $BRANCH, $HEAD_SHORT)

# 2) __diag_commit.txt を public に出力（コミット不要）
try {
  if (-not (Test-Path .\public)) { New-Item -ItemType Directory -Path .\public | Out-Null }
  $stamp = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
  "commit=$HEAD_SHORT`ndatetime=$stamp" | Out-File -FilePath .\public\__diag_commit.txt -Encoding utf8 -Force
  Write-Host ("[C] wrote public\\__diag_commit.txt => commit={0}" -f $HEAD_SHORT)
} catch { Write-Host "[C][WARN] write __diag_commit.txt failed: $($_.Exception.Message)" }

# 3) Read currently served commit (if dev server listening)
$servingCommit = $null
try {
  $tcp = Get-NetTCPConnection -State Listen -LocalPort 3005 -ErrorAction SilentlyContinue
  if ($tcp) {
    $resp = Invoke-WebRequest -Uri "http://localhost:3005/__diag_commit.txt" -UseBasicParsing -TimeoutSec 3
    if ($resp.StatusCode -eq 200 -and ($resp.Content -match "commit=([0-9a-f]+)")) {
      $servingCommit = $matches[1]
  Write-Host ("[C] serving commit on 3005 => {0}" -f $servingCommit)
    } else {
  Write-Host "[C][WARN] cannot read __diag_commit.txt from dev server"
    }
  } else {
  Write-Host "[C] dev server not listening on 3005"
  }
} catch {
  Write-Host "[C][WARN] fetch __diag_commit.txt failed: $($_.Exception.Message)"
}

# 4) Decide if sync needed
$needSync = $true
if ($servingCommit) {
  if ($servingCommit -eq $HEAD_SHORT) {
  Write-Host "[OK] Served commit matches current HEAD. Up to date."
    $needSync = $false
  } else {
  Write-Host ("[DIFF] served={0} / HEAD={1} -> will sync & restart" -f $servingCommit, $HEAD_SHORT)
  }
} else {
  Write-Host "[INFO] Served commit unknown -> will sync & restart"
}

if (-not $needSync) { if ($AutoStartDev) { Write-Host "[INFO] --AutoStartDev: run guard:precommit then (if ok) dev"; npm run guard:precommit; if ($LASTEXITCODE -eq 0) { npm run dev } }; exit 0 }

# ==== A) Safe sync & restart ====

# A-1) Safety backup & snapshot
try { npm run backup:zip; npm run snapshot } catch { Write-Host "[A][WARN] backup/snapshot: $($_.Exception.Message)" }

# A-2) Stash uncommitted changes (if any)
$dirty = (git status --porcelain)
if ($dirty) {
  $stamp2 = (Get-Date).ToString('yyyyMMdd-HHmmss')
  git stash push -u -m "pre-sync-$stamp2" | Out-Null
  Write-Host "[A] stashed local changes"
}

# A-3) Update from origin (FF only else create sync branch)
git fetch --prune
Write-Host ("[A] HEAD...origin/{0} = {1}" -f $BRANCH, (git rev-list --left-right --count "HEAD...origin/$BRANCH"))
git pull --ff-only
if ($LASTEXITCODE -ne 0) {
  $NEWBR = "sync-latest-$((Get-Date).ToString('yyyyMMdd-HHmm'))"
  git switch -c $NEWBR "origin/$BRANCH" 2>$null
  if ($LASTEXITCODE -ne 0) { git checkout -b $NEWBR "origin/$BRANCH" | Out-Null }
  Write-Host ("[A] checked out {0} (tracking origin/{1})" -f $NEWBR, $BRANCH)
}

# A-4) Stop dev server if listening on 3005
try {
  $tcp2 = Get-NetTCPConnection -State Listen -LocalPort 3005 -ErrorAction SilentlyContinue
  if ($tcp2) { Get-Process -Id $tcp2.OwningProcess | Stop-Process -Force; Start-Sleep -s 1; Write-Host "[A] port 3005 cleared" }
} catch { Write-Host "[A][WARN] stop dev: $($_.Exception.Message)" }

# A-5) Clear Vite cache
if (Test-Path .\node_modules\.vite) {
  try { Remove-Item -Recurse -Force .\node_modules\.vite; Write-Host "[A] vite cache cleared" }
  catch { Write-Host "[A][WARN] clear cache: $($_.Exception.Message)" }
}

# A-6) Install deps -> guard -> restart dev
npm install --no-audit --no-fund
npm run guard:precommit
if ($LASTEXITCODE -ne 0) { Write-Host "[FAIL] guard:precommit failed"; exit 1 }

npm run dev

# A-7) Rewrite served commit file & print latest commit for manual compare
try {
  $HEAD2 = (git rev-parse --short HEAD).Trim()
  $stamp3 = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
  "commit=$HEAD2`ndatetime=$stamp3" | Out-File -FilePath .\public\__diag_commit.txt -Encoding utf8 -Force
  Write-Host ("[A] updated __diag_commit.txt => commit={0}" -f $HEAD2)
  Write-Host "[A] Open http://localhost:3005/__diag_commit.txt and confirm commit matches below:"
  git log --oneline -n 1
} catch { Write-Host "[A][WARN] finalize diag: $($_.Exception.Message)" }
