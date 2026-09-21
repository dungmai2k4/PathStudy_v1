-- ========================================================
-- SEED DATA FOR assessment_db
-- ========================================================

-- 1. ASSESSMENTS
INSERT INTO assessments (id, title, assessment_type, subject_id, total_questions, time_limit_minutes, passing_score_percentage, created_at, updated_at) VALUES
('77777777-0000-0000-0000-000000000001',
 'Khảo sát Năng lực Đầu vào Tiếng Anh THPT',
 'PLACEMENT',
 '11111111-1111-1111-1111-111111111101',
 12, 20, 60, NOW(), NOW()),

('77777777-0000-0000-0000-000000000002',
 'Kiểm tra Đánh giá Kỹ năng: Thì động từ (Verb Tenses)',
 'SKILL_TEST',
 '11111111-1111-1111-1111-111111111101',
 5, 10, 70, NOW(), NOW());

-- 2. ASSESSMENT QUESTIONS (FOR PLACEMENT TEST)
INSERT INTO assessment_questions (id, assessment_id, question_id, skill_id, skill_name, content, options_json, correct_option_id, difficulty, display_order, explanation, created_at, updated_at) VALUES
('aaaaaaaa-1000-0000-0000-000000000001',
 '77777777-0000-0000-0000-000000000001',
 '88888888-0000-0000-0000-000000000001',
 '22222222-2222-2222-2222-222222222201', 'Thì động từ (Verb Tenses)',
 'The sun ________ in the east and sets in the west.',
 '[{"id":"99999999-0000-0000-0000-000000000101","optionContent":"rises","displayOrder":1},{"id":"99999999-0000-0000-0000-000000000102","optionContent":"is rising","displayOrder":2},{"id":"99999999-0000-0000-0000-000000000103","optionContent":"rose","displayOrder":3},{"id":"99999999-0000-0000-0000-000000000104","optionContent":"has risen","displayOrder":4}]',
 '99999999-0000-0000-0000-000000000101', 'EASY', 1,
 'Chân lý, quy luật tự nhiên luôn chia ở thì Hiện tại đơn. "The sun" số ít nên dùng "rises".',
 NOW(), NOW()),

('aaaaaaaa-1000-0000-0000-000000000002',
 '77777777-0000-0000-0000-000000000001',
 '88888888-0000-0000-0000-000000000002',
 '22222222-2222-2222-2222-222222222201', 'Thì động từ (Verb Tenses)',
 'While we ________ along the beach, a sudden thunderstorm began.',
 '[{"id":"99999999-0000-0000-0000-000000000201","optionContent":"walked","displayOrder":1},{"id":"99999999-0000-0000-0000-000000000202","optionContent":"were walking","displayOrder":2},{"id":"99999999-0000-0000-0000-000000000203","optionContent":"had walked","displayOrder":3},{"id":"99999999-0000-0000-0000-000000000204","optionContent":"are walking","displayOrder":4}]',
 '99999999-0000-0000-0000-000000000202', 'MEDIUM', 2,
 'Hành động đang diễn ra trong quá khứ (we were walking) thì có hành động bất ngờ xen vào.',
 NOW(), NOW()),

('aaaaaaaa-1000-0000-0000-000000000003',
 '77777777-0000-0000-0000-000000000001',
 '88888888-0000-0000-0000-000000000003',
 '22222222-2222-2222-2222-222222222202', 'Câu bị động (Passive Voice)',
 'This historic opera house ________ by a French architect in 1897.',
 '[{"id":"99999999-0000-0000-0000-000000000301","optionContent":"was designed","displayOrder":1},{"id":"99999999-0000-0000-0000-000000000302","optionContent":"designed","displayOrder":2},{"id":"99999999-0000-0000-0000-000000000303","optionContent":"has designed","displayOrder":3},{"id":"99999999-0000-0000-0000-000000000304","optionContent":"is designed","displayOrder":4}]',
 '99999999-0000-0000-0000-000000000301', 'EASY', 3,
 'Mốc thời gian "in 1897" trong quá khứ và chủ ngữ chỉ vật bị động -> was designed.',
 NOW(), NOW()),

('aaaaaaaa-1000-0000-0000-000000000004',
 '77777777-0000-0000-0000-000000000001',
 '88888888-0000-0000-0000-000000000004',
 '22222222-2222-2222-2222-222222222202', 'Câu bị động (Passive Voice)',
 'It is widely believed that the secret documents ________ before the authorities arrived.',
 '[{"id":"99999999-0000-0000-0000-000000000401","optionContent":"have been destroyed","displayOrder":1},{"id":"99999999-0000-0000-0000-000000000402","optionContent":"had been destroyed","displayOrder":2},{"id":"99999999-0000-0000-0000-000000000403","optionContent":"were destroyed","displayOrder":3},{"id":"99999999-0000-0000-0000-000000000404","optionContent":"destroyed","displayOrder":4}]',
 '99999999-0000-0000-0000-000000000402', 'HARD', 4,
 'Bị động Quá khứ hoàn thành: had been destroyed.',
 NOW(), NOW()),

