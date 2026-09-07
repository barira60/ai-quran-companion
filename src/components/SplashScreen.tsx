import { QuranLogo } from "@/components/QuranLogo";
import { useEffect, useState } from "react";

export function SplashScreen() {
  const [shouldRender, setShouldRender] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Display splash screen first, then smoothly transition into the app content
    const fadeTimer = setTimeout(() => {
      setFading(true);
      const removeTimer = setTimeout(() => {
        setShouldRender(false);
      }, 600);
      return () => clearTimeout(removeTimer);
    }, 1400);

    return () => clearTimeout(fadeTimer);
  }, []);

  if (!shouldRender) return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-between bg-[#0b1b15] px-6 py-10 sm:py-14 select-none transition-all duration-600 ease-out ${
        fading ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100 pointer-events-auto"
      }`}
      style={{
        backgroundImage: `radial-gradient(circle at 50% 38%, rgba(16, 185, 129, 0.16), transparent 65%), radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.05) 1px, transparent 0)`,
        backgroundSize: "100% 100%, 24px 24px",
      }}
    >
      {/* Top spacer for mobile safe area */}
      <div className="w-full pt-[calc(1.2rem+env(safe-area-inset-top,0px))]" />

      {/* Center Logo & Title */}
      <div className="flex flex-col items-center text-center my-auto space-y-4 sm:space-y-5 animate-in fade-in zoom-in-95 duration-400">
        <div className="relative text-white drop-shadow-2xl">
          <QuranLogo size={112} className="size-28 sm:size-32" />
        </div>

        <div className="space-y-1.5 pt-1.5 flex flex-col items-center" dir="rtl">
          <h1 className="font-urdu text-3xl sm:text-4xl font-bold text-white tracking-normal leading-[1.8] drop-shadow-md">
            قرآن و سنت سے رہنمائی
          </h1>
          <p className="text-[11px] sm:text-xs font-semibold tracking-widest text-white/90 uppercase font-sans" dir="ltr">
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
      <div className="w-full text-center pb-[calc(1.2rem+env(safe-area-inset-bottom,0px))] space-y-1">
        <p className="font-urdu text-base sm:text-lg text-white/95 font-normal tracking-normal leading-[1.9] drop-shadow-sm" dir="rtl">
          قرآن سے جڑیں، سمجھیں، غور کریں۔
        </p>
        <p className="text-[10px] sm:text-[11px] font-medium tracking-[0.2em] text-emerald-200/80 uppercase font-sans" dir="ltr">
          Connect • Understand • Reflect
        </p>
      </div>
    </div>
  );
}

