INSERT INTO lesson (id, topic_id, skill_id, title, theory_summary, content, status, display_order, is_remedial, created_at, updated_at) VALUES 
('55555555-0000-0000-0000-000000000008', '22222222-2222-2222-2222-222222222202', '22222222-2222-2222-2222-222222222202', 
'[Bài học cải thiện] Chuyên đề Bị động đặc biệt & Cấu trúc nhờ vả', 
'Bài học bổ trợ củng cố: Nắm vững thể bị động kép, bị động với 2 tân ngữ và cấu trúc causative have/get.', 
'### 1. Bị động với động từ có 2 tân ngữ (give, send, show, buy...)
- **Chủ động:** S + V + O1 (người) + O2 (vật)
- **Bị động 1 (ưa chuộng hơn):** O1 + be + V3/ed + O2. (*I was given a nice gift.*)
- **Bị động 2:** O2 + be + V3/ed + to/for + O1. (*A nice gift was given to me.*)

### 2. Cấu trúc bị động khách quan / ý kiến (It is said that...)
- **Chủ động:** People say that S2 + V2...
- **Dạng 1:** It is said that + S2 + V2...
- **Dạng 2:** S2 + is/are said + to V (cùng thì) hoặc to have V3/ed (lệch thì/xảy ra trước).
- *Ví dụ:* He is said to have won the competition last year.

### 3. Cấu trúc nhờ vả (Causative Form)
- **Have:** S + have + O(người) + V_inf = S + have + O(vật) + V3/ed.
  - *I had the mechanic repair my car.* -> *I had my car repaired.*
- **Get:** S + get + O(người) + to V_inf = S + get + O(vật) + V3/ed.
  - *She got her brother to fix the lamp.* -> *She got the lamp fixed.*

### 4. Mẹo giải nhanh đề thi trắc nghiệm
- Nhìn ngay sau chỗ trống: nếu **không có tân ngữ trực tiếp** mà có giới từ (by, in, with...) -> 90% là câu **Bị động**!', 
'PUBLISHED', 2, true, NOW(), NOW()) 
ON CONFLICT (id) DO UPDATE SET 
title = EXCLUDED.title, 
theory_summary = EXCLUDED.theory_summary, 
content = EXCLUDED.content, 
is_remedial = EXCLUDED.is_remedial;

INSERT INTO mini_quiz (id, lesson_id, title, description, questions_json, status, created_at) VALUES
('77777777-1000-0000-0000-000000000008', '55555555-0000-0000-0000-000000000008',
'Quiz: Ôn tập Củng cố Câu bị động',
'Trả lời 3 câu hỏi củng cố kiến thức trước khi làm lại bài kiểm tra Topic.',
'[
  {
    "question": "Yesterday, my mother had our roof ________ by the local builders.",
    "options": ["repair", "repaired", "to repair", "repairing"],
    "answer": "repaired",
    "explanation": "Cấu trúc nhờ vả bị động: have + O(vật - our roof) + V3/ed (repaired)."
  },
  {
    "question": "The ancient pagoda is believed ________ in the 11th century.",
    "options": ["to build", "to have been built", "being built", "built"],
    "answer": "to have been built",
    "explanation": "Hành động xây dựng xảy ra trong quá khứ trước thời điểm hiện tại (is believed) -> to have been built."
  },
  {
    "question": "A prestigious scholarship was offered ________ her due to her outstanding academic results.",
    "options": ["to", "for", "with", "at"],
    "answer": "to",
    "explanation": "Bị động với tân ngữ chỉ vật đưa lên đầu: S(vật) + be + offered + to + O(người)."
  }
]', 'ACTIVE', NOW())
ON CONFLICT (id) DO UPDATE SET
questions_json = EXCLUDED.questions_json;
