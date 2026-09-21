-- ========================================================
-- SEED DATA FOR content_db
-- ========================================================

-- 1. SUBJECTS
INSERT INTO subject (id, code, name, description, icon, status, is_available, display_order, created_at, updated_at) VALUES
('11111111-1111-1111-1111-111111111101', 'ENGLISH', 'Tiếng Anh', 'Chương trình Tiếng Anh THPT phát triển 4 kỹ năng ngôn ngữ và trọng tâm ngữ pháp, từ vựng chuẩn cấu trúc đề thi tốt nghiệp & đánh giá năng lực.', 'Languages', 'ACTIVE', true, 1, NOW(), NOW()),
('13a9f6ca-1be6-4c15-b88a-920bf381a67e', 'MATH', 'Toán học', 'Đại số, Giải tích, Hình học không gian và các chuyên đề Toán tư duy ứng dụng bậc THPT.', 'Calculator', 'COMING_SOON', false, 2, NOW(), NOW()),
('6a6c9d82-d676-4f93-8e6f-ce3793fbb25a', 'LITERATURE', 'Ngữ văn', 'Tác phẩm văn học trung đại & hiện đại Việt Nam, kỹ năng đọc hiểu văn bản và viết bài nghị luận.', 'BookOpen', 'COMING_SOON', false, 3, NOW(), NOW()),
('16eb75f2-98a2-42a9-9fed-73761e84947d', 'PHYSICS', 'Vật lý', 'Cơ học, Nhiệt học, Điện từ học, Quang hình & Vật lý lượng tử hiện đại.', 'Atom', 'COMING_SOON', false, 4, NOW(), NOW());

-- 2. MODULES
INSERT INTO module (id, code, name, description, status, display_order, subject_id, created_at, updated_at) VALUES
('22222222-2222-2222-2222-222222222210', 'GRAMMAR', 'Ngữ pháp Tiếng Anh THPT', 'Toàn diện hệ thống ngữ pháp tiếng Anh trọng tâm từ cơ bản đến nâng cao cho kỳ thi THPT Quốc gia.', 'ACTIVE', 1, '11111111-1111-1111-1111-111111111101', NOW(), NOW()),
('22222222-2222-2222-2222-222222222220', 'VOCAB', 'Từ vựng & Kỹ năng Đọc hiểu', 'Kho từ vựng học thuật, collocations, phrasal verbs và kỹ năng tư duy đọc hiểu chuyên sâu.', 'ACTIVE', 2, '11111111-1111-1111-1111-111111111101', NOW(), NOW());

-- 3. TOPICS
INSERT INTO topic (id, code, name, description, status, display_order, module_id, created_at, updated_at) VALUES
('22222222-2222-2222-2222-222222222201', 'TENSES', 'Các thì trong tiếng Anh (Verb Tenses)', 'Hệ thống 12 thì cơ bản và nâng cao, quy tắc hòa hợp thời thì và dấu hiệu nhận biết.', 'ACTIVE', 1, '22222222-2222-2222-2222-222222222210', NOW(), NOW()),
('22222222-2222-2222-2222-222222222202', 'PASSIVE', 'Câu bị động (Passive Voice)', 'Cấu trúc câu bị động các thì, thể bị động đặc biệt, bị động kép và thể nhờ bảo.', 'ACTIVE', 2, '22222222-2222-2222-2222-222222222210', NOW(), NOW()),
('22222222-2222-2222-2222-222222222203', 'CONDITIONALS', 'Câu điều kiện (Conditionals & Wishes)', 'Câu điều kiện loại 0, 1, 2, 3, câu điều kiện hỗn hợp và cấu trúc đảo ngữ điều kiện.', 'ACTIVE', 3, '22222222-2222-2222-2222-222222222210', NOW(), NOW()),
('22222222-2222-2222-2222-222222222204', 'RELATIVES', 'Mệnh đề quan hệ (Relative Clauses)', 'Đại từ, trạng từ quan hệ, mệnh đề xác định/không xác định và rút gọn mệnh đề quan hệ.', 'ACTIVE', 4, '22222222-2222-2222-2222-222222222210', NOW(), NOW()),
('22222222-2222-2222-2222-222222222205', 'COLLOCATIONS', 'Cụm từ cố định & Cụm động từ (Collocations & Phrasal Verbs)', 'Các cụm động từ và kết hợp từ thường gặp trong các bài thi THPT Quốc gia.', 'ACTIVE', 1, '22222222-2222-2222-2222-222222222220', NOW(), NOW()),
('22222222-2222-2222-2222-222222222206', 'READING', 'Đọc hiểu & Kỹ năng làm bài (Reading Comprehension)', 'Kỹ năng Skimming, Scanning, tìm ý chính (Main Idea), suy luận từ vựng và đại từ thay thế.', 'ACTIVE', 2, '22222222-2222-2222-2222-222222222220', NOW(), NOW());

