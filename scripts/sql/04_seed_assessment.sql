-- ========================================================
-- SEED DATA FOR assessment_db (Bám sát SGK Tiếng Anh 10 - 100% Tiếng Anh)
-- ========================================================

-- 1. ASSESSMENTS
INSERT INTO assessments (id, title, assessment_type, subject_id, total_questions, time_limit_minutes, passing_score_percentage, created_at, updated_at) VALUES
('77777777-0000-0000-0000-000000000001',
 'Khảo sát Năng lực Đầu vào Tiếng Anh 10 (Grade 10 Placement Test)',
 'PLACEMENT',
 '11111111-1111-1111-1111-111111111101',
 12, 20, 60, NOW(), NOW()),

('77777777-0000-0000-0000-000000000002',
 'Kiểm tra Đánh giá Chủ đề: Unit 1 Present Simple & Continuous',
 'SKILL_TEST',
 '11111111-1111-1111-1111-111111111101',
 5, 10, 70, NOW(), NOW());

-- 2. ASSESSMENT QUESTIONS (FOR PLACEMENT TEST - 100% ENGLISH)
INSERT INTO assessment_questions (id, assessment_id, question_id, skill_id, skill_name, content, options_json, correct_option_id, difficulty, display_order, explanation, created_at, updated_at) VALUES
-- Q1
('aaaaaaaa-1000-0000-0000-000000000001',
 '77777777-0000-0000-0000-000000000001',
 '88888888-0000-0000-0000-000000000001',
 '22222222-2222-2222-2222-222222222201', 'Unit 1: Present Simple & Present Continuous',
 'In Vietnamese families, children usually ________ their parents with everyday household chores.',
 '[{"id":"99999999-0000-0000-0000-000000000101","optionContent":"help","displayOrder":1},{"id":"99999999-0000-0000-0000-000000000102","optionContent":"are helping","displayOrder":2},{"id":"99999999-0000-0000-0000-000000000103","optionContent":"helped","displayOrder":3},{"id":"99999999-0000-0000-0000-000000000104","optionContent":"has helped","displayOrder":4}]',
 '99999999-0000-0000-0000-000000000101', 'EASY', 1,
 'Routine habit with adverb "usually" requires Present Simple (help).',
 NOW(), NOW()),

-- Q2
('aaaaaaaa-1000-0000-0000-000000000002',
 '77777777-0000-0000-0000-000000000001',
 '88888888-0000-0000-0000-000000000002',
 '22222222-2222-2222-2222-222222222201', 'Unit 1: Present Simple & Present Continuous',
 'Be quiet! My little sister ________ her online English assignment in the next room.',
 '[{"id":"99999999-0000-0000-0000-000000000201","optionContent":"does","displayOrder":1},{"id":"99999999-0000-0000-0000-000000000202","optionContent":"is doing","displayOrder":2},{"id":"99999999-0000-0000-0000-000000000203","optionContent":"did","displayOrder":3},{"id":"99999999-0000-0000-0000-000000000204","optionContent":"has done","displayOrder":4}]',
 '99999999-0000-0000-0000-000000000202', 'MEDIUM', 2,
 'Action in progress denoted by signal "Be quiet!" requires Present Continuous (is doing).',
 NOW(), NOW()),

-- Q3
('aaaaaaaa-1000-0000-0000-000000000003',
 '77777777-0000-0000-0000-000000000001',
 '88888888-0000-0000-0000-000000000003',
 '22222222-2222-2222-2222-222222222202', 'Unit 2: Will vs. Be Going To & Passive Voice',
 '"Why are you buying so much paint?" - "I ________ the living room walls light green this weekend."',
 '[{"id":"99999999-0000-0000-0000-000000000301","optionContent":"am going to paint","displayOrder":1},{"id":"99999999-0000-0000-0000-000000000302","optionContent":"paint","displayOrder":2},{"id":"99999999-0000-0000-0000-000000000303","optionContent":"will paint","displayOrder":3},{"id":"99999999-0000-0000-0000-000000000304","optionContent":"painted","displayOrder":4}]',
 '99999999-0000-0000-0000-000000000301', 'EASY', 3,
 'Pre-planned intention decided before the moment of speaking uses "am going to paint".',
 NOW(), NOW()),

