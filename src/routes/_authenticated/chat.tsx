import { AppShell } from "@/components/AppShell";
import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/chat")({
  component: ChatLayout,
});

function ChatLayout() {
  return (
    <AppShell>
      <div className="flex h-full min-h-0 flex-1">
        <Outlet />
      </div>
    </AppShell>
  );
}

