#!/usr/bin/env bash
set -e

echo "=========================================================="
echo "  Building PathStudy Microservices JARs (Maven Package)   "
echo "=========================================================="

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
cd "$ROOT_DIR"

# 1. Check Maven installation
if ! command -v mvn &> /dev/null; then
    echo "ERROR: Maven (mvn) is not installed or not in PATH."
    exit 1
fi

# 2. Package all modules skipping tests for fast production builds
echo "Running: mvn clean package -DskipTests..."
mvn clean package -DskipTests

# 3. Verify JAR outputs
JARS=(
    "infrastructure/eureka-server/target/eureka-server-1.0.0-SNAPSHOT.jar"
    "services/api-gateway/target/api-gateway-1.0.0-SNAPSHOT.jar"
    "services/auth-service/target/auth-service-1.0.0-SNAPSHOT.jar"
    "services/content-service/target/content-service-1.0.0-SNAPSHOT.jar"
    "services/question-service/target/question-service-1.0.0-SNAPSHOT.jar"
    "services/assessment-service/target/assessment-service-1.0.0-SNAPSHOT.jar"
    "services/adaptive-learning-service/target/adaptive-learning-service-1.0.0-SNAPSHOT.jar"
    "services/payment-service/target/payment-service-1.0.0-SNAPSHOT.jar"
)

echo ""
echo "Verifying generated artifacts..."
ALL_FOUND=true
for jar in "${JARS[@]}"; do
    if [ -f "$jar" ]; then
        echo "  [OK] Found: $jar"
    else
        echo "  [FAILED] Missing: $jar"
        ALL_FOUND=false
    fi
done

if [ "$ALL_FOUND" = true ]; then
    echo ""
    echo "SUCCESS: All 8 microservice JARs were successfully built!"
    echo "You can now run: docker compose -f docker-compose.prod.yml up -d --build"
else
    echo "ERROR: One or more JAR files failed to build."
    exit 1
fi