-- 4. SKILLS
INSERT INTO skill (id, code, name, description, priority, status, display_order, subject_id, created_at, updated_at) VALUES
('22222222-2222-2222-2222-222222222201', 'SKILL_TENSES', 'Thì động từ (Verb Tenses)', 'Nhận biết và vận dụng chính xác các thì cơ bản và nâng cao trong câu.', 1, 'ACTIVE', 1, '11111111-1111-1111-1111-111111111101', NOW(), NOW()),
('22222222-2222-2222-2222-222222222202', 'SKILL_PASSIVE', 'Câu bị động (Passive Voice)', 'Chuyển đổi linh hoạt giữa chủ động và bị động ở các thì và cấu trúc đặc biệt.', 2, 'ACTIVE', 2, '11111111-1111-1111-1111-111111111101', NOW(), NOW()),
('22222222-2222-2222-2222-222222222203', 'SKILL_CONDITIONALS', 'Câu điều kiện (Conditionals)', 'Sử dụng thành thạo câu điều kiện loại 1, 2, 3 và đảo ngữ.', 3, 'ACTIVE', 3, '11111111-1111-1111-1111-111111111101', NOW(), NOW()),
('22222222-2222-2222-2222-222222222204', 'SKILL_RELATIVES', 'Mệnh đề quan hệ (Relative Clauses)', 'Nắm vững cách dùng Who/Whom/Which/That và rút gọn mệnh đề quan hệ.', 4, 'ACTIVE', 4, '11111111-1111-1111-1111-111111111101', NOW(), NOW()),
('22222222-2222-2222-2222-222222222205', 'SKILL_VOCAB', 'Từ vựng & Cụm từ (Vocabulary & Collocations)', 'Mở rộng vốn từ học thuật, nhận diện cụm động từ và kết hợp từ tự nhiên.', 5, 'ACTIVE', 5, '11111111-1111-1111-1111-111111111101', NOW(), NOW()),
('22222222-2222-2222-2222-222222222206', 'SKILL_READING', 'Đọc hiểu tiếng Anh (Reading Comprehension)', 'Tối ưu tốc độ đọc, trả lời chính xác câu hỏi định vị và câu hỏi suy luận.', 6, 'ACTIVE', 6, '11111111-1111-1111-1111-111111111101', NOW(), NOW());

-- 5. LESSONS
INSERT INTO lesson (id, title, content, theory_summary, status, display_order, skill_id, topic_id, is_remedial, created_at, updated_at) VALUES
('55555555-0000-0000-0000-000000000001', 'Hiện tại đơn vs Hiện tại tiếp diễn (Present Simple vs Continuous)', 
'### 1. Hiện tại đơn (Present Simple)
- **Công thức:** S + V(s/es) | S + do/does not + V_inf
- **Cách dùng:** Diễn tả thói quen, chân lý khoa học, quy luật tự nhiên, lịch trình cố định.
- **Dấu hiệu:** always, usually, often, sometimes, every day/week, on Mondays.

### 2. Hiện tại tiếp diễn (Present Continuous)
- **Công thức:** S + am/is/are + V-ing
- **Cách dùng:** Hành động đang diễn ra tại thời điểm nói, xu hướng tạm thời, kế hoạch tương lai chắc chắn.
- **Dấu hiệu:** now, at the moment, currently, Look!, Listen!',
'Hiện tại đơn dùng cho thói quen, chân lý tự nhiên. Hiện tại tiếp diễn dùng cho hành động đang diễn ra ngay lúc nói hoặc kế hoạch gần.', 'PUBLISHED', 1, '22222222-2222-2222-2222-222222222201', '22222222-2222-2222-2222-222222222201', false, NOW(), NOW()),

