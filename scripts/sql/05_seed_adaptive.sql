-- ========================================================
-- SEED DATA FOR adaptive_db
-- ========================================================

-- 1. SKILL PROFILES FOR STUDENT
INSERT INTO skill_profiles (id, student_id, subject_id, skill_id, skill_name, accuracy_percentage, mastery_level, created_at, updated_at) VALUES
('bbbbbbbb-1000-0000-0000-000000000001',
 '90ed5f83-cbcf-409a-8c18-1594380acbe4',
 '11111111-1111-1111-1111-111111111101',
 '22222222-2222-2222-2222-222222222201', 'Thì động từ (Verb Tenses)',
 100, 'PROFICIENT', NOW(), NOW()),

('bbbbbbbb-1000-0000-0000-000000000002',
 '90ed5f83-cbcf-409a-8c18-1594380acbe4',
 '11111111-1111-1111-1111-111111111101',
 '22222222-2222-2222-2222-222222222202', 'Câu bị động (Passive Voice)',
 50, 'DEVELOPING', NOW(), NOW()),

('bbbbbbbb-1000-0000-0000-000000000003',
 '90ed5f83-cbcf-409a-8c18-1594380acbe4',
 '11111111-1111-1111-1111-111111111101',
 '22222222-2222-2222-2222-222222222203', 'Câu điều kiện (Conditionals)',
 0, 'WEAK', NOW(), NOW()),

('bbbbbbbb-1000-0000-0000-000000000004',
 '90ed5f83-cbcf-409a-8c18-1594380acbe4',
 '11111111-1111-1111-1111-111111111101',
 '22222222-2222-2222-2222-222222222204', 'Mệnh đề quan hệ (Relative Clauses)',
 50, 'DEVELOPING', NOW(), NOW()),

('bbbbbbbb-1000-0000-0000-000000000005',
 '90ed5f83-cbcf-409a-8c18-1594380acbe4',
 '11111111-1111-1111-1111-111111111101',
 '22222222-2222-2222-2222-222222222205', 'Từ vựng & Cụm từ (Vocabulary & Collocations)',
 100, 'PROFICIENT', NOW(), NOW()),

('bbbbbbbb-1000-0000-0000-000000000006',
 '90ed5f83-cbcf-409a-8c18-1594380acbe4',
 '11111111-1111-1111-1111-111111111101',
 '22222222-2222-2222-2222-222222222206', 'Đọc hiểu tiếng Anh (Reading Comprehension)',
 100, 'PROFICIENT', NOW(), NOW());

-- 2. STUDY PATH
INSERT INTO study_paths (id, student_id, subject_id, subject_name, assessment_attempt_id, status, total_skills, completed_skills, progress_percentage, created_at, updated_at) VALUES
('bbbbbbbb-0000-0000-0000-000000000001',
 '90ed5f83-cbcf-409a-8c18-1594380acbe4',
 '11111111-1111-1111-1111-111111111101',
 'Tiếng Anh THPT',
 'aaaaaaaa-2000-0000-0000-000000000001',
 'IN_PROGRESS',
 6, 3, 50,
 NOW(), NOW());

-- 3. STUDY PATH SKILL NODES
INSERT INTO study_path_skill_nodes (id, study_path_id, skill_id, skill_name, module_id, module_name, topic_id, sequence_order, status, baseline_accuracy, proficiency_level, milestone_test_passed, priority_reason, has_remedial_active, created_at, updated_at) VALUES
('bbbbbbbb-2000-0000-0000-000000000001',
 'bbbbbbbb-0000-0000-0000-000000000001',
 '22222222-2222-2222-2222-222222222203', 'Câu điều kiện (Conditionals)',
 '22222222-2222-2222-2222-222222222210', 'Ngữ pháp Tiếng Anh THPT',
 '22222222-2222-2222-2222-222222222203',
 1, 'IN_PROGRESS', 0, 'WEAK', false, 'Cần bổ trợ trọng tâm do đạt độ chính xác 0% ở khảo sát đầu vào', true,
 NOW(), NOW()),

