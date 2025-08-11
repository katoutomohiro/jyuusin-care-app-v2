param(
  [int]$Port = 3005
)

try {
  $conn = Get-NetTCPConnection -State Listen -LocalPort $Port -ErrorAction SilentlyContinue
  if (-not $conn) {
    Write-Host ("[PORT] {0} is free." -f $Port)
    exit 0
  }

  $pids = ($conn | Select-Object -ExpandProperty OwningProcess -Unique)
  foreach ($pid in $pids) {
    try {
      $proc = Get-Process -Id $pid -ErrorAction SilentlyContinue
      if ($proc) {
        Write-Host ("[PORT] Killing PID={0} Name={1} listening on {2}" -f $pid, $proc.ProcessName, $Port)
        Stop-Process -Id $pid -Force
      }
    } catch {
      Write-Host ("[PORT][WARN] Failed to stop PID={0}: {1}" -f $pid, $_.Exception.Message)
    }
  }

  Start-Sleep -Seconds 1
  $again = Get-NetTCPConnection -State Listen -LocalPort $Port -ErrorAction SilentlyContinue
  if ($again) {
    Write-Host ("[PORT][FAIL] Still occupied: {0}" -f $Port)
    exit 1
  } else {
    Write-Host ("[PORT][OK] Freed: {0}" -f $Port)
    exit 0
  }
} catch {
  Write-Host ("[PORT][ERROR] {0}" -f $_.Exception.Message)
  exit 1
}
