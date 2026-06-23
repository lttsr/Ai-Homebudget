import { RoleType } from "@/types";
import type { ChatMessages, ChatRooms } from "./types";

export const DEMO_ROOMS: ChatRooms[] = [
  {
    roomId: "room-food",
    agentSessionId: "session-food-001",
    roomName: "食費の見直し相談",
    description: "外食・食材・弁当などの支出を整理します",
    registeredDate: "2026-06-01T09:00:00",
    updatedDate: "2026-06-08T10:30:00",
  },
  {
    roomId: "room-savings",
    agentSessionId: "session-savings-001",
    roomName: "貯蓄プラン相談",
    description: "目標金額と月次の貯蓄ペースを一緒に考えます",
    registeredDate: "2026-06-03T14:20:00",
    updatedDate: "2026-06-07T18:45:00",
  },
  {
    roomId: "room-fixed",
    agentSessionId: "session-fixed-001",
    roomName: "固定費の削減相談",
    description: "家賃・通信費・サブスクなどの見直しを支援します",
    registeredDate: "2026-06-05T11:15:00",
    updatedDate: "2026-06-08T08:00:00",
  },
];

type DemoMessage = Pick<
  ChatMessages,
  "messageId" | "roomId" | "message" | "role"
>;

export const DEMO_MESSAGES_BY_ROOM: Record<string, DemoMessage[]> = {
  "room-food": [
    {
      messageId: "msg-food-1",
      roomId: "room-food",
      role: RoleType.USER,
      message: "今月の食費、どこを見直せばいいか教えて",
    },
    {
      messageId: "msg-food-2",
      roomId: "room-food",
      role: RoleType.AGENT,
      message:
        "家計相談モード（UIのみ）です。まずは直近1ヶ月の食費（外食・食材・弁当など）の合算と、大きい支出トップ3を一緒に洗い出すと、打ち手が選びやすいです。",
    },
  ],
  "room-savings": [
    {
      messageId: "msg-savings-1",
      roomId: "room-savings",
      role: RoleType.USER,
      message: "毎月5万円貯めたいんだけど、現実的なプランはある？",
    },
    {
      messageId: "msg-savings-2",
      roomId: "room-savings",
      role: RoleType.AGENT,
      message:
        "収入と固定費を確認したうえで、変動費の上限を決めると達成しやすくなります。まずは直近3ヶ月の可処分所得の平均を把握しましょう。",
    },
  ],
  "room-fixed": [
    {
      messageId: "msg-fixed-1",
      roomId: "room-fixed",
      role: RoleType.USER,
      message: "通信費とサブスク、どれを優先して見直すべき？",
    },
    {
      messageId: "msg-fixed-2",
      roomId: "room-fixed",
      role: RoleType.AGENT,
      message:
        "月額の高い順に並べ、利用頻度の低いものから解約候補にすると効率的です。通信費はプラン変更だけで数千円下がることもあります。",
    },
  ],
};
