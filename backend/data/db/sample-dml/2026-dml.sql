-- 2026年 家計簿サンプルデータ
DELETE FROM daily_home_budget_detail;
DELETE FROM daily_home_budget;
DELETE FROM montly_summary;

-- 日次家計簿（5月：全31日）
INSERT INTO daily_home_budget (budget_id, base_date, income_total, expense_total, registered_date, updated_date)
VALUES
    (1, DATE '2026-05-01', 300000, 85000, TIMESTAMP '2026-05-01 10:00:00', TIMESTAMP '2026-05-01 10:00:00'),
    (2, DATE '2026-05-02', 0, 0, TIMESTAMP '2026-05-02 10:00:00', TIMESTAMP '2026-05-02 10:00:00'),
    (3, DATE '2026-05-03', 0, 3450, TIMESTAMP '2026-05-03 10:00:00', TIMESTAMP '2026-05-03 10:00:00'),
    (4, DATE '2026-05-04', 0, 0, TIMESTAMP '2026-05-04 10:00:00', TIMESTAMP '2026-05-04 10:00:00'),
    (5, DATE '2026-05-05', 0, 620, TIMESTAMP '2026-05-05 10:00:00', TIMESTAMP '2026-05-05 10:00:00'),
    (6, DATE '2026-05-06', 0, 0, TIMESTAMP '2026-05-06 10:00:00', TIMESTAMP '2026-05-06 10:00:00'),
    (7, DATE '2026-05-07', 0, 1980, TIMESTAMP '2026-05-07 10:00:00', TIMESTAMP '2026-05-07 10:00:00'),
    (8, DATE '2026-05-08', 0, 0, TIMESTAMP '2026-05-08 10:00:00', TIMESTAMP '2026-05-08 10:00:00'),
    (9, DATE '2026-05-09', 0, 0, TIMESTAMP '2026-05-09 10:00:00', TIMESTAMP '2026-05-09 10:00:00'),
    (10, DATE '2026-05-10', 0, 4100, TIMESTAMP '2026-05-10 10:00:00', TIMESTAMP '2026-05-10 10:00:00'),
    (11, DATE '2026-05-11', 0, 0, TIMESTAMP '2026-05-11 10:00:00', TIMESTAMP '2026-05-11 10:00:00'),
    (12, DATE '2026-05-12', 0, 1200, TIMESTAMP '2026-05-12 10:00:00', TIMESTAMP '2026-05-12 10:00:00'),
    (13, DATE '2026-05-13', 0, 0, TIMESTAMP '2026-05-13 10:00:00', TIMESTAMP '2026-05-13 10:00:00'),
    (14, DATE '2026-05-14', 0, 0, TIMESTAMP '2026-05-14 10:00:00', TIMESTAMP '2026-05-14 10:00:00'),
    (15, DATE '2026-05-15', 0, 5680, TIMESTAMP '2026-05-15 10:00:00', TIMESTAMP '2026-05-15 10:00:00'),
    (16, DATE '2026-05-16', 0, 0, TIMESTAMP '2026-05-16 10:00:00', TIMESTAMP '2026-05-16 10:00:00'),
    (17, DATE '2026-05-17', 0, 0, TIMESTAMP '2026-05-17 10:00:00', TIMESTAMP '2026-05-17 10:00:00'),
    (18, DATE '2026-05-18', 0, 45000, TIMESTAMP '2026-05-18 10:00:00', TIMESTAMP '2026-05-18 10:00:00'),
    (19, DATE '2026-05-19', 0, 0, TIMESTAMP '2026-05-19 10:00:00', TIMESTAMP '2026-05-19 10:00:00'),
    (20, DATE '2026-05-20', 0, 2300, TIMESTAMP '2026-05-20 10:00:00', TIMESTAMP '2026-05-01 00:00:00'),
    (21, DATE '2026-05-21', 0, 0, TIMESTAMP '2026-05-21 10:00:00', TIMESTAMP '2026-05-01 00:00:00'),
    (22, DATE '2026-05-22', 0, 1100, TIMESTAMP '2026-05-22 10:00:00', TIMESTAMP '2026-05-01 00:00:00'),
    (23, DATE '2026-05-23', 0, 0, TIMESTAMP '2026-05-23 10:00:00', TIMESTAMP '2026-05-01 00:00:00'),
    (24, DATE '2026-05-24', 0, 0, TIMESTAMP '2026-05-24 10:00:00', TIMESTAMP '2026-05-01 00:00:00'),
    (25, DATE '2026-05-25', 0, 4150, TIMESTAMP '2026-05-25 10:00:00', TIMESTAMP '2026-05-01 00:00:00'),
    (26, DATE '2026-05-26', 0, 0, TIMESTAMP '2026-05-26 10:00:00', TIMESTAMP '2026-05-01 00:00:00'),
    (27, DATE '2026-05-27', 0, 0, TIMESTAMP '2026-05-27 10:00:00', TIMESTAMP '2026-05-01 00:00:00'),
    (28, DATE '2026-05-28', 0, 980, TIMESTAMP '2026-05-28 10:00:00', TIMESTAMP '2026-05-01 00:00:00'),
    (29, DATE '2026-05-29', 0, 0, TIMESTAMP '2026-05-29 10:00:00', TIMESTAMP '2026-05-01 00:00:00'),
    (30, DATE '2026-05-30', 0, 0, TIMESTAMP '2026-05-30 10:00:00', TIMESTAMP '2026-05-01 00:00:00'),
    (31, DATE '2026-05-31', 0, 5700, TIMESTAMP '2026-05-31 10:00:00', TIMESTAMP '2026-05-01 00:00:00');

