package api.model.budget.type;

public enum TaskStatusType {
    /** 未確定 */
    PENDING,
    /** 確定 */
    DETERMINED;

    /**
     * 文字列に変換します。
     *
     * @return 文字列
     */
    public String toString() {
        return name();
    }

    /**
     * 未確定かどうかを判断します。
     *
     * @return boolean
     */
    public boolean isPending() {
        return this == PENDING;
    }

    /**
     * 確定かどうかを判断します。
     *
     * @return boolean
     */
    public boolean isDetermined() {
        return this == DETERMINED;
    }
}
