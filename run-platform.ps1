# run-platform.ps1 has been merged into start-services.ps1
Write-Host "Notice: 'run-platform.ps1' is now merged into 'start-services.ps1'." -ForegroundColor DarkCyan
& "$PSScriptRoot\start-services.ps1" @args