-- Q4
('aaaaaaaa-1000-0000-0000-000000000004',
 '77777777-0000-0000-0000-000000000001',
 '88888888-0000-0000-0000-000000000004',
 '22222222-2222-2222-2222-222222222202', 'Unit 2: Will vs. Be Going To & Passive Voice',
 'More renewable energy sources such as wind and solar power ________ to replace fossil fuels in the near future.',
 '[{"id":"99999999-0000-0000-0000-000000000401","optionContent":"must develop","displayOrder":1},{"id":"99999999-0000-0000-0000-000000000402","optionContent":"must be developed","displayOrder":2},{"id":"99999999-0000-0000-0000-000000000403","optionContent":"have developed","displayOrder":3},{"id":"99999999-0000-0000-0000-000000000404","optionContent":"are developing","displayOrder":4}]',
 '99999999-0000-0000-0000-000000000402', 'HARD', 4,
 'Modal passive requires: modal + be + V3/ed (must be developed).',
 NOW(), NOW()),

-- Q5
('aaaaaaaa-1000-0000-0000-000000000005',
 '77777777-0000-0000-0000-000000000001',
 '88888888-0000-0000-0000-000000000005',
 '22222222-2222-2222-2222-222222222203', 'Unit 3: Compound Sentences & Infinitives',
 'The stadium was packed with enthusiastic fans, ________ the rock band gave a sensational performance.',
 '[{"id":"99999999-0000-0000-0000-000000000501","optionContent":"and","displayOrder":1},{"id":"99999999-0000-0000-0000-000000000502","optionContent":"but","displayOrder":2},{"id":"99999999-0000-0000-0000-000000000503","optionContent":"or","displayOrder":3},{"id":"99999999-0000-0000-0000-000000000504","optionContent":"yet","displayOrder":4}]',
 '99999999-0000-0000-0000-000000000501', 'MEDIUM', 5,
 'Coordinating conjunction "and" expresses logical addition between two positive clauses.',
 NOW(), NOW()),

-- Q6
('aaaaaaaa-1000-0000-0000-000000000006',
 '77777777-0000-0000-0000-000000000001',
 '88888888-0000-0000-0000-000000000006',
 '22222222-2222-2222-2222-222222222203', 'Unit 3: Compound Sentences & Infinitives',
 'The inspiring melody of the orchestra made the whole audience ________ deeply touched.',
 '[{"id":"99999999-0000-0000-0000-000000000601","optionContent":"feel","displayOrder":1},{"id":"99999999-0000-0000-0000-000000000602","optionContent":"to feel","displayOrder":2},{"id":"99999999-0000-0000-0000-000000000603","optionContent":"feeling","displayOrder":3},{"id":"99999999-0000-0000-0000-000000000604","optionContent":"felt","displayOrder":4}]',
 '99999999-0000-0000-0000-000000000601', 'HARD', 6,
 'Make + Object + Bare Infinitive (feel).',
 NOW(), NOW()),

-- Q7
('aaaaaaaa-1000-0000-0000-000000000007',
 '77777777-0000-0000-0000-000000000001',
 '88888888-0000-0000-0000-000000000007',
 '22222222-2222-2222-2222-222222222204', 'Unit 4: Past Simple vs. Past Continuous',
 'When the teacher walked into the classroom, the volunteer students ________ charity gift boxes.',
 '[{"id":"99999999-0000-0000-0000-000000000701","optionContent":"were preparing","displayOrder":1},{"id":"99999999-0000-0000-0000-000000000702","optionContent":"prepared","displayOrder":2},{"id":"99999999-0000-0000-0000-000000000703","optionContent":"are preparing","displayOrder":3},{"id":"99999999-0000-0000-0000-000000000704","optionContent":"prepare","displayOrder":4}]',
 '99999999-0000-0000-0000-000000000701', 'EASY', 7,
 'Ongoing background action in progress (were preparing) interrupted by "walked".',
 NOW(), NOW()),

