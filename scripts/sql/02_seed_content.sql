-- ========================================================
-- SEED DATA FOR content_db (Chuẩn GDPT 2018 - SGK Tiếng Anh 10)
-- ========================================================

-- Ensure schema has required columns
ALTER TABLE subject ADD COLUMN IF NOT EXISTS grade INTEGER;
ALTER TABLE subject ADD COLUMN IF NOT EXISTS is_available BOOLEAN DEFAULT true;

-- 1. SUBJECTS (Phân cấp rõ ràng từng khối 10, 11, 12 - Không có môn nào chung cả 3 khối)
INSERT INTO subject (id, code, name, description, icon, grade, status, is_available, display_order, created_at, updated_at) VALUES
-- Khối 10
('11111111-1111-1111-1111-111111111101', 'ENGLISH', 'Tiếng Anh 10', 'Chương trình Tiếng Anh 10 GDPT bám sát SGK Global Success & Friends Global: Phát triển toàn diện ngữ pháp cốt lõi, từ vựng theo chủ điểm và kỹ năng đọc hiểu thích ứng.', 'Languages', 10, 'ACTIVE', true, 1, NOW(), NOW()),
('13a9f6ca-1be6-4c15-b88a-920bf381a610', 'MATH_10', 'Toán học 10', 'Chương trình Toán học lớp 10: Mệnh đề, tập hợp, bất phương trình, hàm số bậc hai và hình học vectơ theo SGK mới.', 'Calculator', 10, 'COMING_SOON', false, 2, NOW(), NOW()),
('6a6c9d82-d676-4f93-8e6f-ce3793fbb210', 'LITERATURE_10', 'Ngữ văn 10', 'Chương trình Ngữ văn lớp 10: Thần thoại, sử thi, thơ trữ tình, kỹ năng đọc hiểu văn bản nghị luận & thông tin.', 'BookOpen', 10, 'COMING_SOON', false, 3, NOW(), NOW()),
('16eb75f2-98a2-42a9-9fed-73761e849410', 'PHYSICS_10', 'Vật lý 10', 'Chương trình Vật lý lớp 10: Động học, các định luật Newton, năng lượng, công và động lượng.', 'Atom', 10, 'COMING_SOON', false, 4, NOW(), NOW()),
('26eb75f2-98a2-42a9-9fed-73761e849410', 'CHEMISTRY_10', 'Hóa học 10', 'Chương trình Hóa học lớp 10: Cấu tạo nguyên tử, bảng tuần hoàn, liên kết hóa học và phản ứng oxi hóa - khử.', 'FlaskConical', 10, 'COMING_SOON', false, 5, NOW(), NOW()),
('36eb75f2-98a2-42a9-9fed-73761e849410', 'BIOLOGY_10', 'Sinh học 10', 'Chương trình Sinh học lớp 10: Sinh học tế bào, phân chia tế bào, trao đổi chất và vi sinh vật.', 'Dna', 10, 'COMING_SOON', false, 6, NOW(), NOW()),
('46eb75f2-98a2-42a9-9fed-73761e849410', 'HISTORY_10', 'Lịch sử 10', 'Chương trình Lịch sử lớp 10: Khái niệm lịch sử, các nền văn minh cổ đại thế giới và văn minh Đông Nam Á.', 'Landmark', 10, 'COMING_SOON', false, 7, NOW(), NOW()),
('56eb75f2-98a2-42a9-9fed-73761e849410', 'GEOGRAPHY_10', 'Địa lý 10', 'Chương trình Địa lý lớp 10: Bản đồ, thạch quyển, khí quyển, thủy quyển và địa lý dân cư thế giới.', 'Globe', 10, 'COMING_SOON', false, 8, NOW(), NOW()),
('66eb75f2-98a2-42a9-9fed-73761e849410', 'INFORMATICS_10', 'Tin học 10', 'Chương trình Tin học lớp 10: Khoa học máy tính, lập trình Python căn bản và xử lý dữ liệu số.', 'Laptop', 10, 'COMING_SOON', false, 9, NOW(), NOW()),

