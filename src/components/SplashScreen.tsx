import logo from "@/assets/logo.png";
import { useEffect, useState } from "react";

export function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Check if splash was already shown in this session
    const shown = typeof window !== "undefined" && window.sessionStorage.getItem("qc.splash-shown");
    if (shown) {
      setVisible(false);
      return;
    }

    const timer = setTimeout(() => {
      setFading(true);
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem("qc.splash-shown", "true");
      }
      const exitTimer = setTimeout(() => {
        setVisible(false);
      }, 700);
      return () => clearTimeout(exitTimer);
    }, 1400);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-between bg-[#4ea884] dark:bg-[#0e271f] px-6 py-10 sm:py-14 select-none transition-all duration-700 ease-out ${
        fading ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100"
      }`}
      style={{
        backgroundImage: `radial-gradient(circle at 50% 35%, rgba(255, 255, 255, 0.15), transparent 70%), radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.08) 1px, transparent 0)`,
        backgroundSize: "100% 100%, 28px 28px",
      }}
    >
      {/* Top spacer for safe area */}
      <div className="w-full pt-[calc(1rem+env(safe-area-inset-top,0px))]" />

      {/* Center Logo & Titles */}
      <div className="flex flex-col items-center text-center my-auto space-y-4 sm:space-y-5 animate-in fade-in zoom-in-95 duration-500">
        {/* Animated App Icon */}
        <div className="relative group">
          <div className="absolute -inset-2 rounded-3xl bg-white/20 blur-md transition group-hover:blur-lg" />
          <img
            src={logo}
            alt="قرآن و سنت رہنمائی"
            width={120}
            height={120}
            className="relative size-24 sm:size-28 rounded-2xl sm:rounded-3xl shadow-2xl object-cover ring-2 ring-white/30"
          />
        </div>

        {/* App Title in Urdu & English */}
        <div className="space-y-1 pt-2">
          <h1 className="font-urdu text-3xl sm:text-4xl font-bold text-white tracking-wide drop-shadow-md">
            قرآن و سنت رہنمائی
          </h1>
          <p className="text-xs sm:text-sm font-medium tracking-wider text-white/90 uppercase">
            AI Quran & Sunnah Companion
          </p>
        </div>

        {/* Subtle Minimal Loader */}
        <div className="flex items-center gap-1.5 pt-3">
          <span className="size-1.5 rounded-full bg-white/70 animate-bounce [animation-delay:-0.3s]" />
          <span className="size-1.5 rounded-full bg-white/70 animate-bounce [animation-delay:-0.15s]" />
          <span className="size-1.5 rounded-full bg-white/70 animate-bounce" />
        </div>
      </div>

      {/* Bottom Tagline */}
      <div className="w-full text-center pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
        <p className="font-urdu text-base sm:text-lg text-white/95 font-medium tracking-wide drop-shadow-sm">
          قرآن سے جڑیں، سمجھیں، غور کریں۔
        </p>
      </div>
    </div>
  );
}
