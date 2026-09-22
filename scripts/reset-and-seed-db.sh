#!/usr/bin/env bash
# ========================================================
# PathStudy Platform - Database Reset & SQL Seeder (Linux / VPS)
# ========================================================
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SQL_DIR="$SCRIPT_DIR/sql"

DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_USER="${DB_USERNAME:-postgres}"
DB_PASS="${DB_PASSWORD:-123456}"

export PGPASSWORD="$DB_PASS"

echo "========================================================="
echo "   PathStudy Platform - Database Reset & SQL Seeder      "
echo "========================================================="
echo "Target: $DB_USER@${DB_HOST}:${DB_PORT}"

execute_sql() {
    local db="$1"
    local file="$2"
    local desc="$3"
    echo -e "\n>> [$db] $desc..."
    local file_path="$SQL_DIR/$file"
    if [ ! -f "$file_path" ]; then
        echo "   [ERROR] File not found: $file_path"
        return 1
    fi
    psql -U "$DB_USER" -h "$DB_HOST" -p "$DB_PORT" -d "$db" -f "$file_path" > /dev/null
    echo "   [OK] Success!"
}

echo -e "\n>>> 1. CLEAR ALL DATABASES..."
execute_sql "auth_db"       "00_clear_auth.sql"       "Clearing auth_db"
execute_sql "content_db"    "00_clear_content.sql"    "Clearing content_db"
execute_sql "question_db"   "00_clear_question.sql"   "Clearing question_db"
execute_sql "assessment_db" "00_clear_assessment.sql" "Clearing assessment_db"
execute_sql "adaptive_db"   "00_clear_adaptive.sql"   "Clearing adaptive_db"
execute_sql "payment_db"    "00_clear_payment.sql"    "Clearing payment_db"

echo -e "\n>>> 2. SEED SAMPLE DATA..."
execute_sql "auth_db"       "01_seed_auth.sql"       "Seeding auth_db (Roles, Accounts, Subscriptions)"
execute_sql "content_db"    "02_seed_content.sql"    "Seeding content_db (Subjects, Modules, Topics, Lessons)"
execute_sql "question_db"   "03_seed_question.sql"   "Seeding question_db (Bank, Questions, Options)"
execute_sql "assessment_db" "04_seed_assessment.sql" "Seeding assessment_db (Assessments, Attempts, Results)"
execute_sql "adaptive_db"   "05_seed_adaptive.sql"   "Seeding adaptive_db (Profiles, Study Paths, Progress)"
execute_sql "payment_db"    "06_seed_payment.sql"    "Seeding payment_db (Payment Orders)"

echo -e "\n========================================================="
echo "               THỐNG KÊ DỮ LIỆU SAU KHI NẠP              "
echo "========================================================="

print_count() {
    local db="$1"
    local table="$2"
    local count
    count=$(psql -U "$DB_USER" -h "$DB_HOST" -p "$DB_PORT" -d "$db" -t -A -c "SELECT count(*) FROM $table" 2>/dev/null || echo "0")
    printf "%-16s | %-28s | %s\n" "$db" "$table" "$count"
}

printf "%-16s | %-28s | %s\n" "Database" "Table" "Rows"
echo "-----------------+------------------------------+------"
print_count "auth_db" "roles"
print_count "auth_db" "users"
print_count "auth_db" "account"
print_count "auth_db" "student_profile"
print_count "auth_db" "subscription_plan"
print_count "auth_db" "user_subscription"
print_count "content_db" "subject"
print_count "content_db" "module"
print_count "content_db" "topic"
print_count "content_db" "skill"
print_count "content_db" "lesson"
print_count "question_db" "question"
print_count "question_db" "question_option"
print_count "assessment_db" "assessments"
print_count "assessment_db" "assessment_attempts"
print_count "adaptive_db" "study_paths"
print_count "payment_db" "payment_order"

echo -e "\nHoàn tất nạp dữ liệu thành công!"
