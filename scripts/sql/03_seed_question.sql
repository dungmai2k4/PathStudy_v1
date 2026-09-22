-- ========================================================
-- SEED DATA FOR question_db (Bám sát SGK Tiếng Anh 10 - 100% Tiếng Anh)
-- ========================================================

-- 1. QUESTION BANK
INSERT INTO question_bank (id, name, description, status, subject_id, created_at, updated_at) VALUES
('33333333-3333-3333-3333-333333333301', 
 'Ngân hàng Câu hỏi Tiếng Anh 10 - Chuẩn SGK & GDPT 2018', 
 'Bộ câu hỏi trắc nghiệm tiếng Anh 10 chuẩn hóa theo các Unit của SGK Global Success & Friends Global: Present Tenses, Future & Passive, Compound & Infinitives, Past Tenses, Collocations & Reading Comprehension.', 
 'ACTIVE', 
 '11111111-1111-1111-1111-111111111101', 
 NOW(), NOW());

-- 2. QUESTIONS (100% bằng Tiếng Anh)
-- Q1: Unit 1 Present Simple habit (EASY)
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, lesson_id, content, difficulty, status, explanation, display_order, created_at, updated_at) VALUES
('88888888-0000-0000-0000-000000000001',
 '33333333-3333-3333-3333-333333333301',
 '22222222-2222-2222-2222-222222222201',
 '22222222-2222-2222-2222-222222222201',
 '22222222-2222-2222-2222-222222222210',
 '55555555-0000-0000-0000-000000000001',
 'In Vietnamese families, children usually ________ their parents with everyday household chores.',
 'EASY', 'ACTIVE',
 'Adverb of frequency "usually" indicates a routine habit -> Present Simple with plural subject (help).',
 1, NOW(), NOW());

-- Q2: Unit 1 Present Continuous with sensory signal (MEDIUM)
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, lesson_id, content, difficulty, status, explanation, display_order, created_at, updated_at) VALUES
('88888888-0000-0000-0000-000000000002',
 '33333333-3333-3333-3333-333333333301',
 '22222222-2222-2222-2222-222222222201',
 '22222222-2222-2222-2222-222222222201',
 '22222222-2222-2222-2222-222222222210',
 '55555555-0000-0000-0000-000000000001',
 'Be quiet! My little sister ________ her online English assignment in the next room.',
 'MEDIUM', 'ACTIVE',
 'Exclamatory imperative "Be quiet!" indicates an action in progress right now -> Present Continuous (is doing).',
 2, NOW(), NOW());

-- Q3: Unit 2 Future with Will vs Be Going To (EASY)
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, lesson_id, content, difficulty, status, explanation, display_order, created_at, updated_at) VALUES
('88888888-0000-0000-0000-000000000003',
 '33333333-3333-3333-3333-333333333301',
 '22222222-2222-2222-2222-222222222202',
 '22222222-2222-2222-2222-222222222202',
 '22222222-2222-2222-2222-222222222210',
 '55555555-0000-0000-0000-000000000003',
 '"Why are you buying so much paint?" - "I ________ the living room walls light green this weekend."',
 'EASY', 'ACTIVE',
 'Pre-planned intention with prior preparation already made -> "am going to paint".',
 3, NOW(), NOW());

-- Q4: Unit 2 Passive Voice in Environmental Context (HARD)
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, lesson_id, content, difficulty, status, explanation, display_order, created_at, updated_at) VALUES
('88888888-0000-0000-0000-000000000004',
 '33333333-3333-3333-3333-333333333301',
 '22222222-2222-2222-2222-222222222202',
 '22222222-2222-2222-2222-222222222202',
 '22222222-2222-2222-2222-222222222210',
 '55555555-0000-0000-0000-000000000004',
 'More renewable energy sources such as wind and solar power ________ to replace fossil fuels in the near future.',
 'HARD', 'ACTIVE',
 'Passive construction in modal/future passive form: "must be developed" or "are going to be developed".',
 4, NOW(), NOW());

