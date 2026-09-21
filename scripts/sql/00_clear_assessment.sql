-- ========================================================
-- CLEAR ALL DATA IN assessment_db
-- ========================================================
TRUNCATE TABLE 
    assessment_answers,
    skill_assessment_results,
    assessment_attempts,
    assessment_questions,
    assessments
CASCADE;
