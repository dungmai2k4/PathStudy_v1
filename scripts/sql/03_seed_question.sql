-- ========================================================
-- SEED DATA FOR question_db
-- ========================================================

-- 1. QUESTION BANK
INSERT INTO question_bank (id, name, description, status, subject_id, created_at, updated_at) VALUES
('33333333-3333-3333-3333-333333333301', 
 'Ngân hàng Câu hỏi Tiếng Anh Chuẩn THPT & ĐGNL', 
 'Bộ câu hỏi trắc nghiệm tiếng Anh 4 lựa chọn chuẩn hóa, phân cấp 3 mức độ (Dễ, Trung bình, Khó) theo 6 nhóm kỹ năng ngữ pháp, từ vựng và đọc hiểu.', 
 'ACTIVE', 
 '11111111-1111-1111-1111-111111111101', 
 NOW(), NOW());

-- 2. QUESTIONS
-- Q1: Tenses (EASY)
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, lesson_id, content, difficulty, status, explanation, display_order, created_at, updated_at) VALUES
('88888888-0000-0000-0000-000000000001',
 '33333333-3333-3333-3333-333333333301',
 '22222222-2222-2222-2222-222222222201',
 '22222222-2222-2222-2222-222222222201',
 '22222222-2222-2222-2222-222222222210',
 '55555555-0000-0000-0000-000000000001',
 'The sun ________ in the east and sets in the west.',
 'EASY', 'ACTIVE',
 'Chân lý, quy luật tự nhiên luôn chia ở thì Hiện tại đơn. "The sun" số ít nên dùng "rises".',
 1, NOW(), NOW());

-- Q2: Tenses (MEDIUM)
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, lesson_id, content, difficulty, status, explanation, display_order, created_at, updated_at) VALUES
('88888888-0000-0000-0000-000000000002',
 '33333333-3333-3333-3333-333333333301',
 '22222222-2222-2222-2222-222222222201',
 '22222222-2222-2222-2222-222222222201',
 '22222222-2222-2222-2222-222222222210',
 '55555555-0000-0000-0000-000000000002',
 'While we ________ along the beach, a sudden thunderstorm began.',
 'MEDIUM', 'ACTIVE',
 'Hành động đang diễn ra trong quá khứ (we were walking) thì có hành động bất ngờ xen vào (a thunderstorm began).',
 2, NOW(), NOW());

-- Q3: Passive Voice (EASY)
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, lesson_id, content, difficulty, status, explanation, display_order, created_at, updated_at) VALUES
('88888888-0000-0000-0000-000000000003',
 '33333333-3333-3333-3333-333333333301',
 '22222222-2222-2222-2222-222222222202',
 '22222222-2222-2222-2222-222222222202',
 '22222222-2222-2222-2222-222222222210',
 '55555555-0000-0000-0000-000000000004',
 'This historic opera house ________ by a French architect in 1897.',
 'EASY', 'ACTIVE',
 'Mốc thời gian "in 1897" trong quá khứ và chủ ngữ chỉ vật bị động -> dùng "was designed".',
 3, NOW(), NOW());

-- Q4: Passive Voice (HARD)
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, lesson_id, content, difficulty, status, explanation, display_order, created_at, updated_at) VALUES
('88888888-0000-0000-0000-000000000004',
 '33333333-3333-3333-3333-333333333301',
 '22222222-2222-2222-2222-222222222202',
 '22222222-2222-2222-2222-222222222202',
 '22222222-2222-2222-2222-222222222210',
 '55555555-0000-0000-0000-000000000004',
 'It is widely believed that the secret documents ________ before the authorities arrived.',
 'HARD', 'ACTIVE',
 'Hành động phá hủy tài liệu xảy ra và hoàn tất trước khi cảnh sát đến -> Bị động Quá khứ hoàn thành: "had been destroyed".',
 4, NOW(), NOW());

