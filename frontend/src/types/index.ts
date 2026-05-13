export const TaskStatusType = {
  PENDING: "PENDING",
  FINISHED: "FINISHED",
} as const;
export type TaskStatusType =
  (typeof TaskStatusType)[keyof typeof TaskStatusType];
