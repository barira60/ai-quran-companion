import { Button } from "@/components/ui/button";
import { addLocalFavorite } from "@/lib/local-store";
import { useLanguage } from "@/lib/language-store";
import { BookmarkPlus, ExternalLink, Pause, Play, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export interface AyahData {
  surah: number;
  ayah: number;
  name?: string;
  arabic?: string;
  translation?: string;
  urduTranslation?: string;
  explanation?: string;
}

export interface AyahCardProps {
  data: AyahData;
  isUrdu?: boolean;
  onRemove?: () => void;
}

function audioUrl(data: AyahData): string {
  const pad = (n: number) => String(n).padStart(3, "0");
  return `https://everyayah.com/data/Alafasy_128kbps/${pad(data.surah)}${pad(data.ayah)}.mp3`;
}

// Arabic-Indic numerals for the ayah marker
function toArabicDigits(n: number) {
  return String(n).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[Number(d)]);
}

const ayahCache = new Map<
  string,
  { arabic: string; enTranslation: string; urTranslation: string; name?: string }
>();

export function AyahCard({ data, isUrdu, onRemove }: AyahCardProps) {
  const showUrdu =
    isUrdu !== undefined
      ? isUrdu
      : data.translation
        ? /[\u0600-\u06FF]/.test(data.translation)
        : Boolean(data.urduTranslation);
  const [playing, setPlaying] = useState(false);
  const [verifiedArabic, setVerifiedArabic] = useState<string>(data.arabic ?? "");
  const [verifiedEnTranslation, setVerifiedEnTranslation] = useState<string>(data.translation ?? "");
  const [verifiedUrTranslation, setVerifiedUrTranslation] = useState<string>(data.urduTranslation ?? "");
  const [surahName, setSurahName] = useState<string>(data.name ?? `Surah ${data.surah}`);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (data.arabic && !verifiedArabic) setVerifiedArabic(data.arabic);
    if (data.translation && !verifiedEnTranslation) setVerifiedEnTranslation(data.translation);
    if (data.urduTranslation && !verifiedUrTranslation) setVerifiedUrTranslation(data.urduTranslation);
    if (data.name && (!surahName || surahName.startsWith("Surah "))) setSurahName(data.name);
  }, [data.arabic, data.translation, data.urduTranslation, data.name, verifiedArabic, verifiedEnTranslation, verifiedUrTranslation, surahName]);

  useEffect(() => {
    if (!data.surah || !data.ayah) return;

    const cacheKey = `${data.surah}:${data.ayah}`;
    const cached = ayahCache.get(cacheKey);
    if (cached) {
      if (cached.arabic) setVerifiedArabic(cached.arabic);
      if (cached.enTranslation) setVerifiedEnTranslation(cached.enTranslation);
      if (cached.urTranslation) setVerifiedUrTranslation(cached.urTranslation);
      if (cached.name) setSurahName(cached.name);
      return;
    }

    let isMounted = true;
    fetch(
      `https://api.alquran.cloud/v1/ayah/${data.surah}:${data.ayah}/editions/quran-uthmani,en.sahih,ur.jalandhry`
    )
      .then((res) => res.json())
      .then((json) => {
        if (!isMounted || !json?.data || !Array.isArray(json.data)) return;
        const uthmani = json.data[0]?.text;
        const sahih = json.data[1]?.text?.replace(/\"$/, "").trim();
        const jalandhry = json.data[2]?.text?.replace(/\"$/, "").trim();
        const engName = json.data[0]?.surah?.englishName;

        const entry = {
          arabic: uthmani || data.arabic || "",
          enTranslation: sahih || data.translation || "",
          urTranslation: jalandhry || data.urduTranslation || "",
          name: engName || data.name || `Surah ${data.surah}`,
        };
        ayahCache.set(cacheKey, entry);

        if (entry.arabic) setVerifiedArabic(entry.arabic);
        if (entry.enTranslation) setVerifiedEnTranslation(entry.enTranslation);
        if (entry.urTranslation) setVerifiedUrTranslation(entry.urTranslation);
        if (entry.name) setSurahName(entry.name);
      })
      .catch((err) => {
        console.warn("Quran API sync note:", err);
      });

    return () => {
      isMounted = false;
    };
  }, [data.surah, data.ayah]);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  const toggle = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl(data));
      audioRef.current.onended = () => setPlaying(false);
    }
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().catch(() => toast.error("Could not play audio"));
      setPlaying(true);
    }
  };

  const currentTranslation = showUrdu
    ? verifiedUrTranslation || data.urduTranslation || (data.translation && /[\u0600-\u06FF]/.test(data.translation) ? data.translation : "") || verifiedEnTranslation || data.translation
    : verifiedEnTranslation || (data.translation && !/[\u0600-\u06FF]/.test(data.translation) ? data.translation : "") || data.translation || verifiedUrTranslation;

  const saveFav = () => {
    try {
      addLocalFavorite({
        surah_number: data.surah,
        ayah_number: data.ayah,
        surah_name: surahName,
        arabic: verifiedArabic || data.arabic,
        translation: currentTranslation || "",
      });
      toast.success("Saved to favorites");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save");
    }
  };

  const quranComUrl = `https://quran.com/${data.surah}/${data.ayah}`;

  return (
    <div className="my-4 overflow-hidden rounded-2xl sm:rounded-3xl border-2 border-primary/30 dark:border-primary/40 bg-card shadow-md shadow-primary/5 ring-1 ring-gold/25 transition-all">
      <div className="flex items-center justify-between gap-2 border-b border-primary/15 bg-gradient-to-r from-primary/10 via-primary/5 to-gold/10 px-3.5 py-2.5 sm:px-5 sm:py-3">
        <a
          href={quranComUrl}
          target="_blank"
          rel="noopener noreferrer"
          title={`Open ${surahName} ${data.surah}:${data.ayah} on Quran.com`}
          className="group/link flex min-w-0 items-center gap-2 truncate text-xs font-semibold text-primary hover:underline sm:text-sm"
        >
          <span className="inline-flex size-2 rounded-full bg-primary shrink-0 animate-pulse" />
          <span className="font-serif tracking-tight">{surahName}</span>
          <span className="text-primary/40">·</span>
          <span className="tabular-nums px-1.5 py-0.5 rounded-md bg-primary/10 font-bold">
            {data.surah}:{data.ayah}
          </span>
          <ExternalLink className="size-3 text-primary/60 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
        </a>
        <div className="flex shrink-0 items-center gap-1.5">
          <Button
            size="sm"
            variant="ghost"
            onClick={toggle}
            aria-label={playing ? "Pause recitation" : "Play recitation"}
            title="Listen to recitation"
            className={`h-8 gap-1.5 px-2.5 rounded-lg text-xs font-medium transition-colors ${
              playing ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-primary/10 text-primary hover:bg-primary/20"
            }`}
          >
            {playing ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
            <span className="hidden xs:inline">{playing ? (showUrdu ? "روکیں" : "Pause") : (showUrdu ? "تلاوت سنیں" : "Recite")}</span>
          </Button>
          {onRemove ? (
            <Button
              size="icon-sm"
              variant="ghost"
              onClick={onRemove}
              aria-label="Remove from favorites"
              className="size-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="size-4" />
            </Button>
          ) : (
            <Button
              size="icon-sm"
              variant="ghost"
              onClick={saveFav}
              aria-label="Save to favorites"
              title="Save to favorites"
              className="size-8 rounded-lg text-muted-foreground hover:text-gold hover:bg-gold/10"
            >
              <BookmarkPlus className="size-4" />
            </Button>
          )}
        </div>
      </div>

      {(verifiedArabic || data.arabic) && (
        <div dir="rtl" lang="ar" className="px-5 pt-6 pb-2 sm:px-8 sm:pt-8">
          <p className="arabic text-foreground font-semibold">
            {verifiedArabic || data.arabic}
            <span className="mx-2 inline-block align-middle font-arabic text-[0.8em] text-gold font-normal">
              ﴿{toArabicDigits(data.ayah)}﴾
            </span>
          </p>
        </div>
      )}

      {currentTranslation && (
        <div className="px-5 pb-3 pt-3 sm:px-8 sm:pb-4 border-t border-primary/10 bg-primary/[0.02]" dir={showUrdu ? "rtl" : "ltr"}>
          {showUrdu ? (
            <p className="urdu text-foreground font-urdu font-medium text-[1.5rem] sm:text-[1.65rem] leading-[2.5] sm:leading-[2.7] text-right">
              {currentTranslation}
            </p>
          ) : (
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base text-left font-sans">
              {currentTranslation}
            </p>
          )}
          <div className="mt-2 flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
            <span className={showUrdu ? "font-urdu text-xs sm:text-sm font-semibold" : "font-semibold"}>{showUrdu ? "ترجمہ:" : "Translation:"}</span>
            <span className={`font-medium text-foreground/80 ${showUrdu ? "font-urdu text-xs sm:text-sm" : ""}`}>
              {showUrdu ? "فتح محمد جالندھری (اردو)" : "Saheeh International (English)"}
            </span>
          </div>
        </div>
      )}

      {data.explanation && (
        <div
          dir={showUrdu ? "rtl" : "ltr"}
          className="mx-3.5 mb-4 mt-2 rounded-2xl border border-primary/20 bg-primary/[0.06] p-3.5 sm:mx-6 sm:mb-5 sm:p-4.5 shadow-2xs"
        >
          <div className={`mb-1.5 flex items-center gap-1.5 font-bold text-primary ${showUrdu ? "font-urdu text-sm sm:text-base text-right justify-start" : "text-xs uppercase tracking-wider font-sans"}`}>
            <span className="inline-block size-1.5 rounded-full bg-primary" />
            {showUrdu ? "آسان قرآنی مفہوم و رہنمائی" : "In Simple Words & Guidance"}
          </div>
          <p className={showUrdu ? "urdu text-foreground text-[1.32rem] sm:text-[1.45rem] font-urdu leading-[2.35] sm:leading-[2.5] text-right" : "text-sm leading-relaxed text-foreground sm:text-base text-left font-sans"}>
            {data.explanation}
          </p>
        </div>
      )}
    </div>
  );
}