-- Khối 11
('11111111-1111-1111-1111-111111111111', 'ENGLISH_11', 'Tiếng Anh 11', 'Chương trình Tiếng Anh 11 GDPT: Luyện tập chuyên sâu Modal verbs, Stative verbs, Gerunds & Infinitives và các chủ đề Healthy Living, Generation Gap.', 'Languages', 11, 'COMING_SOON', false, 10, NOW(), NOW()),
('13a9f6ca-1be6-4c15-b88a-920bf381a611', 'MATH_11', 'Toán học 11', 'Chương trình Toán học lớp 11: Lượng giác, dãy số, cấp số cộng, giới hạn hàm số, hình học không gian và xác suất thống kê.', 'Calculator', 11, 'COMING_SOON', false, 11, NOW(), NOW()),
('6a6c9d82-d676-4f93-8e6f-ce3793fbb211', 'LITERATURE_11', 'Ngữ văn 11', 'Chương trình Ngữ văn lớp 11: Văn học hiện thực, thơ mới, văn bản nghị luận xã hội và văn hóa truyền thống.', 'BookOpen', 11, 'COMING_SOON', false, 12, NOW(), NOW()),
('16eb75f2-98a2-42a9-9fed-73761e849411', 'PHYSICS_11', 'Vật lý 11', 'Chương trình Vật lý lớp 11: Dao động cơ, sóng cơ, điện trường và dòng điện không đổi.', 'Atom', 11, 'COMING_SOON', false, 13, NOW(), NOW()),
('26eb75f2-98a2-42a9-9fed-73761e849411', 'CHEMISTRY_11', 'Hóa học 11', 'Chương trình Hóa học lớp 11: Cân bằng hóa học, dung dịch điện li, Nitrogen - Sulfur và hóa học hữu cơ.', 'FlaskConical', 11, 'COMING_SOON', false, 14, NOW(), NOW()),

-- Khối 12
('11111111-1111-1111-1111-111111111112', 'ENGLISH_12', 'Tiếng Anh 12', 'Chương trình Tiếng Anh 12 & Tổng ôn thi Tốt nghiệp THPT: Mệnh đề trạng ngữ, câu so sánh, trích dẫn gián tiếp và từ vựng học thuật nâng cao.', 'Languages', 12, 'COMING_SOON', false, 15, NOW(), NOW()),
('13a9f6ca-1be6-4c15-b88a-920bf381a612', 'MATH_12', 'Toán học 12', 'Chương trình Toán học lớp 12: Ứng dụng đạo hàm khảo sát hàm số, nguyên hàm, tích phân và tọa độ Oxyz.', 'Calculator', 12, 'COMING_SOON', false, 16, NOW(), NOW()),
('6a6c9d82-d676-4f93-8e6f-ce3793fbb212', 'LITERATURE_12', 'Ngữ văn 12', 'Chương trình Ngữ văn lớp 12: Tác phẩm kinh điển Việt Nam thế kỷ XX, phân tích tác phẩm và nghị luận tác phẩm.', 'BookOpen', 12, 'COMING_SOON', false, 17, NOW(), NOW()),
('16eb75f2-98a2-42a9-9fed-73761e849412', 'PHYSICS_12', 'Vật lý 12', 'Chương trình Vật lý lớp 12: Dòng điện xoay chiều, dao động sóng điện từ, sóng ánh sáng và vật lý hạt nhân.', 'Atom', 12, 'COMING_SOON', false, 18, NOW(), NOW()),
('26eb75f2-98a2-42a9-9fed-73761e849412', 'CHEMISTRY_12', 'Hóa học 12', 'Chương trình Hóa học lớp 12: Este - Lipit, Cacbohiđrat, Amin - Amino axit - Peptit, kim loại và hợp kim.', 'FlaskConical', 12, 'COMING_SOON', false, 19, NOW(), NOW());