-- Q5: Unit 3 Compound Sentences (MEDIUM)
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, lesson_id, content, difficulty, status, explanation, display_order, created_at, updated_at) VALUES
('88888888-0000-0000-0000-000000000005',
 '33333333-3333-3333-3333-333333333301',
 '22222222-2222-2222-2222-222222222203',
 '22222222-2222-2222-2222-222222222203',
 '22222222-2222-2222-2222-222222222210',
 '55555555-0000-0000-0000-000000000005',
 'The stadium was packed with enthusiastic fans, ________ the rock band gave a sensational performance.',
 'MEDIUM', 'ACTIVE',
 'Coordinating conjunction "and" connects two independent clauses showing harmonious addition.',
 5, NOW(), NOW());

-- Q6: Unit 3 Infinitives with Causative / Verbs (HARD)
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, lesson_id, content, difficulty, status, explanation, display_order, created_at, updated_at) VALUES
('88888888-0000-0000-0000-000000000006',
 '33333333-3333-3333-3333-333333333301',
 '22222222-2222-2222-2222-222222222203',
 '22222222-2222-2222-2222-222222222203',
 '22222222-2222-2222-2222-222222222210',
 '55555555-0000-0000-0000-000000000005',
 'The inspiring melody of the orchestra made the whole audience ________ deeply touched.',
 'HARD', 'ACTIVE',
 'Causative structure: make + Object + Bare Infinitive (feel).',
 6, NOW(), NOW());

-- Q7: Unit 4 Past Simple vs Past Continuous with When (EASY)
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, lesson_id, content, difficulty, status, explanation, display_order, created_at, updated_at) VALUES
('88888888-0000-0000-0000-000000000007',
 '33333333-3333-3333-3333-333333333301',
 '22222222-2222-2222-2222-222222222204',
 '22222222-2222-2222-2222-222222222204',
 '22222222-2222-2222-2222-222222222210',
 '55555555-0000-0000-0000-000000000006',
 'When the teacher walked into the classroom, the volunteer students ________ charity gift boxes.',
 'EASY', 'ACTIVE',
 'Background action in progress interrupted by short action: "were preparing".',
 7, NOW(), NOW());

-- Q8: Unit 4 Past Continuous with While (MEDIUM)
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, lesson_id, content, difficulty, status, explanation, display_order, created_at, updated_at) VALUES
('88888888-0000-0000-0000-000000000008',
 '33333333-3333-3333-3333-333333333301',
 '22222222-2222-2222-2222-222222222204',
 '22222222-2222-2222-2222-222222222204',
 '22222222-2222-2222-2222-222222222210',
 '55555555-0000-0000-0000-000000000006',
 'While Peter ________ trees along the canal bank, he found an injured puppy.',
 'MEDIUM', 'ACTIVE',
 'Time clause with "While" takes Past Continuous: "was planting".',
 8, NOW(), NOW());

-- Q9: Unit 1 & 2 Collocation Family Life (EASY)
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, lesson_id, content, difficulty, status, explanation, display_order, created_at, updated_at) VALUES
('88888888-0000-0000-0000-000000000009',
 '33333333-3333-3333-3333-333333333301',
 '22222222-2222-2222-2222-222222222205',
 '22222222-2222-2222-2222-222222222205',
 '22222222-2222-2222-2222-222222222220',
 '55555555-0000-0000-0000-000000000007',
 'In my family, my father usually does the heavy ________ such as fixing electrical appliances and moving furniture.',
 'EASY', 'ACTIVE',
 'Idiomatic collocation in Grade 10 Unit 1: "do the heavy lifting" (làm việc nặng nhọc).',
 9, NOW(), NOW());

-- Q10: Unit 1 & 2 Collocation Carbon Footprint (MEDIUM)
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, lesson_id, content, difficulty, status, explanation, display_order, created_at, updated_at) VALUES
('88888888-0000-0000-0000-000000000010',
 '33333333-3333-3333-3333-333333333301',
 '22222222-2222-2222-2222-222222222205',
 '22222222-2222-2222-2222-222222222205',
 '22222222-2222-2222-2222-222222222220',
 '55555555-0000-0000-0000-000000000007',
 'Switching off unnecessary home appliances is an easy habit to reduce your carbon ________.',
 'MEDIUM', 'ACTIVE',
 'Collocation in Grade 10 Unit 2: "carbon footprint" (dấu chân carbon).',
 10, NOW(), NOW());