-- Q5: Conditionals (MEDIUM)
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, lesson_id, content, difficulty, status, explanation, display_order, created_at, updated_at) VALUES
('88888888-0000-0000-0000-000000000005',
 '33333333-3333-3333-3333-333333333301',
 '22222222-2222-2222-2222-222222222203',
 '22222222-2222-2222-2222-222222222203',
 '22222222-2222-2222-2222-222222222210',
 '55555555-0000-0000-0000-000000000005',
 'If she had listened to my advice earlier, she ________ in such serious trouble now.',
 'MEDIUM', 'ACTIVE',
 'Câu điều kiện hỗn hợp loại 3-2: Điều kiện giả định quá khứ (had listened) dẫn đến kết quả trái thực tế ở hiện tại "now" -> "would not be".',
 5, NOW(), NOW());

-- Q6: Conditionals (HARD)
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, lesson_id, content, difficulty, status, explanation, display_order, created_at, updated_at) VALUES
('88888888-0000-0000-0000-000000000006',
 '33333333-3333-3333-3333-333333333301',
 '22222222-2222-2222-2222-222222222203',
 '22222222-2222-2222-2222-222222222203',
 '22222222-2222-2222-2222-222222222210',
 '55555555-0000-0000-0000-000000000005',
 '________ you require any further assistance, please contact customer support immediately.',
 'HARD', 'ACTIVE',
 'Đảo ngữ câu điều kiện loại 1: Should + S + V_inf thay cho "If you require".',
 6, NOW(), NOW());

-- Q7: Relative Clauses (EASY)
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, lesson_id, content, difficulty, status, explanation, display_order, created_at, updated_at) VALUES
('88888888-0000-0000-0000-000000000007',
 '33333333-3333-3333-3333-333333333301',
 '22222222-2222-2222-2222-222222222204',
 '22222222-2222-2222-2222-222222222204',
 '22222222-2222-2222-2222-222222222210',
 NULL,
 'The young scientist ________ won the prestigious Nobel prize is from Vietnam.',
 'EASY', 'ACTIVE',
 'Đại từ quan hệ thay thế cho danh từ chỉ người "The young scientist" đóng vai trò chủ ngữ -> "who".',
 7, NOW(), NOW());

-- Q8: Relative Clauses (MEDIUM)
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, lesson_id, content, difficulty, status, explanation, display_order, created_at, updated_at) VALUES
('88888888-0000-0000-0000-000000000008',
 '33333333-3333-3333-3333-333333333301',
 '22222222-2222-2222-2222-222222222204',
 '22222222-2222-2222-2222-222222222204',
 '22222222-2222-2222-2222-222222222210',
 NULL,
 'The company offered him a high salary, ________ convinced him to accept the job offer.',
 'MEDIUM', 'ACTIVE',
 'Đại từ quan hệ "which" đứng sau dấu phẩy thay thế cho cả mệnh đề đứng trước.',
 8, NOW(), NOW());

-- Q9: Vocabulary & Collocations (EASY)
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, lesson_id, content, difficulty, status, explanation, display_order, created_at, updated_at) VALUES
('88888888-0000-0000-0000-000000000009',
 '33333333-3333-3333-3333-333333333301',
 '22222222-2222-2222-2222-222222222205',
 '22222222-2222-2222-2222-222222222205',
 '22222222-2222-2222-2222-222222222220',
 '55555555-0000-0000-0000-000000000006',
 'Because of heavy rain, the soccer match had to be ________ until next weekend.',
 'EASY', 'ACTIVE',
 'Cụm động từ "put off" = hoãn lại (postpone/delay). "turned down" = từ chối, "carried out" = tiến hành.',
 9, NOW(), NOW());

-- Q10: Vocabulary & Collocations (MEDIUM)
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, lesson_id, content, difficulty, status, explanation, display_order, created_at, updated_at) VALUES
('88888888-0000-0000-0000-000000000010',
 '33333333-3333-3333-3333-333333333301',
 '22222222-2222-2222-2222-222222222205',
 '22222222-2222-2222-2222-222222222205',
 '22222222-2222-2222-2222-222222222220',
 '55555555-0000-0000-0000-000000000006',
 'The scientific research team successfully ________ a series of experiments on solar energy.',
 'MEDIUM', 'ACTIVE',
 'Collocation: "carry out experiments" = tiến hành thí nghiệm. Các từ khác không kết hợp với experiment theo nghĩa này.',
 10, NOW(), NOW());