-- 2. MODULES CỦA TIẾNG ANH 10 (SGK GDPT 2018)
INSERT INTO module (id, code, name, description, status, display_order, subject_id, created_at, updated_at) VALUES
('22222222-2222-2222-2222-222222222210', 'GRAMMAR_G10', 'Chuyên đề Ngữ pháp Trọng tâm SGK Tiếng Anh 10', 'Hệ thống các cấu trúc ngữ pháp trọng tâm theo từng Unit của chương trình Tiếng Anh 10 mới (Global Success & Friends Global).', 'ACTIVE', 1, '11111111-1111-1111-1111-111111111101', NOW(), NOW()),
('22222222-2222-2222-2222-222222222220', 'VOCAB_G10', 'Chuyên đề Từ vựng & Đọc hiểu theo Chủ điểm SGK Tiếng Anh 10', 'Kho từ vựng, collocations và các bài đọc hiểu chuyên sâu theo các chủ đề bám sát SGK Tiếng Anh 10: Family Life, Environment, Music, Community.', 'ACTIVE', 2, '11111111-1111-1111-1111-111111111101', NOW(), NOW());


-- 3. TOPICS CỦA TIẾNG ANH 10 (Bám sát Unit 1 -> Unit 4 SGK Tiếng Anh 10)
INSERT INTO topic (id, code, name, description, status, display_order, module_id, created_at, updated_at) VALUES
-- Module 1: Grammar
('22222222-2222-2222-2222-222222222201', 'UNIT1_GRAMMAR', 'Unit 1: Present Simple vs. Present Continuous (Hiện tại đơn & Hiện tại tiếp diễn)', 'Phân biệt cách sử dụng thì Hiện tại đơn và Hiện tại tiếp diễn, động từ trạng thái (Stative Verbs) trong chủ đề Family Life.', 'ACTIVE', 1, '22222222-2222-2222-2222-222222222210', NOW(), NOW()),
('22222222-2222-2222-2222-222222222202', 'UNIT2_GRAMMAR', 'Unit 2: Future with Will & Be going to, Passive Voice (Tương lai & Câu bị động)', 'Phân biệt ý định tương lai Will vs. Be going to, và cấu trúc câu bị động trong chủ đề Humans and the Environment.', 'ACTIVE', 2, '22222222-2222-2222-2222-222222222210', NOW(), NOW()),
('22222222-2222-2222-2222-222222222203', 'UNIT3_GRAMMAR', 'Unit 3: Compound Sentences & Infinitives (Câu ghép & Động từ nguyên mẫu)', 'Câu ghép với các liên từ kết hợp (FANBOYS: and, but, or, so) và quy tắc dùng To-infinitives / Bare Infinitives trong chủ đề Music.', 'ACTIVE', 3, '22222222-2222-2222-2222-222222222210', NOW(), NOW()),
('22222222-2222-2222-2222-222222222204', 'UNIT4_GRAMMAR', 'Unit 4: Past Simple vs. Past Continuous with When/While (Quá khứ đơn & Tiếp diễn)', 'Cách phối hợp thì Quá khứ đơn và Quá khứ tiếp diễn với liên từ When và While trong chủ đề For a Better Community.', 'ACTIVE', 4, '22222222-2222-2222-2222-222222222210', NOW(), NOW()),

-- Module 2: Vocabulary & Reading
('22222222-2222-2222-2222-222222222205', 'THEME_UNIT1_2', 'Chủ điểm Unit 1 & 2: Family Life & Green Living (Gia đình & Lối sống xanh)', 'Từ vựng, cụm từ kết hợp (Collocations) về việc nhà, trách nhiệm gia đình, bảo vệ môi trường và giảm phát thải carbon.', 'ACTIVE', 1, '22222222-2222-2222-2222-222222222220', NOW(), NOW()),
('22222222-2222-2222-2222-222222222206', 'THEME_UNIT3_4', 'Chủ điểm Unit 3 & 4: Music & Community Service (Âm nhạc & Hoạt động cộng đồng)', 'Từ vựng nhạc cụ, biểu diễn nghệ thuật, các dự án tình nguyện và kỹ năng đọc hiểu văn bản định vị thông tin chi tiết.', 'ACTIVE', 2, '22222222-2222-2222-2222-222222222220', NOW(), NOW());


