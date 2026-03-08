#!/usr/bin/env powershell
# Arreglar spotfetch.go
$spotfetch = Get-Content backend\spotfetch.go -Raw
$spotfetch = $spotfetch -replace '(\s+)if (.*?Items?) != nil \{\s+for', "`$1for"
$spotfetch = $spotfetch -replace 'if (\w+ != nil) && len\(', 'if len('
$spotfetch | Set-Content backend\spotfetch.go

# Arreglar spotify_metadata.go
$metadata = Get-Content backend\spotify_metadata.go -Raw
$metadata = $metadata -replace 'if items == nil \|\| len', 'if len'
$metadata | Set-Content backend\spotify_metadata.go

Write-Host "Done"