-- Q8
('aaaaaaaa-1000-0000-0000-000000000008',
 '77777777-0000-0000-0000-000000000001',
 '88888888-0000-0000-0000-000000000008',
 '22222222-2222-2222-2222-222222222204', 'Unit 4: Past Simple vs. Past Continuous',
 'While Peter ________ trees along the canal bank, he found an injured puppy.',
 '[{"id":"99999999-0000-0000-0000-000000000801","optionContent":"was planting","displayOrder":1},{"id":"99999999-0000-0000-0000-000000000802","optionContent":"planted","displayOrder":2},{"id":"99999999-0000-0000-0000-000000000803","optionContent":"is planting","displayOrder":3},{"id":"99999999-0000-0000-0000-000000000804","optionContent":"plants","displayOrder":4}]',
 '99999999-0000-0000-0000-000000000801', 'MEDIUM', 8,
 'While clause describing past ongoing activity takes Past Continuous (was planting).',
 NOW(), NOW()),

-- Q9
('aaaaaaaa-1000-0000-0000-000000000009',
 '77777777-0000-0000-0000-000000000001',
 '88888888-0000-0000-0000-000000000009',
 '22222222-2222-2222-2222-222222222205', 'Unit 1 & 2: Family Life & Green Living Collocations',
 'In my family, my father usually does the heavy ________ such as fixing electrical appliances and moving furniture.',
 '[{"id":"99999999-0000-0000-0000-000000000901","optionContent":"lifting","displayOrder":1},{"id":"99999999-0000-0000-0000-000000000902","optionContent":"carrying","displayOrder":2},{"id":"99999999-0000-0000-0000-000000000903","optionContent":"holding","displayOrder":3},{"id":"99999999-0000-0000-0000-000000000904","optionContent":"pulling","displayOrder":4}]',
 '99999999-0000-0000-0000-000000000901', 'EASY', 9,
 'High-frequency collocation in Unit 1: "do the heavy lifting".',
 NOW(), NOW()),

-- Q10
('aaaaaaaa-1000-0000-0000-000000000010',
 '77777777-0000-0000-0000-000000000001',
 '88888888-0000-0000-0000-000000000010',
 '22222222-2222-2222-2222-222222222205', 'Unit 1 & 2: Family Life & Green Living Collocations',
 'Switching off unnecessary home appliances is an easy habit to reduce your carbon ________.',
 '[{"id":"99999999-0000-0000-0000-000000001001","optionContent":"footprint","displayOrder":1},{"id":"99999999-0000-0000-0000-000000001002","optionContent":"handprint","displayOrder":2},{"id":"99999999-0000-0000-0000-000000001003","optionContent":"fingerprint","displayOrder":3},{"id":"99999999-0000-0000-0000-000000001004","optionContent":"shadow","displayOrder":4}]',
 '99999999-0000-0000-0000-000000001001', 'MEDIUM', 10,
 'Unit 2 environmental collocation: "carbon footprint".',
 NOW(), NOW()),

-- Q11
('aaaaaaaa-1000-0000-0000-000000000011',
 '77777777-0000-0000-0000-000000000001',
 '88888888-0000-0000-0000-000000000011',
 '22222222-2222-2222-2222-222222222206', 'Unit 3 & 4: Music & Community Service Reading',
 'The high school youth club organized a charity music concert to ________ funds for poor rural schools.',
 '[{"id":"99999999-0000-0000-0000-000000001101","optionContent":"raise","displayOrder":1},{"id":"99999999-0000-0000-0000-000000001102","optionContent":"rise","displayOrder":2},{"id":"99999999-0000-0000-0000-000000001103","optionContent":"grow","displayOrder":3},{"id":"99999999-0000-0000-0000-000000001104","optionContent":"lift","displayOrder":4}]',
 '99999999-0000-0000-0000-000000001101', 'EASY', 11,
 'Unit 4 volunteering collocation: "raise funds for charity".',
 NOW(), NOW()),