-- 4. SKILLS
INSERT INTO skill (id, code, name, description, priority, status, display_order, subject_id, created_at, updated_at) VALUES
('22222222-2222-2222-2222-222222222201', 'SKILL_PRESENT_TENSES', 'Unit 1: Present Simple & Present Continuous', 'Sử dụng thành thạo thì Hiện tại đơn và Hiện tại tiếp diễn; nhận biết Stative Verbs.', 1, 'ACTIVE', 1, '11111111-1111-1111-1111-111111111101', NOW(), NOW()),
('22222222-2222-2222-2222-222222222202', 'SKILL_FUTURE_PASSIVE', 'Unit 2: Will vs. Be Going To & Passive Voice', 'Phân biệt ý định tương lai và biến đổi câu chủ động sang bị động.', 2, 'ACTIVE', 2, '11111111-1111-1111-1111-111111111101', NOW(), NOW()),
('22222222-2222-2222-2222-222222222203', 'SKILL_COMPOUND_INFINITIVES', 'Unit 3: Compound Sentences & Infinitives', 'Nối câu bằng liên từ kết hợp và sử dụng chính xác To-infinitive / Bare infinitive.', 3, 'ACTIVE', 3, '11111111-1111-1111-1111-111111111101', NOW(), NOW()),
('22222222-2222-2222-2222-222222222204', 'SKILL_PAST_TENSES', 'Unit 4: Past Simple vs. Past Continuous', 'Phối hợp các thì quá khứ với liên từ When và While trong câu phức.', 4, 'ACTIVE', 4, '11111111-1111-1111-1111-111111111101', NOW(), NOW()),
('22222222-2222-2222-2222-222222222205', 'SKILL_VOCAB_FAMILY_ENV', 'Unit 1 & 2: Family Life & Green Living Collocations', 'Nắm vững collocations và từ vựng chủ đề gia đình, bảo vệ hệ sinh thái.', 5, 'ACTIVE', 5, '11111111-1111-1111-1111-111111111101', NOW(), NOW()),
('22222222-2222-2222-2222-222222222206', 'SKILL_VOCAB_MUSIC_COMMUNITY', 'Unit 3 & 4: Music & Community Service Reading', 'Đọc hiểu chuyên sâu các bài báo, đoạn văn về nghệ thuật và hoạt động thiện nguyện.', 6, 'ACTIVE', 6, '11111111-1111-1111-1111-111111111101', NOW(), NOW());


-- 5. LESSONS (Bám sát chương trình SGK Tiếng Anh 10)
INSERT INTO lesson (id, title, content, theory_summary, status, display_order, skill_id, topic_id, is_remedial, created_at, updated_at) VALUES

-- Unit 1 Lesson 1
('55555555-0000-0000-0000-000000000001', 
'Unit 1 Grammar: Present Simple vs. Present Continuous', 
'### 1. Present Simple (Thì Hiện tại đơn)
- **Form:**
  - Positive: $S + V(s/es)$
  - Negative: $S + do/does + not + V_{inf}$
  - Question: $Do/Does + S + V_{inf}?$
- **Usage:**
  - Habits, routines, and repeated actions: *I wash the dishes after dinner every day.*
  - General truths and facts: *Water boils at 100 degrees Celsius.*
  - Timetables and schedules: *The English class starts at 7:30 a.m.*
- **Time expressions:** *always, usually, often, sometimes, rarely, never, every day/week/month, on Sundays.*

---

### 2. Present Continuous (Thì Hiện tại tiếp diễn)
- **Form:**
  - Positive: $S + am/is/are + V\text{-}ing$
  - Negative: $S + am/is/are + not + V\text{-}ing$
  - Question: $Am/Is/Are + S + V\text{-}ing?$
- **Usage:**
  - Actions happening right now: *Look! My father is cooking in the kitchen.*
  - Temporary situations: *We are studying online this week.*
- **Time expressions:** *now, right now, at the moment, currently, Look!, Listen!, Be quiet!*', 
'Present Simple expresses habits and permanent facts. Present Continuous expresses actions in progress at the time of speaking or temporary situations.', 
'PUBLISHED', 1, '22222222-2222-2222-2222-222222222201', '22222222-2222-2222-2222-222222222201', false, NOW(), NOW()),

