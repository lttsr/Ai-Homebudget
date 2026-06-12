package api.model.budget.type;

public enum ExpensesType {
    /** 収入 */
    INCOME,
    /** 支出 */
    EXPENSE;

    /**
     * 文字列に変換します。
     *
     * @return 文字列
     */
    public String toString() {
        return name();
    }

    /**
     * 収入かどうかを判断します。
     *
     * @return boolean
     */
    public boolean isIncome() {
        return this == INCOME;
    }

    /**
     * 支出かどうかを判断します。
     *
     * @return boolean
     */
    public boolean isExpense() {
        return this == EXPENSE;
    }
}
