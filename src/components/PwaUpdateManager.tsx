import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Sparkles, X } from "lucide-react";
import { useLanguage } from "@/lib/language-store";

export function PwaUpdateManager() {
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const [showReload, setShowReload] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [appLang] = useLanguage();
  const isUrdu = appLang === "ur";

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    let refreshing = false;

    // Reload page when new service worker takes over control
    const onControllerChange = () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    };

    navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);

    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        // 1. If there's already a waiting worker, prompt user
        if (registration.waiting) {
          setWaitingWorker(registration.waiting);
          setShowReload(true);
        }

        // 2. Listen for newly detected updates
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (!newWorker) return;

          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              // New update installed and waiting to activate
              setWaitingWorker(newWorker);
              setShowReload(true);
            }
          });
        });

        // 3. Actively check for updates when returning to app / tab focus
        const checkForUpdate = () => {
          if (navigator.onLine) {
            registration.update().catch(() => {});
          }
        };

        const onVisibilityChange = () => {
          if (document.visibilityState === "visible") {
            checkForUpdate();
          }
        };

        window.addEventListener("focus", checkForUpdate);
        document.addEventListener("visibilitychange", onVisibilityChange);

        // 4. Periodic background check every 3 minutes
        const intervalId = setInterval(checkForUpdate, 3 * 60 * 1000);

        return () => {
          window.removeEventListener("focus", checkForUpdate);
          document.removeEventListener("visibilitychange", onVisibilityChange);
          clearInterval(intervalId);
        };
      })
      .catch((err) => {
        console.warn("ServiceWorker registration error:", err);
      });

    return () => {
      navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
    };
  }, []);

  const handleUpdate = () => {
    setIsUpdating(true);
    if (waitingWorker) {
      waitingWorker.postMessage({ type: "SKIP_WAITING" });
    } else {
      // Fallback reload
      window.location.reload();
    }
  };

  if (!showReload) return null;

  return (
    <div
      dir={isUrdu ? "rtl" : "ltr"}
      className="fixed bottom-5 left-4 right-4 sm:left-auto sm:right-5 sm:max-w-md z-[99998] animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="bg-card/95 backdrop-blur-lg border-2 border-primary/40 rounded-2xl p-4 shadow-2xl flex items-start gap-3.5">
        <div className="p-2.5 rounded-xl bg-primary/15 text-primary shrink-0 mt-0.5 animate-pulse">
          <Sparkles className="size-5" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className={`text-sm font-bold text-foreground ${isUrdu ? "font-urdu text-base" : ""}`}>
              {isUrdu ? "نیا ورژن دستیاب ہے!" : "Update Available!"}
            </h4>
            <button
              onClick={() => setShowReload(false)}
              className="text-muted-foreground hover:text-foreground p-1 rounded-lg transition-colors shrink-0"
              aria-label="Dismiss"
            >
              <X className="size-4" />
            </button>
          </div>

          <p className={`text-xs text-muted-foreground mt-1 leading-relaxed ${isUrdu ? "font-urdu text-xs leading-[1.8]" : ""}`}>
            {isUrdu
              ? "ایپ کا نیا ورژن تیار ہے۔ تازہ ترین فیچرز اور بہتری کے لیے ابھی اپ ڈیٹ کریں۔"
              : "A new version of Quran Companion is ready. Update now for the latest features & improvements."}
          </p>

          <div className="flex items-center gap-2 mt-3.5">
            <Button
              size="sm"
              onClick={handleUpdate}
              disabled={isUpdating}
              className={`h-8 px-3.5 gap-1.5 text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs ${
                isUrdu ? "font-urdu text-xs" : ""
              }`}
            >
              <RefreshCw className={`size-3.5 ${isUpdating ? "animate-spin" : ""}`} />
              <span>{isUpdating ? (isUrdu ? "اپ ڈیٹ ہو رہا ہے..." : "Updating...") : (isUrdu ? "ابھی اپ ڈیٹ کریں" : "Update Now")}</span>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowReload(false)}
              className={`h-8 px-2.5 text-xs text-muted-foreground ${isUrdu ? "font-urdu text-xs" : ""}`}
            >
              {isUrdu ? "بعد میں" : "Later"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
