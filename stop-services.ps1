# Script to stop all PathStudy services and frontend
$ports = @(8761, 8088, 8081, 8082, 8083, 8084, 8085, 8087, 5173)

Write-Host "Stopping PathStudy services..." -ForegroundColor Cyan

foreach ($port in $ports) {
    $connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($connections) {
        $pids = $connections | Select-Object -ExpandProperty OwningProcess -Unique
        foreach ($p in $pids) {
            try {
                $proc = Get-Process -Id $p -ErrorAction SilentlyContinue
                if ($proc) {
                    Write-Host "Stopping process $($proc.ProcessName) (PID: $p) on port $port..." -ForegroundColor Yellow
                    Stop-Process -Id $p -Force -ErrorAction SilentlyContinue
                }
            } catch {
                Write-Host "Could not stop PID $p : $_" -ForegroundColor Red
            }
        }
    }
}

Write-Host "All services stopped successfully." -ForegroundColor Green