('bbbbbbbb-2000-0000-0000-000000000002',
 'bbbbbbbb-0000-0000-0000-000000000001',
 '22222222-2222-2222-2222-222222222202', 'Câu bị động (Passive Voice)',
 '22222222-2222-2222-2222-222222222210', 'Ngữ pháp Tiếng Anh THPT',
 '22222222-2222-2222-2222-222222222202',
 2, 'UNLOCKED', 50, 'DEVELOPING', false, 'Củng cố các dạng bị động nâng cao và cấu trúc đặc biệt', false,
 NOW(), NOW()),

('bbbbbbbb-2000-0000-0000-000000000003',
 'bbbbbbbb-0000-0000-0000-000000000001',
 '22222222-2222-2222-2222-222222222204', 'Mệnh đề quan hệ (Relative Clauses)',
 '22222222-2222-2222-2222-222222222210', 'Ngữ pháp Tiếng Anh THPT',
 '22222222-2222-2222-2222-222222222204',
 3, 'LOCKED', 50, 'DEVELOPING', false, 'Rèn luyện kỹ năng rút gọn mệnh đề quan hệ', false,
 NOW(), NOW()),

('bbbbbbbb-2000-0000-0000-000000000004',
 'bbbbbbbb-0000-0000-0000-000000000001',
 '22222222-2222-2222-2222-222222222201', 'Thì động từ (Verb Tenses)',
 '22222222-2222-2222-2222-222222222210', 'Ngữ pháp Tiếng Anh THPT',
 '22222222-2222-2222-2222-222222222201',
 4, 'COMPLETED', 100, 'PROFICIENT', true, 'Đã làm chủ hoàn toàn các thì cơ bản và nâng cao', false,
 NOW(), NOW()),

('bbbbbbbb-2000-0000-0000-000000000005',
 'bbbbbbbb-0000-0000-0000-000000000001',
 '22222222-2222-2222-2222-222222222205', 'Từ vựng & Cụm từ (Vocabulary & Collocations)',
 '22222222-2222-2222-2222-222222222220', 'Từ vựng & Kỹ năng Đọc hiểu',
 '22222222-2222-2222-2222-222222222205',
 5, 'COMPLETED', 100, 'PROFICIENT', true, 'Đã đạt điểm tuyệt đối ở khảo sát đầu vào', false,
 NOW(), NOW()),

('bbbbbbbb-2000-0000-0000-000000000006',
 'bbbbbbbb-0000-0000-0000-000000000001',
 '22222222-2222-2222-2222-222222222206', 'Đọc hiểu tiếng Anh (Reading Comprehension)',
 '22222222-2222-2222-2222-222222222220', 'Từ vựng & Kỹ năng Đọc hiểu',
 '22222222-2222-2222-2222-222222222206',
 6, 'COMPLETED', 100, 'PROFICIENT', true, 'Kỹ năng đọc hiểu tốt, đạt chuẩn mục tiêu', false,
 NOW(), NOW());

-- 4. STUDENT LESSON PROGRESS
INSERT INTO student_lesson_progress (id, student_id, topic_id, lesson_id, is_completed, quiz_completed, quiz_score, completed_at, created_at, updated_at) VALUES
('bbbbbbbb-3000-0000-0000-000000000001',
 '90ed5f83-cbcf-409a-8c18-1594380acbe4',
 '22222222-2222-2222-2222-222222222201',
 '55555555-0000-0000-0000-000000000001',
 true, true, 100, NOW() - INTERVAL '12 hours', NOW() - INTERVAL '1 day', NOW()),

('bbbbbbbb-3000-0000-0000-000000000002',
 '90ed5f83-cbcf-409a-8c18-1594380acbe4',
 '22222222-2222-2222-2222-222222222201',
 '55555555-0000-0000-0000-000000000002',
 true, true, 100, NOW() - INTERVAL '6 hours', NOW() - INTERVAL '1 day', NOW());
