import { createLocalThread, useLocalThreads } from "@/lib/local-store";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Sparkle } from "lucide-react";
import { useEffect } from "react";

export const Route = createFileRoute("/_authenticated/chat/")({
  component: ChatIndex,
});

function ChatIndex() {
  const threads = useLocalThreads();
  const navigate = useNavigate();

  useEffect(() => {
    if (threads.length > 0) {
      navigate({ to: "/chat/$threadId", params: { threadId: threads[0].id }, replace: true });
    } else {
      const t = createLocalThread({});
      navigate({ to: "/chat/$threadId", params: { threadId: t.id }, replace: true });
    }
  }, [threads, navigate]);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center px-6 text-center">
      <div className="rounded-full bg-gold/15 p-4 text-gold mb-4 animate-pulse">
        <Sparkle className="size-8" />
      </div>
      <h2 className="font-serif text-xl font-semibold">Loading conversation…</h2>
    </div>
  );
}
