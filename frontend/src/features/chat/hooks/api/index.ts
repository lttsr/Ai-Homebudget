import { DEMO_MESSAGES_BY_ROOM, DEMO_ROOMS } from "../../demo-data";
import type { ChatMessages, ChatRooms } from "../../types";

/** デモ用（API 接続後は削除） */
let demoRooms = [...DEMO_ROOMS];

/** チャットルーム一覧を取得します。 */
export const findChatRooms = async (): Promise<ChatRooms[]> => {
  // return await get<ChatRooms[]>("/chat/rooms");
  return [...demoRooms];
};

/** ルームのメッセージを取得します。 */
export const findChatMessages = async (
  roomId: string,
): Promise<ChatMessages[]> => {
  // return await get<ChatMessages[]>(`/chat/rooms/${roomId}/messages`);
  return DEMO_MESSAGES_BY_ROOM[roomId] ?? [];
};

/** チャットルームを削除します。 */
export const deleteChatRoom = async (roomId: string): Promise<void> => {
  // await apiRoot.delete(`/chat/rooms/${roomId}`);
  demoRooms = demoRooms.filter((room) => room.roomId !== roomId);
};