-- Unit 1 Lesson 2: Stative Verbs
('55555555-0000-0000-0000-000000000002', 
'Unit 1 Grammar: Stative Verbs in Present Tenses', 
'### 1. What are Stative Verbs?
Stative verbs describe states, feelings, senses, possession, or mental conditions rather than actions. They are **not normally used in continuous tenses** ($V\text{-}ing$).

### 2. Common Groups of Stative Verbs
- **Feelings & Emotions:** *love, hate, like, prefer, want, need.*
- **Thoughts & Opinions:** *believe, know, think (opinion), remember, understand.*
- **Senses:** *see, hear, smell, taste, feel.*
- **Possession:** *have, own, belong to, possess.*

### 3. Verbs with both Stative and Dynamic Meanings
- **Think:**
  - Stative: *I think you are right.* (My opinion)
  - Dynamic: *I am thinking about my upcoming test.* (Mental process happening now)
- **Have:**
  - Stative: *She has two brothers.* (Possession)
  - Dynamic: *She is having breakfast right now.* (Eating)', 
'Stative verbs describe states and are rarely used in continuous tenses. Some verbs like think, have, taste have different meanings in simple vs. continuous forms.', 
'PUBLISHED', 2, '22222222-2222-2222-2222-222222222201', '22222222-2222-2222-2222-222222222201', false, NOW(), NOW()),

-- Unit 1 Remedial
('55555555-0000-0000-0000-000000000011', 
'[Remedial Lesson] Mastering Present Tenses & Stative Verbs', 
'### Key Reminders to Avoid Mistakes:
1. When a sentence contains frequency adverbs like *usually, rarely, every weekend*, choose **Present Simple**.
2. When you see an exclamation signal like *Look!, Listen!, Be quiet!*, choose **Present Continuous**.
3. With stative verbs of preference (*like, want, need*), never write *is wanting* or *is liking*. Always use *wants* or *likes*.', 
'Focus on frequency adverbs for Present Simple and sensory signals for Present Continuous. Stative verbs never take continuous forms.', 
'PUBLISHED', 3, '22222222-2222-2222-2222-222222222201', '22222222-2222-2222-2222-222222222201', true, NOW(), NOW()),

-- Unit 2 Lesson 1: Future Will vs Be Going To
('55555555-0000-0000-0000-000000000003', 
'Unit 2 Grammar: Future with Will vs. Be Going To', 
'### 1. Will + Bare Infinitive
- **Spontaneous decisions made at the moment of speaking:**
  - *It is hot here. I will open the window.*
- **Promises, offers, and requests:**
  - *I will help you sort out the recycled trash.*
- **Predictions without present evidence (based on opinion):**
  - *I think our team will win the green award.*

---

### 2. Be Going To + Bare Infinitive
- **Prior plans and intentions formed before the moment of speaking:**
  - *We are going to plant 50 trees in the community garden this Saturday.*
- **Predictions based on clear present evidence:**
  - *Look at those black clouds! It is going to rain.*', 
'Use Will for spontaneous decisions and promises. Use Be going to for pre-planned intentions and predictions based on present evidence.', 
'PUBLISHED', 1, '22222222-2222-2222-2222-222222222202', '22222222-2222-2222-2222-222222222202', false, NOW(), NOW()),

-- Unit 2 Lesson 2: Passive Voice
('55555555-0000-0000-0000-000000000004', 
'Unit 2 Grammar: Passive Voice in Environmental Contexts', 
'### 1. Passive Voice Formula
- **Active:** $S + V + O$
- **Passive:** $S(O) + be + V_{3/ed} + (by + Agent)$

### 2. Tenses in Passive Voice:
- **Present Simple:** $am/is/are + V_{3/ed}$
  - *Millions of plastic bottles are thrown away every day.*
- **Past Simple:** $was/were + V_{3/ed}$
  - *The eco-project was launched last month.*
- **Modal Verbs:** $modal + be + V_{3/ed}$
  - *Household waste must be sorted before disposal.*

### 3. Agent Omission (Bỏ "by Agent"):
Omit *by him, by them, by someone, by people* when the agent is unknown, obvious, or unimportant.', 
'Passive voice focuses on the action and receiver rather than the doer: S + be + V3/ed.', 
'PUBLISHED', 2, '22222222-2222-2222-2222-222222222202', '22222222-2222-2222-2222-222222222202', false, NOW(), NOW()),

