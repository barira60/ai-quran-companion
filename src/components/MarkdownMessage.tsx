import { AyahCard, type AyahData } from "@/components/AyahCard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  BookOpen,
  CheckCircle2,
  ExternalLink,
  HandHeart,
  Heart,
  HelpCircle,
  Sparkle,
} from "lucide-react";
import type { ReactNode } from "react";
import ReactMarkdown from "react-markdown";

type SectionMeta = { title: string; icon?: string };

const ICONS: Record<string, ReactNode> = {
  heart: <Heart className="size-4 text-primary shrink-0" />,
  sparkle: <Sparkle className="size-4 text-gold shrink-0" />,
  book: <BookOpen className="size-4 text-primary shrink-0" />,
  hands: <HandHeart className="size-4 text-gold shrink-0" />,
  check: <CheckCircle2 className="size-4 text-primary shrink-0" />,
  question: <HelpCircle className="size-4 text-muted-foreground shrink-0" />,
};

function safeParse<T>(raw: string): T | null {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

// Split text into ordered chunks: plain markdown, ayah blocks, section blocks.
type Chunk =
  | { kind: "md"; text: string }
  | { kind: "ayah"; data: AyahData; raw: string }
  | { kind: "ayah_loading" }
  | { kind: "section"; meta: SectionMeta; body: string; index: number };

function cleanMessageText(raw: string): string {
  return raw
    .replace(/<\|tool_call_start\|>[\s\S]*?(?:<\|tool_call_end\|>|$)/gi, "")
    .replace(/\[\s*(?:quran_com|sunnah_com)\([\s\S]*?\)\s*\]/gi, "")
    .replace(/<\|(?:im_start|im_end|tool_call_start|tool_call_end)\b[^>]*>/gi, "")
    .trim();
}

function parsePartialAyahData(raw: string): AyahData | null {
  const parsed = safeParse<AyahData>(raw);
  if (parsed && typeof parsed.surah === "number" && typeof parsed.ayah === "number") {
    return parsed;
  }
  const surahMatch = raw.match(/"surah"\s*:\s*(\d+)/i);
  const ayahMatch = raw.match(/"ayah"\s*:\s*(\d+)/i);
  if (!surahMatch || !ayahMatch) return null;

  const extractString = (key: string): string | undefined => {
    const re = new RegExp(`"${key}"\\s*:\\s*"((?:[^"\\\\]|\\\\.)*)`, "i");
    const m = raw.match(re);
    if (!m) return undefined;
    try {
      return JSON.parse(`"${m[1]}"`) as string;
    } catch {
      return m[1].replace(/\\n/g, "\n").replace(/\\"/g, '"').replace(/\\\\/g, "\\");
    }
  };

  return {
    surah: parseInt(surahMatch[1], 10),
    ayah: parseInt(ayahMatch[1], 10),
    name: extractString("name"),
    arabic: extractString("arabic"),
    translation: extractString("translation"),
    urduTranslation: extractString("urduTranslation"),
    explanation: extractString("explanation"),
  };
}

function splitChunks(rawText: string): Chunk[] {
  const text = cleanMessageText(rawText);
  const chunks: Chunk[] = [];
  const re = /```(ayah|section)\n([\s\S]*?)(?:```|$)/g;
  let lastIndex = 0;
  let sectionIdx = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > lastIndex) {
      const md = text.slice(lastIndex, m.index).trim();
      if (md) chunks.push({ kind: "md", text: md });
    }
    const lang = m[1];
    const inner = m[2].trim();
    if (lang === "ayah") {
      const data = parsePartialAyahData(inner);
      if (data) {
        chunks.push({ kind: "ayah", data, raw: inner });
      } else {
        chunks.push({ kind: "ayah_loading" });
      }
    } else {
      // section: first line is JSON meta, rest is markdown body
      const nl = inner.indexOf("\n");
      const head = nl === -1 ? inner : inner.slice(0, nl);
      const body = nl === -1 ? "" : inner.slice(nl + 1).trim();
      const meta = safeParse<SectionMeta>(head);
      if (meta?.title) {
        chunks.push({ kind: "section", meta, body, index: sectionIdx++ });
      }
    }
    lastIndex = re.lastIndex;
  }
  if (lastIndex < text.length) {
    const md = text.slice(lastIndex).trim();
    if (md) chunks.push({ kind: "md", text: md });
  }
  return chunks;
}

