import { useState } from "react";
import { SendHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const demo_messages: {
  id: string;
  role: "user" | "assistant";
  body: string;
}[] = [
  {
    id: "1",
    role: "user",
    body: "今月の食費、どこを見直せばいいか教えて",
  },
  {
    id: "2",
    role: "assistant",
    body: "家計相談モード（UIのみ）です。まずは直近1ヶ月の食費（外食・食材・弁当など）の合算と、大きい支出トップ3を一緒に洗い出すと、打ち手が選びやすいです。",
  },
];

export function AskAI() {
  const [draft, setDraft] = useState("");

  return (
    <div
      id="ask-ai-root"
      className="flex h-full min-h-0 w-full flex-1 flex-col bg-slate-50/80 pt-20"
    >
      <div
        id="ask-ai-thread"
        className="min-h-0 flex-1 overflow-y-auto px-3 py-4"
        role="log"
        aria-label="会話"
      >
        <ul className="mx-auto flex max-w-2xl flex-col gap-3">
          {demo_messages.map((m) => (
            <li
              key={m.id}
              className={cn(
                "flex w-full",
                m.role === "user" ? "justify-end" : "justify-start",
              )}
            >
              <div
                className={cn(
                  "max-w-[min(100%,32rem)] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm",
                  m.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "border border-border/60 bg-card text-card-foreground",
                )}
              >
                {m.body}
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
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="min-w-0 flex-1">
            <label className="sr-only" htmlFor="ask_ai_message">
              メッセージ
            </label>
            <textarea
              id="ask_ai_message"
              name="ask_ai_message"
              rows={1}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
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
