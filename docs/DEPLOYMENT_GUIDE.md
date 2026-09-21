# Cẩm Nang Triển Khai Hệ Thống PathStudy Lên Web Thực Tế (Production Deployment Guide)

Tài liệu này hướng dẫn chi tiết từ A-Z quy trình triển khai toàn bộ hệ thống nền tảng học tập thích ứng **PathStudy** (gồm 8 Spring Boot Microservices, PostgreSQL và React Frontend) lên máy chủ VPS Linux (Ubuntu).

---

## 1. Yêu Cầu & Chuẩn Bị Hạ Tầng

### 1.1. Cấu hình VPS Khuyến Nghị
Hệ thống gồm 8 tiến trình Spring Boot Java 21, PostgreSQL và Nginx. Các service đã được tinh chỉnh JVM flags (`-XX:+UseSerialGC -Xms96m -Xmx256m`) để tối ưu hóa bộ nhớ.
* **CPU:** Tối thiểu 2 Cores (khuyến nghị 4 Cores).
* **RAM:** Tối thiểu **4GB RAM** (BẮT BUỘC tạo thêm 4GB Swap) hoặc tốt nhất là **8GB RAM**.
* **Ổ cứng:** Tối thiểu 30GB SSD / NVMe.
* **Hệ điều hành:** Ubuntu 22.04 LTS hoặc Ubuntu 24.04 LTS.
* **Nhà cung cấp:**
  * Quốc tế: Hetzner (Gói CX22 / CX32 ~4-7€/tháng - hiệu năng rất cao, giá tốt), Contabo, DigitalOcean, Linode.
  * Việt Nam: Vietnix, TinoHost, AZDIGI, BKNS (Gói VPS 4GB - 8GB RAM).

### 1.2. Tên Miền (Domain) & DNS
1. Sở hữu một tên miền (Ví dụ: `studypath.vn` hoặc `yourdomain.com`).
2. Trỏ bản ghi DNS tại nhà cung cấp tên miền (hoặc Cloudflare):
   * **Bản ghi A:** `@` (hoặc `yourdomain.com`) -> Trỏ về `IP_CỦA_VPS`.
   * **Bản ghi A (hoặc CNAME):** `www` -> Trỏ về `IP_CỦA_VPS`.

---

## 2. Bước 1: Thiết Lập & Bảo Mật Máy Chủ VPS

Đăng nhập vào VPS bằng SSH từ máy tính của bạn:
```bash
ssh root@<IP_VPS>
```

### 2.1. Cập nhật hệ thống
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl wget git ufw htop
```

### 2.2. Tạo 4GB Swap (Bộ nhớ ảo - Chống tràn RAM OOM Killer)
> **Rất quan trọng:** Khi chạy nhiều microservices Java, Swap đảm bảo nếu có service tăng tải đột ngột, hệ điều hành sẽ không tự ý "giết" (kill) tiến trình.

```bash
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Kiểm tra lại swap:
free -h
```

### 2.3. Thiết lập Tường Lửa (UFW Firewall)
Chỉ mở các cổng cần thiết cho bên ngoài:
```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp     # Cổng SSH
sudo ufw allow 80/tcp     # Cổng HTTP (Web)
sudo ufw allow 443/tcp    # Cổng HTTPS (Web Bảo Mật)
sudo ufw --force enable
sudo ufw status
```
*(Các cổng nội bộ như `8761`, `8088`, `8081-8087`, `5432` đều được bảo vệ trong mạng nội bộ Docker, tuyệt đối không mở ra ngoài Internet).*

---

## 3. Bước 2: Cài Đặt Môi Trường (Docker, Java 21, Maven)

### 3.1. Cài đặt Docker & Docker Compose Plugin
```bash
# Cài đặt chứng chỉ và repository chính thức của Docker
sudo apt install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Kiểm tra
docker --version
docker compose version
```

### 3.2. Cài đặt OpenJDK 21 và Maven (Để build dự án)
```bash
sudo apt install -y openjdk-21-jdk-headless maven
java -version
mvn -version
```

---

## 4. Bước 3: Tải Mã Nguồn & Cấu Hình Biến Môi Trường

### 4.1. Clone dự án về thư mục `/var/www/`
```bash
sudo mkdir -p /var/www
cd /var/www
git clone <URL_REPO_GITHUB_CỦA_BẠN> PathStudy_v1
cd PathStudy_v1
```

### 4.2. Cấu hình file `.env` Production
Tạo file `.env` từ file mẫu `.env.prod.example`:
```bash
cp .env.prod.example .env
nano .env
```
Chỉnh sửa các giá trị thực tế của bạn:
```env
# 1. Mật khẩu DB an toàn
DB_USERNAME=postgres
DB_PASSWORD=TaoMatKhauPhucTapTaiDay_2026!