('aaaaaaaa-1000-0000-0000-000000000005',
 '77777777-0000-0000-0000-000000000001',
 '88888888-0000-0000-0000-000000000005',
 '22222222-2222-2222-2222-222222222203', 'Câu điều kiện (Conditionals)',
 'If she had listened to my advice earlier, she ________ in such serious trouble now.',
 '[{"id":"99999999-0000-0000-0000-000000000501","optionContent":"would not have been","displayOrder":1},{"id":"99999999-0000-0000-0000-000000000502","optionContent":"would not be","displayOrder":2},{"id":"99999999-0000-0000-0000-000000000503","optionContent":"will not be","displayOrder":3},{"id":"99999999-0000-0000-0000-000000000504","optionContent":"is not","displayOrder":4}]',
 '99999999-0000-0000-0000-000000000502', 'MEDIUM', 5,
 'Câu điều kiện hỗn hợp 3-2: would not be.',
 NOW(), NOW()),

('aaaaaaaa-1000-0000-0000-000000000006',
 '77777777-0000-0000-0000-000000000001',
 '88888888-0000-0000-0000-000000000006',
 '22222222-2222-2222-2222-222222222203', 'Câu điều kiện (Conditionals)',
 '________ you require any further assistance, please contact customer support immediately.',
 '[{"id":"99999999-0000-0000-0000-000000000601","optionContent":"Should","displayOrder":1},{"id":"99999999-0000-0000-0000-000000000602","optionContent":"Were","displayOrder":2},{"id":"99999999-0000-0000-0000-000000000603","optionContent":"Had","displayOrder":3},{"id":"99999999-0000-0000-0000-000000000604","optionContent":"Unless","displayOrder":4}]',
 '99999999-0000-0000-0000-000000000601', 'HARD', 6,
 'Đảo ngữ câu điều kiện loại 1: Should.',
 NOW(), NOW()),

('aaaaaaaa-1000-0000-0000-000000000007',
 '77777777-0000-0000-0000-000000000001',
 '88888888-0000-0000-0000-000000000007',
 '22222222-2222-2222-2222-222222222204', 'Mệnh đề quan hệ (Relative Clauses)',
 'The young scientist ________ won the prestigious Nobel prize is from Vietnam.',
 '[{"id":"99999999-0000-0000-0000-000000000701","optionContent":"who","displayOrder":1},{"id":"99999999-0000-0000-0000-000000000702","optionContent":"whom","displayOrder":2},{"id":"99999999-0000-0000-0000-000000000703","optionContent":"which","displayOrder":3},{"id":"99999999-0000-0000-0000-000000000704","optionContent":"whose","displayOrder":4}]',
 '99999999-0000-0000-0000-000000000701', 'EASY', 7,
 'Đại từ quan hệ thay thế cho danh từ chỉ người đóng vai trò chủ ngữ: who.',
 NOW(), NOW()),

('aaaaaaaa-1000-0000-0000-000000000008',
 '77777777-0000-0000-0000-000000000001',
 '88888888-0000-0000-0000-000000000008',
 '22222222-2222-2222-2222-222222222204', 'Mệnh đề quan hệ (Relative Clauses)',
 'The company offered him a high salary, ________ convinced him to accept the job offer.',
 '[{"id":"99999999-0000-0000-0000-000000000801","optionContent":"that","displayOrder":1},{"id":"99999999-0000-0000-0000-000000000802","optionContent":"which","displayOrder":2},{"id":"99999999-0000-0000-0000-000000000803","optionContent":"what","displayOrder":3},{"id":"99999999-0000-0000-0000-000000000804","optionContent":"who","displayOrder":4}]',
 '99999999-0000-0000-0000-000000000802', 'MEDIUM', 8,
 'Đại từ quan hệ which đứng sau dấu phẩy thay thế cho cả mệnh đề.',
 NOW(), NOW()),

('aaaaaaaa-1000-0000-0000-000000000009',
 '77777777-0000-0000-0000-000000000001',
 '88888888-0000-0000-0000-000000000009',
 '22222222-2222-2222-2222-222222222205', 'Từ vựng & Cụm từ (Vocabulary & Collocations)',
 'Because of heavy rain, the soccer match had to be ________ until next weekend.',
 '[{"id":"99999999-0000-0000-0000-000000000901","optionContent":"put off","displayOrder":1},{"id":"99999999-0000-0000-0000-000000000902","optionContent":"turned down","displayOrder":2},{"id":"99999999-0000-0000-0000-000000000903","optionContent":"given up","displayOrder":3},{"id":"99999999-0000-0000-0000-000000000904","optionContent":"carried out","displayOrder":4}]',
 '99999999-0000-0000-0000-000000000901', 'EASY', 9,
 'put off = hoãn lại.',
 NOW(), NOW()),

