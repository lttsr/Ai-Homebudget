package api.model.chat.type;

public enum MessageRoleType {
    /** ユーザー */
    USER,
    /** エージェント */
    AGENT;

    /**
     * 文字列に変換します。
     *
     * @return 文字列
     */
    public String toString() {
        return name();
    }

    /**
     * ユーザーかどうかを判断します。
     *
     * @return boolean
     */
    public boolean isUser() {
        return this == USER;
    }

    /**
     * エージェントかどうかを判断します。
     *
     * @return boolean
     */
    public boolean isAgent() {
        return this == AGENT;
    }
}
