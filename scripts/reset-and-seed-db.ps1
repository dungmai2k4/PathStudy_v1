# ========================================================
# PathStudy Platform - Database Reset & SQL Seeder Script
# ========================================================

$DB_HOST = "localhost"
$DB_PORT = "5432"
$DB_USER = "postgres"
$DB_PASS = "123456"

# Load DB_PASSWORD from .env if available
$envFile = Join-Path $PSScriptRoot "..\services\auth-service\.env"
if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        $line = $_.Trim()
        if ($line -match "^DB_PASSWORD=(.*)$") {
            $DB_PASS = $matches[1].Trim()
        }
        if ($line -match "^DB_HOST=(.*)$") {
            $DB_HOST = $matches[1].Trim()
        }
        if ($line -match "^DB_PORT=(.*)$") {
            $DB_PORT = $matches[1].Trim()
        }
        if ($line -match "^DB_USERNAME=(.*)$") {
            $DB_USER = $matches[1].Trim()
        }
    }
}

$env:PGPASSWORD = $DB_PASS
$sqlDir = Join-Path $PSScriptRoot "sql"

Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host "   PathStudy Platform - Database Reset & SQL Seeder     " -ForegroundColor Cyan
Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host "Target: $DB_USER@${DB_HOST}:${DB_PORT}" -ForegroundColor Yellow

# Function to execute SQL file
function Execute-SqlFile {
    param(
        [string]$db,
        [string]$file,
        [string]$desc
    )
    Write-Host "`n>> [$db] $desc..." -ForegroundColor White
    $filePath = Join-Path $sqlDir $file
    if (-not (Test-Path $filePath)) {
        Write-Host "   [ERROR] File not found: $filePath" -ForegroundColor Red
        return
    }
    
    $result = psql -U $DB_USER -h $DB_HOST -p $DB_PORT -d $db -f $filePath 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   [OK] Success!" -ForegroundColor Green
    } else {
        Write-Host "   [FAIL] $result" -ForegroundColor Red
    }
}

# ---------------------------------------------------------
# 1. CLEAR ALL DATABASES
# ---------------------------------------------------------
Write-Host "`n>>> BẮT ĐẦU CLEAR HẾT DỮ LIỆU CÁC DATABASE..." -ForegroundColor Magenta

Execute-SqlFile "auth_db"       "00_clear_auth.sql"       "Clearing auth_db"
Execute-SqlFile "content_db"    "00_clear_content.sql"    "Clearing content_db"
Execute-SqlFile "question_db"   "00_clear_question.sql"   "Clearing question_db"
Execute-SqlFile "assessment_db" "00_clear_assessment.sql" "Clearing assessment_db"
Execute-SqlFile "adaptive_db"   "00_clear_adaptive.sql"   "Clearing adaptive_db"
Execute-SqlFile "payment_db"    "00_clear_payment.sql"    "Clearing payment_db"

# ---------------------------------------------------------
# 2. SEED SAMPLE DATA
# ---------------------------------------------------------
Write-Host "`n>>> BẮT ĐẦU NẠP DỮ LIỆU MẪU BẰNG SQL..." -ForegroundColor Magenta

Execute-SqlFile "auth_db"       "01_seed_auth.sql"       "Seeding auth_db (Roles, Accounts, Subscriptions)"
Execute-SqlFile "content_db"    "02_seed_content.sql"    "Seeding content_db (Subjects, Modules, Topics, Lessons, Quizzes)"
Execute-SqlFile "question_db"   "03_seed_question.sql"   "Seeding question_db (Bank, Questions, Options)"
Execute-SqlFile "assessment_db" "04_seed_assessment.sql" "Seeding assessment_db (Assessments, Attempts, Results)"
Execute-SqlFile "adaptive_db"   "05_seed_adaptive.sql"   "Seeding adaptive_db (Profiles, Study Paths, Progress)"
Execute-SqlFile "payment_db"    "06_seed_payment.sql"    "Seeding payment_db (Payment Orders)"

# ---------------------------------------------------------
# 3. VERIFY & REPORT RECORD COUNTS
# ---------------------------------------------------------
Write-Host "`n=========================================================" -ForegroundColor Cyan
Write-Host "               THỐNG KÊ DỮ LIỆU SAU KHI NẠP              " -ForegroundColor Cyan
Write-Host "=========================================================" -ForegroundColor Cyan

function Print-Count {
    param([string]$db, [string]$table)
    $cnt = (psql -U $DB_USER -h $DB_HOST -p $DB_PORT -d $db -t -A -c "SELECT count(*) FROM $table" 2>&1).Trim()
    [PSCustomObject]@{
        Database = $db
        Table    = $table
        Rows     = $cnt
    }
}

$summary = @(
    Print-Count "auth_db" "roles"
    Print-Count "auth_db" "users"
    Print-Count "auth_db" "account"
    Print-Count "auth_db" "student_profile"
    Print-Count "auth_db" "subscription_plan"
    Print-Count "auth_db" "user_subscription"
    Print-Count "content_db" "subject"
    Print-Count "content_db" "module"
    Print-Count "content_db" "topic"
    Print-Count "content_db" "skill"
    Print-Count "content_db" "lesson"
    Print-Count "content_db" "example"
    Print-Count "content_db" "mini_quiz"
    Print-Count "question_db" "question_bank"
    Print-Count "question_db" "question"
    Print-Count "question_db" "question_option"
    Print-Count "assessment_db" "assessments"
    Print-Count "assessment_db" "assessment_questions"
    Print-Count "assessment_db" "assessment_attempts"
    Print-Count "assessment_db" "assessment_answers"
    Print-Count "assessment_db" "skill_assessment_results"
    Print-Count "adaptive_db" "skill_profiles"
    Print-Count "adaptive_db" "study_paths"
    Print-Count "adaptive_db" "study_path_skill_nodes"
    Print-Count "adaptive_db" "student_lesson_progress"
    Print-Count "payment_db" "payment_order"
)

$summary | Format-Table -AutoSize

Write-Host "Hoàn tất kiểm tra và nạp dữ liệu thành công!" -ForegroundColor Green
