import { ChatWindow } from "@/components/ChatWindow";
import { createLocalThread, useLocalMessages, useLocalThreads } from "@/lib/local-store";
import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import type { UIMessage } from "ai";
import { useEffect, useState } from "react";
import { Sparkle } from "lucide-react";

export const Route = createFileRoute("/_authenticated/chat/$threadId")({
  component: ThreadPage,
});

function ThreadPage() {
  const { threadId } = useParams({ from: "/_authenticated/chat/$threadId" });
  const [mounted, setMounted] = useState(false);
  const threads = useLocalThreads();
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  const exists = threads.some((t) => t.id === threadId);

  useEffect(() => {
    if (mounted && !exists) {
      if (threads.length > 0) {
        navigate({ to: "/chat/$threadId", params: { threadId: threads[0].id }, replace: true });
      } else {
        const t = createLocalThread({});
        navigate({ to: "/chat/$threadId", params: { threadId: t.id }, replace: true });
      }
    }
  }, [mounted, exists, threads, navigate]);

  if (!mounted || !exists) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center px-6 text-center">
        <div className="rounded-full bg-gold/15 p-4 text-gold mb-4 animate-pulse">
          <Sparkle className="size-8" />
        </div>
        <h2 className="font-serif text-xl font-semibold">Loading conversation…</h2>
      </div>
    );
  }

  return <ThreadContent threadId={threadId} />;
}

function ThreadContent({ threadId }: { threadId: string }) {
  const messages = useLocalMessages(threadId);
  const threads = useLocalThreads();
  const thread = threads.find((t) => t.id === threadId);
  const initial = messages as unknown as UIMessage[];

  return (
    <div className="flex h-full w-full flex-1 min-w-0">
      <ChatWindow
        key={threadId}
        threadId={threadId}
        mood={thread?.mood ?? null}
        initialMessages={initial}
      />
    </div>
  );
}
