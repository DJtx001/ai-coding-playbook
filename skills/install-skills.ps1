# Install the 14 methodology skills referenced by the tutorial
# Pulled live from the original open-source repo (obra/superpowers, MIT).
# Usage (Windows PowerShell):
#   powershell -ExecutionPolicy Bypass -File .\install-skills.ps1
$ErrorActionPreference = "Stop"

$repoZip = "https://codeload.github.com/obra/superpowers/zip/refs/heads/main"
$work    = Join-Path $env:TEMP "superpowers-$(Get-Random)"
$dst     = Join-Path $env:USERPROFILE ".claude\skills"
$zip     = Join-Path $work "sp.zip"

Write-Host "[1/3] downloading latest superpowers from GitHub ..."
New-Item -ItemType Directory $work -Force | Out-Null
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
Invoke-WebRequest -Uri $repoZip -OutFile $zip -UseBasicParsing
Expand-Archive -Path $zip -DestinationPath $work -Force

$src = Get-ChildItem $work -Directory | Where-Object { $_.Name -like "superpowers-*" } | Select-Object -First 1
if (-not $src) { Write-Host "[ERROR] failed to extract archive"; exit 1 }

Write-Host "[2/3] installing to $dst ..."
New-Item -ItemType Directory $dst -Force | Out-Null

# Remove skills the tutorial no longer recommends (only if they exist)
foreach ($s in @("grill-me", "code-review", "diagnosing-bugs", "writing-for-agents")) {
  $p = Join-Path $dst $s
  if (Test-Path $p) { Remove-Item $p -Recurse -Force; Write-Host "  [removed]   $s" }
}

# Install every skill directory EXCEPT test-driven-development:
# if you already have `tdd` (same upstream skill), two copies of TDD rules will conflict.
Get-ChildItem (Join-Path $src.FullName "skills") -Directory | Where-Object { $_.Name -ne "test-driven-development" } | ForEach-Object {
  $target = Join-Path $dst $_.Name
  if (Test-Path $target) { Remove-Item $target -Recurse -Force }
  Copy-Item $_.FullName $target -Recurse -Force
  Write-Host "  [installed] $($_.Name)"
}

Write-Host "[3/3] cleaning up ..."
Remove-Item $work -Recurse -Force
Write-Host ""
Write-Host "[OK] done. Open a NEW Claude Code session and ask it to list skills to verify."
