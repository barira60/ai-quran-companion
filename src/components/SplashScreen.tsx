import logo from "@/assets/logo.png";
import { useEffect, useState } from "react";

export function SplashScreen() {
  const [shouldRender, setShouldRender] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Only show once per session on cold start
    const alreadyShown = sessionStorage.getItem("qc.splash-shown");
    if (alreadyShown) {
      return;
    }

    // Mark as shown immediately and start splash lifecycle
    sessionStorage.setItem("qc.splash-shown", "true");
    setShouldRender(true);

    const fadeTimer = setTimeout(() => {
      setFading(true);
      const removeTimer = setTimeout(() => {
        setShouldRender(false);
      }, 600);
      return () => clearTimeout(removeTimer);
    }, 1300);

    return () => clearTimeout(fadeTimer);
  }, []);

  if (!shouldRender) return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-between bg-[#3e9b77] dark:bg-[#0b1b15] px-6 py-10 sm:py-14 select-none transition-all duration-600 ease-out ${
        fading ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100 pointer-events-auto"
      }`}
      style={{
        backgroundImage: `radial-gradient(circle at 50% 38%, rgba(255, 255, 255, 0.18), transparent 65%), radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.08) 1px, transparent 0)`,
        backgroundSize: "100% 100%, 24px 24px",
      }}
    >
      {/* Top spacer for mobile safe area */}
      <div className="w-full pt-[calc(1.2rem+env(safe-area-inset-top,0px))]" />

      {/* Center Logo & Title */}
      <div className="flex flex-col items-center text-center my-auto space-y-4 sm:space-y-5 animate-in fade-in zoom-in-95 duration-400">
        <div className="relative">
          <img
            src={logo}
            alt="قرآن و سنت رہنمائی"
            width={120}
            height={120}
            className="size-28 sm:size-32 object-contain drop-shadow-2xl"
          />
        </div>

        <div className="space-y-1 pt-1.5">
          <h1 className="font-urdu text-3xl sm:text-4xl font-bold text-white tracking-wide drop-shadow-md">
            قرآن و سنت رہنمائی
          </h1>
          <p className="text-[11px] sm:text-xs font-semibold tracking-widest text-white/90 uppercase font-sans">
            AI Quran & Sunnah Companion
          </p>
        </div>

        {/* Subtle 3-dot pulse indicator */}
        <div className="flex items-center gap-1.5 pt-2">
          <span className="size-1.5 rounded-full bg-white/80 animate-bounce [animation-delay:-0.3s]" />
          <span className="size-1.5 rounded-full bg-white/80 animate-bounce [animation-delay:-0.15s]" />
          <span className="size-1.5 rounded-full bg-white/80 animate-bounce" />
        </div>
      </div>

      {/* Bottom Tagline */}
      <div className="w-full text-center pb-[calc(1.2rem+env(safe-area-inset-bottom,0px))]">
        <p className="font-urdu text-base sm:text-lg text-white/95 font-medium tracking-wide drop-shadow-sm">
          قرآن سے جڑیں، سمجھیں، غور کریں۔
        </p>
      </div>
    </div>
  );
}