-- Unit 2 Remedial
('55555555-0000-0000-0000-000000000012', 
'[Remedial Lesson] Quick Passive Transformations & Modal Passives', 
'### Step-by-Step Rule:
1. Identify the Object of the active sentence and move it to Subject position.
2. Choose the correct form of *be* matching the tense and singular/plural subject.
3. Turn the main verb into past participle ($V_{3/ed}$).
4. Add *by + agent* only when the specific doer is essential.', 
'Master the 3-step passive conversion: Object becomes Subject, Be matches tense and number, Main verb becomes V3/ed.', 
'PUBLISHED', 3, '22222222-2222-2222-2222-222222222202', '22222222-2222-2222-2222-222222222202', true, NOW(), NOW()),

-- Unit 3 Lesson 1: Compound Sentences & Infinitives
('55555555-0000-0000-0000-000000000005', 
'Unit 3 Grammar: Compound Sentences & Verb Patterns (To-inf / Bare inf)', 
'### 1. Compound Sentences with Coordinating Conjunctions
A compound sentence joins two independent clauses using a coordinating conjunction (FANBOYS):
- **And (addition):** *She plays the piano, and her brother plays the violin.*
- **But (contrast):** *He wanted to buy the concert ticket, but they were sold out.*
- **Or (alternative):** *We can listen to classical music, or we can attend the pop show.*
- **So (result):** *The performance was outstanding, so the audience gave a standing ovation.*
*Rule: Put a comma before the conjunction.*

---

### 2. To-infinitives vs. Bare Infinitives
- **Followed by To-infinitive ($to + V$):**
  - *decide, want, hope, plan, promise, agree, refuse, manage, offer.*
  - *He decided to take guitar lessons.*
- **Followed by Bare Infinitive ($V$ without to):**
  - Causative verbs: *make, let* ($make/let + O + V$).
  - *The energetic rhythm made the audience dance.*
  - Modal verbs: *can, could, should, must, will.*', 
'Use and, but, or, so to combine independent clauses. Distinguish verbs taking to-infinitives (hope, plan, decide) from verbs taking bare infinitives (make, let, modals).', 
'PUBLISHED', 1, '22222222-2222-2222-2222-222222222203', '22222222-2222-2222-2222-222222222203', false, NOW(), NOW()),

-- Unit 4 Lesson 1: Past Simple vs Continuous with When/While
('55555555-0000-0000-0000-000000000006', 
'Unit 4 Grammar: Past Simple vs. Past Continuous with When & While', 
'### 1. Combining Past Actions: Interrupted Actions
- One action was in progress (longer action: **Past Continuous**) when another action occurred and interrupted it (shorter action: **Past Simple**).
- **Structures:**
  - $When + Past\ Simple,\ Past\ Continuous$
    - *When the bell rang, the volunteers were packing charity food.*
  - $While + Past\ Continuous,\ Past\ Simple$
    - *While we were cleaning up the schoolyard, it began to drizzle.*

---

### 2. Parallel Actions happening at the same time:
- $While + Past\ Continuous,\ Past\ Continuous$
  - *While Nam was teaching basic English to orphans, Mai was preparing lunch.*', 
'Past Continuous describes the longer background action (was/were V-ing). Past Simple describes the interrupting event (V2/ed).', 
'PUBLISHED', 1, '22222222-2222-2222-2222-222222222204', '22222222-2222-2222-2222-222222222204', false, NOW(), NOW()),

-- Unit 1 & 2 Theme Vocabulary
('55555555-0000-0000-0000-000000000007', 
'Unit 1 & 2 Vocabulary: Family Life & Green Living Collocations', 
'### 1. Family Life Essential Collocations:
- **share household chores:** chia sẻ việc nhà
- **do the heavy lifting:** làm công việc nặng nhọc
- **breadwinner:** người trụ cột gia đình (kiếm tiền chính)
- **homemaker:** người nội trợ

### 2. Humans and the Environment Collocations:
- **reduce one''s carbon footprint:** cắt giảm dấu chân carbon
- **adopt a green lifestyle:** theo đuổi lối sống thân thiện môi trường
- **eco-friendly products:** sản phẩm thân thiện sinh thái
- **renewable energy:** năng lượng tái tạo', 
'Master high-frequency collocations for Grade 10 Unit 1 & 2 topics on family cooperation and ecological sustainability.', 
'PUBLISHED', 1, '22222222-2222-2222-2222-222222222205', '22222222-2222-2222-2222-222222222205', false, NOW(), NOW()),