-- Q11: Reading Comprehension (EASY)
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, lesson_id, content, difficulty, status, explanation, display_order, created_at, updated_at) VALUES
('88888888-0000-0000-0000-000000000011',
 '33333333-3333-3333-3333-333333333301',
 '22222222-2222-2222-2222-222222222206',
 '22222222-2222-2222-2222-222222222206',
 '22222222-2222-2222-2222-222222222220',
 NULL,
 'Read the sentence: "Renewable energy sources such as solar and wind power produce minimal greenhouse gas emissions." What is the main benefit mentioned?',
 'EASY', 'ACTIVE',
 'Câu văn nêu rõ lợi ích là "produce minimal greenhouse gas emissions" -> giảm thiểu khí thải nhà kính.',
 11, NOW(), NOW());

-- Q12: Reading Comprehension (HARD)
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, lesson_id, content, difficulty, status, explanation, display_order, created_at, updated_at) VALUES
('88888888-0000-0000-0000-000000000012',
 '33333333-3333-3333-3333-333333333301',
 '22222222-2222-2222-2222-222222222206',
 '22222222-2222-2222-2222-222222222206',
 '22222222-2222-2222-2222-222222222220',
 NULL,
 'In academic reading, what is the primary purpose of an author using rhetorical questions in the introductory paragraph?',
 'HARD', 'ACTIVE',
 'Câu hỏi tu từ ở đoạn mở đầu nhằm khơi gợi tư duy, kích thích sự tò mò của người đọc về chủ đề bài viết.',
 12, NOW(), NOW());

-- 3. QUESTION OPTIONS
-- Options for Q1
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order) VALUES
('99999999-0000-0000-0000-000000000101', '88888888-0000-0000-0000-000000000001', 'rises', true, 1),
('99999999-0000-0000-0000-000000000102', '88888888-0000-0000-0000-000000000001', 'is rising', false, 2),
('99999999-0000-0000-0000-000000000103', '88888888-0000-0000-0000-000000000001', 'rose', false, 3),
('99999999-0000-0000-0000-000000000104', '88888888-0000-0000-0000-000000000001', 'has risen', false, 4);

-- Options for Q2
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order) VALUES
('99999999-0000-0000-0000-000000000201', '88888888-0000-0000-0000-000000000002', 'walked', false, 1),
('99999999-0000-0000-0000-000000000202', '88888888-0000-0000-0000-000000000002', 'were walking', true, 2),
('99999999-0000-0000-0000-000000000203', '88888888-0000-0000-0000-000000000002', 'had walked', false, 3),
('99999999-0000-0000-0000-000000000204', '88888888-0000-0000-0000-000000000002', 'are walking', false, 4);

-- Options for Q3
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order) VALUES
('99999999-0000-0000-0000-000000000301', '88888888-0000-0000-0000-000000000003', 'was designed', true, 1),
('99999999-0000-0000-0000-000000000302', '88888888-0000-0000-0000-000000000003', 'designed', false, 2),
('99999999-0000-0000-0000-000000000303', '88888888-0000-0000-0000-000000000003', 'has designed', false, 3),
('99999999-0000-0000-0000-000000000304', '88888888-0000-0000-0000-000000000003', 'is designed', false, 4);

-- Options for Q4
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order) VALUES
('99999999-0000-0000-0000-000000000401', '88888888-0000-0000-0000-000000000004', 'have been destroyed', false, 1),
('99999999-0000-0000-0000-000000000402', '88888888-0000-0000-0000-000000000004', 'had been destroyed', true, 2),
('99999999-0000-0000-0000-000000000403', '88888888-0000-0000-0000-000000000004', 'were destroyed', false, 3),
('99999999-0000-0000-0000-000000000404', '88888888-0000-0000-0000-000000000004', 'destroyed', false, 4);

-- Options for Q5
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order) VALUES
('99999999-0000-0000-0000-000000000501', '88888888-0000-0000-0000-000000000005', 'would not have been', false, 1),
('99999999-0000-0000-0000-000000000502', '88888888-0000-0000-0000-000000000005', 'would not be', true, 2),
('99999999-0000-0000-0000-000000000503', '88888888-0000-0000-0000-000000000005', 'will not be', false, 3),
('99999999-0000-0000-0000-000000000504', '88888888-0000-0000-0000-000000000005', 'is not', false, 4);

