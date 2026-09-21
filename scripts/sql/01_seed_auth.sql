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
-- Password hash for 'Admin@123': $2a$10$scPhKnjPk93vU4zW/KC6rOq/914.y8aexFYaRwGSNrj0su55bwRqW
-- Password hash for 'Manager@123': $2a$10$9pLHgAsBhEvibc36MhwMb.xdtAQ9oQ9Bdn8TSwXF4q8Nbp1IOceKO
-- Password hash for 'Student@123': $2a$10$l17tWA0YmNa1wJz4NX1H.e6ZrD.eGBKAqAbMsSn5VL3E27bpxux7e

-- Admin
INSERT INTO users (id, created_at, updated_at) VALUES
('11111111-0000-0000-0000-000000000001', NOW(), NOW());

INSERT INTO account (id, user_id, username, password_hash, status, created_at, updated_at) VALUES
('11111111-0000-0000-0000-000000000011', '11111111-0000-0000-0000-000000000001', 'admin', '$2a$10$scPhKnjPk93vU4zW/KC6rOq/914.y8aexFYaRwGSNrj0su55bwRqW', 'ACTIVE', NOW(), NOW());

INSERT INTO student_profile (id, user_id, full_name, grade, class_name, created_at, updated_at) VALUES
('11111111-0000-0000-0000-000000000021', '11111111-0000-0000-0000-000000000001', 'System Administrator', 12, 'ADMIN', NOW(), NOW());

INSERT INTO user_roles (user_id, role_id) VALUES
('11111111-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003');

-- Manager
INSERT INTO users (id, created_at, updated_at) VALUES
('11111111-0000-0000-0000-000000000002', NOW(), NOW());

INSERT INTO account (id, user_id, username, password_hash, status, created_at, updated_at) VALUES
('11111111-0000-0000-0000-000000000012', '11111111-0000-0000-0000-000000000002', 'manager', '$2a$10$9pLHgAsBhEvibc36MhwMb.xdtAQ9oQ9Bdn8TSwXF4q8Nbp1IOceKO', 'ACTIVE', NOW(), NOW());

INSERT INTO student_profile (id, user_id, full_name, grade, class_name, created_at, updated_at) VALUES
('11111111-0000-0000-0000-000000000022', '11111111-0000-0000-0000-000000000002', 'Academic Content Manager', 12, 'MANAGER', NOW(), NOW());

INSERT INTO user_roles (user_id, role_id) VALUES
('11111111-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002');

-- Student 1 (student / Admin@123)
INSERT INTO users (id, created_at, updated_at) VALUES
('90ed5f83-cbcf-409a-8c18-1594380acbe4', NOW(), NOW());

INSERT INTO account (id, user_id, username, password_hash, status, created_at, updated_at) VALUES
('11111111-0000-0000-0000-000000000013', '90ed5f83-cbcf-409a-8c18-1594380acbe4', 'student', '$2a$10$scPhKnjPk93vU4zW/KC6rOq/914.y8aexFYaRwGSNrj0su55bwRqW', 'ACTIVE', NOW(), NOW());

INSERT INTO student_profile (id, user_id, full_name, grade, class_name, created_at, updated_at) VALUES
('11111111-0000-0000-0000-000000000023', '90ed5f83-cbcf-409a-8c18-1594380acbe4', 'Nguyễn Văn An', 12, '12A1', NOW(), NOW());

INSERT INTO user_roles (user_id, role_id) VALUES
('90ed5f83-cbcf-409a-8c18-1594380acbe4', '10000000-0000-0000-0000-000000000001');

-- Active Subscription for Student 1
INSERT INTO user_subscription (id, user_id, plan_id, start_date, end_date, status, payment_reference, created_at, updated_at) VALUES
('40000000-0000-0000-0000-000000000011', '90ed5f83-cbcf-409a-8c18-1594380acbe4', '40000000-0000-0000-0000-000000000001', NOW() - INTERVAL '3 days', NOW() + INTERVAL '27 days', 'ACTIVE', 'PS886622', NOW(), NOW());

-- Student 2 (student_demo / Admin@123)
INSERT INTO users (id, created_at, updated_at) VALUES
('935bbe02-85f5-4d14-9d64-6657b3da4e7d', NOW(), NOW());

INSERT INTO account (id, user_id, username, password_hash, status, created_at, updated_at) VALUES
('11111111-0000-0000-0000-000000000014', '935bbe02-85f5-4d14-9d64-6657b3da4e7d', 'student_demo', '$2a$10$scPhKnjPk93vU4zW/KC6rOq/914.y8aexFYaRwGSNrj0su55bwRqW', 'ACTIVE', NOW(), NOW());

INSERT INTO student_profile (id, user_id, full_name, grade, class_name, created_at, updated_at) VALUES
('11111111-0000-0000-0000-000000000024', '935bbe02-85f5-4d14-9d64-6657b3da4e7d', 'Trần Thị Mai', 11, '11B2', NOW(), NOW());

INSERT INTO user_roles (user_id, role_id) VALUES
('935bbe02-85f5-4d14-9d64-6657b3da4e7d', '10000000-0000-0000-0000-000000000001');