('55555555-0000-0000-0000-000000000002', 'Quá khứ đơn vs Quá khứ tiếp diễn với When & While',
'### 1. Quá khứ đơn (Past Simple)
- **Công thức:** S + V2/ed | S + did not + V_inf
- **Cách dùng:** Hành động đã xảy ra và chấm dứt hoàn toàn trong quá khứ có thời gian xác định.

### 2. Quá khứ tiếp diễn (Past Continuous)
- **Công thức:** S + was/were + V-ing
- **Cách dùng:** Hành động đang diễn ra tại một thời điểm xác định trong quá khứ.

### 3. Kết hợp When và While
- **When + Past Simple, Past Continuous:** Hành động ngắn xen vào hành động dài đang xảy ra (When I arrived, they were having dinner).
- **While + Past Continuous, Past Simple:** Trong khi hành động dài đang xảy ra thì có việc xen vào.',
'When đi với mệnh đề hành động ngắn xen vào; While đi với mệnh đề hành động dài đang tiếp diễn.', 'PUBLISHED', 2, '22222222-2222-2222-2222-222222222201', '22222222-2222-2222-2222-222222222201', false, NOW(), NOW()),

('55555555-0000-0000-0000-000000000003', 'Hiện tại hoàn thành & Quá khứ hoàn thành (Perfect Tenses)',
'### 1. Hiện tại hoàn thành (Present Perfect)
- **Công thức:** S + have/has + V3/ed
- **Dấu hiệu:** since, for, already, yet, just, ever, never, so far, recently.

### 2. Quá khứ hoàn thành (Past Perfect)
- **Công thức:** S + had + V3/ed
- **Cách dùng:** Diễn tả hành động xảy ra và hoàn tất TRƯỚC một mốc thời gian hoặc hành động khác trong quá khứ.',
'Hiện tại hoàn thành nối quá khứ với hiện tại. Quá khứ hoàn thành xảy ra trước một hành động quá khứ khác.', 'PUBLISHED', 3, '22222222-2222-2222-2222-222222222201', '22222222-2222-2222-2222-222222222201', false, NOW(), NOW()),

('55555555-0000-0000-0000-000000000004', 'Cấu trúc câu bị động các thì (Passive Voice Mastery)',
'### Quy tắc chuyển đổi: S + V + O -> S(O) + be + V3/ed + by O(S)
- **Hiện tại đơn:** am/is/are + V3/ed
- **Quá khứ đơn:** was/were + V3/ed
- **Hiện tại hoàn thành:** have/has been + V3/ed
- **Động từ khuyết thiếu (Modals):** modal + be + V3/ed',
'Động từ to be được chia theo thì của câu gốc, động từ chính luôn ở dạng Phân từ 2 (V3/ed).', 'PUBLISHED', 1, '22222222-2222-2222-2222-222222222202', '22222222-2222-2222-2222-222222222202', false, NOW(), NOW()),

('55555555-0000-0000-0000-000000000005', 'Câu điều kiện loại 1, 2, 3 và Đảo ngữ (Conditionals & Inversion)',
'### 1. Loại 1 (Có thật ở hiện tại/tương lai): If + S + V(s/es), S + will/can + V_inf
- Đảo ngữ: Should + S + V_inf, S + will + V_inf

### 2. Loại 2 (Không có thật ở hiện tại): If + S + V2/ed (were), S + would/could + V_inf
- Đảo ngữ: Were + S + to V_inf..., S + would + V_inf

### 3. Loại 3 (Không có thật ở quá khứ): If + S + had + V3/ed, S + would have + V3/ed
- Đảo ngữ: Had + S + V3/ed, S + would have + V3/ed',
'Loại 1: có thể xảy ra. Loại 2: giả định hiện tại (were). Loại 3: tiếc nuối quá khứ (had V3, would have V3).', 'PUBLISHED', 1, '22222222-2222-2222-2222-222222222203', '22222222-2222-2222-2222-222222222203', false, NOW(), NOW()),

