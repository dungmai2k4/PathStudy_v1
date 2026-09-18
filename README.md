# PathStudy — Adaptive Learning Platform

Adaptive Learning Platform (PathStudy_v1) là hệ thống học tập thích ứng thông minh xây dựng trên kiến trúc Microservices với Spring Boot, Spring Cloud, PostgreSQL và Frontend React + Vite + Tailwind CSS.

---

## 1. Cấu Trúc Dự Án

```text
PathStudy_v1/
├── common/
│   └── common-library/          # DTOs, Exceptions, BaseEntity, JwtUtils
├── infrastructure/
│   └── eureka-server/           # Service Discovery (Port 8761)
├── services/
│   ├── api-gateway/             # Spring Cloud Gateway (Port 8088)
│   ├── auth-service/            # Auth, User, Profile & Pro Subscription (Port 8081)
│   ├── content-service/         # Sắp triển khai (Phase 3)
│   ├── question-service/        # Sắp triển khai (Phase 4)
│   ├── assessment-service/      # Sắp triển khai (Phase 5)
│   ├── adaptive-learning-service/# Sắp triển khai (Phase 6)
│   └── progress-service/        # Sắp triển khai (Phase 7)
├── frontend/                    # React 19 + Vite + Tailwind CSS + JavaScript (Port 5173)
├── docs/                        # 13 tài liệu đặc tả kỹ thuật chi tiết
├── pom.xml                      # Maven Multi-Module Root POM
└── README.md
```

---

## 2. Bảng Cấu Hình Port Cục Bộ

| Dịch vụ | Công nghệ | Port |
| :--- | :--- | :--- |
| **PostgreSQL 18** | Local Database | `5432` |
| **Eureka Server** | Spring Cloud Netflix Eureka | `8761` |
| **API Gateway** | Spring Cloud Gateway | `8088` |
| **Auth / User Service** | Spring Boot 3.3.4 | `8081` |
| **Frontend Web** | React 19 + Vite + Tailwind CSS | `5173` |

---

## 3. Hướng Dẫn Khởi Động Dự Án

### 3.1. Cơ sở dữ liệu PostgreSQL
Đảm bảo PostgreSQL đang chạy trên cổng `5432` với tài khoản `postgres` / `123456`.
6 cơ sở dữ liệu đã được tạo sẵn:
- `auth_db`
- `content_db`
- `question_db`
- `assessment_db`
- `adaptive_db`
- `progress_db`

### 3.2. Build và chạy Backend
Tại thư mục gốc dự án:
```powershell
# Build toàn bộ các module
mvn clean install -DskipTests

# Chạy Eureka Server (Terminal 1)
mvn spring-boot:run -pl infrastructure/eureka-server

# Chạy API Gateway (Terminal 2)
mvn spring-boot:run -pl services/api-gateway

# Chạy Auth Service (Terminal 3)
mvn spring-boot:run -pl services/auth-service
```

### 3.3. Chạy Frontend
Tại thư mục `frontend/`:
```powershell
npm.cmd run dev
```
Truy cập giao diện tại: `http://localhost:5173`

---

## 4. Tài Khoản Demo Để Thử Nghiệm
- **Tên đăng nhập:** `student_demo`
- **Mật khẩu:** `Password123@`
- **Khối lớp:** Khối 11 (Lớp 11A3)
- **Gói dịch vụ:** Đã nâng cấp thành viên **PRO**