-- 日次家計簿（6月）
INSERT INTO daily_home_budget (budget_id, base_date, income_total, expense_total, registered_date, updated_date)
VALUES
    (32, DATE '2026-06-01', 300000, 3500, TIMESTAMP '2026-06-01 00:00:00', TIMESTAMP '2026-06-01 00:00:00'),
    (33, DATE '2026-06-02', 0, 1300, TIMESTAMP '2026-06-01 00:00:00', TIMESTAMP '2026-06-01 00:00:00');

SELECT setval('daily_home_budget_id_seq', (SELECT MAX(budget_id) FROM daily_home_budget));

-- 日次家計簿詳細（5月）
INSERT INTO daily_home_budget_detail (
    budget_id, detail_id, category_id, account_id, expense_type, price, memo, registered_date, updated_date
)
VALUES
    (1, 1, 2, 2, 0, 300000, '5月給与', TIMESTAMP '2026-05-01 00:00:00', TIMESTAMP '2026-05-01 00:00:00'),
    (1, 2, 9, 2, 1, 85000, '5月家賃', TIMESTAMP '2026-05-01 00:00:00', TIMESTAMP '2026-05-01 00:00:00'),
    (3, 1, 1, 1, 1, 2800, '食料品', TIMESTAMP '2026-05-01 00:00:00', TIMESTAMP '2026-05-01 00:00:00'),
    (3, 2, 4, 1, 1, 650, 'カフェ', TIMESTAMP '2026-05-01 00:00:00', TIMESTAMP '2026-05-01 00:00:00'),
    (5, 1, 3, 3, 1, 620, '電車代', TIMESTAMP '2026-05-01 00:00:00', TIMESTAMP '2026-05-01 00:00:00'),
    (7, 1, 5, 1, 1, 1980, '技術書', TIMESTAMP '2026-05-01 00:00:00', TIMESTAMP '2026-05-01 00:00:00'),
    (10, 1, 1, 1, 1, 4100, 'まとめ買い', TIMESTAMP '2026-05-01 00:00:00', TIMESTAMP '2026-05-01 00:00:00'),
    (12, 1, 4, 1, 1, 880, 'ランチ', TIMESTAMP '2026-05-01 00:00:00', TIMESTAMP '2026-05-01 00:00:00'),
    (12, 2, 3, 3, 1, 320, 'バス代', TIMESTAMP '2026-05-01 00:00:00', TIMESTAMP '2026-05-01 00:00:00'),
    (15, 1, 1, 1, 1, 5200, '週末の買い出し', TIMESTAMP '2026-05-01 00:00:00', TIMESTAMP '2026-05-01 00:00:00'),
    (15, 2, 3, 3, 1, 480, '電車代', TIMESTAMP '2026-05-01 00:00:00', TIMESTAMP '2026-05-01 00:00:00'),
    (18, 1, 10, 1, 1, 45000, 'クレジットカード決済', TIMESTAMP '2026-05-01 00:00:00', TIMESTAMP '2026-05-01 00:00:00'),
    (20, 1, 6, 1, 1, 2300, '文房具', TIMESTAMP '2026-05-01 00:00:00', TIMESTAMP '2026-05-01 00:00:00'),
    (22, 1, 7, 2, 1, 1100, 'インターネット回線', TIMESTAMP '2026-05-01 00:00:00', TIMESTAMP '2026-05-01 00:00:00'),
    (25, 1, 1, 1, 1, 3600, '食料品', TIMESTAMP '2026-05-01 00:00:00', TIMESTAMP '2026-05-01 00:00:00'),
    (25, 2, 4, 3, 1, 550, 'カフェ', TIMESTAMP '2026-05-01 00:00:00', TIMESTAMP '2026-05-01 00:00:00'),
    (28, 1, 3, 3, 1, 980, '定期券更新', TIMESTAMP '2026-05-01 00:00:00', TIMESTAMP '2026-05-01 00:00:00'),
    (31, 1, 7, 2, 1, 4500, '携帯料金', TIMESTAMP '2026-05-01 00:00:00', TIMESTAMP '2026-05-01 00:00:00'),
    (31, 2, 6, 1, 1, 1200, '日用品', TIMESTAMP '2026-05-01 00:00:00', TIMESTAMP '2026-05-01 00:00:00');

