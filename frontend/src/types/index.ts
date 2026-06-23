export const TaskStatusType = {
  /** 未確定 */
  PENDING: "PENDING",
  /** 確定 */
  FINISHED: "FINISHED",
} as const;
export type TaskStatusType =
  (typeof TaskStatusType)[keyof typeof TaskStatusType];

export const ExpenseType = {
  /** 収入 */
  INCOME: "INCOME",
  /** 支出 */
  EXPENSE: "EXPENSE",
} as const;
export type ExpenseType = (typeof ExpenseType)[keyof typeof ExpenseType];

export const RoleType = {
  /** ユーザー */
  USER: "USER",
  /** エージェント */
  AGENT: "AGENT",
} as const;
export type RoleType = (typeof RoleType)[keyof typeof RoleType];
