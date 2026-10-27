# Install the 15 bundled methodology skills into ~/.claude/skills
# Skills are vendored from obra/superpowers and obra/superpowers-marketplace
# (MIT, Copyright (c) 2025 Jesse Vincent).
# See LICENSE-superpowers and README.md in this folder.
# Usage (Windows PowerShell):
#   powershell -ExecutionPolicy Bypass -File .\install-skills.ps1
$ErrorActionPreference = "Stop"

$src = $PSScriptRoot
$dst = Join-Path $env:USERPROFILE ".claude\skills"

Write-Host "[1/2] installing to $dst ..."
New-Item -ItemType Directory $dst -Force | Out-Null

# Remove skills this repo no longer recommends (only if they exist)
foreach ($s in @("grill-me", "code-review", "diagnosing-bugs", "writing-for-agents", "using-superpowers")) {
  $p = Join-Path $dst $s
  if (Test-Path $p) { Remove-Item $p -Recurse -Force; Write-Host "  [removed]   $s" }
}

$count = 0
Get-ChildItem $src -Directory | ForEach-Object {
  $target = Join-Path $dst $_.Name
  if (Test-Path $target) { Remove-Item $target -Recurse -Force }
  Copy-Item $_.FullName $target -Recurse -Force
  Write-Host "  [installed] $($_.Name)"
  $count++
}

Write-Host "[2/2] done. Open a NEW Claude Code session and verify with: ls ~/.claude/skills"

Write-Host ""
Write-Host "[OK] installed $count skills. Open a NEW Claude Code session and verify."