-- 日次家計簿詳細（6月）
INSERT INTO daily_home_budget_detail (
    budget_id, detail_id, category_id, account_id, expense_type, price, memo, registered_date, updated_date
)
VALUES
    (32, 1, 1, 1, 1, 3500, '夕食の買い出し', TIMESTAMP '2026-06-01 10:00:00', TIMESTAMP '2026-06-01 10:00:00'),
    (32, 2, 2, 2, 0, 300000, '6月給与', TIMESTAMP '2026-06-01 10:00:00', TIMESTAMP '2026-06-01 10:00:00'),
    (33, 1, 3, 3, 1, 500, '電車代', TIMESTAMP '2026-06-02 00:20:00', TIMESTAMP '2026-06-02 00:20:00'),
    (33, 2, 4, 1, 1, 800, 'モーニング', TIMESTAMP '2026-06-02 20:00:00', TIMESTAMP '2026-06-02 20:00:00');

SELECT setval('daily_home_budget_detail_id_seq', (SELECT MAX(detail_id) FROM daily_home_budget_detail));

-- 月次家計簿確定情報（5月）
INSERT INTO montly_summary (
    base_month, status_type, income_total, expense_total, savings, savings_target,
    achievement_rate, comment, confirmed_date, registered_date, updated_date
)
VALUES (
    DATE '2026-05-01',
    1,
    300000,
    161260,
    138740,
    120000,
    115.62,
    '5月は家賃・クレジット決済が大きく、それでも貯蓄目標を上回りました。夕食の買い出しを節約して貯蓄を増やしました。',
    TIMESTAMP '2026-06-01 00:00:00',
    TIMESTAMP '2026-05-01 00:00:00',
    TIMESTAMP '2026-06-01 00:00:00'
);

-- 月次家計簿確定情報（6月・未確定）
INSERT INTO montly_summary (
    base_month, status_type, income_total, expense_total, savings, savings_target,
    achievement_rate, comment, confirmed_date, registered_date, updated_date
)
VALUES (
    DATE '2026-06-01',
    0,
    0,
    0,
    0,
    120000,
    0,
    NULL,
    TIMESTAMP '2026-06-01 00:00:00',
    TIMESTAMP '2026-06-01 00:00:00',
    TIMESTAMP '2026-06-01 00:00:00'
);