-- Q11: Unit 3 & 4 Vocabulary Volunteer Project (EASY)
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, lesson_id, content, difficulty, status, explanation, display_order, created_at, updated_at) VALUES
('88888888-0000-0000-0000-000000000011',
 '33333333-3333-3333-3333-333333333301',
 '22222222-2222-2222-2222-222222222206',
 '22222222-2222-2222-2222-222222222206',
 '22222222-2222-2222-2222-222222222220',
 '55555555-0000-0000-0000-000000000008',
 'The high school youth club organized a charity music concert to ________ funds for poor rural schools.',
 'EASY', 'ACTIVE',
 'Collocation in Grade 10 Unit 4: "raise funds" (gây quỹ).',
 11, NOW(), NOW());

-- Q12: Unit 3 & 4 Reading Comprehension (HARD)
INSERT INTO question (id, question_bank_id, skill_id, topic_id, module_id, lesson_id, content, difficulty, status, explanation, display_order, created_at, updated_at) VALUES
('88888888-0000-0000-0000-000000000012',
 '33333333-3333-3333-3333-333333333301',
 '22222222-2222-2222-2222-222222222206',
 '22222222-2222-2222-2222-222222222206',
 '22222222-2222-2222-2222-222222222220',
 '55555555-0000-0000-0000-000000000008',
 'Read the following statement: "Community service not only benefits society but also enhances students'' personal growth and leadership skills." What is the main message?',
 'HARD', 'ACTIVE',
 'Both community and students benefit mutually from volunteer engagement.',
 12, NOW(), NOW());


-- 3. QUESTION OPTIONS (100% bằng Tiếng Anh)
-- Q1 Options
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order) VALUES
('99999999-0000-0000-0000-000000000101', '88888888-0000-0000-0000-000000000001', 'help', true, 1),
('99999999-0000-0000-0000-000000000102', '88888888-0000-0000-0000-000000000001', 'are helping', false, 2),
('99999999-0000-0000-0000-000000000103', '88888888-0000-0000-0000-000000000001', 'helped', false, 3),
('99999999-0000-0000-0000-000000000104', '88888888-0000-0000-0000-000000000001', 'has helped', false, 4);

-- Q2 Options
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order) VALUES
('99999999-0000-0000-0000-000000000201', '88888888-0000-0000-0000-000000000002', 'does', false, 1),
('99999999-0000-0000-0000-000000000202', '88888888-0000-0000-0000-000000000002', 'is doing', true, 2),
('99999999-0000-0000-0000-000000000203', '88888888-0000-0000-0000-000000000002', 'did', false, 3),
('99999999-0000-0000-0000-000000000204', '88888888-0000-0000-0000-000000000002', 'has done', false, 4);

-- Q3 Options
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order) VALUES
('99999999-0000-0000-0000-000000000301', '88888888-0000-0000-0000-000000000003', 'am going to paint', true, 1),
('99999999-0000-0000-0000-000000000302', '88888888-0000-0000-0000-000000000003', 'paint', false, 2),
('99999999-0000-0000-0000-000000000303', '88888888-0000-0000-0000-000000000003', 'will paint', false, 3),
('99999999-0000-0000-0000-000000000304', '88888888-0000-0000-0000-000000000003', 'painted', false, 4);

-- Q4 Options
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order) VALUES
('99999999-0000-0000-0000-000000000401', '88888888-0000-0000-0000-000000000004', 'must develop', false, 1),
('99999999-0000-0000-0000-000000000402', '88888888-0000-0000-0000-000000000004', 'must be developed', true, 2),
('99999999-0000-0000-0000-000000000403', '88888888-0000-0000-0000-000000000004', 'have developed', false, 3),
('99999999-0000-0000-0000-000000000404', '88888888-0000-0000-0000-000000000004', 'are developing', false, 4);

-- Q5 Options
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order) VALUES
('99999999-0000-0000-0000-000000000501', '88888888-0000-0000-0000-000000000005', 'and', true, 1),
('99999999-0000-0000-0000-000000000502', '88888888-0000-0000-0000-000000000005', 'but', false, 2),
('99999999-0000-0000-0000-000000000503', '88888888-0000-0000-0000-000000000005', 'or', false, 3),
('99999999-0000-0000-0000-000000000504', '88888888-0000-0000-0000-000000000005', 'yet', false, 4);