-- Unit 3 & 4 Theme Vocabulary & Reading
('55555555-0000-0000-0000-000000000008', 
'Unit 3 & 4 Vocabulary & Reading: Music & Community Engagement', 
'### 1. Music & Art Performance Collocations:
- **talented artist:** nghệ sĩ tài năng
- **live performance / concert:** buổi biểu diễn trực tiếp
- **give a standing ovation:** đứng dậy vỗ tay tán thưởng

### 2. Community Service Collocations:
- **raise funds for charity:** gây quỹ từ thiện
- **participate in volunteer work:** tham gia hoạt động tình nguyện
- **support disadvantaged children:** hỗ trợ trẻ em có hoàn cảnh khó khăn

### 3. Reading Strategy:
- **Skimming:** Read the first and last sentences of each paragraph to identify the main theme.
- **Scanning:** Search for specific numbers, dates, or keywords to answer detail questions.', 
'Core vocabulary for Music and Community volunteering with scanning/skimming reading comprehension strategies.', 
'PUBLISHED', 1, '22222222-2222-2222-2222-222222222206', '22222222-2222-2222-2222-222222222206', false, NOW(), NOW());


-- 6. EXAMPLES (Bám sát SGK Tiếng Anh 10)
INSERT INTO example (id, title, content, explanation, translation, display_order, lesson_id, created_at) VALUES
('66666666-0000-0000-0000-000000000001', 'Present Habit', 'My mother prepares breakfast for the whole family every morning.', 'Habitual daily action uses Present Simple.', 'Mẹ tôi chuẩn bị bữa sáng cho cả gia đình vào mỗi buổi sáng.', 1, '55555555-0000-0000-0000-000000000001', NOW()),
('66666666-0000-0000-0000-000000000002', 'Action in Progress', 'Look! The students are cleaning up the schoolyard for the green festival.', 'Look! indicates an ongoing action right now, using Present Continuous.', 'Nhìn kìa! Các học sinh đang dọn dẹp sân trường cho lễ hội xanh.', 2, '55555555-0000-0000-0000-000000000001', NOW()),
('66666666-0000-0000-0000-000000000003', 'Stative Verb Meaning', 'I think recycling old newspapers is very important.', 'Think expresses an opinion, so it must be in Present Simple.', 'Tôi nghĩ việc tái chế báo cũ là rất quan trọng.', 1, '55555555-0000-0000-0000-000000000002', NOW()),
('66666666-0000-0000-0000-000000000004', 'Be Going To with Evidence', 'Look at those dark clouds; it is going to rain.', 'Clear visual evidence requires be going to.', 'Nhìn những đám mây đen kìa; trời sắp mưa rồi đấy.', 1, '55555555-0000-0000-0000-000000000003', NOW()),
('66666666-0000-0000-0000-000000000005', 'Environmental Passive', 'Solar panels are installed on the school roof to generate electricity.', 'Focus is on the installation process rather than the worker.', 'Các tấm pin mặt trời được lắp đặt trên mái trường để tạo ra điện năng.', 1, '55555555-0000-0000-0000-000000000004', NOW()),
('66666666-0000-0000-0000-000000000006', 'Compound Sentence', 'Lan loves singing, but she decided not to enter the competition.', 'Conjunction but connects two contrasting clauses with a comma.', 'Lan rất thích hát, nhưng cô ấy đã quyết định không tham gia cuộc thi.', 1, '55555555-0000-0000-0000-000000000005', NOW()),
('66666666-0000-0000-0000-000000000007', 'Interrupted Past Action', 'While the volunteer team was planting trees, a gentle shower started.', 'Was planting is the ongoing background action interrupted by started.', 'Trong khi đội tình nguyện đang trồng cây thì một cơn mưa rào bất chợt bắt đầu.', 1, '55555555-0000-0000-0000-000000000006', NOW());


