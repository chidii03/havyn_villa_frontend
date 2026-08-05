"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Textarea } from "@/components/ui/textarea";
import { ApiError } from "@/lib/api/http";
import { getSupportChat, sendSupportChatMessage, type SupportChatMessage } from "@/lib/api/support";
import { useAuth } from "@/lib/auth/auth-provider";
import { cn } from "@/lib/utils";

export default function MessagesPage() {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");
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
    },
  });

  const messages = chatQuery.data?.messages ?? [];
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
    <div className="mx-auto flex min-h-[calc(100vh-220px)] w-full max-w-4xl flex-col px-6 py-12">
      <h1 className="font-display text-2xl font-semibold text-ink">Messages</h1>

      <section className="mt-8 flex min-h-[560px] flex-1 flex-col rounded-xl border border-line bg-white">
        <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">
          {chatQuery.isLoading ? (
            <p className="text-sm text-ink-muted">Loading conversation...</p>
          ) : (
            <div className="space-y-4">
              {messages.map((item, index) => (
                <MessageBubble key={item.id ?? `greeting-${index}`} message={item} />
              ))}
              {sendMutation.isPending && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-bl-md bg-muted px-4 py-3 text-sm text-ink-muted">Havyn Villa is typing...</div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {error && (
          <p role="alert" className="border-t border-line px-4 py-2 text-sm text-danger sm:px-6">
            {error instanceof ApiError ? error.message : "Something went wrong, please try again."}
          </p>
        )}

        <form onSubmit={onSubmit} className="flex gap-3 border-t border-line p-4">
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
            className="min-h-12 resize-none"
            disabled={sendMutation.isPending}
          />
          <Button type="submit" size="icon" aria-label="Send message" disabled={!message.trim() || sendMutation.isPending}>
            <Icon name="chevronRight" size={18} />
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
          "max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-6",
          isUser ? "rounded-br-md bg-brand text-white" : "rounded-bl-md bg-muted text-ink",
        )}
      >
        {message.body}
      </div>
    </div>
  );
}
