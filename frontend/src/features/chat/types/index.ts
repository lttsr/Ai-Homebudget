import type { RoleType } from "@/types";

/** チャットルーム */
export type ChatRooms = {
  roomId: string;
  agentSessionId: string;
  roomName: string;
  description: string;
  registeredDate: string;
  updatedDate: string;
};

/** チャットメッセージ */
export type ChatMessages = {
  messageId: string;
  roomId: string;
  message: string;
  role: RoleType;
  registeredDate: string;
  updatedDate: string;
};
