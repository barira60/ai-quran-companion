import { Button } from "@/components/ui/button";
import {
  createLocalThread,
  deleteLocalThread,
  useLocalThreads,
} from "@/lib/local-store";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { Plus, Trash2 } from "lucide-react";

export function ThreadSidebar() {
  const navigate = useNavigate();
  const threads = useLocalThreads();
  const { threadId } = useParams({ strict: false }) as { threadId?: string };

  const newThread = () => {
    const t = createLocalThread({});
    navigate({ to: "/chat/$threadId", params: { threadId: t.id } });
  };

  const removeThread = (id: string) => {
    deleteLocalThread(id);
    const remaining = threads.filter((t) => t.id !== id);
    if (threadId === id) {
      if (remaining.length > 0) {
        navigate({ to: "/chat/$threadId", params: { threadId: remaining[0].id }, replace: true });
      } else {
        const t = createLocalThread({});
        navigate({ to: "/chat/$threadId", params: { threadId: t.id }, replace: true });
      }
    }
  };

  return (
    <div className="flex h-full w-full flex-col border-r bg-card/30">
      <div className="p-3">
        <Button onClick={newThread} className="w-full gap-2">
          <Plus className="size-4" /> New conversation
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto px-2 pb-3 space-y-1">
        {threads.length === 0 && (
          <p className="px-3 py-6 text-xs text-muted-foreground text-center">
            Your saved conversations will appear here.
          </p>
        )}
        {threads.map((t) => {
          const active = threadId === t.id;
          return (
            <div
              key={t.id}
              className={`group flex items-center gap-1 rounded-lg pr-1 ${
                active ? "bg-primary/10" : "hover:bg-muted"
              }`}
            >
              <Link
                to="/chat/$threadId"
                params={{ threadId: t.id }}
                className="flex-1 min-w-0 px-3 py-2 text-sm truncate"
              >
                {t.title}
                {t.mood && (
                  <span className="ml-2 text-[10px] uppercase tracking-wide text-gold">
                    {t.mood}
                  </span>
                )}
              </Link>
              <button
                aria-label="Delete conversation"
                onClick={() => removeThread(t.id)}
                className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
