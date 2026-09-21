# Script to launch and manage all PathStudy microservices and frontend
param (
    [switch]$Background,   # Run all services detached in background
    [switch]$NoFrontend,   # Skip starting frontend
    [switch]$Stop          # Stop all running PathStudy services
)

$rootDir = $PSScriptRoot
Set-Location $rootDir

$logDir = Join-Path $rootDir "logs"
if (-not (Test-Path $logDir)) {
    New-Item -ItemType Directory -Path $logDir | Out-Null
}

$servicePorts = @(8761, 8088, 8081, 8082, 8083, 8084, 8085, 8087, 5173)

# Function to stop all services running on registered ports
function Stop-PathStudyServices {
    Write-Host "==========================================" -ForegroundColor Cyan
    Write-Host "    Stopping PathStudy Services...        " -ForegroundColor Cyan
    Write-Host "==========================================" -ForegroundColor Cyan

    foreach ($port in $servicePorts) {
        $connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
        if ($connections) {
            $pids = $connections | Select-Object -ExpandProperty OwningProcess -Unique
            foreach ($p in $pids) {
                try {
                    $proc = Get-Process -Id $p -ErrorAction SilentlyContinue
                    if ($proc) {
                        Write-Host "  -> Stopping $($proc.ProcessName) (PID: $p) on port $port..." -ForegroundColor Yellow
                        Stop-Process -Id $p -Force -ErrorAction SilentlyContinue
                    }
                } catch {
                    Write-Host "  -> Could not stop PID $p : $_" -ForegroundColor Red
                }
            }
        }
    }
    Write-Host "All services stopped successfully." -ForegroundColor Green
}

# If -Stop is requested, stop services and exit
if ($Stop) {
    Stop-PathStudyServices
    exit 0
}

# Helper function to load .env file into current process environment
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
    }
}

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "    PathStudy Platform Launcher           " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

$processes = @()

# 1. Eureka Server
Write-Host "[1/9] Starting Eureka Server (Port 8761)..." -ForegroundColor Yellow
$eurekaJar = Join-Path $rootDir "infrastructure\eureka-server\target\eureka-server-1.0.0-SNAPSHOT.jar"
if (-not (Test-Path $eurekaJar)) {
    Write-Host "ERROR: Eureka JAR not found at $eurekaJar. Run 'mvn clean install -DskipTests' first." -ForegroundColor Red
    exit 1
}

$eureka = Start-Process -FilePath "java" `
    -ArgumentList @("-Xms64m", "-Xmx192m", "-jar", $eurekaJar) `
    -WorkingDirectory $rootDir `
    -RedirectStandardOutput (Join-Path $logDir "eureka-server.log") `
    -RedirectStandardError (Join-Path $logDir "eureka-server.err.log") `
    -WindowStyle Hidden `
    -PassThru

$processes += $eureka

Write-Host "Waiting 8s for Eureka Server to initialize..." -ForegroundColor Gray
Start-Sleep -Seconds 8

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
    if (-not (Test-Path $jarPath)) {
        Write-Host "ERROR: JAR not found for $Name at $jarPath. Run 'mvn clean install -DskipTests' first." -ForegroundColor Red
        return $null
    }

    $p = Start-Process -FilePath "java" `
        -ArgumentList @($MinMem, $MaxMem, "-jar", $jarPath) `
        -WorkingDirectory $rootDir `
        -RedirectStandardOutput (Join-Path $logDir "$Name.log") `
        -RedirectStandardError (Join-Path $logDir "$Name.err.log") `
        -WindowStyle Hidden `
        -PassThru
    return $p
}

# 2-8 Microservices
$processes += Start-ServiceJar -Step "2/9" -Name "api-gateway" -RelPath "services\api-gateway\target\api-gateway-1.0.0-SNAPSHOT.jar" -Port 8088 -EnvFile (Join-Path $rootDir "services\api-gateway\.env")
$processes += Start-ServiceJar -Step "3/9" -Name "auth-service" -RelPath "services\auth-service\target\auth-service-1.0.0-SNAPSHOT.jar" -Port 8081 -EnvFile (Join-Path $rootDir "services\auth-service\.env")
$processes += Start-ServiceJar -Step "4/9" -Name "content-service" -RelPath "services\content-service\target\content-service-1.0.0-SNAPSHOT.jar" -Port 8082 -EnvFile (Join-Path $rootDir "services\content-service\.env")
$processes += Start-ServiceJar -Step "5/9" -Name "question-service" -RelPath "services\question-service\target\question-service-1.0.0-SNAPSHOT.jar" -Port 8083 -EnvFile (Join-Path $rootDir "services\question-service\.env")
$processes += Start-ServiceJar -Step "6/9" -Name "assessment-service" -RelPath "services\assessment-service\target\assessment-service-1.0.0-SNAPSHOT.jar" -Port 8084 -EnvFile (Join-Path $rootDir "services\assessment-service\.env")
$processes += Start-ServiceJar -Step "7/9" -Name "adaptive-learning-service" -RelPath "services\adaptive-learning-service\target\adaptive-learning-service-1.0.0-SNAPSHOT.jar" -Port 8085 -EnvFile (Join-Path $rootDir "services\adaptive-learning-service\.env")
$processes += Start-ServiceJar -Step "8/9" -Name "payment-service" -RelPath "services\payment-service\target\payment-service-1.0.0-SNAPSHOT.jar" -Port 8087 -EnvFile (Join-Path $rootDir "services\payment-service\.env")

# 9. Frontend
if (-not $NoFrontend) {
    Write-Host "[9/9] Starting Frontend (Port 5173)..." -ForegroundColor Yellow
    $frontendDir = Join-Path $rootDir "frontend"
    $fe = Start-Process -FilePath "cmd.exe" `
        -ArgumentList @("/c", "npm run dev") `
        -WorkingDirectory $frontendDir `
        -RedirectStandardOutput (Join-Path $logDir "frontend.log") `
        -RedirectStandardError (Join-Path $logDir "frontend.err.log") `
        -WindowStyle Hidden `
        -PassThru
    $processes += $fe
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Green
Write-Host "  PathStudy Platform is fully running!    " -ForegroundColor Green
Write-Host "  Frontend Web:  http://localhost:5173     " -ForegroundColor Green
Write-Host "  API Gateway:   http://localhost:8088     " -ForegroundColor Green
Write-Host "  Eureka Portal: http://localhost:8761     " -ForegroundColor Green
Write-Host "  Logs dir:      $logDir" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green

if ($Background) {
    Write-Host "Running in background mode. Terminal released." -ForegroundColor Cyan
    Write-Host "To stop all services: .\start-services.ps1 -Stop" -ForegroundColor Yellow
    exit 0
}

Write-Host "Running in foreground mode. Press Ctrl+C to stop all services..." -ForegroundColor Cyan

# Keep process alive and gracefully clean up on exit / Ctrl+C
try {
    while ($true) {
        Start-Sleep -Seconds 2
    }
} finally {
    Write-Host "`nStopping all child processes..." -ForegroundColor Gray
    Stop-PathStudyServices
}