-- 7. MINI QUIZZES (100% bằng Tiếng Anh chuẩn mực bám sát SGK 10)
INSERT INTO mini_quiz (id, title, description, status, questions_json, lesson_id, created_at) VALUES
('77777777-1000-0000-0000-000000000001', 
'Quick Quiz: Unit 1 Present Tenses', 
'Quick check on Present Simple vs. Present Continuous in Grade 10 Unit 1', 
'ACTIVE', 
'[
  {
    "id": "q1",
    "question": "In my family, both my parents _______ to share the household responsibilities equally.",
    "options": ["try", "are trying", "tried", "has tried"],
    "correctIndex": 0,
    "explanation": "General family routine uses Present Simple with plural subject (try)."
  },
  {
    "id": "q2",
    "question": "Listen! Someone _______ the door of our apartment.",
    "options": ["knocks", "is knocking", "knocked", "has knocked"],
    "correctIndex": 1,
    "explanation": "The signal Listen! denotes an action happening at the moment of speaking (is knocking)."
  }
]', 
'55555555-0000-0000-0000-000000000001', NOW()),

('77777777-1000-0000-0000-000000000002', 
'Quick Quiz: Stative vs. Dynamic Verbs', 
'Quick check on stative verb rules', 
'ACTIVE', 
'[
  {
    "id": "q1",
    "question": "I _______ this soup to see if it needs more salt, and it _______ delicious.",
    "options": ["am tasting / tastes", "taste / is tasting", "taste / tastes", "am tasting / is tasting"],
    "correctIndex": 0,
    "explanation": "Active testing action is dynamic (am tasting); sensory state is stative (tastes)."
  }
]', 
'55555555-0000-0000-0000-000000000002', NOW()),

('77777777-1000-0000-0000-000000000003', 
'Quick Quiz: Unit 2 Future Forms', 
'Quick check on Will vs. Be Going To', 
'ACTIVE', 
'[
  {
    "id": "q1",
    "question": "We have already bought the seeds. We _______ a vegetable garden in our backyard tomorrow.",
    "options": ["will plant", "are going to plant", "plant", "planted"],
    "correctIndex": 1,
    "explanation": "A planned intention decided in advance with preparation uses be going to."
  },
  {
    "id": "q2",
    "question": "Can you carry this bag of groceries? - Sure, I _______ you right away!",
    "options": ["will help", "am going to help", "helped", "help"],
    "correctIndex": 0,
    "explanation": "Spontaneous offer made at the moment of speaking uses will."
  }
]', 
'55555555-0000-0000-0000-000000000003', NOW()),

('77777777-1000-0000-0000-000000000004', 
'Quick Quiz: Unit 2 Passive Voice', 
'Quick check on passive voice transformation in environmental contexts', 
'ACTIVE', 
'[
  {
    "id": "q1",
    "question": "Single-use plastic bags _______ by reusable canvas tote bags in many supermarkets.",
    "options": ["are replacing", "are being replaced", "have replaced", "replace"],
    "correctIndex": 1,
    "explanation": "Subject is passive and action is ongoing/current: are being replaced."
  }
]', 
'55555555-0000-0000-0000-000000000004', NOW()),

('77777777-1000-0000-0000-000000000005', 
'Quick Quiz: Unit 3 Compound Sentences & Infinitives', 
'Quick check on coordination and verb complementation', 
'ACTIVE', 
'[
  {
    "id": "q1",
    "question": "The young musician practiced diligently every day, _______ he won first prize in the national contest.",
    "options": ["but", "so", "or", "for"],
    "correctIndex": 1,
    "explanation": "So expresses the logical result of his hard practice."
  },
  {
    "id": "q2",
    "question": "The music teacher made all the students _______ the scale before singing.",
    "options": ["to practice", "practice", "practicing", "practiced"],
    "correctIndex": 1,
    "explanation": "Causative verb make + Object takes a bare infinitive (practice)."
  }
]', 
'55555555-0000-0000-0000-000000000005', NOW()),

('77777777-1000-0000-0000-000000000006', 
'Quick Quiz: Unit 4 Past Tenses with When/While', 
'Quick check on past events in volunteer contexts', 
'ACTIVE', 
'[
  {
    "id": "q1",
    "question": "While we _______ relief supplies to flood victims, local villagers _______ us hot tea.",
    "options": ["were delivering / brought", "delivered / were bringing", "delivered / brought", "were delivering / were bringing"],
    "correctIndex": 0,
    "explanation": "Longer ongoing action in progress (were delivering) interrupted by short event (brought)."
  }
]', 
'55555555-0000-0000-0000-000000000006', NOW());
