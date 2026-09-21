UPDATE lesson 
SET title = REPLACE(title, '[Bài học cải thiện]', '[Bài học bổ sung]'),
    content = REPLACE(content, '👉 ', '')
WHERE is_remedial = true;

UPDATE assessments 
SET passing_score_percentage = 60 
WHERE passing_score_percentage = 80;
