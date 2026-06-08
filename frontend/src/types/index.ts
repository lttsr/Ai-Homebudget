export const TaskStatusType = {
  /** 未確定 */
  PENDING: "PENDING",
  /** 確定 */
  FINISHED: "FINISHED",
} as const;
export type TaskStatusType =
  (typeof TaskStatusType)[keyof typeof TaskStatusType];