# 2. Chuỗi bảo mật JWT (Ít nhất 32 ký tự)
JWT_SECRET=TaoMotChuoiJwtBaoMatNgauNhienDaiItNhat32KyTuChoProduction2026!
JWT_EXPIRATION_MS=86400000

# 3. Tên miền trang web của bạn
CORS_ALLOWED_ORIGIN_PROD=https://your-domain.com

# 4. Cấu hình ngân hàng VietQR thực tế
VIETQR_BANK_ID=970422
VIETQR_ACCOUNT_NO=0123456789
VIETQR_ACCOUNT_NAME=NGUYEN VAN A
VIETQR_TEMPLATE=compact2

# 5. Token bảo mật Webhook thanh toán
PAYMENT_WEBHOOK_TOKEN=DatMotTokenBaoMatWebhookDaiVaKhoDoan2026
```
*(Bấm `Ctrl + O` -> `Enter` để lưu, `Ctrl + X` để thoát `nano`)*.

---

## 5. Bước 4: Đóng Gói & Khởi Chạy Hệ Thống

### 5.1. Build các file JAR Microservices
Chạy script tự động đã tạo sẵn:
```bash
chmod +x scripts/build-jars.sh
./scripts/build-jars.sh
```
*Script này sẽ biên dịch toàn bộ parent POM, `common-library` và 8 microservices, sau đó kiểm tra xác nhận cả 8 file `.jar` đều sẵn sàng.*

### 5.2. Khởi động toàn bộ cụm Container với Docker Compose
```bash
docker compose -f docker-compose.prod.yml up -d --build
```

### 5.3. Theo dõi tiến trình khởi động & logs
```bash
# Xem danh sách container đang chạy:
docker compose -f docker-compose.prod.yml ps

# Xem log theo thời gian thực:
docker compose -f docker-compose.prod.yml logs -f

