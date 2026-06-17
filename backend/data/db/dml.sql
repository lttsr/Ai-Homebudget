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