('aaaaaaaa-1000-0000-0000-000000000010',
 '77777777-0000-0000-0000-000000000001',
 '88888888-0000-0000-0000-000000000010',
 '22222222-2222-2222-2222-222222222205', 'Từ vựng & Cụm từ (Vocabulary & Collocations)',
 'The scientific research team successfully ________ a series of experiments on solar energy.',
 '[{"id":"99999999-0000-0000-0000-000000001001","optionContent":"carried out","displayOrder":1},{"id":"99999999-0000-0000-0000-000000001002","optionContent":"made up","displayOrder":2},{"id":"99999999-0000-0000-0000-000000001003","optionContent":"looked into","displayOrder":3},{"id":"99999999-0000-0000-0000-000000001004","optionContent":"brought about","displayOrder":4}]',
 '99999999-0000-0000-0000-000000001001', 'MEDIUM', 10,
 'carry out experiments = tiến hành thí nghiệm.',
 NOW(), NOW()),

('aaaaaaaa-1000-0000-0000-000000000011',
 '77777777-0000-0000-0000-000000000001',
 '88888888-0000-0000-0000-000000000011',
 '22222222-2222-2222-2222-222222222206', 'Đọc hiểu tiếng Anh (Reading Comprehension)',
 'Read the sentence: "Renewable energy sources such as solar and wind power produce minimal greenhouse gas emissions." What is the main benefit mentioned?',
 '[{"id":"99999999-0000-0000-0000-000000001101","optionContent":"Low greenhouse gas emissions","displayOrder":1},{"id":"99999999-0000-0000-0000-000000001102","optionContent":"Unlimited supply anywhere","displayOrder":2},{"id":"99999999-0000-0000-0000-000000001103","optionContent":"Cheap initial installation","displayOrder":3},{"id":"99999999-0000-0000-0000-000000001104","optionContent":"Ease of maintenance","displayOrder":4}]',
 '99999999-0000-0000-0000-000000001101', 'EASY', 11,
 'Low greenhouse gas emissions.',
 NOW(), NOW()),

('aaaaaaaa-1000-0000-0000-000000000012',
 '77777777-0000-0000-0000-000000000001',
 '88888888-0000-0000-0000-000000000012',
 '22222222-2222-2222-2222-222222222206', 'Đọc hiểu tiếng Anh (Reading Comprehension)',
 'In academic reading, what is the primary purpose of an author using rhetorical questions in the introductory paragraph?',
 '[{"id":"99999999-0000-0000-0000-000000001201","optionContent":"Engage the readers curiosity and prompt critical thinking","displayOrder":1},{"id":"99999999-0000-0000-0000-000000001202","optionContent":"Test whether the reader understands the vocabulary","displayOrder":2},{"id":"99999999-0000-0000-0000-000000001203","optionContent":"Disprove an established scientific formula","displayOrder":3},{"id":"99999999-0000-0000-0000-000000001204","optionContent":"Avoid expressing a direct personal opinion","displayOrder":4}]',
 '99999999-0000-0000-0000-000000001201', 'HARD', 12,
 'Engage the readers curiosity.',
 NOW(), NOW());

-- 3. ASSESSMENT ATTEMPT (SAMPLE COMPLETED ATTEMPT FOR STUDENT)
INSERT INTO assessment_attempts (id, assessment_id, student_id, subject_id, assessment_type, status, score, total_questions, accuracy_percentage, is_passed, started_at, submitted_at, created_at, updated_at) VALUES
('aaaaaaaa-2000-0000-0000-000000000001',
 '77777777-0000-0000-0000-000000000001',
 '90ed5f83-cbcf-409a-8c18-1594380acbe4',
 '11111111-1111-1111-1111-111111111101',
 'PLACEMENT',
 'SUBMITTED',
 8, 12, 67, true,
 NOW() - INTERVAL '1 day',
 NOW() - INTERVAL '1 day' + INTERVAL '16 minutes',
 NOW() - INTERVAL '1 day',
 NOW() - INTERVAL '1 day');

