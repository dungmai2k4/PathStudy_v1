-- ========================================================
-- SEED DATA FOR adaptive_db (Chuẩn SGK Tiếng Anh 10)
-- ========================================================

-- 1. SKILL PROFILES FOR STUDENT
INSERT INTO skill_profiles (id, student_id, subject_id, skill_id, skill_name, accuracy_percentage, mastery_level, created_at, updated_at) VALUES
('bbbbbbbb-1000-0000-0000-000000000001',
 '90ed5f83-cbcf-409a-8c18-1594380acbe4',
 '11111111-1111-1111-1111-111111111101',
 '22222222-2222-2222-2222-222222222201', 'Unit 1: Present Simple & Present Continuous',
 100, 'PROFICIENT', NOW(), NOW()),

('bbbbbbbb-1000-0000-0000-000000000002',
 '90ed5f83-cbcf-409a-8c18-1594380acbe4',
 '11111111-1111-1111-1111-111111111101',
 '22222222-2222-2222-2222-222222222202', 'Unit 2: Will vs. Be Going To & Passive Voice',
 50, 'DEVELOPING', NOW(), NOW()),

('bbbbbbbb-1000-0000-0000-000000000003',
 '90ed5f83-cbcf-409a-8c18-1594380acbe4',
 '11111111-1111-1111-1111-111111111101',
 '22222222-2222-2222-2222-222222222203', 'Unit 3: Compound Sentences & Infinitives',
 0, 'WEAK', NOW(), NOW()),

('bbbbbbbb-1000-0000-0000-000000000004',
 '90ed5f83-cbcf-409a-8c18-1594380acbe4',
 '11111111-1111-1111-1111-111111111101',
 '22222222-2222-2222-2222-222222222204', 'Unit 4: Past Simple vs. Past Continuous',
 50, 'DEVELOPING', NOW(), NOW()),

('bbbbbbbb-1000-0000-0000-000000000005',
 '90ed5f83-cbcf-409a-8c18-1594380acbe4',
 '11111111-1111-1111-1111-111111111101',
 '22222222-2222-2222-2222-222222222205', 'Unit 1 & 2: Family Life & Green Living Collocations',
 100, 'PROFICIENT', NOW(), NOW()),

('bbbbbbbb-1000-0000-0000-000000000006',
 '90ed5f83-cbcf-409a-8c18-1594380acbe4',
 '11111111-1111-1111-1111-111111111101',
 '22222222-2222-2222-2222-222222222206', 'Unit 3 & 4: Music & Community Service Reading',
 100, 'PROFICIENT', NOW(), NOW());

-- 2. STUDY PATH
INSERT INTO study_paths (id, student_id, subject_id, subject_name, assessment_attempt_id, status, total_skills, completed_skills, progress_percentage, created_at, updated_at) VALUES
('bbbbbbbb-0000-0000-0000-000000000001',
 '90ed5f83-cbcf-409a-8c18-1594380acbe4',
 '11111111-1111-1111-1111-111111111101',
 'Tiếng Anh 10',
 'aaaaaaaa-2000-0000-0000-000000000001',
 'IN_PROGRESS',
 6, 3, 50,
 NOW(), NOW());

-- 3. STUDY PATH SKILL NODES
INSERT INTO study_path_skill_nodes (id, study_path_id, skill_id, skill_name, module_id, module_name, topic_id, sequence_order, status, baseline_accuracy, proficiency_level, milestone_test_passed, priority_reason, has_remedial_active, created_at, updated_at) VALUES
('bbbbbbbb-2000-0000-0000-000000000001',
 'bbbbbbbb-0000-0000-0000-000000000001',
 '22222222-2222-2222-2222-222222222203', 'Unit 3: Compound Sentences & Infinitives',
 '22222222-2222-2222-2222-222222222210', 'Chuyên đề Ngữ pháp Trọng tâm SGK Tiếng Anh 10',
 '22222222-2222-2222-2222-222222222203',
 1, 'IN_PROGRESS', 0, 'WEAK', false, 'Cần bổ trợ trọng tâm do đạt độ chính xác 0% ở khảo sát đầu vào (Câu ghép & To/Bare Infinitives)', true,
 NOW(), NOW()),

('bbbbbbbb-2000-0000-0000-000000000002',
 'bbbbbbbb-0000-0000-0000-000000000001',
 '22222222-2222-2222-2222-222222222202', 'Unit 2: Will vs. Be Going To & Passive Voice',
 '22222222-2222-2222-2222-222222222210', 'Chuyên đề Ngữ pháp Trọng tâm SGK Tiếng Anh 10',
 '22222222-2222-2222-2222-222222222202',
 2, 'UNLOCKED', 50, 'DEVELOPING', false, 'Củng cố phân biệt thì tương lai và cấu trúc câu bị động Unit 2', false,
 NOW(), NOW()),

('bbbbbbbb-2000-0000-0000-000000000003',
 'bbbbbbbb-0000-0000-0000-000000000001',
 '22222222-2222-2222-2222-222222222204', 'Unit 4: Past Simple vs. Past Continuous',
 '22222222-2222-2222-2222-222222222210', 'Chuyên đề Ngữ pháp Trọng tâm SGK Tiếng Anh 10',
 '22222222-2222-2222-2222-222222222204',
 3, 'LOCKED', 50, 'DEVELOPING', false, 'Rèn luyện phối hợp thì quá khứ với liên từ When và While', false,
 NOW(), NOW()),

('bbbbbbbb-2000-0000-0000-000000000004',
 'bbbbbbbb-0000-0000-0000-000000000001',
 '22222222-2222-2222-2222-222222222201', 'Unit 1: Present Simple & Present Continuous',
 '22222222-2222-2222-2222-222222222210', 'Chuyên đề Ngữ pháp Trọng tâm SGK Tiếng Anh 10',
 '22222222-2222-2222-2222-222222222201',
 4, 'COMPLETED', 100, 'PROFICIENT', true, 'Đã làm chủ hoàn toàn thì hiện tại đơn, tiếp diễn và Stative Verbs', false,
 NOW(), NOW()),

('bbbbbbbb-2000-0000-0000-000000000005',
 'bbbbbbbb-0000-0000-0000-000000000001',
 '22222222-2222-2222-2222-222222222205', 'Unit 1 & 2: Family Life & Green Living Collocations',
 '22222222-2222-2222-2222-222222222220', 'Chuyên đề Từ vựng & Đọc hiểu theo Chủ điểm SGK Tiếng Anh 10',
 '22222222-2222-2222-2222-222222222205',
 5, 'COMPLETED', 100, 'PROFICIENT', true, 'Đã đạt điểm tuyệt đối về collocations chủ điểm Family Life & Green Living', false,
 NOW(), NOW()),

('bbbbbbbb-2000-0000-0000-000000000006',
 'bbbbbbbb-0000-0000-0000-000000000001',
 '22222222-2222-2222-2222-222222222206', 'Unit 3 & 4: Music & Community Service Reading',
 '22222222-2222-2222-2222-222222222220', 'Chuyên đề Từ vựng & Đọc hiểu theo Chủ điểm SGK Tiếng Anh 10',
 '22222222-2222-2222-2222-222222222206',
 6, 'COMPLETED', 100, 'PROFICIENT', true, 'Kỹ năng đọc hiểu văn bản Unit 3 & 4 đạt mức xuất sắc', false,
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

