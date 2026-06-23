import { useCallback, useMemo, useState } from "react";
import { Menu, Plus, SendHorizontal, Trash2 } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { RoleType } from "@/types";
import { DEMO_MESSAGES_BY_ROOM, DEMO_ROOMS } from "../demo-data";
import type { ChatMessages, ChatRooms } from "../types";

type DemoMessage = Pick<
  ChatMessages,
  "messageId" | "roomId" | "message" | "role"
>;

export function ChatAI() {
  const [draft, setDraft] = useState("");
  const [rooms, setRooms] = useState<ChatRooms[]>(() => [...DEMO_ROOMS]);
  const [messagesByRoom, setMessagesByRoom] = useState<
    Record<string, DemoMessage[]>
  >(() => ({ ...DEMO_MESSAGES_BY_ROOM }));
  const [selectedRoomId, setSelectedRoomId] = useState(
    DEMO_ROOMS[0]?.roomId ?? "",
  );
  const [deleteTargetRoom, setDeleteTargetRoom] = useState<ChatRooms | null>(
    null,
  );
  const [isDeletingRoom, setIsDeletingRoom] = useState(false);

  const selectedRoom = useMemo(
    () => rooms.find((room) => room.roomId === selectedRoomId),
    [rooms, selectedRoomId],
  );

  const messages = useMemo(
    () => messagesByRoom[selectedRoomId] ?? [],
    [messagesByRoom, selectedRoomId],
  );

  const handleCreateChat = useCallback(() => {
    const now = new Date().toISOString();
    const roomId = `room-${Date.now()}`;

    const newRoom: ChatRooms = {
      roomId,
      agentSessionId: `session-${Date.now()}`,
      roomName: "新しいチャット",
      description: "家計の悩みを自由に相談できます",
      registeredDate: now,
      updatedDate: now,
    };

    // TODO: POST /chat/rooms を呼び出す
    setRooms((prev) => [newRoom, ...prev]);
    setMessagesByRoom((prev) => ({
      ...prev,
      [roomId]: [],
    }));
    setSelectedRoomId(roomId);
    setDraft("");
  }, []);

  const openDeleteDialog = useCallback((room: ChatRooms) => {
    setDeleteTargetRoom(room);
  }, []);

  const closeDeleteDialog = useCallback(() => {
    if (isDeletingRoom) {
      return;
    }
    setDeleteTargetRoom(null);
  }, [isDeletingRoom]);

  const handleDeleteRoom = useCallback(async () => {
    if (deleteTargetRoom == null) {
      return;
    }

    const roomId = deleteTargetRoom.roomId;
    setIsDeletingRoom(true);

    try {
      // TODO: DELETE /chat/rooms/{roomId} を呼び出す
      await Promise.resolve();

      setRooms((prev) => {
        const nextRooms = prev.filter((room) => room.roomId !== roomId);
        setSelectedRoomId((currentRoomId) => {
          if (currentRoomId !== roomId) {
            return currentRoomId;
          }
          return nextRooms[0]?.roomId ?? "";
        });
        return nextRooms;
      });
      setMessagesByRoom((prev) => {
        const next = { ...prev };
        delete next[roomId];
        return next;
      });
      setDeleteTargetRoom(null);
    } finally {
      setIsDeletingRoom(false);
    }
  }, [deleteTargetRoom]);

  return (
    <div
      id="chat-ai-root"
      className="flex h-full min-h-0 w-full flex-1 flex-col bg-slate-50/80"
    >
      <Dialog
        open={deleteTargetRoom != null}
        onOpenChange={(open) => {
          if (!open) {
            closeDeleteDialog();
          }
        }}
      >
        <DialogContent
          className="gap-0 overflow-hidden p-0 sm:max-w-88"
          showCloseButton={false}
        >
          <div className="px-6 pt-7 pb-5 text-center">
            <div className="mx-auto mb-4 flex size-11 items-center justify-center rounded-full bg-destructive/10 ring-1 ring-destructive/15">
              <Trash2 className="size-5 text-destructive" aria-hidden />
            </div>
            <DialogHeader className="items-center gap-2 text-center">
              <DialogTitle className="text-base font-semibold">
                ルームを削除しますか？
              </DialogTitle>
              <DialogDescription className="text-center text-[0.8125rem] leading-relaxed">
                削除したルームの会話履歴は復元できません。
              </DialogDescription>
            </DialogHeader>
            {deleteTargetRoom ? (
              <div className="mt-5 rounded-xl border border-border/70 bg-muted/35 px-4 py-3 text-left shadow-sm">
                <p className="truncate text-sm font-medium text-foreground">
                  {deleteTargetRoom.roomName}
                </p>
                {deleteTargetRoom.description ? (
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                    {deleteTargetRoom.description}
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>
          <div className="grid grid-cols-2 gap-2 border-t border-border/50 bg-muted/15 px-4 py-4">
            <Button
              type="button"
              variant="outline"
              className="h-10 rounded-lg shadow-none"
              onClick={closeDeleteDialog}
              disabled={isDeletingRoom}
            >
              キャンセル
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="h-10 rounded-lg"
              onClick={() => void handleDeleteRoom()}
              disabled={isDeletingRoom}
            >
              {isDeletingRoom ? "削除中…" : "削除する"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <header
        id="chat-ai-header"
        className="sticky top-0 z-10 flex h-12 shrink-0 items-center justify-between gap-3 border-b border-border/50 bg-slate-50/95 px-3 backdrop-blur-sm"
      >
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold leading-tight text-foreground">
            {selectedRoom?.roomName ?? "家計相談"}
          </p>
          {selectedRoom?.description ? (
            <p className="truncate text-xs text-muted-foreground">
              {selectedRoom.description}
            </p>
          ) : null}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger
            type="button"
            className="shrink-0 rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label="メニュー"
          >
            <Menu className="size-5" aria-hidden />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72 p-2">
            <DropdownMenuLabel className="px-2 py-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              家計相談
            </DropdownMenuLabel>
            <div className="px-1 pb-2">
              <Button
                type="button"
                variant="outline"
                className="h-10 w-full gap-2 rounded-lg border-dashed text-sm font-medium shadow-none"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  handleCreateChat();
                }}
              >
                <Plus className="size-4" aria-hidden />
                新しいチャット
              </Button>
            </div>
            <Accordion
              type="single"
              collapsible
              defaultValue="chat-ai-rooms"
              className="w-full"
            >
              <AccordionItem value="chat-ai-rooms" className="border-0">
                <AccordionTrigger
                  className="rounded-lg px-2 py-2.5 text-sm font-medium hover:bg-muted/50 hover:no-underline [&>svg]:size-4"
                  onPointerDown={(event) => event.preventDefault()}
                >
                  <span className="flex min-w-0 flex-1 items-center justify-between gap-2 pr-1">
                    <span>ルーム</span>
                    <span className="text-xs font-normal text-muted-foreground">
                      {rooms.length}件
                    </span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-0">
                  <div className="space-y-1.5 pt-1">
                    {rooms.length === 0 ? (
                      <p className="rounded-lg bg-muted/40 px-3 py-4 text-center text-sm text-muted-foreground">
                        ルームがありません
                      </p>
                    ) : (
                      rooms.map((room) => {
                        const isSelected = room.roomId === selectedRoomId;

                        return (
                          <div
                            key={room.roomId}
                            className={cn(
                              "flex items-stretch gap-1 rounded-lg border border-transparent p-0.5",
                              isSelected && "border-border/60 bg-accent/30",
                            )}
                          >
                            <DropdownMenuItem
                              className="min-w-0 flex-1 cursor-pointer items-start gap-3 rounded-md py-2.5 pl-2.5 pr-2 focus:bg-transparent"
                              onSelect={() => setSelectedRoomId(room.roomId)}
                            >
                              <span
                                className={cn(
                                  "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                                  isSelected
                                    ? "border-primary bg-primary"
                                    : "border-muted-foreground/35 bg-background",
                                )}
                                aria-hidden
                              >
                                {isSelected ? (
                                  <span className="size-1.5 rounded-full bg-primary-foreground" />
                                ) : null}
                              </span>
                              <span className="min-w-0 flex-1 text-left">
                                <span className="block truncate text-sm font-medium leading-snug">
                                  {room.roomName}
                                </span>
                                <span className="mt-1 block truncate text-xs leading-snug text-muted-foreground">
                                  {room.description}
                                </span>
                              </span>
                            </DropdownMenuItem>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              className="my-1 mr-1 shrink-0 self-center text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                              aria-label={`${room.roomName}を削除`}
                              title="ルームを削除"
                              onClick={(event) => {
                                event.preventDefault();
                                event.stopPropagation();
                                openDeleteDialog(room);
                              }}
                            >
                              <Trash2 className="size-4" aria-hidden />
                            </Button>
                          </div>
                        );
                      })
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <div
        id="chat-ai-thread"
        className="min-h-0 flex-1 overflow-y-auto px-3 py-4"
        role="log"
        aria-label="会話"
      >
        <ul className="mx-auto flex max-w-2xl flex-col gap-3">
          {messages.length === 0 ? (
            <li className="py-16 text-center text-sm text-muted-foreground">
              {rooms.length === 0
                ? "ルームがありません。上の「新しいチャット」から作成してください。"
                : "メッセージはまだありません。"}
            </li>
          ) : null}
          {messages.map((message) => (
            <li
              key={message.messageId}
              className={cn(
                "flex w-full",
                message.role === RoleType.USER
                  ? "justify-end"
                  : "justify-start",
              )}
            >
              <div
                className={cn(
                  "max-w-[min(100%,32rem)] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm",
                  message.role === RoleType.USER
                    ? "bg-primary text-primary-foreground"
                    : "border border-border/60 bg-card text-card-foreground",
                )}
              >
                {message.message}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <footer
        className="shrink-0 border-t border-border/70 bg-background/90 px-3 py-3 backdrop-blur-sm"
        aria-label="メッセージ入力"
      >
        <form
          className="mx-auto flex max-w-2xl gap-2"
          onSubmit={(event) => event.preventDefault()}
        >
          <div className="min-w-0 flex-1">
            <label className="sr-only" htmlFor="chat-ai-message">
              メッセージ
            </label>
            <textarea
              id="chat-ai-message"
              name="chat_ai_message"
              rows={1}
              value={draft}
              disabled={selectedRoom == null}
              onChange={(event) => setDraft(event.target.value)}
              placeholder={
                selectedRoom == null
                  ? "ルームを選択してください…"
                  : "家計の悩みを自由に書いてください…"
              }
              className={cn(
                "min-h-11 w-full resize-none rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm leading-snug",
                "placeholder:text-muted-foreground",
                "shadow-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50",
                "max-h-40",
              )}
            />
          </div>
          <Button
            type="submit"
            className="h-11 shrink-0 gap-1.5 self-end"
            size="default"
            disabled={selectedRoom == null}
            title="送信（バックエンド未接続のため画面のみ）"
          >
            送信
            <SendHorizontal className="size-4" aria-hidden />
          </Button>
        </form>
      </footer>
    </div>
  );
}