-- Options for Q6
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order) VALUES
('99999999-0000-0000-0000-000000000601', '88888888-0000-0000-0000-000000000006', 'Should', true, 1),
('99999999-0000-0000-0000-000000000602', '88888888-0000-0000-0000-000000000006', 'Were', false, 2),
('99999999-0000-0000-0000-000000000603', '88888888-0000-0000-0000-000000000006', 'Had', false, 3),
('99999999-0000-0000-0000-000000000604', '88888888-0000-0000-0000-000000000006', 'Unless', false, 4);

-- Options for Q7
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order) VALUES
('99999999-0000-0000-0000-000000000701', '88888888-0000-0000-0000-000000000007', 'who', true, 1),
('99999999-0000-0000-0000-000000000702', '88888888-0000-0000-0000-000000000007', 'whom', false, 2),
('99999999-0000-0000-0000-000000000703', '88888888-0000-0000-0000-000000000007', 'which', false, 3),
('99999999-0000-0000-0000-000000000704', '88888888-0000-0000-0000-000000000007', 'whose', false, 4);

-- Options for Q8
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order) VALUES
('99999999-0000-0000-0000-000000000801', '88888888-0000-0000-0000-000000000008', 'that', false, 1),
('99999999-0000-0000-0000-000000000802', '88888888-0000-0000-0000-000000000008', 'which', true, 2),
('99999999-0000-0000-0000-000000000803', '88888888-0000-0000-0000-000000000008', 'what', false, 3),
('99999999-0000-0000-0000-000000000804', '88888888-0000-0000-0000-000000000008', 'who', false, 4);

-- Options for Q9
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order) VALUES
('99999999-0000-0000-0000-000000000901', '88888888-0000-0000-0000-000000000009', 'put off', true, 1),
('99999999-0000-0000-0000-000000000902', '88888888-0000-0000-0000-000000000009', 'turned down', false, 2),
('99999999-0000-0000-0000-000000000903', '88888888-0000-0000-0000-000000000009', 'given up', false, 3),
('99999999-0000-0000-0000-000000000904', '88888888-0000-0000-0000-000000000009', 'carried out', false, 4);

-- Options for Q10
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order) VALUES
('99999999-0000-0000-0000-000000001001', '88888888-0000-0000-0000-000000000010', 'carried out', true, 1),
('99999999-0000-0000-0000-000000001002', '88888888-0000-0000-0000-000000000010', 'made up', false, 2),
('99999999-0000-0000-0000-000000001003', '88888888-0000-0000-0000-000000000010', 'looked into', false, 3),
('99999999-0000-0000-0000-000000001004', '88888888-0000-0000-0000-000000000010', 'brought about', false, 4);

-- Options for Q11
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order) VALUES
('99999999-0000-0000-0000-000000001101', '88888888-0000-0000-0000-000000000011', 'Low greenhouse gas emissions', true, 1),
('99999999-0000-0000-0000-000000001102', '88888888-0000-0000-0000-000000000011', 'Unlimited supply anywhere', false, 2),
('99999999-0000-0000-0000-000000001103', '88888888-0000-0000-0000-000000000011', 'Cheap initial installation', false, 3),
('99999999-0000-0000-0000-000000001104', '88888888-0000-0000-0000-000000000011', 'Ease of maintenance', false, 4);

-- Options for Q12
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order) VALUES
('99999999-0000-0000-0000-000000001201', '88888888-0000-0000-0000-000000000012', 'Engage the readers curiosity and prompt critical thinking', true, 1),
('99999999-0000-0000-0000-000000001202', '88888888-0000-0000-0000-000000000012', 'Test whether the reader understands the vocabulary', false, 2),
('99999999-0000-0000-0000-000000001203', '88888888-0000-0000-0000-000000000012', 'Disprove an established scientific formula', false, 3),
('99999999-0000-0000-0000-000000001204', '88888888-0000-0000-0000-000000000012', 'Avoid expressing a direct personal opinion', false, 4);
