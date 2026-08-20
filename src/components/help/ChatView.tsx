"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { cn } from "@/lib/cn";

interface Message {
  id: number;
  from: "agent" | "you";
  text: string;
  /** Local send time, formatted once so re-renders don't drift it. */
  time: string;
}

const AGENT = { name: "Ngozi", role: "Grub Box Support" };

/** Opening prompts, so the thread never starts on a blank box. */
const STARTERS = [
  "My order is late",
  "Something is missing",
  "I want a refund",
  "Change my address",
];

/**
 * Canned replies keyed by what the message is about. A real agent is a socket
 * away; until then this keeps the screen honest about being a placeholder.
 */
function replyTo(text: string): string {
  const q = text.toLowerCase();
  if (q.includes("late") || q.includes("where"))
    return "Sorry about that. I can see the rider is still on the way — I'll check with them now and come back to you in a moment.";
  if (q.includes("missing") || q.includes("wrong"))
    return "That shouldn't happen. Could you tell me which item was missing? I'll arrange a refund for it straight away.";
  if (q.includes("refund") || q.includes("money"))
    return "I can help with that. Refunds go back to your original payment method within 3–5 business days once approved.";
  if (q.includes("address") || q.includes("change"))
    return "I can update the drop-off address if the rider hasn't collected yet. What's the new address?";
  return "Thanks — I've got that. Give me a moment while I pull up your order.";
}

function now(): string {
  return new Date()
    .toLocaleTimeString("en-NG", { hour: "numeric", minute: "2-digit", hour12: true })
    .replace(/\b(am|pm)\b/i, (m) => m.toUpperCase());
}

export function ChatView() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      from: "agent",
      text: `Hi, you're through to ${AGENT.name}. What can I help you with today?`,
      time: now(),
    },
  ]);
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(1);

  // Keep the newest message in view as the thread grows.
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, typing]);

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;

    setMessages((current) => [
      ...current,
      { id: nextId.current++, from: "you", text: trimmed, time: now() },
    ]);
    setDraft("");
    setTyping(true);

    // A beat before the reply, so the thread reads like a conversation.
    setTimeout(() => {
      setTyping(false);
      setMessages((current) => [
        ...current,
        { id: nextId.current++, from: "agent", text: replyTo(trimmed), time: now() },
      ]);
    }, 1100);
  }

  return (
    <div className="border-hairline bg-surface flex h-[min(70vh,620px)] flex-col overflow-hidden rounded-[28px] border-2">
      {/* Agent header ---------------------------------------------------- */}
      <div className="border-hairline flex flex-none items-center gap-3.5 border-b px-6 py-4.5">
        <span className="bg-primary text-canvas flex size-10 flex-none items-center justify-center rounded-full text-sm font-extrabold">
          {AGENT.name.charAt(0)}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-fg text-sm font-extrabold">{AGENT.name}</p>
          <p className="text-success flex items-center gap-1.5 text-[12px] font-bold">
            <span className="bg-success size-1.5 rounded-full" />
            Online · replies in about a minute
          </p>
        </div>
      </div>

      {/* Thread ----------------------------------------------------------- */}
      <div
        role="log"
        aria-live="polite"
        aria-label="Conversation with support"
        className="rail flex flex-1 flex-col gap-3 overflow-y-auto px-6 py-5"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex max-w-[80%] flex-col gap-1",
              message.from === "you" ? "items-end self-end" : "items-start self-start",
            )}
          >
            <div
              className={cn(
                "rounded-[18px] px-4 py-2.5 text-[13.5px] leading-relaxed",
                message.from === "you"
                  ? "bg-primary text-canvas rounded-br-sm font-semibold"
                  : "bg-surface-3 text-fg-muted rounded-bl-sm",
              )}
            >
              {message.text}
            </div>
            <span className="text-fg-subtle text-[11px] font-semibold">
              {message.from === "you" ? "You" : AGENT.name} · {message.time}
            </span>
          </div>
        ))}

        {typing && (
          <div className="self-start">
            <div className="bg-surface-3 soundwave flex items-end gap-1 rounded-[18px] rounded-bl-sm px-4 py-3.5">
              <span className="bg-fg-subtle size-1.5 rounded-full" />
              <span className="bg-fg-subtle size-1.5 rounded-full" />
              <span className="bg-fg-subtle size-1.5 rounded-full" />
              <span className="sr-only">{AGENT.name} is typing</span>
            </div>
          </div>
        )}

        <div ref={endRef} />
      </div>

      {/* Starters + composer ---------------------------------------------- */}
      {messages.length === 1 && (
        <div className="rail-clean flex flex-none gap-2 overflow-x-auto px-6 pb-3">
          {STARTERS.map((starter) => (
            <Chip key={starter} onClick={() => send(starter)} className="text-[13px]">
              {starter}
            </Chip>
          ))}
        </div>
      )}

      <form
        onSubmit={(event) => {
          event.preventDefault();
          send(draft);
        }}
        className="border-hairline flex flex-none items-center gap-2.5 border-t px-4 py-3.5"
      >
        <input
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Type your message…"
          aria-label="Message support"
          className="text-fg placeholder:text-fg-subtle min-w-0 flex-1 bg-transparent px-2 text-sm outline-none"
        />
        <Button type="submit" disabled={draft.trim().length === 0}>
          Send
        </Button>
      </form>
    </div>
  );
}
