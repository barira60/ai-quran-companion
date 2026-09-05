import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Sparkles, X } from "lucide-react";
import { useLanguage } from "@/lib/language-store";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export function InstallPwaPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [appLang] = useLanguage();
  const isUrdu = appLang === "ur";

  useEffect(() => {
    // Check if running in standalone mode (already installed)
    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true
    ) {
      setIsInstalled(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const installedHandler = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", installedHandler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", installedHandler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === "accepted") {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  if (isInstalled || isDismissed || !deferredPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 left-4 sm:left-auto sm:w-96 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-card/95 backdrop-blur-md border border-primary/30 rounded-xl p-4 shadow-xl flex items-start gap-3">
        <div className="p-2.5 rounded-lg bg-primary/10 text-primary shrink-0">
          <Sparkles className="size-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className={`text-sm font-semibold text-foreground ${isUrdu ? "font-urdu text-base" : ""}`}>
            {isUrdu ? "ایپ انسٹال کریں" : "Install Quran Companion"}
          </h4>
          <p className={`text-xs text-muted-foreground mt-0.5 leading-relaxed ${isUrdu ? "font-urdu text-xs" : ""}`}>
            {isUrdu
              ? "موبائل ایپ کی طرح استعمال کریں اور بغیر براؤزر بار کے چلائیں۔"
              : "Install as an app on your phone for quick access and full-screen experience."}
          </p>
          <div className="flex items-center gap-2 mt-3">
            <Button
              size="sm"
              onClick={handleInstallClick}
              className={`h-8 px-3 gap-1.5 text-xs bg-primary text-primary-foreground hover:bg-primary/90 ${
                isUrdu ? "font-urdu" : ""
              }`}
            >
              <Download className="size-3.5" />
              <span>{isUrdu ? "ابھی انسٹال کریں" : "Install App"}</span>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsDismissed(true)}
              className="h-8 px-2.5 text-xs text-muted-foreground"
            >
              {isUrdu ? "بعد میں" : "Later"}
            </Button>
          </div>
        </div>
        <button
          onClick={() => setIsDismissed(true)}
          className="text-muted-foreground hover:text-foreground p-1 rounded-md transition-colors"
          aria-label="Close"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}
