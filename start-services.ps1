# Script to start all PathStudy microservices and frontend
param (
    [switch]$NoFrontend
)

$rootDir = $PSScriptRoot
Set-Location $rootDir

$logDir = Join-Path $rootDir "logs"
if (-not (Test-Path $logDir)) {
    New-Item -ItemType Directory -Path $logDir | Out-Null
}

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "     PathStudy Platform Launching...      " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# 1. Start Eureka Server
Write-Host "[1/9] Starting Eureka Server (Port 8761)..." -ForegroundColor Yellow
$eurekaJar = Join-Path $rootDir "infrastructure\eureka-server\target\eureka-server-1.0.0-SNAPSHOT.jar"
Start-Process -FilePath "java" `
    -ArgumentList @("-Xms64m", "-Xmx192m", "-jar", $eurekaJar) `
    -WorkingDirectory $rootDir `
    -RedirectStandardOutput (Join-Path $logDir "eureka-server.log") `
    -RedirectStandardError (Join-Path $logDir "eureka-server.err.log") `
    -WindowStyle Hidden

Write-Host "Waiting 8s for Eureka Server to initialize..." -ForegroundColor Gray
Start-Sleep -Seconds 8

# Helper function to load .env file into current environment
function Load-EnvFile {
    param ([string]$EnvFilePath)
    if (Test-Path $EnvFilePath) {
        Get-Content $EnvFilePath | ForEach-Object {
            $line = $_.Trim()
            if ($line -and -not $line.StartsWith("#")) {
                $parts = $line -split "=", 2
                if ($parts.Length -eq 2) {
                    [System.Environment]::SetEnvironmentVariable($parts[0].Trim(), $parts[1].Trim(), "Process")
                }
            }
        }
        Write-Host "  -> Loaded env from: $EnvFilePath" -ForegroundColor DarkGray
    } else {
        Write-Host "  -> WARNING: No .env file found at $EnvFilePath" -ForegroundColor Red
    }
}

# Helper function to launch a microservice
function Start-ServiceJar {
    param (
        [string]$Step,
        [string]$Name,
        [string]$RelPath,
        [int]$Port,
        [string]$EnvFile = "",
        [string]$MinMem = "-Xms96m",
        [string]$MaxMem = "-Xmx256m"
    )
    Write-Host "[$Step] Starting $Name (Port $Port)..." -ForegroundColor Yellow
    if ($EnvFile) { Load-EnvFile -EnvFilePath $EnvFile }
    $jarPath = Join-Path $rootDir $RelPath
    Start-Process -FilePath "java" `
        -ArgumentList @($MinMem, $MaxMem, "-jar", $jarPath) `
        -WorkingDirectory $rootDir `
        -RedirectStandardOutput (Join-Path $logDir "$Name.log") `
        -RedirectStandardError (Join-Path $logDir "$Name.err.log") `
        -WindowStyle Hidden
}

# 2. Start API Gateway
Start-ServiceJar -Step "2/9" -Name "api-gateway" -RelPath "services\api-gateway\target\api-gateway-1.0.0-SNAPSHOT.jar" -Port 8088 -EnvFile (Join-Path $rootDir "services\api-gateway\.env")

# 3. Start Auth Service
Start-ServiceJar -Step "3/9" -Name "auth-service" -RelPath "services\auth-service\target\auth-service-1.0.0-SNAPSHOT.jar" -Port 8081 -EnvFile (Join-Path $rootDir "services\auth-service\.env")

# 4. Start Content Service
Start-ServiceJar -Step "4/9" -Name "content-service" -RelPath "services\content-service\target\content-service-1.0.0-SNAPSHOT.jar" -Port 8082 -EnvFile (Join-Path $rootDir "services\content-service\.env")

# 5. Start Question Service
Start-ServiceJar -Step "5/9" -Name "question-service" -RelPath "services\question-service\target\question-service-1.0.0-SNAPSHOT.jar" -Port 8083 -EnvFile (Join-Path $rootDir "services\question-service\.env")

# 6. Start Assessment Service
Start-ServiceJar -Step "6/9" -Name "assessment-service" -RelPath "services\assessment-service\target\assessment-service-1.0.0-SNAPSHOT.jar" -Port 8084 -EnvFile (Join-Path $rootDir "services\assessment-service\.env")

# 7. Start Adaptive Learning Service
Start-ServiceJar -Step "7/9" -Name "adaptive-learning-service" -RelPath "services\adaptive-learning-service\target\adaptive-learning-service-1.0.0-SNAPSHOT.jar" -Port 8085 -EnvFile (Join-Path $rootDir "services\adaptive-learning-service\.env")

# 8. Start Payment Service
Start-ServiceJar -Step "8/9" -Name "payment-service" -RelPath "services\payment-service\target\payment-service-1.0.0-SNAPSHOT.jar" -Port 8087 -EnvFile (Join-Path $rootDir "services\payment-service\.env")

# 9. Start Frontend
if (-not $NoFrontend) {
    Write-Host "[9/9] Starting Frontend (Port 5173)..." -ForegroundColor Yellow
    $frontendDir = Join-Path $rootDir "frontend"
    Start-Process -FilePath "cmd.exe" `
        -ArgumentList @("/c", "npm run dev") `
        -WorkingDirectory $frontendDir `
        -RedirectStandardOutput (Join-Path $logDir "frontend.log") `
        -RedirectStandardError (Join-Path $logDir "frontend.err.log") `
        -WindowStyle Hidden
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Green
Write-Host "  All Services are starting in background!" -ForegroundColor Green
Write-Host "  Frontend:      http://localhost:5173" -ForegroundColor Green
Write-Host "  API Gateway:   http://localhost:8088" -ForegroundColor Green
Write-Host "  Eureka Portal: http://localhost:8761" -ForegroundColor Green
Write-Host "  Logs dir:      $logDir" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
