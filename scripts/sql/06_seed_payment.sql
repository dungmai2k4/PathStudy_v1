-- ========================================================
-- SEED DATA FOR payment_db
-- ========================================================

INSERT INTO payment_order (
    id, order_code, user_id, plan_code, plan_name, amount, duration_days, 
    status, bank_code, account_no, account_name, transaction_reference, 
    transfer_amount, transfer_content, paid_at, created_at, updated_at
) VALUES (
    'cccccccc-0000-0000-0000-000000000001',
    'PS886622',
    '90ed5f83-cbcf-409a-8c18-1594380acbe4',
    'PRO_1_MONTH',
    'PathStudy Pro (1 Tháng)',
    119000,
    30,
    'PAID',
    'MB',
    '0987654321',
    'PATHSTUDY PLATFORM',
    'MBVCB99881122',
    119000,
    'PS886622 NGUYEN VAN AN',
    NOW() - INTERVAL '3 days',
    NOW() - INTERVAL '3 days' - INTERVAL '5 minutes',
    NOW() - INTERVAL '3 days'
)
ON CONFLICT (order_code) DO NOTHING;
