DROP TABLE IF EXISTS daily_home_budget_detail;
DROP TABLE IF EXISTS daily_home_budget;
DROP TABLE IF EXISTS payment_account;
DROP TABLE IF EXISTS budget_category;
DROP SEQUENCE IF EXISTS daily_home_budget_detail_id_seq;
DROP SEQUENCE IF EXISTS daily_home_budget_id_seq;
DROP SEQUENCE IF EXISTS payment_account_id_seq;
DROP SEQUENCE IF EXISTS budget_category_id_seq;

-- 口座・決済手段マスタ
CREATE SEQUENCE IF NOT EXISTS payment_account_id_seq;

CREATE TABLE IF NOT EXISTS payment_account (
    account_id      BIGINT       NOT NULL,
    name            VARCHAR(255) NOT NULL,
    registered_date TIMESTAMP    NOT NULL,
    updated_date    TIMESTAMP    NOT NULL,
    CONSTRAINT payment_account_pkey PRIMARY KEY (account_id)
);

ALTER SEQUENCE payment_account_id_seq OWNED BY payment_account.account_id;

-- カテゴリマスタ
CREATE SEQUENCE IF NOT EXISTS budget_category_id_seq;

CREATE TABLE IF NOT EXISTS budget_category (
    category_id     BIGINT       NOT NULL,
    name            VARCHAR(255) NOT NULL,
    color_code      VARCHAR(7)   NOT NULL,
    registered_date TIMESTAMP    NOT NULL,
    updated_date    TIMESTAMP    NOT NULL,
    CONSTRAINT budget_category_pkey PRIMARY KEY (category_id)
);

ALTER SEQUENCE budget_category_id_seq OWNED BY budget_category.category_id;

-- 日次家計簿
CREATE SEQUENCE IF NOT EXISTS daily_home_budget_id_seq;

CREATE TABLE IF NOT EXISTS daily_home_budget (
    budget_id      BIGINT    NOT NULL,
    base_date    TIMESTAMP NOT NULL,
    income_total   INT       NOT NULL,
    expense_total  INT       NOT NULL,
    registered_date TIMESTAMP NOT NULL,
    updated_date    TIMESTAMP NOT NULL,
    CONSTRAINT daily_home_budget_pkey PRIMARY KEY (budget_id)
);

ALTER SEQUENCE daily_home_budget_id_seq OWNED BY daily_home_budget.budget_id;

-- 日次家計簿詳細
CREATE SEQUENCE IF NOT EXISTS daily_home_budget_detail_id_seq;

CREATE TABLE IF NOT EXISTS daily_home_budget_detail (
    budget_id       BIGINT       NOT NULL,
    detail_id       BIGINT       NOT NULL,
    category_id     BIGINT       NOT NULL,
    account_id      BIGINT       NOT NULL,
    expense_type    SMALLINT     NOT NULL,
    price           INT          NOT NULL,
    memo            VARCHAR(255),
    registered_date TIMESTAMP    NOT NULL,
    updated_date    TIMESTAMP    NOT NULL,
    CONSTRAINT daily_home_budget_detail_pkey PRIMARY KEY (budget_id, detail_id)
);

ALTER SEQUENCE daily_home_budget_detail_id_seq OWNED BY daily_home_budget_detail.detail_id;

COMMENT ON COLUMN daily_home_budget_detail.expense_type IS '0:収入(INCOME), 1:支出(EXPENSE)';

