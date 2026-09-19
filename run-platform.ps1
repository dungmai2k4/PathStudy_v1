# Run-Platform daemon script: Keeps all PathStudy microservices and frontend alive
$rootDir = $PSScriptRoot
Set-Location $rootDir

$logDir = Join-Path $rootDir "logs"
if (-not (Test-Path $logDir)) {
    New-Item -ItemType Directory -Path $logDir | Out-Null
}

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "    PathStudy Platform Launcher           " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

$processes = @()

# 1. Eureka Server
Write-Host "[1/9] Starting Eureka Server (Port 8761)..." -ForegroundColor Yellow
$eureka = Start-Process -FilePath "java" `
    -ArgumentList @("-Xms64m", "-Xmx192m", "-jar", "$rootDir\infrastructure\eureka-server\target\eureka-server-1.0.0-SNAPSHOT.jar") `
    -WorkingDirectory $rootDir `
    -RedirectStandardOutput "$logDir\eureka-server.log" `
    -RedirectStandardError "$logDir\eureka-server.err.log" `
    -PassThru
$processes += $eureka

Write-Host "Waiting 8s for Eureka Server..." -ForegroundColor Gray
Start-Sleep -Seconds 8

# Function to launch Spring Boot service
function Launch-Service {
    param ($Name, $RelJar, $Port)
    Write-Host "Starting $Name (Port $Port)..." -ForegroundColor Yellow
    $p = Start-Process -FilePath "java" `
        -ArgumentList @("-Xms96m", "-Xmx256m", "-jar", "$rootDir\$RelJar") `
        -WorkingDirectory $rootDir `
        -RedirectStandardOutput "$logDir\$Name.log" `
        -RedirectStandardError "$logDir\$Name.err.log" `
        -PassThru
    return $p
}

# 2. API Gateway
$processes += Launch-Service "api-gateway" "services\api-gateway\target\api-gateway-1.0.0-SNAPSHOT.jar" 8088

# 3. Auth Service
$processes += Launch-Service "auth-service" "services\auth-service\target\auth-service-1.0.0-SNAPSHOT.jar" 8081

# 4. Content Service
$processes += Launch-Service "content-service" "services\content-service\target\content-service-1.0.0-SNAPSHOT.jar" 8082

# 5. Question Service
$processes += Launch-Service "question-service" "services\question-service\target\question-service-1.0.0-SNAPSHOT.jar" 8083

# 6. Assessment Service
$processes += Launch-Service "assessment-service" "services\assessment-service\target\assessment-service-1.0.0-SNAPSHOT.jar" 8084

# 7. Adaptive Learning Service
$processes += Launch-Service "adaptive-learning-service" "services\adaptive-learning-service\target\adaptive-learning-service-1.0.0-SNAPSHOT.jar" 8085

# 8. Payment Service
$processes += Launch-Service "payment-service" "services\payment-service\target\payment-service-1.0.0-SNAPSHOT.jar" 8087

# 9. Frontend
Write-Host "[9/9] Starting Frontend (Port 5173)..." -ForegroundColor Yellow
$fe = Start-Process -FilePath "cmd.exe" `
    -ArgumentList @("/c", "npm run dev") `
    -WorkingDirectory "$rootDir\frontend" `
    -RedirectStandardOutput "$logDir\frontend.log" `
    -RedirectStandardError "$logDir\frontend.err.log" `
    -PassThru
$processes += $fe

Write-Host ""
Write-Host "==========================================" -ForegroundColor Green
Write-Host "  PathStudy Platform is fully running!    " -ForegroundColor Green
Write-Host "  Frontend Web:  http://localhost:5173     " -ForegroundColor Green
Write-Host "  API Gateway:   http://localhost:8088     " -ForegroundColor Green
Write-Host "  Eureka Portal: http://localhost:8761     " -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green

# Loop to monitor processes and keep runner alive
try {
    while ($true) {
        Start-Sleep -Seconds 30
    }
} finally {
    Write-Host "Terminating child processes..." -ForegroundColor Gray
    foreach ($p in $processes) {
        if ($p -and -not $p.HasExited) {
            Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue
        }
    }
}