-- Q12
('aaaaaaaa-1000-0000-0000-000000000012',
 '77777777-0000-0000-0000-000000000001',
 '88888888-0000-0000-0000-000000000012',
 '22222222-2222-2222-2222-222222222206', 'Unit 3 & 4: Music & Community Service Reading',
 'Read the following statement: "Community service not only benefits society but also enhances students'' personal growth and leadership skills." What is the main message?',
 '[{"id":"99999999-0000-0000-0000-000000001201","optionContent":"Volunteering offers mutual benefits for both society and the volunteers themselves.","displayOrder":1},{"id":"99999999-0000-0000-0000-000000001202","optionContent":"Only students gain advantages from community services.","displayOrder":2},{"id":"99999999-0000-0000-0000-000000001203","optionContent":"Leadership skills cannot be developed through voluntary projects.","displayOrder":3},{"id":"99999999-0000-0000-0000-000000001204","optionContent":"Community projects are only meant for adult workers.","displayOrder":4}]',
 '99999999-0000-0000-0000-000000001201', 'HARD', 12,
 'Both the society and students gain advantages, reflecting mutual benefit.',
 NOW(), NOW());


-- 3. SAMPLE ASSESSMENT ATTEMPT & RESULTS (CHO STUDENT AN)
INSERT INTO assessment_attempts (id, assessment_id, student_id, subject_id, assessment_type, started_at, submitted_at, score, total_questions, accuracy_percentage, is_passed, status, created_at, updated_at) VALUES
('aaaaaaaa-2000-0000-0000-000000000001',
 '77777777-0000-0000-0000-000000000001',
 '90ed5f83-cbcf-409a-8c18-1594380acbe4',
 '11111111-1111-1111-1111-111111111101',
 'PLACEMENT',
 NOW() - INTERVAL '2 days',
 NOW() - INTERVAL '2 days' + INTERVAL '16 minutes',
 8, 12, 67,
 true,
 'COMPLETED',
 NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days');

-- 4. SKILL ASSESSMENT RESULTS
INSERT INTO skill_assessment_results (id, attempt_id, skill_id, skill_name, total_questions, correct_count, accuracy_percentage, proficiency_level, created_at, updated_at) VALUES
('aaaaaaaa-3000-0000-0000-000000000001', 'aaaaaaaa-2000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222201', 'Unit 1: Present Simple & Present Continuous', 2, 2, 100, 'PROFICIENT', NOW(), NOW()),
('aaaaaaaa-3000-0000-0000-000000000002', 'aaaaaaaa-2000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222202', 'Unit 2: Will vs. Be Going To & Passive Voice', 2, 1, 50, 'DEVELOPING', NOW(), NOW()),
('aaaaaaaa-3000-0000-0000-000000000003', 'aaaaaaaa-2000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222203', 'Unit 3: Compound Sentences & Infinitives', 2, 0, 0, 'WEAK', NOW(), NOW()),
('aaaaaaaa-3000-0000-0000-000000000004', 'aaaaaaaa-2000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222204', 'Unit 4: Past Simple vs. Past Continuous', 2, 1, 50, 'DEVELOPING', NOW(), NOW()),
('aaaaaaaa-3000-0000-0000-000000000005', 'aaaaaaaa-2000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222205', 'Unit 1 & 2: Family Life & Green Living Collocations', 2, 2, 100, 'PROFICIENT', NOW(), NOW()),
('aaaaaaaa-3000-0000-0000-000000000006', 'aaaaaaaa-2000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222206', 'Unit 3 & 4: Music & Community Service Reading', 2, 2, 100, 'PROFICIENT', NOW(), NOW());
