-- ========================================================
-- SEED DATA FOR auth_db
-- ========================================================

-- 1. ROLES
INSERT INTO roles (id, name, created_at, updated_at) VALUES
('10000000-0000-0000-0000-000000000001', 'STUDENT', NOW(), NOW()),
('10000000-0000-0000-0000-000000000002', 'MANAGER', NOW(), NOW()),
('10000000-0000-0000-0000-000000000003', 'ADMIN', NOW(), NOW())
ON CONFLICT (name) DO UPDATE SET updated_at = NOW();

-- 2. SUBSCRIPTION PLANS
INSERT INTO subscription_plan (id, code, name, duration_days, price_vnd, status, created_at, updated_at) VALUES
('40000000-0000-0000-0000-000000000001', 'PRO_1_MONTH', 'PathStudy Pro (1 Tháng)', 30, 119000, 'ACTIVE', NOW(), NOW()),
('40000000-0000-0000-0000-000000000002', 'PRO_6_MONTHS', 'PathStudy Pro (6 Tháng)', 180, 519000, 'ACTIVE', NOW(), NOW())
ON CONFLICT (code) DO UPDATE SET price_vnd = EXCLUDED.price_vnd, updated_at = NOW();

-- 3. USERS
-- Password hash for '123456': $2a$10$PDwD7PM7VvMkVDkD55wi7uJGaJ1kjnduYBDra99PrgrQ0ktAV9XL6

-- Admin (admin / 123456)
INSERT INTO users (id, created_at, updated_at) VALUES
('11111111-0000-0000-0000-000000000001', NOW(), NOW());

INSERT INTO account (id, user_id, username, password_hash, status, created_at, updated_at) VALUES
('11111111-0000-0000-0000-000000000011', '11111111-0000-0000-0000-000000000001', 'admin', '$2a$10$PDwD7PM7VvMkVDkD55wi7uJGaJ1kjnduYBDra99PrgrQ0ktAV9XL6', 'ACTIVE', NOW(), NOW());

INSERT INTO student_profile (id, user_id, full_name, grade, class_name, created_at, updated_at) VALUES
('11111111-0000-0000-0000-000000000021', '11111111-0000-0000-0000-000000000001', 'System Administrator', 12, 'ADMIN', NOW(), NOW());

INSERT INTO user_roles (user_id, role_id) VALUES
('11111111-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003');