-- 4. ASSESSMENT ANSWERS FOR THE ATTEMPT
INSERT INTO assessment_answers (id, attempt_id, question_id, selected_option_id, correct_option_id, is_correct, created_at, updated_at) VALUES
('aaaaaaaa-3000-0000-0000-000000000001', 'aaaaaaaa-2000-0000-0000-000000000001', '88888888-0000-0000-0000-000000000001', '99999999-0000-0000-0000-000000000101', '99999999-0000-0000-0000-000000000101', true, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
('aaaaaaaa-3000-0000-0000-000000000002', 'aaaaaaaa-2000-0000-0000-000000000001', '88888888-0000-0000-0000-000000000002', '99999999-0000-0000-0000-000000000202', '99999999-0000-0000-0000-000000000202', true, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
('aaaaaaaa-3000-0000-0000-000000000003', 'aaaaaaaa-2000-0000-0000-000000000001', '88888888-0000-0000-0000-000000000003', '99999999-0000-0000-0000-000000000301', '99999999-0000-0000-0000-000000000301', true, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
('aaaaaaaa-3000-0000-0000-000000000004', 'aaaaaaaa-2000-0000-0000-000000000001', '88888888-0000-0000-0000-000000000004', '99999999-0000-0000-0000-000000000401', '99999999-0000-0000-0000-000000000402', false, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'), -- Sai
('aaaaaaaa-3000-0000-0000-000000000005', 'aaaaaaaa-2000-0000-0000-000000000001', '88888888-0000-0000-0000-000000000005', '99999999-0000-0000-0000-000000000501', '99999999-0000-0000-0000-000000000502', false, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'), -- Sai
('aaaaaaaa-3000-0000-0000-000000000006', 'aaaaaaaa-2000-0000-0000-000000000001', '88888888-0000-0000-0000-000000000006', '99999999-0000-0000-0000-000000000602', '99999999-0000-0000-0000-000000000601', false, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'), -- Sai
('aaaaaaaa-3000-0000-0000-000000000007', 'aaaaaaaa-2000-0000-0000-000000000001', '88888888-0000-0000-0000-000000000007', '99999999-0000-0000-0000-000000000701', '99999999-0000-0000-0000-000000000701', true, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
('aaaaaaaa-3000-0000-0000-000000000008', 'aaaaaaaa-2000-0000-0000-000000000001', '88888888-0000-0000-0000-000000000008', '99999999-0000-0000-0000-000000000801', '99999999-0000-0000-0000-000000000802', false, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'), -- Sai
('aaaaaaaa-3000-0000-0000-000000000009', 'aaaaaaaa-2000-0000-0000-000000000001', '88888888-0000-0000-0000-000000000009', '99999999-0000-0000-0000-000000000901', '99999999-0000-0000-0000-000000000901', true, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
('aaaaaaaa-3000-0000-0000-000000000010', 'aaaaaaaa-2000-0000-0000-000000000001', '88888888-0000-0000-0000-000000000010', '99999999-0000-0000-0000-000000001001', '99999999-0000-0000-0000-000000001001', true, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
('aaaaaaaa-3000-0000-0000-000000000011', 'aaaaaaaa-2000-0000-0000-000000000001', '88888888-0000-0000-0000-000000000011', '99999999-0000-0000-0000-000000001101', '99999999-0000-0000-0000-000000001101', true, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
('aaaaaaaa-3000-0000-0000-000000000012', 'aaaaaaaa-2000-0000-0000-000000000001', '88888888-0000-0000-0000-000000000012', '99999999-0000-0000-0000-000000001201', '99999999-0000-0000-0000-000000001201', true, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day');

-- 5. SKILL ASSESSMENT RESULTS
INSERT INTO skill_assessment_results (id, attempt_id, skill_id, skill_name, total_questions, correct_count, accuracy_percentage, proficiency_level, created_at, updated_at) VALUES
('aaaaaaaa-4000-0000-0000-000000000001', 'aaaaaaaa-2000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222201', 'Thì động từ (Verb Tenses)', 2, 2, 100, 'PROFICIENT', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
('aaaaaaaa-4000-0000-0000-000000000002', 'aaaaaaaa-2000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222202', 'Câu bị động (Passive Voice)', 2, 1, 50, 'DEVELOPING', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
('aaaaaaaa-4000-0000-0000-000000000003', 'aaaaaaaa-2000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222203', 'Câu điều kiện (Conditionals)', 2, 0, 0, 'WEAK', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
('aaaaaaaa-4000-0000-0000-000000000004', 'aaaaaaaa-2000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222204', 'Mệnh đề quan hệ (Relative Clauses)', 2, 1, 50, 'DEVELOPING', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
('aaaaaaaa-4000-0000-0000-000000000005', 'aaaaaaaa-2000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222205', 'Từ vựng & Cụm từ (Vocabulary & Collocations)', 2, 2, 100, 'PROFICIENT', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
('aaaaaaaa-4000-0000-0000-000000000006', 'aaaaaaaa-2000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222206', 'Đọc hiểu tiếng Anh (Reading Comprehension)', 2, 2, 100, 'PROFICIENT', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day');
