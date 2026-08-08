"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Textarea } from "@/components/ui/textarea";
import { ApiError } from "@/lib/api/http";
import {
  getSupportChat,
  sendSupportChatMessage,
  type SupportChatMessage,
} from "@/lib/api/support";
import { useAuth } from "@/lib/auth/auth-provider";
import { cn } from "@/lib/utils";

export default function MessagesPage() {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");
  const [retryMessage, setRetryMessage] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const chatQuery = useQuery({
    queryKey: ["support-chat"],
    queryFn: () => getSupportChat(accessToken!),
    enabled: Boolean(accessToken),
  });

  const sendMutation = useMutation({
    mutationFn: (body: string) => sendSupportChatMessage(accessToken!, body),
    onSuccess: (response) => {
      queryClient.setQueryData(["support-chat"], response);
      setMessage("");
      setRetryMessage(null);
    },
    onError: (_error, body) => {
      setRetryMessage(body);
    },
  });

  const messages = chatQuery.data?.messages ?? [];
  const visibleMessages =
    sendMutation.isPending && sendMutation.variables
      ? [
          ...messages,
          {
            id: "pending-user-message",
            role: "USER" as const,
            body: sendMutation.variables,
            createdAt: null,
          },
        ]
      : messages;
  const error = chatQuery.error ?? sendMutation.error;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, sendMutation.isPending]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const body = message.trim();
    if (!body || sendMutation.isPending) return;
    sendMutation.mutate(body);
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-136px)] w-full max-w-5xl flex-col px-4 py-4 sm:px-6">
      <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-line bg-white">
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6">
          {chatQuery.isLoading ? (
            <div className="flex h-full items-center justify-center text-sm text-ink-muted">
              Loading conversation...
            </div>
          ) : (
            <div className="space-y-4">
              {visibleMessages.map((item, index) => (
                <MessageBubble
                  key={item.id ?? `greeting-${index}`}
                  message={item}
                />
              ))}
              {sendMutation.isPending && (
                <div
                  className="flex justify-start"
                  aria-live="polite"
                  aria-label="Havyn Villa is typing"
                >
                  <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-muted px-4 py-3 text-ink-muted">
                    <span className="size-1.5 animate-pulse rounded-full bg-current" />
                    <span className="size-1.5 animate-pulse rounded-full bg-current [animation-delay:120ms]" />
                    <span className="size-1.5 animate-pulse rounded-full bg-current [animation-delay:240ms]" />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {error && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-4 py-3 text-sm sm:px-6">
            <p role="alert" className="text-danger">
              {error instanceof ApiError
                ? error.message
                : "Something went wrong, please try again."}
            </p>
            {retryMessage && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => sendMutation.mutate(retryMessage)}
              >
                Retry
              </Button>
            )}
          </div>
        )}

        <form
          onSubmit={onSubmit}
          className="flex items-end gap-3 border-t border-line p-3 sm:p-4"
        >
          <Textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                event.currentTarget.form?.requestSubmit();
              }
            }}
            placeholder="Message Havyn Villa AI Assistant"
            rows={1}
            className="max-h-36 min-h-12 resize-none rounded-2xl px-4 py-3 leading-6"
            disabled={sendMutation.isPending}
          />
          <Button
            type="submit"
            size="icon"
            aria-label="Send message"
            className="size-14 rounded-full bg-brand text-white shadow-sm hover:bg-brand/90"
            disabled={!message.trim() || sendMutation.isPending}
          >
            <Icon
              name="arrowUp"
              size={22}
              weight="bold"
              className="text-white"
            />
          </Button>
        </form>
      </section>
    </div>
  );
}

function MessageBubble({ message }: { message: SupportChatMessage }) {
  const isUser = message.role === "USER";

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[82%] rounded-2xl px-4 py-3 text-base leading-7 sm:max-w-[74%]",
          isUser
            ? "rounded-br-md bg-brand text-white"
            : "rounded-bl-md bg-muted text-ink",
        )}
      >
        <MarkdownText text={message.body} />
      </div>
    </div>
  );
}

function MarkdownText({ text }: { text: string }) {
  return (
    <div className="space-y-2 whitespace-pre-wrap wrap-break-word">
      {text.split(/\n{2,}/).map((block, index) => {
        const trimmed = block.trim();
        if (!trimmed) return null;
        const listItems = trimmed
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => /^[-*]\s+/.test(line));
        if (listItems.length > 1) {
          return (
            <ul key={index} className="list-disc space-y-1 pl-5">
              {listItems.map((item) => (
                <li key={item}>
                  {renderInlineMarkdown(item.replace(/^[-*]\s+/, ""))}
                </li>
              ))}
            </ul>
          );
        }
        return <p key={index}>{renderInlineMarkdown(trimmed)}</p>;
      })}
    </div>
  );
}

function renderInlineMarkdown(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={index}
          className="rounded bg-black/10 px-1 py-0.5 text-[0.92em]"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      return (
        <a
          key={index}
          href={link[2]}
          className="font-medium underline underline-offset-4"
          target="_blank"
          rel="noreferrer"
        >
          {link[1]}
        </a>
      );
    }
    return part;
  });
}
