# Script to build all PathStudy microservices JAR files via Maven
$rootDir = (Get-Item $PSScriptRoot).Parent.FullName
Set-Location $rootDir

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  Building PathStudy Microservices JARs (Maven Package)   " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Check Maven
if (-not (Get-Command mvn -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: Maven (mvn) not found in PATH." -ForegroundColor Red
    exit 1
}

# 2. Package all modules
Write-Host "Executing 'mvn clean package -DskipTests'..." -ForegroundColor Yellow
mvn clean package -DskipTests

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Maven package failed." -ForegroundColor Red
    exit 1
}

# 3. Verify JAR outputs
$jars = @(
    "infrastructure\eureka-server\target\eureka-server-1.0.0-SNAPSHOT.jar",
    "services\api-gateway\target\api-gateway-1.0.0-SNAPSHOT.jar",
    "services\auth-service\target\auth-service-1.0.0-SNAPSHOT.jar",
    "services\content-service\target\content-service-1.0.0-SNAPSHOT.jar",
    "services\question-service\target\question-service-1.0.0-SNAPSHOT.jar",
    "services\assessment-service\target\assessment-service-1.0.0-SNAPSHOT.jar",
    "services\adaptive-learning-service\target\adaptive-learning-service-1.0.0-SNAPSHOT.jar",
    "services\payment-service\target\payment-service-1.0.0-SNAPSHOT.jar"
)

Write-Host "`nVerifying generated artifacts..." -ForegroundColor Gray
$allOk = $true
foreach ($jar in $jars) {
    $fullPath = Join-Path $rootDir $jar
    if (Test-Path $fullPath) {
        Write-Host "  [OK] Found: $jar" -ForegroundColor Green
    } else {
        Write-Host "  [FAILED] Missing: $jar" -ForegroundColor Red
        $allOk = $false
    }
}

if ($allOk) {
    Write-Host "`nSUCCESS: All 8 microservice JARs are ready!" -ForegroundColor Green
    Write-Host "You can now run: docker compose -f docker-compose.prod.yml up -d --build" -ForegroundColor Cyan
} else {
    Write-Host "`nERROR: Some JAR files are missing." -ForegroundColor Red
    exit 1
}
