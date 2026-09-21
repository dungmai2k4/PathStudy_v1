-- ========================================================
-- CLEAR ALL DATA IN auth_db
-- ========================================================
TRUNCATE TABLE 
    user_subscription,
    user_roles,
    student_profile,
    account,
    users,
    subscription_plan,
    roles
CASCADE;
