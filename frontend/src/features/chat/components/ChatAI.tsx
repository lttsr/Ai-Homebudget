import { useEffect, useState } from "react";
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
import { deleteChatRoom, findChatMessages, findChatRooms } from "../hooks/api";
import type { ChatMessages, ChatRooms } from "../types";

export function ChatAI() {
  const [draft, setDraft] = useState("");
  const [rooms, setRooms] = useState<ChatRooms[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessages[]>([]);
  const [deleteRoomId, setDeleteRoomId] = useState<string | null>(null);

  useEffect(() => {
    void findChatRooms().then((list) => {
      setRooms(list);
      setSelectedRoomId((prev) => prev ?? list[0]?.roomId ?? null);
    });
  }, []);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      if (selectedRoomId == null) {
        setMessages([]);
        return;
      }
      const list = await findChatMessages(selectedRoomId);
      if (!cancelled) {
        setMessages(list);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [selectedRoomId]);

  const handleDeleteRoom = async () => {
    if (deleteRoomId == null) {
      return;
    }

    const targetId = deleteRoomId;

    await deleteChatRoom(targetId);
    setRooms(await findChatRooms());

    if (selectedRoomId === targetId) {
      setSelectedRoomId(null);
    }
    setDeleteRoomId(null);
  };

  return (
    <div
      id="chat-ai-root"
      className="flex h-full min-h-0 w-full flex-1 flex-col bg-slate-50/80"
    >
      <Dialog
        open={deleteRoomId != null}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteRoomId(null);
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
            {deleteRoomId != null
              ? rooms
                  .filter((item) => item.roomId === deleteRoomId)
                  .map((item) => (
                    <div
                      key={item.roomId}
                      className="mt-5 rounded-xl border border-border/70 bg-muted/35 px-4 py-3 text-left shadow-sm"
                    >
                      <p className="truncate text-sm font-medium text-foreground">
                        {item.roomName}
                      </p>
                      {item.description ? (
                        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                          {item.description}
                        </p>
                      ) : null}
                    </div>
                  ))
              : null}
          </div>
          <div className="grid grid-cols-2 gap-2 border-t border-border/50 bg-muted/15 px-4 py-4">
            <Button
              type="button"
              variant="outline"
              className="h-10 rounded-lg shadow-none"
              onClick={() => setDeleteRoomId(null)}
            >
              キャンセル
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="h-10 rounded-lg"
              onClick={() => void handleDeleteRoom()}
            >
              削除する
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
            {selectedRoomId == null
              ? "新しいチャット"
              : (rooms.find((item) => item.roomId === selectedRoomId)
                  ?.roomName ?? "家計相談")}
          </p>
          {selectedRoomId == null ? (
            <p className="truncate text-xs text-muted-foreground">
              未保存 · 送信時にルームが作成されます
            </p>
          ) : rooms.find((item) => item.roomId === selectedRoomId)
              ?.description ? (
            <p className="truncate text-xs text-muted-foreground">
              {
                rooms.find((item) => item.roomId === selectedRoomId)
                  ?.description
              }
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
                  setSelectedRoomId(null);
                  setDraft("");
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
                      rooms.map((item) => {
                        const isSelected = item.roomId === selectedRoomId;

                        return (
                          <div
                            key={item.roomId}
                            className={cn(
                              "flex items-stretch gap-1 rounded-lg border border-transparent p-0.5",
                              isSelected && "border-border/60 bg-accent/30",
                            )}
                          >
                            <DropdownMenuItem
                              className="min-w-0 flex-1 cursor-pointer items-start gap-3 rounded-md py-2.5 pl-2.5 pr-2 focus:bg-transparent"
                              onSelect={() => setSelectedRoomId(item.roomId)}
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
                                  {item.roomName}
                                </span>
                                <span className="mt-1 block truncate text-xs leading-snug text-muted-foreground">
                                  {item.description}
                                </span>
                              </span>
                            </DropdownMenuItem>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              className="my-1 mr-1 shrink-0 self-center text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                              aria-label={`${item.roomName}を削除`}
                              title="ルームを削除"
                              onClick={(event) => {
                                event.preventDefault();
                                event.stopPropagation();
                                setDeleteRoomId(item.roomId);
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
              {selectedRoomId == null
                ? "メッセージを入力して会話を始めましょう。"
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
              onChange={(event) => setDraft(event.target.value)}
              placeholder="家計の悩みを自由に書いてください…"
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
            disabled={draft.trim() === ""}
            title={
              selectedRoomId == null
                ? "送信（初回送信時にルーム作成 · バックエンド未接続）"
                : "送信（バックエンド未接続のため画面のみ）"
            }
          >
            送信
            <SendHorizontal className="size-4" aria-hidden />
          </Button>
        </form>
      </footer>
    </div>
  );
}