# Xem mức tiêu thụ RAM và CPU của từng microservice:
docker stats
```
> **Lưu ý:** Trong lần đầu tiên chạy, Eureka Server và PostgreSQL sẽ khởi động trước. Sau ~30 đến 60 giây, tất cả các service con sẽ đăng ký thành công vào Eureka và sẵn sàng tiếp nhận request.

---

## 6. Bước 5: Cấu Hình Tên Miền & SSL (HTTPS) Miễn Phí

Có 2 cách kích hoạt HTTPS:

### Cách 1: Sử dụng Cloudflare (Nhanh nhất & Đơn giản nhất - Khuyên Dùng)
1. Thêm domain vào **Cloudflare** (Gói Miễn Phí).
2. Trỏ bản ghi **A** về IP của VPS và **Bật đám mây màu cam (Proxied)**.
3. Vào mục **SSL/TLS** trên Cloudflare:
   - Chọn chế độ mã hóa: **Full** hoặc **Flexible**.
   - Bật **Always Use HTTPS** và **Automatic HTTPS Rewrites**.
4. **Kết quả:** Trang web ngay lập tức có chứng chỉ HTTPS chuẩn quốc tế mà bạn không cần cấu hình phức tạp trên VPS!

---

### Cách 2: Cài Đặt Certbot (Let's Encrypt) Trực Tiếp Trên VPS
Nếu bạn trỏ trực tiếp không qua Cloudflare proxy:
1. Cài đặt Certbot:
   ```bash
   sudo apt install -y certbot python3-certbot-nginx
   ```
2. Cấp chứng chỉ SSL:
   ```bash
   sudo certbot certonly --standalone -d your-domain.com -d www.your-domain.com
   ```
3. Sau khi chứng chỉ được tạo tại `/etc/letsencrypt/live/your-domain.com/`, ánh xạ volume chứng chỉ vào container Nginx của frontend trong `docker-compose.prod.yml`.

---

## 7. Bước 6: Tự Động Sao Lưu Dữ Liệu (Database Backup Cronjob)

Tạo script tự động sao lưu dữ liệu mỗi ngày vào 02:00 sáng:
```bash
sudo mkdir -p /var/backups/pathstudy
```

Tạo file script:
```bash
sudo nano /var/backups/backup.sh
```
Nội dung script:
```bash
#!/bin/bash
BACKUP_DIR="/var/backups/pathstudy"
DATE=$(date +%Y%m%d_%H%M%S)
FILENAME="$BACKUP_DIR/pathstudy_backup_$DATE.sql.gz"

docker exec -t pathstudy-postgres pg_dumpall -U postgres | gzip > "$FILENAME"

# Xóa các bản sao lưu cũ hơn 14 ngày
find $BACKUP_DIR -type f -name "*.sql.gz" -mtime +14 -delete
```
Cấp quyền thực thi và thêm vào crontab:
```bash
sudo chmod +x /var/backups/backup.sh
(crontab -l 2>/dev/null; echo "0 2 * * * /var/backups/backup.sh") | crontab -
```

---

## 8. Các Lệnh Quản Lý Vận Hành Thường Dùng

| Thao tác | Câu lệnh |
| :--- | :--- |
| **Xem trạng thái các service** | `docker compose -f docker-compose.prod.yml ps` |
| **Xem giám sát RAM/CPU** | `docker stats` |
| **Xem log của 1 service cụ thể** | `docker compose -f docker-compose.prod.yml logs -f auth-service` |
| **Khởi động lại 1 service** | `docker compose -f docker-compose.prod.yml restart auth-service` |
| **Cập nhật code mới** | `git pull && ./scripts/build-jars.sh && docker compose -f docker-compose.prod.yml up -d --build` |
| **Dừng toàn bộ hệ thống** | `docker compose -f docker-compose.prod.yml down` |
| **Dọn dẹp image cũ tiết kiệm ổ cứng** | `docker image prune -f` |

---

## 9. Xử Lý Sự Cố Thường Gặp (Troubleshooting)

1. **Lỗi "Connection Refused" khi gọi database lần đầu:**
   * *Nguyên nhân:* Service khởi động nhanh hơn khi Postgres hoàn tất cấu trúc.
   * *Khắc phục:* `docker-compose.prod.yml` đã được trang bị `healthcheck` và `depends_on: condition: service_healthy`. Spring Boot sẽ tự động retry kết nối sau vài giây.
2. **Container bị tắt đột ngột (Exit 137):**
   * *Nguyên nhân:* Hết RAM hệ thống (OOM Killer).
   * *Khắc phục:* Đảm bảo đã bật **4GB Swap** theo Mục 2.2. Kiểm tra `free -h`.
3. **Frontend gọi API bị lỗi CORS:**
   * *Nguyên nhân:* Cấu hình domain chưa khớp hoặc gọi sai port.
   * *Khắc phục:* Với cấu hình Nginx Reverse Proxy ở cổng 80/443, mọi request đi qua `/api/` cùng origin với frontend nên hoàn toàn không xảy ra lỗi CORS. Đảm bảo `VITE_API_BASE_URL` trong frontend để trống hoặc trỏ đúng domain.