const TITLE_MAP_URDU: Record<string, string> = {
  "why this helps": "یہ کیوں مددگار ہے",
  "reflection": "غور و فکر",
  "reflections": "غور و فکر",
  "authentic hadith": "مستند حدیث",
  "hadith": "مستند حدیث",
  "dua": "مسنون دعا",
  "duas": "مسنون دعائیں",
  "supplication": "مسنون دعا",
  "masnoon dua": "مسنون دعا",
  "practical steps": "عملی اقدامات",
  "actionable steps": "عملی اقدامات",
  "reflect on this": "غور فرمائیں",
  "questions to ponder": "غور فرمائیں",
  "یہ کیوں مددگار ہے": "یہ کیوں مددگار ہے",
  "غور و فکر": "غور و فکر",
  "مستند حدیث": "مستند حدیث",
  "حدیث": "مستند حدیث",
  "مسنون دعا": "مسنون دعا",
  "مسنون دعائیں": "مسنون دعائیں",
  "دعا": "مسنون دعا",
  "عملی اقدامات": "عملی اقدامات",
  "غور فرمائیں": "غور فرمائیں",
};

const TITLE_MAP_ENGLISH: Record<string, string> = {
  "why this helps": "Why this helps",
  "reflection": "Reflection",
  "reflections": "Reflection",
  "authentic hadith": "Authentic Hadith",
  "hadith": "Authentic Hadith",
  "dua": "Dua",
  "duas": "Dua",
  "supplication": "Dua",
  "masnoon dua": "Dua",
  "practical steps": "Practical Steps",
  "actionable steps": "Practical Steps",
  "reflect on this": "Reflect on this",
  "questions to ponder": "Reflect on this",
  "یہ کیوں مددگار ہے": "Why this helps",
  "غور و فکر": "Reflection",
  "مستند حدیث": "Authentic Hadith",
  "حدیث": "Authentic Hadith",
  "مسنون دعا": "Dua",
  "مسنون دعائیں": "Dua",
  "دعا": "Dua",
  "عملی اقدامات": "Practical Steps",
  "غور فرمائیں": "Reflect on this",
  "سوالات برائے غور": "Reflect on this",
};

function getDisplayTitle(title: string, isUrdu: boolean): string {
  const clean = title.trim();
  const lower = clean.toLowerCase();
  if (isUrdu) {
    return TITLE_MAP_URDU[lower] || TITLE_MAP_URDU[clean] || clean;
  }
  return TITLE_MAP_ENGLISH[clean] || TITLE_MAP_ENGLISH[lower] || clean;
}

export function detectMessageLanguage(text: string): "ur" | "en" {
  // Strip out Arabic verses, Arabic dua lines, and code block formatting
  const strippedText = text
    .replace(/"arabic"\s*:\s*"[^"]*"/g, "")
    .replace(/\*\*Arabic:\*\*[\s\S]*?(?=\n\*\*|$)/gi, "");

  const latinCount = (strippedText.match(/[a-zA-Z]/g) || []).length;
  const urduCount = (strippedText.match(/[\u0600-\u06FF]/g) || []).length;

  return urduCount > latinCount && urduCount > 10 ? "ur" : "en";
}

function isTextUrdu(text: string): boolean {
  const arabicUrduChars = (text.match(/[\u0600-\u06FF]/g) || []).length;
  const latinChars = (text.match(/[a-zA-Z]/g) || []).length;
  return arabicUrduChars > latinChars && arabicUrduChars > 5;
}