-- Q6 Options
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order) VALUES
('99999999-0000-0000-0000-000000000601', '88888888-0000-0000-0000-000000000006', 'feel', true, 1),
('99999999-0000-0000-0000-000000000602', '88888888-0000-0000-0000-000000000006', 'to feel', false, 2),
('99999999-0000-0000-0000-000000000603', '88888888-0000-0000-0000-000000000006', 'feeling', false, 3),
('99999999-0000-0000-0000-000000000604', '88888888-0000-0000-0000-000000000006', 'felt', false, 4);

-- Q7 Options
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order) VALUES
('99999999-0000-0000-0000-000000000701', '88888888-0000-0000-0000-000000000007', 'were preparing', true, 1),
('99999999-0000-0000-0000-000000000702', '88888888-0000-0000-0000-000000000007', 'prepared', false, 2),
('99999999-0000-0000-0000-000000000703', '88888888-0000-0000-0000-000000000007', 'are preparing', false, 3),
('99999999-0000-0000-0000-000000000704', '88888888-0000-0000-0000-000000000007', 'prepare', false, 4);

-- Q8 Options
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order) VALUES
('99999999-0000-0000-0000-000000000801', '88888888-0000-0000-0000-000000000008', 'was planting', true, 1),
('99999999-0000-0000-0000-000000000802', '88888888-0000-0000-0000-000000000008', 'planted', false, 2),
('99999999-0000-0000-0000-000000000803', '88888888-0000-0000-0000-000000000008', 'is planting', false, 3),
('99999999-0000-0000-0000-000000000804', '88888888-0000-0000-0000-000000000008', 'plants', false, 4);

-- Q9 Options
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order) VALUES
('99999999-0000-0000-0000-000000000901', '88888888-0000-0000-0000-000000000009', 'lifting', true, 1),
('99999999-0000-0000-0000-000000000902', '88888888-0000-0000-0000-000000000009', 'carrying', false, 2),
('99999999-0000-0000-0000-000000000903', '88888888-0000-0000-0000-000000000009', 'holding', false, 3),
('99999999-0000-0000-0000-000000000904', '88888888-0000-0000-0000-000000000009', 'pulling', false, 4);

-- Q10 Options
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order) VALUES
('99999999-0000-0000-0000-000000001001', '88888888-0000-0000-0000-000000000010', 'footprint', true, 1),
('99999999-0000-0000-0000-000000001002', '88888888-0000-0000-0000-000000000010', 'handprint', false, 2),
('99999999-0000-0000-0000-000000001003', '88888888-0000-0000-0000-000000000010', 'fingerprint', false, 3),
('99999999-0000-0000-0000-000000001004', '88888888-0000-0000-0000-000000000010', 'shadow', false, 4);

-- Q11 Options
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order) VALUES
('99999999-0000-0000-0000-000000001101', '88888888-0000-0000-0000-000000000011', 'raise', true, 1),
('99999999-0000-0000-0000-000000001102', '88888888-0000-0000-0000-000000000011', 'rise', false, 2),
('99999999-0000-0000-0000-000000001103', '88888888-0000-0000-0000-000000000011', 'grow', false, 3),
('99999999-0000-0000-0000-000000001104', '88888888-0000-0000-0000-000000000011', 'lift', false, 4);

-- Q12 Options
INSERT INTO question_option (id, question_id, option_content, is_correct, display_order) VALUES
('99999999-0000-0000-0000-000000001201', '88888888-0000-0000-0000-000000000012', 'Volunteering offers mutual benefits for both society and the volunteers themselves.', true, 1),
('99999999-0000-0000-0000-000000001202', '88888888-0000-0000-0000-000000000012', 'Only students gain advantages from community services.', false, 2),
('99999999-0000-0000-0000-000000001203', '88888888-0000-0000-0000-000000000012', 'Leadership skills cannot be developed through voluntary projects.', false, 3),
('99999999-0000-0000-0000-000000001204', '88888888-0000-0000-0000-000000000012', 'Community projects are only meant for adult workers.', false, 4);