-- 5 Specialized Managers (manager1 - manager5 / 123456)
-- Manager 1: Ngữ pháp
INSERT INTO users (id, created_at, updated_at) VALUES ('11111111-0000-0000-0000-00000000000a', NOW(), NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO account (id, user_id, username, password_hash, status, created_at, updated_at) VALUES ('11111111-0000-0000-0000-00000000001a', '11111111-0000-0000-0000-00000000000a', 'manager1', '$2a$10$PDwD7PM7VvMkVDkD55wi7uJGaJ1kjnduYBDra99PrgrQ0ktAV9XL6', 'ACTIVE', NOW(), NOW()) ON CONFLICT (username) DO NOTHING;
INSERT INTO student_profile (id, user_id, full_name, grade, class_name, created_at, updated_at) VALUES ('11111111-0000-0000-0000-00000000002a', '11111111-0000-0000-0000-00000000000a', 'Nguyễn Thu Hà (Trưởng Ban Ngữ Pháp)', 12, 'MANAGER', NOW(), NOW()) ON CONFLICT (user_id) DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ('11111111-0000-0000-0000-00000000000a', '10000000-0000-0000-0000-000000000002') ON CONFLICT DO NOTHING;

-- Manager 2: Từ vựng & Đọc hiểu
INSERT INTO users (id, created_at, updated_at) VALUES ('11111111-0000-0000-0000-00000000000b', NOW(), NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO account (id, user_id, username, password_hash, status, created_at, updated_at) VALUES ('11111111-0000-0000-0000-00000000001b', '11111111-0000-0000-0000-00000000000b', 'manager2', '$2a$10$PDwD7PM7VvMkVDkD55wi7uJGaJ1kjnduYBDra99PrgrQ0ktAV9XL6', 'ACTIVE', NOW(), NOW()) ON CONFLICT (username) DO NOTHING;
INSERT INTO student_profile (id, user_id, full_name, grade, class_name, created_at, updated_at) VALUES ('11111111-0000-0000-0000-00000000002b', '11111111-0000-0000-0000-00000000000b', 'Trần Minh Đức (Trưởng Ban Từ Vựng & Đọc Hiểu)', 12, 'MANAGER', NOW(), NOW()) ON CONFLICT (user_id) DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ('11111111-0000-0000-0000-00000000000b', '10000000-0000-0000-0000-000000000002') ON CONFLICT DO NOTHING;

-- Manager 3: Ngân hàng câu hỏi & Đề thi
INSERT INTO users (id, created_at, updated_at) VALUES ('11111111-0000-0000-0000-000000000005', NOW(), NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO account (id, user_id, username, password_hash, status, created_at, updated_at) VALUES ('11111111-0000-0000-0000-000000000015', '11111111-0000-0000-0000-000000000005', 'manager3', '$2a$10$PDwD7PM7VvMkVDkD55wi7uJGaJ1kjnduYBDra99PrgrQ0ktAV9XL6', 'ACTIVE', NOW(), NOW()) ON CONFLICT (username) DO NOTHING;
INSERT INTO student_profile (id, user_id, full_name, grade, class_name, created_at, updated_at) VALUES ('11111111-0000-0000-0000-000000000025', '11111111-0000-0000-0000-000000000005', 'Lê Hoàng Nam (Trưởng Ban Ngân Hàng Câu Hỏi)', 12, 'MANAGER', NOW(), NOW()) ON CONFLICT (user_id) DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ('11111111-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000002') ON CONFLICT DO NOTHING;

-- Manager 4: Đánh giá năng lực
INSERT INTO users (id, created_at, updated_at) VALUES ('11111111-0000-0000-0000-000000000006', NOW(), NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO account (id, user_id, username, password_hash, status, created_at, updated_at) VALUES ('11111111-0000-0000-0000-000000000016', '11111111-0000-0000-0000-000000000006', 'manager4', '$2a$10$PDwD7PM7VvMkVDkD55wi7uJGaJ1kjnduYBDra99PrgrQ0ktAV9XL6', 'ACTIVE', NOW(), NOW()) ON CONFLICT (username) DO NOTHING;
INSERT INTO student_profile (id, user_id, full_name, grade, class_name, created_at, updated_at) VALUES ('11111111-0000-0000-0000-000000000026', '11111111-0000-0000-0000-000000000006', 'Phạm Thảo Vy (Trưởng Ban Đánh Giá Năng Lực)', 12, 'MANAGER', NOW(), NOW()) ON CONFLICT (user_id) DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ('11111111-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000002') ON CONFLICT DO NOTHING;

-- Manager 5: Lộ trình thích ứng
INSERT INTO users (id, created_at, updated_at) VALUES ('11111111-0000-0000-0000-000000000007', NOW(), NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO account (id, user_id, username, password_hash, status, created_at, updated_at) VALUES ('11111111-0000-0000-0000-000000000017', '11111111-0000-0000-0000-000000000007', 'manager5', '$2a$10$PDwD7PM7VvMkVDkD55wi7uJGaJ1kjnduYBDra99PrgrQ0ktAV9XL6', 'ACTIVE', NOW(), NOW()) ON CONFLICT (username) DO NOTHING;
INSERT INTO student_profile (id, user_id, full_name, grade, class_name, created_at, updated_at) VALUES ('11111111-0000-0000-0000-000000000027', '11111111-0000-0000-0000-000000000007', 'Vũ Quốc Tuấn (Trưởng Ban Lộ Trình Thích Ứng)', 12, 'MANAGER', NOW(), NOW()) ON CONFLICT (user_id) DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ('11111111-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000002') ON CONFLICT DO NOTHING;

-- Student 1 (student / 123456)
INSERT INTO users (id, created_at, updated_at) VALUES
('90ed5f83-cbcf-409a-8c18-1594380acbe4', NOW(), NOW());

INSERT INTO account (id, user_id, username, password_hash, status, created_at, updated_at) VALUES
('11111111-0000-0000-0000-000000000013', '90ed5f83-cbcf-409a-8c18-1594380acbe4', 'student', '$2a$10$PDwD7PM7VvMkVDkD55wi7uJGaJ1kjnduYBDra99PrgrQ0ktAV9XL6', 'ACTIVE', NOW(), NOW());

INSERT INTO student_profile (id, user_id, full_name, grade, class_name, created_at, updated_at) VALUES
('11111111-0000-0000-0000-000000000023', '90ed5f83-cbcf-409a-8c18-1594380acbe4', 'Nguyễn Văn An', 12, '12A1', NOW(), NOW());

INSERT INTO user_roles (user_id, role_id) VALUES
('90ed5f83-cbcf-409a-8c18-1594380acbe4', '10000000-0000-0000-0000-000000000001');

-- Active Subscription for Student 1
INSERT INTO user_subscription (id, user_id, plan_id, start_date, end_date, status, payment_reference, created_at, updated_at) VALUES
('40000000-0000-0000-0000-000000000011', '90ed5f83-cbcf-409a-8c18-1594380acbe4', '40000000-0000-0000-0000-000000000001', NOW() - INTERVAL '3 days', NOW() + INTERVAL '27 days', 'ACTIVE', 'PS886622', NOW(), NOW());