function resolveSourceLink(rawText: string): { label: string; url?: string; siteName?: "Quran.com" | "Sunnah.com" | "Source" } {
  let raw = rawText.trim();

  // Strip leading/trailing headers like **حوالہ:**, **ماخذ:**, **Source:**, **Reference:** or —
  raw = raw.replace(/^\s*(?:—|-|\*\*|\*)*\s*(?:Source|Reference|حوالہ|ماخذ|ماخذ کی قسم)\s*(?::|：)?\s*(?:\*\*|\*)?\s*/i, "").trim();
  // Also strip any internal **حوالہ:** or duplicate bold markers
  raw = raw.replace(/\*\*(?:Source|Reference|حوالہ|ماخذ):\*\*\s*/gi, "").trim();

  // Check for markdown link: [text](https://...)
  const mdLinkMatch = raw.match(/\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)/);
  let directUrl: string | undefined;
  if (mdLinkMatch) {
    directUrl = mdLinkMatch[2];
    raw = raw.replace(mdLinkMatch[0], "").trim();
  } else {
    const rawUrlMatch = raw.match(/(https?:\/\/[^\s)]+)/);
    if (rawUrlMatch) {
      directUrl = rawUrlMatch[1];
      raw = raw.replace(directUrl, "").trim();
    }
  }

  // Clean trailing and leading punctuation / dashes from label
  const cleanLabel = raw.replace(/[—–\-:()]\s*$/, "").replace(/^[—–\-:()]\s*/, "").trim();

  if (directUrl) {
    const isQuran = directUrl.includes("quran.com");
    const isSunnah = directUrl.includes("sunnah.com");
    return {
      label: cleanLabel || rawText.trim(),
      url: directUrl,
      siteName: isQuran ? "Quran.com" : isSunnah ? "Sunnah.com" : "Source",
    };
  }

  // Check for Quran verse reference: e.g. "Al-Baqarah 2:201", "Surah 2:201", "2:201", "سورۃ البقرۃ 2:201"
  const quranMatch = cleanLabel.match(/(?:(?:Surah|سورۃ|سورہ)\s+)?(?:[A-Za-z'-]+\s+)?(\d{1,3}):(\d{1,3})/i);
  if (quranMatch) {
    const surah = parseInt(quranMatch[1], 10);
    const ayah = parseInt(quranMatch[2], 10);
    if (surah >= 1 && surah <= 114) {
      return {
        label: cleanLabel,
        url: `https://quran.com/${surah}/${ayah}`,
        siteName: "Quran.com",
      };
    }
  }

  // Check for Hadith collection reference: e.g. "Sahih al-Bukhari 6389", "Sahih Muslim 2707", "Tirmidhi 3505", etc.
  const hadithCollections: Array<{ pattern: RegExp; prefix: string }> = [
    { pattern: /(?:Sahih\s+)?(?:al-)?bukhari\s*(\d+[a-z]?)|صحیح\s*البخاری\s*(\d+[a-z]?)/i, prefix: "bukhari" },
    { pattern: /(?:Sahih\s+)?muslim\s*(\d+[a-z]?)|صحیح\s*مسلم\s*(\d+[a-z]?)/i, prefix: "muslim" },
    { pattern: /(?:Jami['`]?\s+)?(?:at-)?tirmidhi\s*(\d+[a-z]?)|جامع\s*الترمذی\s*(\d+[a-z]?)|ترمذی\s*(\d+[a-z]?)/i, prefix: "tirmidhi" },
    { pattern: /(?:Sunan\s+)?(?:Abi|Abu)\s*dawud\s*(\d+[a-z]?)|سنن\s*ابی\s*داؤد\s*(\d+[a-z]?)/i, prefix: "abudawud" },
    { pattern: /(?:Sunan\s+)?(?:an-)?nasa['`]?i\s*(\d+[a-z]?)|سنن\s*النسائی\s*(\d+[a-z]?)|نسائی\s*(\d+[a-z]?)/i, prefix: "nasai" },
    { pattern: /(?:Sunan\s+)?ibn\s*majah\s*(\d+[a-z]?)|سنن\s*ابن\s*ماجہ\s*(\d+[a-z]?)|ابن\s*ماجہ\s*(\d+[a-z]?)/i, prefix: "ibnmajah" },
    { pattern: /(?:Muwatta\s+)?malik\s*(\d+[a-z]?)|موطأ\s*مالک\s*(\d+[a-z]?)/i, prefix: "malik" },
    { pattern: /riyad(?:us)?[- ]?salihin\s*(\d+[a-z]?)|ریاض\s*الصالحین\s*(\d+[a-z]?)/i, prefix: "riyadussalihin" },
  ];

  for (const col of hadithCollections) {
    const m = cleanLabel.match(col.pattern);
    if (m) {
      const num = m[1] || m[2];
      if (num) {
        return {
          label: cleanLabel,
          url: `https://sunnah.com/${col.prefix}:${num}`,
          siteName: "Sunnah.com",
        };
      }
    }
  }

  return { label: cleanLabel };
}

function HadithBlock({ text }: { text: string }) {
  const translation = text.match(/\*\*(?:Translation|ترجمہ):\*\*\s*([\s\S]*?)(?=\n\*\*(?:Narrator|راوی)|\n\*\*(?:Book|کتاب)|\n\*\*(?:Source|Reference|حوالہ)|\n\*\*(?:Explanation|وضاحت)|$)/i);
  const narrator = text.match(/\*\*(?:Narrator|راوی):\*\*\s*([\s\S]*?)(?=\n\*\*(?:Book|کتاب)|\n\*\*(?:Source|Reference|حوالہ)|\n\*\*(?:Explanation|وضاحت)|$)/i);
  const book = text.match(/\*\*(?:Book|کتاب):\*\*\s*([\s\S]*?)(?=\n\*\*(?:Source|Reference|حوالہ)|\n\*\*(?:Explanation|وضاحت)|$)/i);
  const source = text.match(/\*\*(?:Source|Reference|حوالہ):\*\*\s*([\s\S]*?)(?=\n\*\*(?:Explanation|وضاحت)|$)/i);
  const explanation = text.match(/\*\*(?:Explanation|وضاحت):\*\*\s*([\s\S]*)/i);

  const translationText = translation?.[1]?.trim() || "";
  const isTranslationUrdu = /[\u0600-\u06FF]/.test(translationText);

  const explanationText = explanation?.[1]?.trim() || "";
  const isExplanationUrdu = /[\u0600-\u06FF]/.test(explanationText);

  const narratorText = narrator?.[1]?.trim() || "";
  const isNarratorUrdu = /[\u0600-\u06FF]/.test(narratorText);

  const isUrduUI = isTranslationUrdu || isExplanationUrdu || isNarratorUrdu || Boolean(text.match(/\*\*(?:ترجمہ|راوی|کتاب|ماخذ|وضاحت):/));

  if (!translation && !source) {
    const isRawUrdu = /[\u0600-\u06FF]/.test(text);
    return (
      <div
        dir={isRawUrdu ? "rtl" : "ltr"}
        className={`prose prose-sm max-w-none dark:prose-invert ${
          isRawUrdu ? "font-urdu text-[1.35rem] leading-[2.6] text-right" : "text-left font-sans"
        }`}
      >
        <ReactMarkdown>{text}</ReactMarkdown>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3.5">
      {translationText && (
        <div
          dir={isTranslationUrdu ? "rtl" : "ltr"}
          className={`px-4 py-3.5 rounded-xl ${
            isTranslationUrdu
              ? "bg-primary/5 border-r-4 border-primary text-right"
              : "bg-primary/5 border-l-4 border-primary text-left"
          }`}
        >
          <p
            className={
              isTranslationUrdu
                ? "urdu text-foreground font-urdu text-[1.42rem] leading-[2.7] whitespace-pre-line"
                : "text-sm sm:text-base leading-relaxed text-foreground whitespace-pre-line italic font-sans"
            }
          >
            "{translationText}"
          </p>
        </div>
      )}
      <div
        className="flex flex-wrap items-center gap-2 text-xs"
        dir={isUrduUI ? "rtl" : "ltr"}
      >
        {narrator && (
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-primary border border-primary/20">
            <span className={isUrduUI ? "font-urdu font-bold text-sm" : "font-bold"}>
              {isUrduUI ? "راوی:" : "Narrated by:"}
            </span>
            <span className={isUrduUI ? "font-urdu text-foreground text-sm" : "text-foreground font-sans"}>
              {narrator[1].trim()}
            </span>
          </div>
        )}
        {book && (
          <div className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-secondary-foreground border">
            <span className={isUrduUI ? "font-urdu font-bold text-sm" : "font-bold"}>
              {isUrduUI ? "کتاب:" : "Book:"}
            </span>
            <span className={isUrduUI ? "font-urdu text-foreground text-sm" : "text-foreground font-sans"}>
              {book[1].trim()}
            </span>
          </div>
        )}
      </div>
      {source && (() => {
        const resolved = resolveSourceLink(source[1]);
        const siteText =
          resolved.siteName === "Quran.com"
            ? (isUrduUI ? "قرآن ڈاٹ کام پر آیت دیکھیں" : "Read on Quran.com")
            : (isUrduUI ? "سنت ڈاٹ کام پر مکمل حدیث پڑھیں" : "Read full on Sunnah.com");

        return (
          <div
            className="flex flex-wrap items-center gap-2 pt-0.5"
            dir={isUrduUI ? "rtl" : "ltr"}
          >
            <span className={isUrduUI ? "font-urdu text-sm font-medium text-muted-foreground" : "text-xs font-medium text-muted-foreground font-sans"}>
              — {resolved.label}
            </span>
            {resolved.url && (
              <a
                href={resolved.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary hover:bg-primary/20 hover:underline transition-colors"
              >
                <span className={isUrduUI ? "font-urdu text-xs" : "font-sans"}>
                  {siteText}
                </span>
                <ExternalLink className="size-3 text-primary/80" />
              </a>
            )}
          </div>
        );
      })()}
      {explanationText && (
        <div
          dir={isExplanationUrdu ? "rtl" : "ltr"}
          className="overflow-hidden rounded-xl border border-primary/20 bg-card shadow-xs"
        >
          <div className="flex items-center gap-2 border-b border-primary/15 bg-primary/10 px-4 py-2.5">
            <Sparkle className="size-4 text-primary shrink-0" />
            <span className={`font-bold text-primary ${isExplanationUrdu ? "font-urdu text-base" : "text-xs uppercase tracking-wider font-sans"}`}>
              {isExplanationUrdu ? "آسان تشریح و رہنمائی" : "Explanation & Guidance"}
            </span>
          </div>
          <div className="p-4">
            <p
              className={
                isExplanationUrdu
                  ? "urdu text-foreground font-urdu text-[1.38rem] leading-[2.6] whitespace-pre-line text-right"
                  : "text-sm sm:text-base leading-relaxed text-foreground whitespace-pre-line text-left font-sans"
              }
            >
              {explanationText}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Render the Dua section with the Quranic font applied to the Arabic line.
function DuaBlock({ text }: { text: string }) {
  const arabicMatch = text.match(/\*\*(?:Arabic|عربی):\*\*\s*([\s\S]*?)(?=\n\*\*(?:Transliteration|تلفظ|رومن)|\n\*\*(?:Meaning|ترجمہ|مفہوم)|\n\*\*(?:From|ماخذ)|\n\*\*(?:Source|Reference|حوالہ)|\n\*\*(?:Explanation|وضاحت|فضیلت)|$)/i);
  const transliterationMatch = text.match(/\*\*(?:Transliteration|تلفظ|رومن):\*\*\s*([\s\S]*?)(?=\n\*\*(?:Meaning|ترجمہ|مفہوم)|\n\*\*(?:From|ماخذ)|\n\*\*(?:Source|Reference|حوالہ)|\n\*\*(?:Explanation|وضاحت|فضیلت)|$)/i);
  const meaningMatch = text.match(/\*\*(?:Meaning|ترجمہ|مفہوم):\*\*\s*([\s\S]*?)(?=\n\*\*(?:From|ماخذ)|\n\*\*(?:Source|Reference|حوالہ)|\n\*\*(?:Explanation|وضاحت|فضیلت)|$)/i);
  const fromMatch = text.match(/\*\*(?:From|ماخذ):\*\*\s*([\s\S]*?)(?=\n\*\*(?:Source|Reference|حوالہ)|\n\*\*(?:Explanation|وضاحت|فضیلت)|$)/i);
  const sourceMatch = text.match(/\*\*(?:Source|Reference|حوالہ):\*\*\s*([\s\S]*?)(?=\n\*\*(?:Explanation|وضاحت|فضیلت)|$)/i);
  const explanationMatch = text.match(/\*\*(?:Explanation|وضاحت|فضیلت):\*\*\s*([\s\S]*)/i);

  const meaningText = meaningMatch?.[1]?.trim() || "";
  const isMeaningUrdu = /[\u0600-\u06FF]/.test(meaningText);

  const explanationText = explanationMatch?.[1]?.trim() || "";
  const isExplanationUrdu = /[\u0600-\u06FF]/.test(explanationText);

  const fromText = fromMatch?.[1]?.trim() || "";
  const isFromUrdu = /[\u0600-\u06FF]/.test(fromText);

  const isUrduUI = isMeaningUrdu || isExplanationUrdu || isFromUrdu || Boolean(text.match(/\*\*(?:عربی|تلفظ|ترجمہ|ماخذ|وضاحت):/));

  return (
    <div className="flex flex-col gap-3.5">
      {arabicMatch && (
        <div dir="rtl" lang="ar" className="rounded-xl border border-gold/30 bg-gold/5 p-4 shadow-xs text-right">
          <p className="dua-arabic text-foreground text-2xl leading-[2.8]">{arabicMatch[1].trim()}</p>
        </div>
      )}
      {transliterationMatch && (
        <div dir="ltr" className="rounded-lg bg-muted/40 p-3.5 border text-left">
          <div className="flex items-center gap-1.5 mb-1 justify-start">
            <span className="inline-block rounded-md bg-muted px-2.5 py-0.5 text-xs font-bold text-muted-foreground uppercase tracking-wider font-sans">
              Transliteration
            </span>
          </div>
          <p className="text-sm italic text-foreground leading-relaxed font-sans text-left">
            {transliterationMatch[1].trim()}
          </p>
        </div>
      )}
      {meaningText && (
        <div
          dir={isMeaningUrdu ? "rtl" : "ltr"}
          className={`rounded-xl p-4 ${
            isMeaningUrdu
              ? "border-r-4 border-gold/60 bg-gold/5 text-right"
              : "border-l-4 border-gold/60 bg-gold/5 text-left"
          }`}
        >
          <div className={`flex items-center gap-1.5 mb-1 ${isMeaningUrdu ? "justify-start" : ""}`}>
            <span className={`inline-block rounded-md bg-gold/15 px-2.5 py-0.5 font-bold text-gold ${isMeaningUrdu ? "font-urdu text-xs" : "text-xs uppercase tracking-wider font-sans"}`}>
              {isMeaningUrdu ? "ترجمہ و مفہوم" : "Meaning"}
            </span>
          </div>
          <p className={isMeaningUrdu ? "urdu text-foreground font-urdu text-[1.42rem] leading-[2.7]" : "text-sm sm:text-base leading-relaxed text-foreground font-sans"}>
            {meaningText}
          </p>
        </div>
      )}
      {(fromMatch || sourceMatch) && (() => {
        const fromRaw = fromMatch?.[1]?.trim() || "";
        const sourceRaw = sourceMatch?.[1]?.trim() || "";
        const resolved = resolveSourceLink(sourceRaw || fromRaw);

        const siteText =
          resolved.siteName === "Quran.com"
            ? (isUrduUI ? "قرآن ڈاٹ کام پر آیت دیکھیں" : "Read on Quran.com")
            : (isUrduUI ? "سنت ڈاٹ کام پر مکمل حدیث دیکھیں" : "Read full on Sunnah.com");

        return (
          <div
            className="flex flex-wrap items-center gap-2 pt-0.5"
            dir={isUrduUI ? "rtl" : "ltr"}
          >
            {fromRaw && (
              <span className={isUrduUI ? "font-urdu text-sm font-semibold text-foreground/90" : "text-xs font-semibold text-foreground/90 font-sans"}>
                — {fromRaw}
              </span>
            )}
            {resolved.label && resolved.label !== fromRaw && (
              <span className={isUrduUI ? "font-urdu text-sm font-medium text-muted-foreground" : "text-xs font-medium text-muted-foreground font-sans"}>
                <strong className={isUrduUI ? "font-urdu font-bold text-foreground" : "font-bold text-foreground"}>
                  {isUrduUI ? "حوالہ:" : "Reference:"}
                </strong>{" "}
                {resolved.label}
              </span>
            )}
            {resolved.url && (
              <a
                href={resolved.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md bg-gold/15 px-2.5 py-1 text-[11px] font-semibold text-gold hover:bg-gold/25 hover:underline transition-colors"
              >
                <span className={isUrduUI ? "font-urdu text-xs" : "font-sans"}>
                  {siteText}
                </span>
                <ExternalLink className="size-3 text-gold/80" />
              </a>
            )}
          </div>
        );
      })()}
      {explanationText && (
        <div
          dir={isExplanationUrdu ? "rtl" : "ltr"}
          className="overflow-hidden rounded-xl border border-gold/25 bg-card shadow-xs"
        >
          <div className="flex items-center gap-2 border-b border-gold/20 bg-gold/10 px-4 py-2.5">
            <HandHeart className="size-4 text-gold shrink-0" />
            <span className={`font-bold text-gold ${isExplanationUrdu ? "font-urdu text-base" : "text-xs uppercase tracking-wider font-sans"}`}>
              {isExplanationUrdu ? "آسان تشریح و فضیلت" : "Explanation & Virtue"}
            </span>
          </div>
          <div className="p-4">
            <p
              className={
                isExplanationUrdu
                  ? "urdu text-foreground text-[1.38rem] font-urdu leading-[2.6] whitespace-pre-line text-right"
                  : "text-sm sm:text-base leading-relaxed text-foreground whitespace-pre-line text-left font-sans"
              }
            >
              {explanationText}
            </p>
          </div>
        </div>
      )}
      {!arabicMatch && !transliterationMatch && !meaningMatch && !fromMatch && !sourceMatch && (
        <div
          dir={isUrduUI ? "rtl" : "ltr"}
          className={`prose prose-sm max-w-none dark:prose-invert ${
            isUrduUI ? "font-urdu text-[1.35rem] leading-[2.6] text-right" : "text-left font-sans"
          }`}
        >
          <ReactMarkdown>{text}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}

function MdBlock({ text, title, isUrdu }: { text: string; title?: string; isUrdu?: boolean }) {
  const isBlockUrdu = isUrdu !== undefined ? isUrdu : isTextUrdu(text);
  const t = title?.toLowerCase() || "";

  if (t === "dua" || t === "دعا" || t.includes("دعا") || t.includes("supplication")) return <DuaBlock text={text} />;
  if (t === "authentic hadith" || t === "مستند حدیث" || t.includes("hadith") || t.includes("حدیث")) {
    return <HadithBlock text={text} />;
  }

  return (
    <div
      dir={isBlockUrdu ? "rtl" : "ltr"}
      className={`prose prose-sm max-w-none dark:prose-invert prose-headings:font-serif prose-headings:font-semibold prose-p:leading-relaxed prose-p:my-2 prose-ul:my-2 prose-li:my-1 prose-strong:text-primary ${
        isBlockUrdu ? "font-urdu text-right text-[1.38rem] leading-[2.6]" : "text-left font-sans text-sm sm:text-base"
      }`}
    >
      <ReactMarkdown
        components={{
          h1: ({ children }) => <h1 className={isBlockUrdu ? "urdu-heading text-2xl my-3" : "text-lg font-bold my-2 font-sans"}>{children}</h1>,
          h2: ({ children }) => <h2 className={isBlockUrdu ? "urdu-heading text-xl my-2.5" : "text-base font-bold my-2 font-sans"}>{children}</h2>,
          h3: ({ children }) => <h3 className={isBlockUrdu ? "urdu-heading text-lg my-2" : "text-sm font-bold my-1.5 font-sans"}>{children}</h3>,
          ul: ({ children }) => (
            <ul className={`space-y-2.5 my-2.5 ${isBlockUrdu ? "pr-1" : "pl-5 list-disc"}`}>
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className={`space-y-2.5 my-2.5 ${isBlockUrdu ? "pr-1" : "pl-5 list-decimal"}`}>
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className={isBlockUrdu ? "flex items-start gap-2.5 text-[1.38rem] leading-[2.6]" : "leading-normal font-sans"}>
              {isBlockUrdu && <span className="inline-block size-2.5 rounded-full bg-primary mt-4 shrink-0 shadow-xs" />}
              <span className="flex-1">{children}</span>
            </li>
          ),
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}

export function MarkdownMessage({ text }: { text: string }) {
  const isMessageUrdu = detectMessageLanguage(text) === "ur";
  const chunks = splitChunks(text);

  // Group consecutive section chunks into one Accordion (first one open).
  const grouped: Array<Chunk | { kind: "accordion"; items: Extract<Chunk, { kind: "section" }>[] }> = [];
  let buf: Extract<Chunk, { kind: "section" }>[] = [];
  const flush = () => {
    if (buf.length) {
      grouped.push({ kind: "accordion", items: buf });
      buf = [];
    }
  };
  for (const c of chunks) {
    if (c.kind === "section") buf.push(c);
    else {
      flush();
      grouped.push(c);
    }
  }
  flush();

  return (
    <div className="flex flex-col gap-2">
      {grouped.map((g, i) => {
        if (g.kind === "md") return <MdBlock key={i} text={g.text} isUrdu={isMessageUrdu} />;
        if (g.kind === "ayah") return <AyahCard key={i} data={g.data} isUrdu={isMessageUrdu} />;
        if (g.kind === "ayah_loading") {
          return (
            <div key={i} className="my-3 overflow-hidden rounded-2xl border border-primary/15 bg-card/60 p-4 shadow-xs animate-pulse">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-4 w-28 rounded-md bg-primary/20" />
                <div className="h-4 w-12 rounded-md bg-primary/10" />
              </div>
              <div className="space-y-2.5">
                <div className="h-6 w-full rounded-lg bg-primary/15" />
                <div className="h-4 w-5/6 rounded-md bg-primary/10" />
                <div className="h-4 w-2/3 rounded-md bg-primary/10" />
              </div>
            </div>
          );
        }
        if (g.kind === "section") return null; // handled by accordion
        // accordion
        return (
          <Accordion
            key={i}
            type="multiple"
            defaultValue={[`item-0`]}
            className="my-2 w-full overflow-hidden rounded-2xl border bg-card shadow-xs"
          >
            {g.items.map((s, idx) => {
              const displayTitle = getDisplayTitle(s.meta.title, isMessageUrdu);

              return (
                <AccordionItem
                  key={idx}
                  value={`item-${idx}`}
                  className="border-b last:border-b-0"
                >
                  <AccordionTrigger
                    className={`px-4 py-4 text-sm hover:no-underline transition-colors ${
                      isMessageUrdu ? "font-urdu text-right" : "text-left"
                    }`}
                    dir={isMessageUrdu ? "rtl" : "ltr"}
                  >
                    <span className="flex items-center gap-3">
                      <div className="flex items-center justify-center size-8 rounded-lg bg-primary/10 text-primary">
                        {s.meta.icon && ICONS[s.meta.icon]}
                      </div>
                      <span className={isMessageUrdu ? "font-urdu text-[1.65rem] font-bold text-foreground leading-normal" : "font-semibold text-foreground font-sans"}>
                        {displayTitle}
                      </span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 pt-1">
                    <MdBlock text={s.body} title={s.meta.title} isUrdu={isMessageUrdu} />
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        );
      })}
    </div>
  );
}
