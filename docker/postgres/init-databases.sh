#!/bin/sh
set -e
set -u

# Script automatically executed by Postgres Docker container on initial creation
create_database() {
    database="$1"
    echo "  [Postgres Init] Checking / Creating database: '$database'..."
    psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
        SELECT 'CREATE DATABASE $database'
        WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '$database')\gexec
        GRANT ALL PRIVILEGES ON DATABASE $database TO $POSTGRES_USER;
EOSQL
}

# List of all microservice databases
DATABASES="auth_db content_db question_db assessment_db adaptive_db payment_db"

echo "=========================================================="
echo " Starting PathStudy Multi-Database Initialization Script"
echo "=========================================================="

for db in $DATABASES; do
    create_database "$db"
done

echo "All PathStudy databases initialized successfully!"
