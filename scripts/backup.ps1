param(
  [string]$Source = (Get-Location).Path,
  [string]$OutDir = "C:\dev",
  [string]$Name = ("backup_jyuusin-care-app-v2_{0}.zip" -f (Get-Date -Format yyyyMMdd_HHmmss))
)
$zip = Join-Path $OutDir $Name
$dst = Join-Path $OutDir "backup_src_jyuusin-care-app-v2"
robocopy $Source $dst /MIR /XD node_modules .next dist .git .svelte-kit .vercel /.well-known /XJ /R:1 /W:1 | Out-Null
if (Test-Path $zip) { Remove-Item $zip -Force }
Compress-Archive -Path (Join-Path $dst "*") -DestinationPath $zip -Force
Write-Host "Backup ZIP => $zip"
