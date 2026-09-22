-- ========================================================
-- SEED 100 ENGLISH QUESTIONS INTO question_db
-- ========================================================

-- Q1: [EASY] The sun ________ in the east and sets in the west....
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000101', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222201', '22222222-2222-2222-2222-222222222201', '22222222-2222-2222-2222-222222222210', 'The sun ________ in the east and sets in the west.', 'EASY', 'ACTIVE', 'Chân lý, quy luật tự nhiên luôn chia ở thì Hiện tại đơn. ''The sun'' số ít nên ''rises''.', 1, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001010', '88888888-0000-0000-0000-000000000101', 'rises', true, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001011', '88888888-0000-0000-0000-000000000101', 'is rising', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001012', '88888888-0000-0000-0000-000000000101', 'rose', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001013', '88888888-0000-0000-0000-000000000101', 'has risen', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q2: [EASY] Look! That man ________ to break into the jewelry ...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000102', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222201', '22222222-2222-2222-2222-222222222201', '22222222-2222-2222-2222-222222222210', 'Look! That man ________ to break into the jewelry shop.', 'EASY', 'ACTIVE', 'Dấu hiệu nhận biết ''Look!'' chỉ hành động đang xảy ra trước mắt -> Hiện tại tiếp diễn (is/am/are + V-ing).', 2, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001020', '88888888-0000-0000-0000-000000000102', 'tries', false, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001021', '88888888-0000-0000-0000-000000000102', 'is trying', true, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001022', '88888888-0000-0000-0000-000000000102', 'tried', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001023', '88888888-0000-0000-0000-000000000102', 'has tried', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q3: [EASY] They ________ in this neighborhood for more than t...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000103', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222201', '22222222-2222-2222-2222-222222222201', '22222222-2222-2222-2222-222222222210', 'They ________ in this neighborhood for more than twenty years.', 'EASY', 'ACTIVE', 'Dấu hiệu ''for + khoảng thời gian'' (for more than twenty years) chỉ hành động kéo dài từ quá khứ đến hiện tại -> Hiện tại hoàn thành.', 3, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001030', '88888888-0000-0000-0000-000000000103', 'live', false, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001031', '88888888-0000-0000-0000-000000000103', 'lived', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001032', '88888888-0000-0000-0000-000000000103', 'have lived', true, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001033', '88888888-0000-0000-0000-000000000103', 'are living', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q4: [EASY] Yesterday afternoon, Lan ________ her bicycle to s...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000104', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222201', '22222222-2222-2222-2222-222222222201', '22222222-2222-2222-2222-222222222210', 'Yesterday afternoon, Lan ________ her bicycle to school when it started raining.', 'EASY', 'ACTIVE', 'Hành động đang diễn ra trong quá khứ (was riding) thì có một hành động khác xen ngang (started).', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001040', '88888888-0000-0000-0000-000000000104', 'rides', false, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001041', '88888888-0000-0000-0000-000000000104', 'was riding', true, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001042', '88888888-0000-0000-0000-000000000104', 'has ridden', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001043', '88888888-0000-0000-0000-000000000104', 'is riding', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q5: [EASY] She usually ________ badminton with her friends ev...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000105', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222201', '22222222-2222-2222-2222-222222222201', '22222222-2222-2222-2222-222222222210', 'She usually ________ badminton with her friends every Sunday morning.', 'EASY', 'ACTIVE', 'Dấu hiệu trạng từ tần suất ''usually'' và ''every Sunday'' chỉ thói quen -> thì Hiện tại đơn.', 5, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001050', '88888888-0000-0000-0000-000000000105', 'play', false, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001051', '88888888-0000-0000-0000-000000000105', 'plays', true, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001052', '88888888-0000-0000-0000-000000000105', 'played', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001053', '88888888-0000-0000-0000-000000000105', 'is playing', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q6: [EASY] Last summer holiday, our family ________ Da Nang a...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000106', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222201', '22222222-2222-2222-2222-222222222201', '22222222-2222-2222-2222-222222222210', 'Last summer holiday, our family ________ Da Nang and Hue imperial city.', 'EASY', 'ACTIVE', 'Mốc thời gian ''Last summer holiday'' thuộc quá khứ đã chấm dứt hoàn toàn -> Quá khứ đơn.', 6, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001060', '88888888-0000-0000-0000-000000000106', 'visits', false, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001061', '88888888-0000-0000-0000-000000000106', 'visited', true, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001062', '88888888-0000-0000-0000-000000000106', 'has visited', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001063', '88888888-0000-0000-0000-000000000106', 'was visiting', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q7: [EASY] My father ________ coffee in the morning; he prefe...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000107', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222201', '22222222-2222-2222-2222-222222222201', '22222222-2222-2222-2222-222222222210', 'My father ________ coffee in the morning; he prefers hot tea.', 'EASY', 'ACTIVE', 'Phủ định ở thì Hiện tại đơn với chủ ngữ ngôi thứ ba số ít ''My father'' dùng trợ động từ ''doesn''t drink''.', 7, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001070', '88888888-0000-0000-0000-000000000107', 'don''t drink', false, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001071', '88888888-0000-0000-0000-000000000107', 'doesn''t drink', true, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001072', '88888888-0000-0000-0000-000000000107', 'isn''t drinking', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001073', '88888888-0000-0000-0000-000000000107', 'hasn''t drunk', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q8: [MEDIUM] By next July, professor David ________ at Cambridg...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000108', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222201', '22222222-2222-2222-2222-222222222201', '22222222-2222-2222-2222-222222222210', 'By next July, professor David ________ at Cambridge University for thirty years.', 'MEDIUM', 'ACTIVE', 'Cấu trúc ''By + mốc thời gian tương lai'' (By next July) kết hợp ''for 30 years'' -> Tương lai hoàn thành: will have + V3/ed.', 8, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001080', '88888888-0000-0000-0000-000000000108', 'will teach', false, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001081', '88888888-0000-0000-0000-000000000108', 'will be teaching', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001082', '88888888-0000-0000-0000-000000000108', 'will have taught', true, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001083', '88888888-0000-0000-0000-000000000108', 'has taught', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q9: [MEDIUM] When we reached the stadium, the concert ________ ...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000109', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222201', '22222222-2222-2222-2222-222222222201', '22222222-2222-2222-2222-222222222210', 'When we reached the stadium, the concert ________ already.', 'MEDIUM', 'ACTIVE', 'Hành động buổi biểu diễn bắt đầu trước khi chúng tôi đến sân vận động -> Quá khứ hoàn thành (had begun).', 9, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001090', '88888888-0000-0000-0000-000000000109', 'began', false, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001091', '88888888-0000-0000-0000-000000000109', 'has begun', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001092', '88888888-0000-0000-0000-000000000109', 'had begun', true, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001093', '88888888-0000-0000-0000-000000000109', 'was beginning', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q10: [MEDIUM] Don''t phone me between 8 and 9 tonight because I ...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000110', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222201', '22222222-2222-2222-2222-222222222201', '22222222-2222-2222-2222-222222222210', 'Don''t phone me between 8 and 9 tonight because I ________ an important online meeting.', 'MEDIUM', 'ACTIVE', 'Hành động sẽ đang diễn ra tại một thời điểm xác định trong tương lai -> Tương lai tiếp diễn (will be + V-ing).', 10, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001100', '88888888-0000-0000-0000-000000000110', 'attend', false, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001101', '88888888-0000-0000-0000-000000000110', 'will attend', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001102', '88888888-0000-0000-0000-000000000110', 'will be attending', true, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001103', '88888888-0000-0000-0000-000000000110', 'have attended', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q11: [MEDIUM] This is the first time I ________ such a breathtak...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000111', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222201', '22222222-2222-2222-2222-222222222201', '22222222-2222-2222-2222-222222222210', 'This is the first time I ________ such a breathtaking panoramic landscape.', 'MEDIUM', 'ACTIVE', 'Cấu trúc ''This is the first/second time + S + have/has + V3/ed'' (Hiện tại hoàn thành).', 11, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001110', '88888888-0000-0000-0000-000000000111', 'see', false, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001111', '88888888-0000-0000-0000-000000000111', 'saw', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001112', '88888888-0000-0000-0000-000000000111', 'have seen', true, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001113', '88888888-0000-0000-0000-000000000111', 'had seen', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q12: [MEDIUM] Hardly ________ home when the heavy storm broke ou...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000112', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222201', '22222222-2222-2222-2222-222222222201', '22222222-2222-2222-2222-222222222210', 'Hardly ________ home when the heavy storm broke out.', 'MEDIUM', 'ACTIVE', 'Cấu trúc đảo ngữ với Hardly: ''Hardly had + S + V3/ed + when + S + V2/ed''.', 12, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001120', '88888888-0000-0000-0000-000000000112', 'had he arrived', true, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001121', '88888888-0000-0000-0000-000000000112', 'he had arrived', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001122', '88888888-0000-0000-0000-000000000112', 'did he arrive', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001123', '88888888-0000-0000-0000-000000000112', 'was he arriving', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q13: [MEDIUM] Up to now, the charity organization ________ milli...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000113', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222201', '22222222-2222-2222-2222-222222222201', '22222222-2222-2222-2222-222222222210', 'Up to now, the charity organization ________ millions of dollars for flood victims.', 'MEDIUM', 'ACTIVE', 'Cụm từ ''Up to now'' (cho đến nay) là dấu hiệu điển hình của thì Hiện tại hoàn thành.', 13, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001130', '88888888-0000-0000-0000-000000000113', 'raised', false, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001131', '88888888-0000-0000-0000-000000000113', 'has raised', true, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001132', '88888888-0000-0000-0000-000000000113', 'was raising', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001133', '88888888-0000-0000-0000-000000000113', 'is raising', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q14: [MEDIUM] She looked exhausted because she ________ non-stop...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000114', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222201', '22222222-2222-2222-2222-222222222201', '22222222-2222-2222-2222-222222222210', 'She looked exhausted because she ________ non-stop all morning.', 'MEDIUM', 'ACTIVE', 'Hành động làm việc liên tục cả buổi sáng dẫn đến kết quả trong quá khứ ''looked exhausted'' -> Quá khứ hoàn thành tiếp diễn (had been working).', 14, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001140', '88888888-0000-0000-0000-000000000114', 'has worked', false, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001141', '88888888-0000-0000-0000-000000000114', 'had been working', true, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001142', '88888888-0000-0000-0000-000000000114', 'was working', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001143', '88888888-0000-0000-0000-000000000114', 'worked', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q15: [MEDIUM] At this exact time yesterday, we ________ the high...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000115', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222201', '22222222-2222-2222-2222-222222222201', '22222222-2222-2222-2222-222222222210', 'At this exact time yesterday, we ________ the high-speed bullet train to Tokyo.', 'MEDIUM', 'ACTIVE', 'Thời điểm xác định trong quá khứ ''At this exact time yesterday'' -> Quá khứ tiếp diễn (were boarding).', 15, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001150', '88888888-0000-0000-0000-000000000115', 'boarded', false, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001151', '88888888-0000-0000-0000-000000000115', 'were boarding', true, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001152', '88888888-0000-0000-0000-000000000115', 'had boarded', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001153', '88888888-0000-0000-0000-000000000115', 'have boarded', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q16: [HARD] No sooner ________ the contract than the economic ...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000116', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222201', '22222222-2222-2222-2222-222222222201', '22222222-2222-2222-2222-222222222210', 'No sooner ________ the contract than the economic crisis was officially declared.', 'HARD', 'ACTIVE', 'Đảo ngữ: ''No sooner had + S + V3/ed + than + S + V2/ed''.', 16, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001160', '88888888-0000-0000-0000-000000000116', 'did they sign', false, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001161', '88888888-0000-0000-0000-000000000116', 'had they signed', true, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001162', '88888888-0000-0000-0000-000000000116', 'they had signed', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001163', '88888888-0000-0000-0000-000000000116', 'would they sign', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q17: [HARD] By the end of this century, scientists estimate th...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000117', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222201', '22222222-2222-2222-2222-222222222201', '22222222-2222-2222-2222-222222222210', 'By the end of this century, scientists estimate that global temperatures ________ by at least 2 degrees.', 'HARD', 'ACTIVE', 'Cấu trúc ''By the end of this century'' (mốc tương lai) diễn tả hành động sẽ hoàn tất trước thời điểm đó -> Tương lai hoàn thành (will have risen).', 17, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001170', '88888888-0000-0000-0000-000000000117', 'will rise', false, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001171', '88888888-0000-0000-0000-000000000117', 'are rising', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001172', '88888888-0000-0000-0000-000000000117', 'will have risen', true, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001173', '88888888-0000-0000-0000-000000000117', 'have risen', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q18: [HARD] It is essential that every delegate ________ the o...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000118', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222201', '22222222-2222-2222-2222-222222222201', '22222222-2222-2222-2222-222222222210', 'It is essential that every delegate ________ the orientation session on international security.', 'HARD', 'ACTIVE', 'Thức giả định (Subjunctive mood): ''It is essential that + S + (should) V nguyên mẫu'' -> ''attend''.', 18, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001180', '88888888-0000-0000-0000-000000000118', 'attends', false, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001181', '88888888-0000-0000-0000-000000000118', 'attended', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001182', '88888888-0000-0000-0000-000000000118', 'attend', true, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001183', '88888888-0000-0000-0000-000000000118', 'is attending', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q19: [HARD] Scarcely ________ into the lecture hall when the p...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000119', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222201', '22222222-2222-2222-2222-222222222201', '22222222-2222-2222-2222-222222222210', 'Scarcely ________ into the lecture hall when the professor began his discourse.', 'HARD', 'ACTIVE', 'Cấu trúc đảo ngữ: ''Scarcely had + S + V3/ed + when + S + V2/ed''.', 19, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001190', '88888888-0000-0000-0000-000000000119', 'had the students stepped', true, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001191', '88888888-0000-0000-0000-000000000119', 'the students had stepped', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001192', '88888888-0000-0000-0000-000000000119', 'did the students step', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001193', '88888888-0000-0000-0000-000000000119', 'were the students stepping', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q20: [HARD] He spoke about the ancient monuments as though he ...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000120', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222201', '22222222-2222-2222-2222-222222222201', '22222222-2222-2222-2222-222222222210', 'He spoke about the ancient monuments as though he ________ there in person centuries ago.', 'HARD', 'ACTIVE', '''as though'' nói về giả định trái ngược với quá khứ (centuries ago) dùng thì Quá khứ hoàn thành ''had been''.', 20, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001200', '88888888-0000-0000-0000-000000000120', 'was', false, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001201', '88888888-0000-0000-0000-000000000120', 'were', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001202', '88888888-0000-0000-0000-000000000120', 'had been', true, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001203', '88888888-0000-0000-0000-000000000120', 'would be', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q21: [EASY] English ________ as an official language in numero...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000121', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222202', '22222222-2222-2222-2222-222222222202', '22222222-2222-2222-2222-222222222210', 'English ________ as an official language in numerous countries across the globe.', 'EASY', 'ACTIVE', 'Bị động ở Hiện tại đơn: S + is/am/are + V3/ed. ''English'' là danh từ không đếm được -> ''is spoken''.', 21, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001210', '88888888-0000-0000-0000-000000000121', 'is speaking', false, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001211', '88888888-0000-0000-0000-000000000121', 'is spoken', true, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001212', '88888888-0000-0000-0000-000000000121', 'speaks', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001213', '88888888-0000-0000-0000-000000000121', 'was spoken', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q22: [EASY] This historic bridge ________ by French engineers ...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000122', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222202', '22222222-2222-2222-2222-222222222202', '22222222-2222-2222-2222-222222222210', 'This historic bridge ________ by French engineers in 1898.', 'EASY', 'ACTIVE', 'Bị động ở Quá khứ đơn (mốc 1898): S + was/were + V3/ed -> ''was constructed''.', 22, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001220', '88888888-0000-0000-0000-000000000122', 'constructed', false, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001221', '88888888-0000-0000-0000-000000000122', 'was constructed', true, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001222', '88888888-0000-0000-0000-000000000122', 'has constructed', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001223', '88888888-0000-0000-0000-000000000122', 'is constructed', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q23: [EASY] The final exam results ________ on the school bull...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000123', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222202', '22222222-2222-2222-2222-222222222202', '22222222-2222-2222-2222-222222222210', 'The final exam results ________ on the school bulletin board next Monday.', 'EASY', 'ACTIVE', 'Bị động ở Tương lai đơn: will be + V3/ed.', 23, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001230', '88888888-0000-0000-0000-000000000123', 'will post', false, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001231', '88888888-0000-0000-0000-000000000123', 'will be posted', true, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001232', '88888888-0000-0000-0000-000000000123', 'are posted', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001233', '88888888-0000-0000-0000-000000000123', 'were posted', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q24: [EASY] All mobile phones must ________ during the examina...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000124', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222202', '22222222-2222-2222-2222-222222222202', '22222222-2222-2222-2222-222222222210', 'All mobile phones must ________ during the examination period.', 'EASY', 'ACTIVE', 'Bị động với động từ khuyết thiếu (modal verb): modal + be + V3/ed -> ''must be turned off''.', 24, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001240', '88888888-0000-0000-0000-000000000124', 'turn off', false, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001241', '88888888-0000-0000-0000-000000000124', 'be turned off', true, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001242', '88888888-0000-0000-0000-000000000124', 'being turned off', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001243', '88888888-0000-0000-0000-000000000124', 'turned off', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q25: [EASY] A new shopping mall ________ near my house at the ...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000125', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222202', '22222222-2222-2222-2222-222222222202', '22222222-2222-2222-2222-222222222210', 'A new shopping mall ________ near my house at the present time.', 'EASY', 'ACTIVE', 'Bị động ở Hiện tại tiếp diễn: is/am/are + being + V3/ed.', 25, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001250', '88888888-0000-0000-0000-000000000125', 'is built', false, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001251', '88888888-0000-0000-0000-000000000125', 'is being built', true, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001252', '88888888-0000-0000-0000-000000000125', 'was built', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001253', '88888888-0000-0000-0000-000000000125', 'has built', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q26: [MEDIUM] The antique vase ________ to be more than five hun...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000126', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222202', '22222222-2222-2222-2222-222222222202', '22222222-2222-2222-2222-222222222210', 'The antique vase ________ to be more than five hundred years old.', 'MEDIUM', 'ACTIVE', 'Cấu trúc bị động khách quan: ''S + is/are thought/said/believed + to V'' -> ''is believed''.', 26, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001260', '88888888-0000-0000-0000-000000000126', 'believes', false, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001261', '88888888-0000-0000-0000-000000000126', 'is believing', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001262', '88888888-0000-0000-0000-000000000126', 'is believed', true, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001263', '88888888-0000-0000-0000-000000000126', 'has believed', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q27: [MEDIUM] She remembers ________ to the national botanical g...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000127', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222202', '22222222-2222-2222-2222-222222222202', '22222222-2222-2222-2222-222222222210', 'She remembers ________ to the national botanical gardens by her grandfather when she was six.', 'MEDIUM', 'ACTIVE', 'Cấu trúc bị động với remember: ''remember being + V3/ed'' (nhớ đã được ai đó làm gì cho).', 27, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001270', '88888888-0000-0000-0000-000000000127', 'to take', false, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001271', '88888888-0000-0000-0000-000000000127', 'taking', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001272', '88888888-0000-0000-0000-000000000127', 'being taken', true, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001273', '88888888-0000-0000-0000-000000000127', 'to be taken', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q28: [MEDIUM] He had his personal computer ________ by a profess...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000128', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222202', '22222222-2222-2222-2222-222222222202', '22222222-2222-2222-2222-222222222210', 'He had his personal computer ________ by a professional technician yesterday.', 'MEDIUM', 'ACTIVE', 'Cấu trúc truyền khiến (causative form): have something done (V3/ed) -> ''repaired''.', 28, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001280', '88888888-0000-0000-0000-000000000128', 'repair', false, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001281', '88888888-0000-0000-0000-000000000128', 'to repair', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001282', '88888888-0000-0000-0000-000000000128', 'repaired', true, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001283', '88888888-0000-0000-0000-000000000128', 'repairing', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q29: [MEDIUM] It is reported that thousands of trees ________ do...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000129', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222202', '22222222-2222-2222-2222-222222222202', '22222222-2222-2222-2222-222222222210', 'It is reported that thousands of trees ________ down during the severe typhoon.', 'MEDIUM', 'ACTIVE', 'Mệnh đề sau ''It is reported that'' chia bị động thì Quá khứ đơn ''were blown''.', 29, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001290', '88888888-0000-0000-0000-000000000129', 'blew', false, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001291', '88888888-0000-0000-0000-000000000129', 'were blown', true, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001292', '88888888-0000-0000-0000-000000000129', 'have blown', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001293', '88888888-0000-0000-0000-000000000129', 'are blowing', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q30: [MEDIUM] The thief avoided ________ by disguising himself a...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000130', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222202', '22222222-2222-2222-2222-222222222202', '22222222-2222-2222-2222-222222222210', 'The thief avoided ________ by disguising himself as a delivery man.', 'MEDIUM', 'ACTIVE', 'Cấu trúc ''avoid being + V3/ed'' (tránh bị phát hiện/bắt giữ) -> ''being recognized''.', 30, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001300', '88888888-0000-0000-0000-000000000130', 'recognizing', false, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001301', '88888888-0000-0000-0000-000000000130', 'to recognize', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001302', '88888888-0000-0000-0000-000000000130', 'being recognized', true, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001303', '88888888-0000-0000-0000-000000000130', 'to be recognized', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q31: [MEDIUM] The proposal is expected ________ by the board of ...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000131', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222202', '22222222-2222-2222-2222-222222222202', '22222222-2222-2222-2222-222222222210', 'The proposal is expected ________ by the board of directors before the end of the quarter.', 'MEDIUM', 'ACTIVE', '''is expected to be + V3/ed'' chỉ sự việc được mong đợi sẽ được phê chuẩn.', 31, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001310', '88888888-0000-0000-0000-000000000131', 'approving', false, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001311', '88888888-0000-0000-0000-000000000131', 'to approve', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001312', '88888888-0000-0000-0000-000000000131', 'to be approved', true, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001313', '88888888-0000-0000-0000-000000000131', 'being approved', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q32: [HARD] The suspect is believed ________ the country on a ...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000132', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222202', '22222222-2222-2222-2222-222222222202', '22222222-2222-2222-2222-222222222210', 'The suspect is believed ________ the country on a falsified foreign passport last week.', 'HARD', 'ACTIVE', 'Bị động kép: ''S + is believed + to have + V3/ed'' khi hành động xảy ra trước thời điểm nói (last week).', 32, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001320', '88888888-0000-0000-0000-000000000132', 'to leave', false, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001321', '88888888-0000-0000-0000-000000000132', 'leaving', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001322', '88888888-0000-0000-0000-000000000132', 'to have left', true, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001323', '88888888-0000-0000-0000-000000000132', 'having left', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q33: [HARD] No further action need ________ until all committe...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000133', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222202', '22222222-2222-2222-2222-222222222202', '22222222-2222-2222-2222-222222222210', 'No further action need ________ until all committee members submit their evaluations.', 'HARD', 'ACTIVE', '''need'' ở đây là modal verb: ''need be + V3/ed'' -> ''need be taken''.', 33, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001330', '88888888-0000-0000-0000-000000000133', 'take', false, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001331', '88888888-0000-0000-0000-000000000133', 'to take', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001332', '88888888-0000-0000-0000-000000000133', 'be taken', true, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001333', '88888888-0000-0000-0000-000000000133', 'to be taken', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q34: [HARD] The manuscript was rumored ________ lost in a myst...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000134', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222202', '22222222-2222-2222-2222-222222222202', '22222222-2222-2222-2222-222222222210', 'The manuscript was rumored ________ lost in a mysterious fire centuries ago.', 'HARD', 'ACTIVE', 'Cấu trúc bị động: ''was rumored to have been + V3/ed'' (đã được đồn đại là đã bị thất lạc trong quá khứ).', 34, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001340', '88888888-0000-0000-0000-000000000134', 'to be', false, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001341', '88888888-0000-0000-0000-000000000134', 'to have been', true, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001342', '88888888-0000-0000-0000-000000000134', 'being', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001343', '88888888-0000-0000-0000-000000000134', 'having been', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q35: [HARD] Under no circumstances should sensitive corporate ...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000135', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222202', '22222222-2222-2222-2222-222222222202', '22222222-2222-2222-2222-222222222210', 'Under no circumstances should sensitive corporate data ________ on personal devices.', 'HARD', 'ACTIVE', 'Đảo ngữ với cụm từ phủ định ''Under no circumstances'' kết hợp bị động: ''should + S + be + V3/ed'' -> ''be stored''.', 35, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001350', '88888888-0000-0000-0000-000000000135', 'store', false, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001351', '88888888-0000-0000-0000-000000000135', 'be stored', true, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001352', '88888888-0000-0000-0000-000000000135', 'being stored', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001353', '88888888-0000-0000-0000-000000000135', 'have stored', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q36: [EASY] If the weather ________ fine tomorrow morning, we ...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000136', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222203', '22222222-2222-2222-2222-222222222203', '22222222-2222-2222-2222-222222222210', 'If the weather ________ fine tomorrow morning, we will organize an outdoor picnic.', 'EASY', 'ACTIVE', 'Câu điều kiện loại 1: Mệnh đề If chia Hiện tại đơn (is), mệnh đề chính dùng will + V.', 36, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001360', '88888888-0000-0000-0000-000000000136', 'is', true, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001361', '88888888-0000-0000-0000-000000000136', 'was', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001362', '88888888-0000-0000-0000-000000000136', 'will be', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001363', '88888888-0000-0000-0000-000000000136', 'would be', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q37: [EASY] If I ________ a billionaire, I would establish fre...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000137', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222203', '22222222-2222-2222-2222-222222222203', '22222222-2222-2222-2222-222222222210', 'If I ________ a billionaire, I would establish free modern hospitals for impoverished children.', 'EASY', 'ACTIVE', 'Câu điều kiện loại 2: Mệnh đề If dùng were cho mọi ngôi, mệnh đề chính dùng would + V.', 37, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001370', '88888888-0000-0000-0000-000000000137', 'am', false, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001371', '88888888-0000-0000-0000-000000000137', 'were', true, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001372', '88888888-0000-0000-0000-000000000137', 'will be', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001373', '88888888-0000-0000-0000-000000000137', 'had been', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q38: [EASY] I wish I ________ more leisure time to pursue my p...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000138', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222203', '22222222-2222-2222-2222-222222222203', '22222222-2222-2222-2222-222222222210', 'I wish I ________ more leisure time to pursue my passion for painting.', 'EASY', 'ACTIVE', 'Câu ước ở hiện tại: ''S + wish + S + V2/ed'' -> ''had''.', 38, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001380', '88888888-0000-0000-0000-000000000138', 'have', false, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001381', '88888888-0000-0000-0000-000000000138', 'had', true, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001382', '88888888-0000-0000-0000-000000000138', 'will have', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001383', '88888888-0000-0000-0000-000000000138', 'would have had', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q39: [EASY] If you heat water to 100 degrees Celsius, it _____...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000139', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222203', '22222222-2222-2222-2222-222222222203', '22222222-2222-2222-2222-222222222210', 'If you heat water to 100 degrees Celsius, it ________ into steam.', 'EASY', 'ACTIVE', 'Câu điều kiện loại 0 (quy luật vật lý): If + Hiện tại đơn, Hiện tại đơn -> ''turns''.', 39, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001390', '88888888-0000-0000-0000-000000000139', 'turns', true, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001391', '88888888-0000-0000-0000-000000000139', 'turned', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001392', '88888888-0000-0000-0000-000000000139', 'will turn', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001393', '88888888-0000-0000-0000-000000000139', 'would turn', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q40: [EASY] You will fail the driving test ________ you practi...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000140', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222203', '22222222-2222-2222-2222-222222222203', '22222222-2222-2222-2222-222222222210', 'You will fail the driving test ________ you practice parallel parking diligently.', 'EASY', 'ACTIVE', '''unless'' = if not (trừ khi / nếu không). ''Bạn sẽ trượt kỳ thi lái xe trừ khi bạn luyện tập chăm chỉ''.', 40, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001400', '88888888-0000-0000-0000-000000000140', 'if', false, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001401', '88888888-0000-0000-0000-000000000140', 'unless', true, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001402', '88888888-0000-0000-0000-000000000140', 'provided', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001403', '88888888-0000-0000-0000-000000000140', 'as long as', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q41: [MEDIUM] If she had checked the train schedule beforehand, ...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000141', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222203', '22222222-2222-2222-2222-222222222203', '22222222-2222-2222-2222-222222222210', 'If she had checked the train schedule beforehand, she ________ the last express train.', 'MEDIUM', 'ACTIVE', 'Câu điều kiện loại 3: If + had + V3/ed, S + would have + V3/ed -> ''wouldn''t have missed''.', 41, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001410', '88888888-0000-0000-0000-000000000141', 'won''t miss', false, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001411', '88888888-0000-0000-0000-000000000141', 'wouldn''t miss', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001412', '88888888-0000-0000-0000-000000000141', 'wouldn''t have missed', true, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001413', '88888888-0000-0000-0000-000000000141', 'didn''t miss', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q42: [MEDIUM] I wish I ________ that unkind remark to my best fr...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000142', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222203', '22222222-2222-2222-2222-222222222203', '22222222-2222-2222-2222-222222222210', 'I wish I ________ that unkind remark to my best friend yesterday.', 'MEDIUM', 'ACTIVE', 'Câu ước cho sự việc đã xảy ra trong quá khứ (yesterday): ''wish + S + had (not) + V3/ed'' -> ''hadn''t made''.', 42, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001420', '88888888-0000-0000-0000-000000000142', 'didn''t make', false, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001421', '88888888-0000-0000-0000-000000000142', 'haven''t made', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001422', '88888888-0000-0000-0000-000000000142', 'hadn''t made', true, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001423', '88888888-0000-0000-0000-000000000142', 'wouldn''t make', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q43: [MEDIUM] If he had taken my advice earlier, he ________ in ...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000143', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222203', '22222222-2222-2222-2222-222222222203', '22222222-2222-2222-2222-222222222210', 'If he had taken my advice earlier, he ________ in such a precarious dilemma right now.', 'MEDIUM', 'ACTIVE', 'Câu điều kiện trộn (Mixed conditional): Giả thiết quá khứ (had taken) kết hợp kết quả hiện tại (''right now'') -> ''wouldn''t be''.', 43, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001430', '88888888-0000-0000-0000-000000000143', 'won''t be', false, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001431', '88888888-0000-0000-0000-000000000143', 'wouldn''t be', true, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001432', '88888888-0000-0000-0000-000000000143', 'wouldn''t have been', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001433', '88888888-0000-0000-0000-000000000143', 'isn''t', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q44: [MEDIUM] Provided that you ________ all confidential guidel...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000144', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222203', '22222222-2222-2222-2222-222222222203', '22222222-2222-2222-2222-222222222210', 'Provided that you ________ all confidential guidelines, you may access the laboratory.', 'MEDIUM', 'ACTIVE', '''Provided that'' tương đương ''If'' trong câu điều kiện loại 1 -> mệnh đề phụ chia Hiện tại đơn.', 44, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001440', '88888888-0000-0000-0000-000000000144', 'follow', true, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001441', '88888888-0000-0000-0000-000000000144', 'followed', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001442', '88888888-0000-0000-0000-000000000144', 'will follow', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001443', '88888888-0000-0000-0000-000000000144', 'have followed', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q45: [MEDIUM] Without your timely assistance, we ________ our ma...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000145', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222203', '22222222-2222-2222-2222-222222222203', '22222222-2222-2222-2222-222222222210', 'Without your timely assistance, we ________ our master thesis on time.', 'MEDIUM', 'ACTIVE', '''Without + N'' tương đương mệnh đề If loại 3: ''wouldn''t have completed''.', 45, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001450', '88888888-0000-0000-0000-000000000145', 'couldn''t complete', false, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001451', '88888888-0000-0000-0000-000000000145', 'wouldn''t have completed', true, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001452', '88888888-0000-0000-0000-000000000145', 'won''t complete', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001453', '88888888-0000-0000-0000-000000000145', 'haven''t completed', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q46: [MEDIUM] ________ any urgent inquiries arise, do not hesita...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000146', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222203', '22222222-2222-2222-2222-222222222203', '22222222-2222-2222-2222-222222222210', '________ any urgent inquiries arise, do not hesitate to contact customer support.', 'MEDIUM', 'ACTIVE', 'Đảo ngữ câu điều kiện loại 1: ''Should + S + V nguyên mẫu'' -> ''Should any urgent inquiries arise''.', 46, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001460', '88888888-0000-0000-0000-000000000146', 'Were', false, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001461', '88888888-0000-0000-0000-000000000146', 'Had', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001462', '88888888-0000-0000-0000-000000000146', 'Should', true, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001463', '88888888-0000-0000-0000-000000000146', 'If', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q47: [HARD] ________ for his courageous intervention, the youn...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000147', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222203', '22222222-2222-2222-2222-222222222203', '22222222-2222-2222-2222-222222222210', '________ for his courageous intervention, the young boy would have drowned in the river.', 'HARD', 'ACTIVE', 'Đảo ngữ câu điều kiện loại 3 với cụm ''Had it not been for + N'' (Nếu không nhờ có...).', 47, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001470', '88888888-0000-0000-0000-000000000147', 'Were it not', false, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001471', '88888888-0000-0000-0000-000000000147', 'Had it not been', true, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001472', '88888888-0000-0000-0000-000000000147', 'If it were not', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001473', '88888888-0000-0000-0000-000000000147', 'Should it not be', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q48: [HARD] Were she ________ the true nature of his intention...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000148', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222203', '22222222-2222-2222-2222-222222222203', '22222222-2222-2222-2222-222222222210', 'Were she ________ the true nature of his intentions, she would break off the engagement immediately.', 'HARD', 'ACTIVE', 'Đảo ngữ câu điều kiện loại 2 với động từ thường: ''Were + S + to V'' -> ''Were she to know''.', 48, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001480', '88888888-0000-0000-0000-000000000148', 'know', false, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001481', '88888888-0000-0000-0000-000000000148', 'to know', true, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001482', '88888888-0000-0000-0000-000000000148', 'known', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001483', '88888888-0000-0000-0000-000000000148', 'knowing', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q49: [HARD] If only our flight ________ canceled, we would be ...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000149', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222203', '22222222-2222-2222-2222-222222222203', '22222222-2222-2222-2222-222222222210', 'If only our flight ________ canceled, we would be enjoying our holiday on the tropical island now.', 'HARD', 'ACTIVE', 'Câu ước / điều kiện trộn: Mệnh đề ''If only'' diễn tả nguyên nhân quá khứ (had not been canceled), kết quả hiện tại (''now'').', 49, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001490', '88888888-0000-0000-0000-000000000149', 'wasn''t', false, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001491', '88888888-0000-0000-0000-000000000149', 'weren''t', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001492', '88888888-0000-0000-0000-000000000149', 'hadn''t been', true, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001493', '88888888-0000-0000-0000-000000000149', 'wouldn''t be', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q50: [HARD] But for the prompt medical treatment, the injured ...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000150', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222203', '22222222-2222-2222-2222-222222222203', '22222222-2222-2222-2222-222222222210', 'But for the prompt medical treatment, the injured soldier ________ of severe blood loss.', 'HARD', 'ACTIVE', '''But for + N'' tương đương ''If it had not been for...'' trong quá khứ -> Mệnh đề chính dùng ''would have died''.', 50, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001500', '88888888-0000-0000-0000-000000000150', 'would die', false, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001501', '88888888-0000-0000-0000-000000000150', 'died', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001502', '88888888-0000-0000-0000-000000000150', 'would have died', true, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001503', '88888888-0000-0000-0000-000000000150', 'had died', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q51: [EASY] The experienced doctor ________ examined my grandf...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000151', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222204', '22222222-2222-2222-2222-222222222204', '22222222-2222-2222-2222-222222222210', 'The experienced doctor ________ examined my grandfather yesterday was very dedicated.', 'EASY', 'ACTIVE', 'Đại từ quan hệ ''who'' thay thế cho danh từ chỉ người ''The experienced doctor'' đóng vai trò chủ ngữ.', 51, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001510', '88888888-0000-0000-0000-000000000151', 'which', false, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001511', '88888888-0000-0000-0000-000000000151', 'who', true, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001512', '88888888-0000-0000-0000-000000000151', 'whom', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001513', '88888888-0000-0000-0000-000000000151', 'whose', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q52: [EASY] The scientific textbook ________ covers quantum ph...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000152', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222204', '22222222-2222-2222-2222-222222222204', '22222222-2222-2222-2222-222222222210', 'The scientific textbook ________ covers quantum physics is on the second shelf.', 'EASY', 'ACTIVE', 'Đại từ quan hệ ''which'' (hoặc ''that'') thay thế cho danh từ chỉ vật ''The scientific textbook''.', 52, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001520', '88888888-0000-0000-0000-000000000152', 'who', false, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001521', '88888888-0000-0000-0000-000000000152', 'whom', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001522', '88888888-0000-0000-0000-000000000152', 'which', true, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001523', '88888888-0000-0000-0000-000000000152', 'whose', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q53: [EASY] This is the renowned author ________ latest histor...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000153', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222204', '22222222-2222-2222-2222-222222222204', '22222222-2222-2222-2222-222222222210', 'This is the renowned author ________ latest historical novel won the international prize.', 'EASY', 'ACTIVE', 'Đại từ quan hệ sở hữu ''whose'' đứng trước danh từ ''latest historical novel''.', 53, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001530', '88888888-0000-0000-0000-000000000153', 'who', false, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001531', '88888888-0000-0000-0000-000000000153', 'whom', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001532', '88888888-0000-0000-0000-000000000153', 'whose', true, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001533', '88888888-0000-0000-0000-000000000153', 'which', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q54: [EASY] The coastal town ________ we spent our summer vaca...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000154', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222204', '22222222-2222-2222-2222-222222222204', '22222222-2222-2222-2222-222222222210', 'The coastal town ________ we spent our summer vacation was incredibly scenic.', 'EASY', 'ACTIVE', 'Trạng từ quan hệ ''where'' thay thế cho cụm trạng từ chỉ nơi chốn (in which).', 54, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001540', '88888888-0000-0000-0000-000000000154', 'which', false, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001541', '88888888-0000-0000-0000-000000000154', 'where', true, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001542', '88888888-0000-0000-0000-000000000154', 'when', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001543', '88888888-0000-0000-0000-000000000154', 'why', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q55: [EASY] I still remember the unforgettable day ________ I ...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000155', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222204', '22222222-2222-2222-2222-222222222204', '22222222-2222-2222-2222-222222222210', 'I still remember the unforgettable day ________ I first entered university.', 'EASY', 'ACTIVE', 'Trạng từ quan hệ ''when'' thay thế cho mốc thời gian ''the unforgettable day''.', 55, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001550', '88888888-0000-0000-0000-000000000155', 'where', false, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001551', '88888888-0000-0000-0000-000000000155', 'when', true, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001552', '88888888-0000-0000-0000-000000000155', 'which', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001553', '88888888-0000-0000-0000-000000000155', 'why', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q56: [MEDIUM] The students ________ by the university were given...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000156', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222204', '22222222-2222-2222-2222-222222222204', '22222222-2222-2222-2222-222222222210', 'The students ________ by the university were given full academic scholarships.', 'MEDIUM', 'ACTIVE', 'Rút gọn mệnh đề quan hệ dạng bị động: ''who were selected'' -> rút gọn thành V3/ed ''selected''.', 56, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001560', '88888888-0000-0000-0000-000000000156', 'selecting', false, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001561', '88888888-0000-0000-0000-000000000156', 'selected', true, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001562', '88888888-0000-0000-0000-000000000156', 'were selected', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001563', '88888888-0000-0000-0000-000000000156', 'who selecting', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q57: [MEDIUM] Anyone ________ to participate in the marathon mus...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000157', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222204', '22222222-2222-2222-2222-222222222204', '22222222-2222-2222-2222-222222222210', 'Anyone ________ to participate in the marathon must register before Friday noon.', 'MEDIUM', 'ACTIVE', 'Rút gọn mệnh đề quan hệ dạng chủ động: ''who wishes'' -> ''wishing''.', 57, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001570', '88888888-0000-0000-0000-000000000157', 'wished', false, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001571', '88888888-0000-0000-0000-000000000157', 'wishing', true, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001572', '88888888-0000-0000-0000-000000000157', 'wishes', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001573', '88888888-0000-0000-0000-000000000157', 'is wishing', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q58: [MEDIUM] The prestigious company has three branches, all of...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000158', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222204', '22222222-2222-2222-2222-222222222204', '22222222-2222-2222-2222-222222222210', 'The prestigious company has three branches, all of ________ are located in major metropolises.', 'MEDIUM', 'ACTIVE', 'Đại từ quan hệ sau lượng từ ''all of'' chỉ vật ''three branches'' phải là ''which''.', 58, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001580', '88888888-0000-0000-0000-000000000158', 'whom', false, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001581', '88888888-0000-0000-0000-000000000158', 'which', true, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001582', '88888888-0000-0000-0000-000000000158', 'that', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001583', '88888888-0000-0000-0000-000000000158', 'them', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q59: [MEDIUM] The lady with ________ you were conversing at the ...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000159', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222204', '22222222-2222-2222-2222-222222222204', '22222222-2222-2222-2222-222222222210', 'The lady with ________ you were conversing at the reception is the university chancellor.', 'MEDIUM', 'ACTIVE', 'Sau giới từ ''with'' chỉ người, ta bắt buộc dùng đại từ quan hệ ''whom''.', 59, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001590', '88888888-0000-0000-0000-000000000159', 'who', false, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001591', '88888888-0000-0000-0000-000000000159', 'whom', true, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001592', '88888888-0000-0000-0000-000000000159', 'which', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001593', '88888888-0000-0000-0000-000000000159', 'whose', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q60: [MEDIUM] Neil Armstrong was the first astronaut ________ on...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000160', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222204', '22222222-2222-2222-2222-222222222204', '22222222-2222-2222-2222-222222222210', 'Neil Armstrong was the first astronaut ________ on the surface of the moon.', 'MEDIUM', 'ACTIVE', 'Rút gọn mệnh đề quan hệ sau từ chỉ thứ tự ''the first/second/last'' dùng ''to V'' -> ''to set foot''.', 60, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001600', '88888888-0000-0000-0000-000000000160', 'setting foot', false, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001601', '88888888-0000-0000-0000-000000000160', 'to set foot', true, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001602', '88888888-0000-0000-0000-000000000160', 'set foot', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001603', '88888888-0000-0000-0000-000000000160', 'sets foot', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q61: [MEDIUM] He passed the entrance examination with stellar gr...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000161', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222204', '22222222-2222-2222-2222-222222222204', '22222222-2222-2222-2222-222222222210', 'He passed the entrance examination with stellar grades, ________ delighted his entire family.', 'MEDIUM', 'ACTIVE', 'Đại từ quan hệ ''which'' đứng sau dấu phẩy thay thế cho cả mệnh đề đứng trước.', 61, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001610', '88888888-0000-0000-0000-000000000161', 'that', false, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001611', '88888888-0000-0000-0000-000000000161', 'which', true, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001612', '88888888-0000-0000-0000-000000000161', 'what', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001613', '88888888-0000-0000-0000-000000000161', 'who', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q62: [HARD] The rare botanical specimen, the origin of _______...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000162', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222204', '22222222-2222-2222-2222-222222222204', '22222222-2222-2222-2222-222222222210', 'The rare botanical specimen, the origin of ________ remains obscure, is kept in a climate-controlled vault.', 'HARD', 'ACTIVE', 'Cụm ''the origin of which'' chỉ vật thuộc về ''The rare botanical specimen''.', 62, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001620', '88888888-0000-0000-0000-000000000162', 'whom', false, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001621', '88888888-0000-0000-0000-000000000162', 'that', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001622', '88888888-0000-0000-0000-000000000162', 'which', true, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001623', '88888888-0000-0000-0000-000000000162', 'whose', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q63: [HARD] There were fifty applicants for the executive posi...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000163', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222204', '22222222-2222-2222-2222-222222222204', '22222222-2222-2222-2222-222222222210', 'There were fifty applicants for the executive position, none of ________ possessed sufficient management experience.', 'HARD', 'ACTIVE', 'Lượng từ + of + whom chỉ người: ''none of whom'' thay thế cho ''fifty applicants''.', 63, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001630', '88888888-0000-0000-0000-000000000163', 'them', false, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001631', '88888888-0000-0000-0000-000000000163', 'which', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001632', '88888888-0000-0000-0000-000000000163', 'whom', true, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001633', '88888888-0000-0000-0000-000000000163', 'who', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q64: [HARD] The complex theory ________ by the Nobel laureate ...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000164', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222204', '22222222-2222-2222-2222-222222222204', '22222222-2222-2222-2222-222222222210', 'The complex theory ________ by the Nobel laureate in physics transformed modern astronomy.', 'HARD', 'ACTIVE', 'Rút gọn mệnh đề quan hệ dạng bị động: ''which was expounded'' -> ''expounded''.', 64, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001640', '88888888-0000-0000-0000-000000000164', 'expounded', true, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001641', '88888888-0000-0000-0000-000000000164', 'expounding', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001642', '88888888-0000-0000-0000-000000000164', 'to expound', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001643', '88888888-0000-0000-0000-000000000164', 'was expounded', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q65: [HARD] The historic city wall, parts of ________ date bac...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000165', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222204', '22222222-2222-2222-2222-222222222204', '22222222-2222-2222-2222-222222222210', 'The historic city wall, parts of ________ date back to the 11th century, is being restored.', 'HARD', 'ACTIVE', 'Cụm danh từ sở hữu kết hợp đại từ quan hệ: ''parts of which'' (các phần của bức tường thành).', 65, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001650', '88888888-0000-0000-0000-000000000165', 'whose', false, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001651', '88888888-0000-0000-0000-000000000165', 'which', true, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001652', '88888888-0000-0000-0000-000000000165', 'that', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001653', '88888888-0000-0000-0000-000000000165', 'whom', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q66: [EASY] Regular physical exercise is extremely ________ to...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000166', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222205', '22222222-2222-2222-2222-222222222205', '22222222-2222-2222-2222-222222222220', 'Regular physical exercise is extremely ________ to mental and cardiovascular health.', 'EASY', 'ACTIVE', 'Cụm tính từ: ''beneficial to sth'' (có lợi, bổ ích cho cái gì).', 66, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001660', '88888888-0000-0000-0000-000000000166', 'harmful', false, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001661', '88888888-0000-0000-0000-000000000166', 'beneficial', true, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001662', '88888888-0000-0000-0000-000000000166', 'dangerous', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001663', '88888888-0000-0000-0000-000000000166', 'careless', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q67: [EASY] She made a brilliant ________ at the international...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000167', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222205', '22222222-2222-2222-2222-222222222205', '22222222-2222-2222-2222-222222222220', 'She made a brilliant ________ at the international symposium yesterday.', 'EASY', 'ACTIVE', 'Collocation: ''make a presentation'' (thuyết trình, trình bày báo cáo).', 67, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001670', '88888888-0000-0000-0000-000000000167', 'speech', false, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001671', '88888888-0000-0000-0000-000000000167', 'presentation', true, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001672', '88888888-0000-0000-0000-000000000167', 'lecture', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001673', '88888888-0000-0000-0000-000000000167', 'talk', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q68: [EASY] Deforestation causes severe habitat ________ for t...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000168', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222205', '22222222-2222-2222-2222-222222222205', '22222222-2222-2222-2222-222222222220', 'Deforestation causes severe habitat ________ for thousands of endangered animal species.', 'EASY', 'ACTIVE', 'Cụm danh từ: ''habitat loss'' (mất môi trường sống).', 68, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001680', '88888888-0000-0000-0000-000000000168', 'loss', true, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001681', '88888888-0000-0000-0000-000000000168', 'gain', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001682', '88888888-0000-0000-0000-000000000168', 'finding', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001683', '88888888-0000-0000-0000-000000000168', 'place', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q69: [EASY] Remember to ________ off the electronic devices be...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000169', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222205', '22222222-2222-2222-2222-222222222205', '22222222-2222-2222-2222-222222222220', 'Remember to ________ off the electronic devices before leaving the office.', 'EASY', 'ACTIVE', 'Phrasal verb: ''switch off'' hoặc ''turn off'' (tắt thiết bị điện).', 69, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001690', '88888888-0000-0000-0000-000000000169', 'take', false, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001691', '88888888-0000-0000-0000-000000000169', 'switch', true, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001692', '88888888-0000-0000-0000-000000000169', 'give', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001693', '88888888-0000-0000-0000-000000000169', 'put', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q70: [EASY] He has a great sense of ________; he always makes ...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000170', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222205', '22222222-2222-2222-2222-222222222205', '22222222-2222-2222-2222-222222222220', 'He has a great sense of ________; he always makes his classmates laugh.', 'EASY', 'ACTIVE', 'Idiom / Collocation: ''sense of humor'' (khiếu hài hước).', 70, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001700', '88888888-0000-0000-0000-000000000170', 'humor', true, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001701', '88888888-0000-0000-0000-000000000170', 'direction', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001702', '88888888-0000-0000-0000-000000000170', 'duty', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001703', '88888888-0000-0000-0000-000000000170', 'responsibility', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q71: [EASY] Smoking has a very negative ________ on lung capac...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000171', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222205', '22222222-2222-2222-2222-222222222205', '22222222-2222-2222-2222-222222222220', 'Smoking has a very negative ________ on lung capacity and overall wellness.', 'EASY', 'ACTIVE', 'Collocation: ''have an effect/impact on sth'' (có tác động tiêu cực đến).', 71, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001710', '88888888-0000-0000-0000-000000000171', 'affect', false, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001711', '88888888-0000-0000-0000-000000000171', 'effect', true, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001712', '88888888-0000-0000-0000-000000000171', 'effective', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001713', '88888888-0000-0000-0000-000000000171', 'effectively', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q72: [MEDIUM] The government has implemented strict measures to ...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000172', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222205', '22222222-2222-2222-2222-222222222205', '22222222-2222-2222-2222-222222222220', 'The government has implemented strict measures to ________ air pollution in urban centers.', 'MEDIUM', 'ACTIVE', 'Động từ ''curb'' / ''tackle'' (kiểm soát, hạn chế sự gia tăng tiêu cực). ''curb pollution''.', 72, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001720', '88888888-0000-0000-0000-000000000172', 'enhance', false, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001721', '88888888-0000-0000-0000-000000000172', 'curb', true, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001722', '88888888-0000-0000-0000-000000000172', 'promote', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001723', '88888888-0000-0000-0000-000000000172', 'stimulate', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q73: [MEDIUM] After three hours of fierce debate, the delegates ...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000173', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222205', '22222222-2222-2222-2222-222222222205', '22222222-2222-2222-2222-222222222220', 'After three hours of fierce debate, the delegates finally reached a ________.', 'MEDIUM', 'ACTIVE', 'Collocation: ''reach a consensus / compromise'' (đạt được sự đồng thuận / thỏa hiệp).', 73, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001730', '88888888-0000-0000-0000-000000000173', 'consensus', true, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001731', '88888888-0000-0000-0000-000000000173', 'conflict', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001732', '88888888-0000-0000-0000-000000000173', 'barrier', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001733', '88888888-0000-0000-0000-000000000173', 'contradiction', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q74: [MEDIUM] She decided to ________ for a prestigious master d...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000174', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222205', '22222222-2222-2222-2222-222222222205', '22222222-2222-2222-2222-222222222220', 'She decided to ________ for a prestigious master degree scholarship in the United Kingdom.', 'MEDIUM', 'ACTIVE', 'Phrasal verb: ''apply for a scholarship'' (nộp hồ sơ ứng tuyển học bổng).', 74, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001740', '88888888-0000-0000-0000-000000000174', 'apply', true, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001741', '88888888-0000-0000-0000-000000000174', 'ask', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001742', '88888888-0000-0000-0000-000000000174', 'call', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001743', '88888888-0000-0000-0000-000000000174', 'look', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q75: [MEDIUM] Due to unforeseen circumstances, the organizing co...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000175', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222205', '22222222-2222-2222-2222-222222222205', '22222222-2222-2222-2222-222222222220', 'Due to unforeseen circumstances, the organizing committee had to ________ off the musical festival.', 'MEDIUM', 'ACTIVE', 'Phrasal verb: ''call off'' (hủy bỏ một sự kiện). ''put off'' = hoãn lại.', 75, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001750', '88888888-0000-0000-0000-000000000175', 'put', false, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001751', '88888888-0000-0000-0000-000000000175', 'call', true, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001752', '88888888-0000-0000-0000-000000000175', 'take', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001753', '88888888-0000-0000-0000-000000000175', 'give', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q76: [MEDIUM] Artificial intelligence is playing an increasingly...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000176', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222205', '22222222-2222-2222-2222-222222222205', '22222222-2222-2222-2222-222222222220', 'Artificial intelligence is playing an increasingly ________ role in modern healthcare diagnostics.', 'MEDIUM', 'ACTIVE', 'Collocation: ''play a vital/pivotal/crucial role in'' (đóng vai trò trọng yếu/then chốt).', 76, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001760', '88888888-0000-0000-0000-000000000176', 'pivotal', true, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001761', '88888888-0000-0000-0000-000000000176', 'minor', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001762', '88888888-0000-0000-0000-000000000176', 'trivial', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001763', '88888888-0000-0000-0000-000000000176', 'passive', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q77: [MEDIUM] He has a reputation for being extremely ________; ...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000177', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222205', '22222222-2222-2222-2222-222222222205', '22222222-2222-2222-2222-222222222220', 'He has a reputation for being extremely ________; he never changes his mind easily.', 'MEDIUM', 'ACTIVE', 'Tính từ ''stubborn'' / ''obstinate'' (bướng bỉnh, cứng đầu, bảo thủ).', 77, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001770', '88888888-0000-0000-0000-000000000177', 'flexible', false, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001771', '88888888-0000-0000-0000-000000000177', 'stubborn', true, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001772', '88888888-0000-0000-0000-000000000177', 'adaptable', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001773', '88888888-0000-0000-0000-000000000177', 'open-minded', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q78: [MEDIUM] The young entrepreneur managed to establish a thri...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000178', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222205', '22222222-2222-2222-2222-222222222205', '22222222-2222-2222-2222-222222222220', 'The young entrepreneur managed to establish a thriving startup against all ________.', 'MEDIUM', 'ACTIVE', 'Idiom: ''against all odds'' (vượt qua mọi nghịch cảnh, khó khăn trắc trở).', 78, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001780', '88888888-0000-0000-0000-000000000178', 'odds', true, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001781', '88888888-0000-0000-0000-000000000178', 'chances', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001782', '88888888-0000-0000-0000-000000000178', 'risks', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001783', '88888888-0000-0000-0000-000000000178', 'dangers', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q79: [MEDIUM] The new automated software has significantly _____...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000179', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222205', '22222222-2222-2222-2222-222222222205', '22222222-2222-2222-2222-222222222220', 'The new automated software has significantly ________ workplace efficiency.', 'MEDIUM', 'ACTIVE', 'Động từ ''boost'' / ''enhance'' (nâng cao, thúc đẩy năng suất, hiệu quả làm việc).', 79, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001790', '88888888-0000-0000-0000-000000000179', 'hindered', false, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001791', '88888888-0000-0000-0000-000000000179', 'boosted', true, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001792', '88888888-0000-0000-0000-000000000179', 'delayed', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001793', '88888888-0000-0000-0000-000000000179', 'lowered', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q80: [HARD] The investigative journalist unearthed ________ ev...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000180', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222205', '22222222-2222-2222-2222-222222222205', '22222222-2222-2222-2222-222222222220', 'The investigative journalist unearthed ________ evidence of high-level administrative corruption.', 'HARD', 'ACTIVE', 'Collocation: ''irrefutable/compelling evidence'' (chứng cứ không thể chối cãi, hoàn toàn thuyết phục).', 80, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001800', '88888888-0000-0000-0000-000000000180', 'irrefutable', true, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001801', '88888888-0000-0000-0000-000000000180', 'doubtful', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001802', '88888888-0000-0000-0000-000000000180', 'tentative', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001803', '88888888-0000-0000-0000-000000000180', 'negligible', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q81: [HARD] Her cutting-edge research has made an ________ con...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000181', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222205', '22222222-2222-2222-2222-222222222205', '22222222-2222-2222-2222-222222222220', 'Her cutting-edge research has made an ________ contribution to the treatment of genetic disorders.', 'HARD', 'ACTIVE', 'Collocation: ''invaluable/immeasurable contribution'' (đóng góp vô giá / cực kỳ to lớn).', 81, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001810', '88888888-0000-0000-0000-000000000181', 'invaluable', true, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001811', '88888888-0000-0000-0000-000000000181', 'worthless', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001812', '88888888-0000-0000-0000-000000000181', 'ineffective', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001813', '88888888-0000-0000-0000-000000000181', 'indifferent', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q82: [HARD] He was on pins and ________ while waiting for the ...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000182', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222205', '22222222-2222-2222-2222-222222222205', '22222222-2222-2222-2222-222222222220', 'He was on pins and ________ while waiting for the board''s decision regarding his promotion.', 'HARD', 'ACTIVE', 'Idiom: ''on pins and needles'' (bồn chồn, sốt ruột, lo lắng đứng ngồi không yên).', 82, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001820', '88888888-0000-0000-0000-000000000182', 'needles', true, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001821', '88888888-0000-0000-0000-000000000182', 'threads', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001822', '88888888-0000-0000-0000-000000000182', 'stones', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001823', '88888888-0000-0000-0000-000000000182', 'wires', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q83: [HARD] The company''s marketing strategy proved to be a w...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000183', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222205', '22222222-2222-2222-2222-222222222205', '22222222-2222-2222-2222-222222222220', 'The company''s marketing strategy proved to be a white ________, consuming immense capital with zero return.', 'HARD', 'ACTIVE', 'Idiom: ''a white elephant'' (một thứ tốn kém tiền của duy trì nhưng hoàn toàn vô dụng).', 83, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001830', '88888888-0000-0000-0000-000000000183', 'elephant', true, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001831', '88888888-0000-0000-0000-000000000183', 'horse', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001832', '88888888-0000-0000-0000-000000000183', 'tiger', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001833', '88888888-0000-0000-0000-000000000183', 'swan', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q84: [HARD] The new legislation aims to ________ the systemic ...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000184', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222205', '22222222-2222-2222-2222-222222222205', '22222222-2222-2222-2222-222222222220', 'The new legislation aims to ________ the systemic disparities between urban and rural school districts.', 'HARD', 'ACTIVE', 'Động từ ''bridge the gap/disparities'' hoặc ''ameliorate / eradicate'' (thu hẹp/cải thiện sự chênh lệch).', 84, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001840', '88888888-0000-0000-0000-000000000184', 'bridge', true, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001841', '88888888-0000-0000-0000-000000000184', 'widen', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001842', '88888888-0000-0000-0000-000000000184', 'aggravate', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001843', '88888888-0000-0000-0000-000000000184', 'prolong', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q85: [HARD] The diplomat handled the delicate bilateral disput...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000185', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222205', '22222222-2222-2222-2222-222222222205', '22222222-2222-2222-2222-222222222220', 'The diplomat handled the delicate bilateral dispute with consummate ________.', 'HARD', 'ACTIVE', 'Collocation: ''with consummate tact / skill'' (với sự khéo léo, tế nhị tột bậc).', 85, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001850', '88888888-0000-0000-0000-000000000185', 'tact', true, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001851', '88888888-0000-0000-0000-000000000185', 'tactics', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001852', '88888888-0000-0000-0000-000000000185', 'bluntness', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001853', '88888888-0000-0000-0000-000000000185', 'hesitation', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q86: [EASY] Renewable energy sources such as wind and solar ar...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000186', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222206', '22222222-2222-2222-2222-222222222206', '22222222-2222-2222-2222-222222222220', 'Renewable energy sources such as wind and solar are sustainable, ________ they do not deplete natural resources.', 'EASY', 'ACTIVE', 'Liên từ chỉ nguyên nhân: ''because'' / ''as'' / ''since'' (bởi vì năng lượng tái tạo không làm cạn kiệt tài nguyên).', 86, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001860', '88888888-0000-0000-0000-000000000186', 'although', false, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001861', '88888888-0000-0000-0000-000000000186', 'because', true, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001862', '88888888-0000-0000-0000-000000000186', 'unless', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001863', '88888888-0000-0000-0000-000000000186', 'so that', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q87: [EASY] He studied diligently day and night; ________, he ...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000187', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222206', '22222222-2222-2222-2222-222222222206', '22222222-2222-2222-2222-222222222220', 'He studied diligently day and night; ________, he achieved the highest honors in the exam.', 'EASY', 'ACTIVE', 'Trạng từ liên kết chỉ kết quả: ''therefore'' (do đó, vì vậy).', 87, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001870', '88888888-0000-0000-0000-000000000187', 'however', false, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001871', '88888888-0000-0000-0000-000000000187', 'therefore', true, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001872', '88888888-0000-0000-0000-000000000187', 'nevertheless', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001873', '88888888-0000-0000-0000-000000000187', 'otherwise', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q88: [EASY] ________ the torrential rainstorm, the open-air fe...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000188', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222206', '22222222-2222-2222-2222-222222222206', '22222222-2222-2222-2222-222222222220', '________ the torrential rainstorm, the open-air festival was attended by thousands of spectators.', 'EASY', 'ACTIVE', '''Despite / In spite of + Noun phrase'' diễn tả sự nhượng bộ (Mặc cho cơn mưa xối xả).', 88, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001880', '88888888-0000-0000-0000-000000000188', 'Despite', true, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001881', '88888888-0000-0000-0000-000000000188', 'Although', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001882', '88888888-0000-0000-0000-000000000188', 'Because of', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001883', '88888888-0000-0000-0000-000000000188', 'Since', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q89: [EASY] You should carry an umbrella with you in ________ ...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000189', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222206', '22222222-2222-2222-2222-222222222206', '22222222-2222-2222-2222-222222222220', 'You should carry an umbrella with you in ________ it rains later this afternoon.', 'EASY', 'ACTIVE', 'Cụm liên từ: ''in case + S + V'' (phòng khi, phòng trường hợp trời mưa).', 89, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001890', '88888888-0000-0000-0000-000000000189', 'case', true, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001891', '88888888-0000-0000-0000-000000000189', 'order', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001892', '88888888-0000-0000-0000-000000000189', 'fact', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001893', '88888888-0000-0000-0000-000000000189', 'view', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q90: [MEDIUM] ________ had the keynote speaker stepped onto the ...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000190', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222206', '22222222-2222-2222-2222-222222222206', '22222222-2222-2222-2222-222222222220', '________ had the keynote speaker stepped onto the stage than the audience erupted into applause.', 'MEDIUM', 'ACTIVE', 'Cấu trúc đảo ngữ: ''No sooner had + S + V3/ed + than...''.', 90, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001900', '88888888-0000-0000-0000-000000000190', 'Scarcely', false, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001901', '88888888-0000-0000-0000-000000000190', 'Hardly', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001902', '88888888-0000-0000-0000-000000000190', 'No sooner', true, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001903', '88888888-0000-0000-0000-000000000190', 'Barely', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q91: [MEDIUM] The team conducted thorough research in order ____...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000191', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222206', '22222222-2222-2222-2222-222222222206', '22222222-2222-2222-2222-222222222220', 'The team conducted thorough research in order ________ misleading statistical conclusions.', 'MEDIUM', 'ACTIVE', 'Cấu trúc chỉ mục đích phủ định: ''in order to avoid + N'' hoặc ''in order not to draw''.', 91, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001910', '88888888-0000-0000-0000-000000000191', 'to avoid', true, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001911', '88888888-0000-0000-0000-000000000191', 'avoiding', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001912', '88888888-0000-0000-0000-000000000191', 'avoid', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001913', '88888888-0000-0000-0000-000000000191', 'to avoiding', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q92: [MEDIUM] Neither the school principal nor the faculty membe...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000192', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222206', '22222222-2222-2222-2222-222222222206', '22222222-2222-2222-2222-222222222220', 'Neither the school principal nor the faculty members ________ willing to compromise on academic standards.', 'MEDIUM', 'ACTIVE', 'Quy tắc hòa hợp chủ ngữ: ''Neither S1 nor S2 + V chia theo S2''. S2 là ''the faculty members'' số nhiều -> ''were''.', 92, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001920', '88888888-0000-0000-0000-000000000192', 'was', false, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001921', '88888888-0000-0000-0000-000000000192', 'were', true, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001922', '88888888-0000-0000-0000-000000000192', 'is', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001923', '88888888-0000-0000-0000-000000000192', 'be', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q93: [MEDIUM] Not only ________ the first prize in the national ...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000193', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222206', '22222222-2222-2222-2222-222222222206', '22222222-2222-2222-2222-222222222220', 'Not only ________ the first prize in the national contest, but he was also awarded a scholarship.', 'MEDIUM', 'ACTIVE', 'Đảo ngữ với ''Not only'': ''Not only did he win... but he was also...''.', 93, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001930', '88888888-0000-0000-0000-000000000193', 'he won', false, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001931', '88888888-0000-0000-0000-000000000193', 'did he win', true, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001932', '88888888-0000-0000-0000-000000000193', 'he had won', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001933', '88888888-0000-0000-0000-000000000193', 'was he winning', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q94: [MEDIUM] So intricate ________ that even seasoned cryptogra...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000194', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222206', '22222222-2222-2222-2222-222222222206', '22222222-2222-2222-2222-222222222220', 'So intricate ________ that even seasoned cryptographers struggled to decipher its contents.', 'MEDIUM', 'ACTIVE', 'Đảo ngữ với ''So'': ''So + Adj + be + S + that...'' -> ''So intricate was the encoded message that...''.', 94, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001940', '88888888-0000-0000-0000-000000000194', 'was the encoded message', true, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001941', '88888888-0000-0000-0000-000000000194', 'the encoded message was', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001942', '88888888-0000-0000-0000-000000000194', 'did the encoded message', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001943', '88888888-0000-0000-0000-000000000194', 'is the encoded message', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q95: [MEDIUM] The higher the altitude of the mountain trail, ___...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000195', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222206', '22222222-2222-2222-2222-222222222206', '22222222-2222-2222-2222-222222222220', 'The higher the altitude of the mountain trail, ________ the oxygen levels become.', 'MEDIUM', 'ACTIVE', 'So sánh kép (Double comparative): ''The + so sánh hơn..., the + so sánh hơn...'' -> ''the lower''.', 95, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001950', '88888888-0000-0000-0000-000000000195', 'the lowest', false, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001951', '88888888-0000-0000-0000-000000000195', 'lower', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001952', '88888888-0000-0000-0000-000000000195', 'the lower', true, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001953', '88888888-0000-0000-0000-000000000195', 'lowest', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q96: [HARD] Much ________ they admired his artistic genius, th...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000196', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222206', '22222222-2222-2222-2222-222222222206', '22222222-2222-2222-2222-222222222220', 'Much ________ they admired his artistic genius, the patrons could not condone his eccentric behavior.', 'HARD', 'ACTIVE', 'Cấu trúc nhượng bộ đặc biệt: ''Much as + S + V'' = ''Although + S + V very much'' (Dù cho họ rất ngưỡng mộ...).', 96, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001960', '88888888-0000-0000-0000-000000000196', 'as', true, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001961', '88888888-0000-0000-0000-000000000196', 'like', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001962', '88888888-0000-0000-0000-000000000196', 'although', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001963', '88888888-0000-0000-0000-000000000196', 'despite', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q97: [HARD] ________ was the intensity of the earthquake that ...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000197', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222206', '22222222-2222-2222-2222-222222222206', '22222222-2222-2222-2222-222222222220', '________ was the intensity of the earthquake that several high-rise structures sustained structural damage.', 'HARD', 'ACTIVE', 'Đảo ngữ với ''Such'': ''Such + be + Noun + that...'' (Trận động đất dữ dội đến mức...).', 97, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001970', '88888888-0000-0000-0000-000000000197', 'So', false, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001971', '88888888-0000-0000-0000-000000000197', 'Such', true, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001972', '88888888-0000-0000-0000-000000000197', 'How', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001973', '88888888-0000-0000-0000-000000000197', 'Too', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q98: [HARD] Only by implementing comprehensive educational ref...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000198', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222206', '22222222-2222-2222-2222-222222222206', '22222222-2222-2222-2222-222222222220', 'Only by implementing comprehensive educational reforms ________ close the persistent achievement gap.', 'HARD', 'ACTIVE', 'Đảo ngữ với ''Only by + V-ing'': ''Only by... can we + V'' -> ''can we hope to close''.', 98, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001980', '88888888-0000-0000-0000-000000000198', 'we can hope to', false, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001981', '88888888-0000-0000-0000-000000000198', 'can we hope to', true, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001982', '88888888-0000-0000-0000-000000000198', 'we hope can', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001983', '88888888-0000-0000-0000-000000000198', 'hope we can to', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q99: [HARD] Were it not for international humanitarian aid, th...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000199', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222206', '22222222-2222-2222-2222-222222222206', '22222222-2222-2222-2222-222222222220', 'Were it not for international humanitarian aid, the famine-stricken region ________ extreme devastation.', 'HARD', 'ACTIVE', 'Đảo ngữ điều kiện loại 2 giả định hiện tại / tương lai: ''would suffer''.', 99, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001990', '88888888-0000-0000-0000-000000000199', 'will suffer', false, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001991', '88888888-0000-0000-0000-000000000199', 'would suffer', true, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001992', '88888888-0000-0000-0000-000000000199', 'would have suffered', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000001993', '88888888-0000-0000-0000-000000000199', 'suffered', false, 4)
ON CONFLICT (id) DO NOTHING;

-- Q100: [HARD] The CEO was reluctant to commit capital until the ...
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, content, difficulty, status, explanation, display_order, created_at, updated_at)
VALUES ('88888888-0000-0000-0000-000000000200', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222206', '22222222-2222-2222-2222-222222222206', '22222222-2222-2222-2222-222222222220', 'The CEO was reluctant to commit capital until the feasibility study ________ conclusive proof of profitability.', 'HARD', 'ACTIVE', 'Hành động nghiên cứu khả thi hoàn tất trước thời điểm trong quá khứ -> Quá khứ hoàn thành ''had provided''.', 100, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000002000', '88888888-0000-0000-0000-000000000200', 'provides', false, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000002001', '88888888-0000-0000-0000-000000000200', 'has provided', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000002002', '88888888-0000-0000-0000-000000000200', 'had provided', true, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order)
VALUES ('99999999-0000-0000-0000-000000002003', '88888888-0000-0000-0000-000000000200', 'is providing', false, 4)
ON CONFLICT (id) DO NOTHING;

