import { LanguageToggle } from "@/components/LanguageToggle";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language-store";
import {
  createLocalThread,
  deleteLocalThread,
  useLocalThreads,
} from "@/lib/local-store";
import { Link, useNavigate, useParams, useRouterState } from "@tanstack/react-router";
import {
  BookHeart,
  ChevronLeft,
  ChevronRight,
  Heart,
  Menu,
  MessageCircleHeart,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";

const nav = [
  { to: "/chat", icon: MessageCircleHeart, label: "Companion" },
  { to: "/healing", icon: BookHeart, label: "Healing Mode" },
  { to: "/favorites", icon: Heart, label: "Favorites" },
] as const;

const COLLAPSED_KEY = "qc.sidebar-collapsed";

export function AppShell({ children }: { children: ReactNode }) {
  const [appLang] = useLanguage();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { threadId } = useParams({ strict: false }) as { threadId?: string };
  const threads = useLocalThreads();
  const [mobileOpen, setMobileOpen] = useState(false);

  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(COLLAPSED_KEY) === "true";
  });

  const isUrdu = appLang === "ur";

  const navItems = [
    { to: "/chat", icon: MessageCircleHeart, label: isUrdu ? "رہنما رفیق" : "Companion" },
    { to: "/healing", icon: BookHeart, label: isUrdu ? "ہیلنگ موڈ" : "Healing Mode" },
    { to: "/favorites", icon: Heart, label: isUrdu ? "پسندیدہ" : "Favorites" },
  ] as const;

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const toggle = () => {
    const next = !collapsed;
    setCollapsed(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(COLLAPSED_KEY, String(next));
    }
  };

  const handleNewConversation = () => {
    const t = createLocalThread({});
    setMobileOpen(false);
    navigate({ to: "/chat/$threadId", params: { threadId: t.id } });
  };

  const handleRemoveThread = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    deleteLocalThread(id);
    const remaining = threads.filter((t) => t.id !== id);
    const activeId = threadId || (pathname.startsWith("/chat/") ? pathname.slice(6) : undefined);
    if (activeId === id || pathname === "/chat") {
      if (remaining.length > 0) {
        navigate({ to: "/chat/$threadId", params: { threadId: remaining[0].id }, replace: true });
      } else {
        const t = createLocalThread({});
        navigate({ to: "/chat/$threadId", params: { threadId: t.id }, replace: true });
      }
    }
  };

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-background">
      {/* Desktop Unified Sidebar */}
      <aside
        className={`hidden md:flex ${
          collapsed ? "w-16" : "w-72"
        } shrink-0 flex-col border-r bg-sidebar text-sidebar-foreground transition-all duration-200 ease-in-out`}
      >
        <div
          className={
            collapsed
              ? "flex flex-col items-center gap-3 px-2 py-4"
              : "flex items-center justify-between px-4 py-4 border-b border-sidebar-border"
          }
        >
          <Link to="/chat">
            <Logo size={collapsed ? 28 : 30} withWordmark={!collapsed} />
          </Link>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={toggle}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="size-4" />
            ) : (
              <ChevronLeft className="size-4" />
            )}
          </Button>
        </div>

        {/* Navigation items */}
        <nav className="space-y-1 p-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.to || (item.to === "/chat" && pathname.startsWith("/chat"));
            return (
              <Link
                key={item.to}
                to={item.to}
                title={item.label}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  collapsed ? "justify-center" : "justify-start"
                } ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                }`}
              >
                <Icon className="size-4 shrink-0" />
                {!collapsed && (
                  <span className={`truncate ${isUrdu ? "font-urdu text-[15px]" : ""}`}>
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Conversations section (only shown when sidebar expanded) */}
        {!collapsed && (
          <div className="flex flex-1 min-h-0 flex-col border-t border-sidebar-border mt-2">
            <div className="flex items-center justify-between px-3 pt-3 pb-2">
              <span className={`text-[11px] font-semibold uppercase tracking-wider text-muted-foreground ${isUrdu ? "font-urdu text-xs" : ""}`}>
                {isUrdu ? "گفتگو کی تاریخ" : "Conversations"}
              </span>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleNewConversation}
                className={`h-7 gap-1 px-2 text-xs text-primary hover:bg-primary/10 ${isUrdu ? "font-urdu" : ""}`}
                title={isUrdu ? "نئی گفتگو شروع کریں" : "Start a new conversation"}
              >
                <Plus className="size-3.5" />
                <span>{isUrdu ? "نئی" : "New"}</span>
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto px-2 pb-3 space-y-1">
              {threads.length === 0 && (
                <p className={`px-3 py-4 text-xs text-muted-foreground text-center ${isUrdu ? "font-urdu" : ""}`}>
                  {isUrdu ? "ابھی تک کوئی گفتگو محفوظ نہیں ہوئی۔" : "No saved conversations yet."}
                </p>
              )}
              {threads.map((t) => {
                const active = threadId === t.id;
                return (
                  <div
                    key={t.id}
                    className={`group flex items-center justify-between rounded-lg pr-1 text-sm transition-colors ${
                      active
                        ? "bg-sidebar-accent font-medium text-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/60"
                    }`}
                  >
                    <Link
                      to="/chat/$threadId"
                      params={{ threadId: t.id }}
                      className="flex-1 min-w-0 px-3 py-2 truncate"
                    >
                      <span>{t.title}</span>
                      {t.mood && (
                        <span className="ml-2 text-[10px] uppercase tracking-wide text-gold">
                          {t.mood}
                        </span>
                      )}
                    </Link>
                    <button
                      aria-label="Delete conversation"
                      onClick={(e) => handleRemoveThread(t.id, e)}
                      title="Delete conversation"
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-opacity"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer */}
        <div
          className={`p-3 border-t border-sidebar-border flex ${
            collapsed ? "flex-col items-center gap-2" : "items-center justify-between"
          }`}
        >
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col h-full overflow-hidden">
        {/* Top Navigation Bar (Desktop & Mobile) */}
        <header className="flex items-center justify-between border-b px-3.5 sm:px-5 py-2.5 sm:py-3.5 bg-card/80 backdrop-blur-md z-10 pt-[calc(0.65rem+env(safe-area-inset-top,0px))] shadow-2xs min-h-[58px] sm:min-h-[64px]">
          {/* Mobile hamburger & logo */}
          <div className="flex items-center gap-2 sm:gap-3 md:hidden shrink-0">
            <Button
              size="icon"
              variant="ghost"
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
              className="size-9 shrink-0 rounded-xl hover:bg-primary/10 text-foreground"
            >
              <Menu className="size-5" />
            </Button>

            <Link to="/chat" className="shrink-0 flex items-center">
              <Logo withWordmark compact size={28} />
            </Link>
          </div>

          {/* Desktop Brand / Breadcrumb */}
          <div className="hidden md:flex items-center gap-2.5 text-xs text-muted-foreground">
            <span className="inline-block size-2.5 rounded-full bg-emerald-500 animate-pulse shadow-xs" />
            <span className={isUrdu ? "font-urdu text-base text-foreground/90 font-bold" : "font-semibold text-foreground/90 text-sm"}>
              {isUrdu ? "قرآن و سنت رہنمائی" : "Quran & Sunnah Guidance"}
            </span>
          </div>

          {/* Action buttons (Language Switcher, New Chat, Theme) */}
          <div className="flex items-center gap-1.5 sm:gap-2 ml-auto shrink-0">
            <LanguageToggle />
            <Button
              size="sm"
              variant="outline"
              onClick={handleNewConversation}
              className={`gap-1.5 h-8 sm:h-9 px-2.5 sm:px-3 text-xs sm:text-sm font-medium text-primary border-primary/25 hover:bg-primary/10 rounded-xl shadow-2xs ${
                isUrdu ? "font-urdu text-sm" : ""
              }`}
              title={isUrdu ? "نئی گفتگو" : "New Chat"}
            >
              <Plus className="size-4 shrink-0" />
              <span className="hidden sm:inline">{isUrdu ? "نئی گفتگو" : "New Chat"}</span>
            </Button>
            <ThemeToggle />
          </div>
        </header>

        {/* Mobile Slide-Out Drawer Overlay & Panel */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
              onClick={() => setMobileOpen(false)}
            />

            {/* Panel */}
            <div className="relative flex flex-col h-full w-80 max-w-[85vw] bg-sidebar text-sidebar-foreground border-r border-sidebar-border shadow-2xl z-10">
              <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
                <Logo withWordmark size={30} />
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  className="size-9 rounded-xl"
                >
                  <X className="size-5" />
                </Button>
              </div>

              <nav className="space-y-1.5 p-3.5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.to || (item.to === "/chat" && pathname.startsWith("/chat"));
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                        active
                          ? "bg-primary text-primary-foreground shadow-xs"
                          : "text-sidebar-foreground hover:bg-sidebar-accent"
                      }`}
                    >
                      <Icon className="size-5" />
                      <span className={isUrdu ? "font-urdu text-[1.15rem]" : "text-sm"}>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="flex flex-1 min-h-0 flex-col border-t border-sidebar-border mt-2">
                <div className="flex items-center justify-between px-3.5 pt-3 pb-2">
                  <span className={`text-[11px] font-semibold uppercase tracking-wider text-muted-foreground ${isUrdu ? "font-urdu text-xs" : ""}`}>
                    {isUrdu ? "گفتگو کی تاریخ" : "Conversations"}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleNewConversation}
                    className={`h-7 gap-1 px-2 text-xs text-primary ${isUrdu ? "font-urdu" : ""}`}
                  >
                    <Plus className="size-3.5" />
                    <span>{isUrdu ? "نئی" : "New"}</span>
                  </Button>
                </div>

                <div className="flex-1 overflow-y-auto px-2.5 pb-3 space-y-1">
                  {threads.length === 0 && (
                    <p className={`px-3 py-4 text-xs text-muted-foreground text-center ${isUrdu ? "font-urdu text-sm" : ""}`}>
                      {isUrdu ? "ابھی تک کوئی گفتگو محفوظ نہیں ہوئی۔" : "No saved conversations yet."}
                    </p>
                  )}
                  {threads.map((t) => {
                    const active = threadId === t.id;
                    return (
                      <div
                        key={t.id}
                        className={`group flex items-center justify-between rounded-xl pr-1 text-sm ${
                          active
                            ? "bg-sidebar-accent font-medium text-foreground"
                            : "text-sidebar-foreground hover:bg-sidebar-accent/60"
                        }`}
                      >
                        <Link
                          to="/chat/$threadId"
                          params={{ threadId: t.id }}
                          onClick={() => setMobileOpen(false)}
                          className="flex-1 min-w-0 px-3 py-2.5 truncate"
                        >
                          <span>{t.title}</span>
                          {t.mood && (
                            <span className="ml-2 text-[10px] uppercase tracking-wide text-gold">
                              {t.mood}
                            </span>
                          )}
                        </Link>
                        <button
                          aria-label="Delete conversation"
                          onClick={(e) => handleRemoveThread(t.id, e)}
                          className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-3.5 border-t border-sidebar-border flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-medium">Quran Companion AI</span>
                <ThemeToggle />
              </div>
            </div>
          </div>
        )}

        {/* Main View Container */}
        <main className="flex-1 min-h-0 h-full overflow-hidden">{children}</main>
      </div>
    </div>
  );
}
