-- 口座・決済手段マスタ 初期データ
INSERT INTO payment_account (account_id, name, registered_date, updated_date)
VALUES
    (1, 'クレジットカード', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (2, '銀行', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (3, 'PayPay', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

SELECT setval('payment_account_id_seq', (SELECT MAX(account_id) FROM payment_account));

-- カテゴリマスタ 初期データ
INSERT INTO budget_category (category_id, name, color_code, registered_date, updated_date)
VALUES
    (1, 'スーパー', '#FF0000', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (2, '給与', '#00FF00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (3, '交通費', '#0000FF', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (4, 'カフェ', '#FFFF00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (5, '書籍', '#a855f7', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (6, '雑費', '#f97316', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (7, '通信費', '#06b6d4', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (8, '前月度収支', '#64748b', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (9, '家賃', '#ca8a04', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (10, 'クレジットカード決済', '#0ea5e9', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

SELECT setval('budget_category_id_seq', (SELECT MAX(category_id) FROM budget_category));

-- 日次家計簿 初期データ
INSERT INTO daily_home_budget (budget_id, base_date, income_total, expense_total, registered_date, updated_date)
VALUES
    (1, TIMESTAMP '2026-06-01', 300000, 3500, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (2, TIMESTAMP '2026-06-02', 0, 1300, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

SELECT setval('daily_home_budget_id_seq', (SELECT MAX(budget_id) FROM daily_home_budget));

-- 日次家計簿詳細 初期データ
INSERT INTO daily_home_budget_detail (
    budget_id, detail_id, category_id, account_id, expense_type, price, memo, registered_date, updated_date
)
VALUES
    (1, 1, 1, 1, 1, 3500, '夕食の買い出し', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (1, 2, 2, 2, 0, 300000, '6月給与', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (2, 1, 3, 3, 1, 500, '電車代', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (2, 2, 4, 1, 1, 800, 'モーニング', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

SELECT setval('daily_home_budget_detail_id_seq', (SELECT MAX(detail_id) FROM daily_home_budget_detail));
