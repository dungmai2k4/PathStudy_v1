$rootDir = "c:\Users\ADMIN\OneDrive\Desktop\PathStudy_v1"
$logDir = Join-Path $rootDir "logs"

function Load-Env {
    param ([string]$file)
    if (Test-Path $file) {
        Get-Content $file | ForEach-Object {
            $line = $_.Trim()
            if ($line -and -not $line.StartsWith("#")) {
                $parts = $line.Split("=", 2)
                if ($parts.Length -eq 2) {
                    [System.Environment]::SetEnvironmentVariable($parts[0].Trim(), $parts[1].Trim(), "Process")
                }
            }
        }
    }
}

# 1. Question Service
Load-Env (Join-Path $rootDir "services\question-service\.env")
$qs = Start-Process -FilePath "java" -ArgumentList @("-Xms96m", "-Xmx256m", "-jar", (Join-Path $rootDir "services\question-service\target\question-service-1.0.0-SNAPSHOT.jar")) -WorkingDirectory $rootDir -RedirectStandardOutput (Join-Path $logDir "question-service.log") -RedirectStandardError (Join-Path $logDir "question-service.err.log") -WindowStyle Hidden -PassThru

# 2. Assessment Service
Load-Env (Join-Path $rootDir "services\assessment-service\.env")
$as = Start-Process -FilePath "java" -ArgumentList @("-Xms96m", "-Xmx256m", "-jar", (Join-Path $rootDir "services\assessment-service\target\assessment-service-1.0.0-SNAPSHOT.jar")) -WorkingDirectory $rootDir -RedirectStandardOutput (Join-Path $logDir "assessment-service.log") -RedirectStandardError (Join-Path $logDir "assessment-service.err.log") -WindowStyle Hidden -PassThru

# 3. Adaptive Learning Service
Load-Env (Join-Path $rootDir "services\adaptive-learning-service\.env")
$als = Start-Process -FilePath "java" -ArgumentList @("-Xms96m", "-Xmx256m", "-jar", (Join-Path $rootDir "services\adaptive-learning-service\target\adaptive-learning-service-1.0.0-SNAPSHOT.jar")) -WorkingDirectory $rootDir -RedirectStandardOutput (Join-Path $logDir "adaptive-learning-service.log") -RedirectStandardError (Join-Path $logDir "adaptive-learning-service.err.log") -WindowStyle Hidden -PassThru

Write-Host "Started Services: QS PID=$($qs.Id), AS PID=$($as.Id), ALS PID=$($als.Id)"