('55555555-0000-0000-0000-000000000006', 'Cụm động từ thông dụng trong đề thi THPT (Essential Phrasal Verbs)',
'### Danh sách cụm động từ cốt lõi:
- **Carry out:** tiến hành, thực hiện (nghiên cứu, kế hoạch)
- **Turn down:** từ chối (lời mời, đề nghị)
- **Put off:** trì hoãn (= postpone/delay)
- **Give up:** từ bỏ (thói quen, công việc)
- **Look up to:** tôn trọng, ngưỡng mộ ai đó
- **Make up for:** bù đắp cho',
'Học phrasal verb theo ngữ cảnh câu văn và từ đồng nghĩa tương đương.', 'PUBLISHED', 1, '22222222-2222-2222-2222-222222222205', '22222222-2222-2222-2222-222222222205', false, NOW(), NOW());

-- 6. EXAMPLES
INSERT INTO example (id, title, content, explanation, translation, display_order, lesson_id, created_at) VALUES
('66666666-0000-0000-0000-000000000001', 'Quy luật tự nhiên', 'Water boils at 100 degrees Celsius.', 'Chân lý khoa học hiển nhiên, luôn chia ở thì Hiện tại đơn.', 'Nước sôi ở 100 độ C.', 1, '55555555-0000-0000-0000-000000000001', NOW()),
('66666666-0000-0000-0000-000000000002', 'Hành động đang xảy ra', 'Look! The students are playing football in the yard.', 'Dấu hiệu "Look!" chứng tỏ hành động đang diễn ra ngay tại thời điểm nói.', 'Nhìn kìa! Các học sinh đang chơi bóng đá trong sân trường.', 2, '55555555-0000-0000-0000-000000000001', NOW()),
('66666666-0000-0000-0000-000000000003', 'Hành động xen vào', 'While Mary was doing her homework, the electricity went out.', 'Was doing (hành động đang diễn ra trong quá khứ), went out (sự việc ngắn cắt ngang).', 'Trong lúc Mary đang làm bài tập về nhà thì bị mất điện.', 1, '55555555-0000-0000-0000-000000000002', NOW()),
('66666666-0000-0000-0000-000000000004', 'Câu bị động Hiện tại hoàn thành', 'A new hospital has been built in our town recently.', 'Dấu hiệu recently và chủ ngữ tân ngữ chỉ vật "A new hospital" -> has been built.', 'Một bệnh viện mới đã được xây dựng tại thị trấn của chúng tôi gần đây.', 1, '55555555-0000-0000-0000-000000000004', NOW()),
('66666666-0000-0000-0000-000000000005', 'Câu điều kiện loại 2', 'If I had enough money right now, I would buy that laptop.', 'Giả định trái ngược với thực tế ở hiện tại: If + past simple, would + V.', 'Nếu tôi có đủ tiền ngay bây giờ, tôi sẽ mua chiếc laptop đó.', 1, '55555555-0000-0000-0000-000000000005', NOW());

-- 7. MINI QUIZZES
INSERT INTO mini_quiz (id, title, description, status, questions_json, lesson_id, created_at) VALUES
('77777777-1000-0000-0000-000000000001', 'Quick Check: Present Tenses', 'Kiểm tra nhanh kiến thức thì Hiện tại đơn và Hiện tại tiếp diễn', 'ACTIVE', 
'[{"id":"q1","question":"The Earth _______ around the Sun.","options":["moves","is moving","moved","has moved"],"correctIndex":0,"explanation":"Chân lý tự nhiên chia thì hiện tại đơn."},{"id":"q2","question":"Be quiet! The professor _______ the lecture.","options":["delivers","is delivering","delivered","has delivered"],"correctIndex":1,"explanation":"Be quiet! là tín hiệu hành động đang tiếp diễn."}]',
'55555555-0000-0000-0000-000000000001', NOW()),

('77777777-1000-0000-0000-000000000002', 'Quick Check: Passive Voice', 'Kiểm tra nhanh kỹ năng biến đổi câu bị động', 'ACTIVE',
'[{"id":"q1","question":"This bridge _______ in 1995.","options":["built","was built","is built","has been built"],"correctIndex":1,"explanation":"Mốc thời gian in 1995 trong quá khứ -> was built."}]',
'55555555-0000-0000-0000-000000000004', NOW());
