import hero from "@/assets/hero.jpg";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language-store";
import { createLocalThread } from "@/lib/local-store";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { BookHeart, Heart, MessageCircleHeart, ShieldCheck, Sparkles } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Quran Companion AI — Find peace in the Qur'an" },
      {
        name: "description",
        content:
          "Share how you feel and receive Quranic verses, hadith, duas, and practical Islamic guidance from a thoughtful AI companion.",
      },
      { property: "og:title", content: "Quran Companion AI" },
      {
        property: "og:description",
        content:
          "An AI mentor that connects your daily struggles with guidance from the Qur'an and Sunnah.",
      },
    ],
  }),
  component: Landing,
});

const QUICK_MOODS = [
  { en: "Stress", ur: "پریشانی", color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" },
  { en: "Anxiety", ur: "بے چینی", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20" },
  { en: "Sadness", ur: "اداسی", color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20" },
  { en: "Patience", ur: "صبر", color: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20" },
  { en: "Tawakkul", ur: "توکل", color: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20" },
  { en: "Gratitude", ur: "شکر", color: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20" },
];

function Landing() {
  const [appLang] = useLanguage();
  const navigate = useNavigate();
  const isUrdu = appLang === "ur";

  const startWithMood = (moodEn: string, moodUr: string) => {
    const title = isUrdu ? `ہیلنگ موڈ · ${moodUr}` : `Healing · ${moodEn}`;
    const t = createLocalThread({ mood: moodEn, title });
    navigate({ to: "/chat/$threadId", params: { threadId: t.id } });
  };

  return (
    <div className={`min-h-[100dvh] bg-background flex flex-col ${isUrdu ? "font-urdu text-right" : ""}`} dir={isUrdu ? "rtl" : "ltr"}>
      {/* Header */}
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 sm:px-6 py-3 sm:py-4 pt-[calc(0.75rem+env(safe-area-inset-top,0px))]">
        <Logo size={28} withWordmark />
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
          <Button size="sm" className={`h-8 sm:h-9 px-3 sm:px-4 text-xs sm:text-sm font-medium ${isUrdu ? "font-urdu text-sm" : ""}`} asChild>
            <Link to="/chat">{isUrdu ? "شروع کریں" : "Get started"}</Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="mx-auto grid max-w-6xl flex-1 gap-6 sm:gap-10 px-4 sm:px-6 py-4 sm:py-10 md:grid-cols-2 md:items-center">
        <div className="space-y-4 sm:space-y-6">
          <div className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1 text-xs shadow-2xs">
            <Sparkles className="size-3.5 text-gold shrink-0" />
            <span className={`text-muted-foreground font-medium ${isUrdu ? "font-urdu text-xs" : ""}`}>
              {isUrdu ? "قرآن و سنت کی روشنی میں رہنمائی" : "Guidance from Qur'an & Sunnah"}
            </span>
          </div>

          <h1 className={`font-serif text-2xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight text-foreground ${isUrdu ? "font-urdu text-3xl sm:text-4xl md:text-5xl leading-[1.8]" : ""}`}>
            {isUrdu ? (
              <>ہر مشکل اور لمحے میں <span className="text-primary">قرآنی سکون</span> پائیں۔</>
            ) : (
              <>Find peace in every <span className="text-primary">Ayah</span>.</>
            )}
          </h1>

          <p className={`text-sm sm:text-base md:text-lg leading-relaxed text-muted-foreground ${isUrdu ? "font-urdu text-base sm:text-lg leading-[2.2]" : ""}`}>
            {isUrdu
              ? "اپنی جذباتی کیفیت اور دلی کیفیات کھل کر بیان کریں۔ قرآن کی آیات، صحیح احادیث، مسنون دعائیں اور عملی اسلامی رہنمائی حاصل کریں۔"
              : "Share how you're feeling — stress, sadness, fear, gratitude — and receive Qur'anic verses, authentic hadith, duas, and practical Islamic steps tailored to your moment."}
          </p>

          {/* Quick Mood Chips */}
          <div className="space-y-2">
            <span className={`text-xs font-semibold text-muted-foreground block ${isUrdu ? "font-urdu text-sm" : ""}`}>
              {isUrdu ? "فوری موڈ منتخب کریں:" : "Choose a feeling to start:"}
            </span>
            <div className="flex flex-wrap gap-2">
              {QUICK_MOODS.map((m) => (
                <button
                  key={m.en}
                  onClick={() => startWithMood(m.en, m.ur)}
                  className={`rounded-full border px-3 py-1 text-xs sm:text-sm font-medium transition-transform hover:scale-105 active:scale-95 shadow-2xs ${m.color} ${
                    isUrdu ? "font-urdu text-sm" : ""
                  }`}
                >
                  {isUrdu ? m.ur : m.en}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button asChild size="lg" className={`h-11 sm:h-12 px-5 sm:px-6 text-sm sm:text-base gap-2 rounded-xl shadow-md ${isUrdu ? "font-urdu text-base" : ""}`}>
              <Link to="/chat">
                <MessageCircleHeart className="size-5 shrink-0" />
                {isUrdu ? "گفتگو شروع کریں" : "Start conversation"}
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className={`h-11 sm:h-12 px-5 sm:px-6 text-sm sm:text-base gap-2 rounded-xl border-primary/30 hover:bg-primary/10 ${isUrdu ? "font-urdu text-base" : ""}`}>
              <Link to="/healing">
                <BookHeart className="size-5 shrink-0" />
                {isUrdu ? "قرآنی شفا موڈ" : "Healing Mode"}
              </Link>
            </Button>
          </div>

          <p className={`text-xs text-muted-foreground flex items-center gap-1.5 ${isUrdu ? "font-urdu text-xs" : ""}`}>
            <ShieldCheck className="size-3.5 text-primary shrink-0" />
            {isUrdu
              ? "تعلیمی رہنمائی — مستند علماء یا ڈاکٹروں کا متبادل نہیں ہے۔"
              : "Educational content — not a substitute for qualified scholars or doctors."}
          </p>
        </div>

        {/* Hero Image */}
        <div className="relative mt-2 md:mt-0">
          <img
            src={hero}
            alt="An open Qur'an on a wooden stand bathed in warm dawn light"
            width={1536}
            height={1024}
            className="w-full max-h-64 sm:max-h-96 md:max-h-none object-cover rounded-2xl sm:rounded-3xl border shadow-lg"
          />
          <div className="absolute inset-0 rounded-2xl sm:rounded-3xl ring-1 ring-gold/20 pointer-events-none" />
        </div>
      </section>

      {/* Features Grid */}
      <section className="mx-auto max-w-6xl w-full px-4 sm:px-6 py-10 sm:py-16 border-t bg-card/30">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <h2 className={`font-serif text-2xl sm:text-3xl font-bold text-foreground ${isUrdu ? "font-urdu text-2xl sm:text-3xl" : ""}`}>
            {isUrdu ? "قرآن کمپینین کی خصوصیات" : "Why use Quran Companion AI"}
          </h2>
          <p className={`mt-2 text-xs sm:text-sm text-muted-foreground ${isUrdu ? "font-urdu text-sm" : ""}`}>
            {isUrdu
              ? "روزمرہ کی مشکلات، بے چینی اور جذباتی لمحات میں قرآن و سنت سے رہنمائی اور سکون کا منبع"
              : "Connecting your daily thoughts, emotions, and questions with direct wisdom from Islamic sources."}
          </p>
        </div>

        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 md:grid-cols-3">
          {[
            {
              icon: MessageCircleHeart,
              title: isUrdu ? "تفسیر سے آراستہ رفیق" : "Tafsir-aware companion",
              desc: isUrdu
                ? "اپنی کیفیات اور سوالات کھل کر بیان کریں۔ متعلقہ قرآنی آیات مع مستند ترجمہ اور آسان فہم حاصل کریں۔"
                : "Describe your feelings naturally. Receive relevant ayahs with translation, reflection, and why each one fits.",
            },
            {
              icon: BookHeart,
              title: isUrdu ? "قرآنی شفا و ہیلنگ موڈ" : "Healing Quran Mode",
              desc: isUrdu
                ? "صبر، امید، توکل، اور شکر گزاری جیسے موضوعات منتخب کریں اور دل کو قرار بخشنے والی دعائیں پڑھیں۔"
                : "Choose a theme — patience, hope, tawakkul, gratitude — and get a curated set of verses, hadith, and duas.",
            },
            {
              icon: Heart,
              title: isUrdu ? "پسندیدہ آیات محفوظ کریں" : "Save what speaks to you",
              desc: isUrdu
                ? "مشاری العفاسی کی دلنشین تلاوت سنیں، پسندیدہ آیات کو بک مارک کریں اور جب چاہیں سنیں۔"
                : "Bookmark verses, listen to recitation by Mishary Alafasy, and return to the words that brought you peace.",
            },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl border border-primary/20 bg-card p-5 sm:p-6 shadow-xs hover:border-primary/40 hover:shadow-md transition">
              <div className="mb-3.5 inline-flex rounded-xl bg-primary/10 p-2.5 text-primary">
                <f.icon className="size-5 sm:size-6" />
              </div>
              <h3 className={`font-serif text-base sm:text-lg font-bold text-foreground ${isUrdu ? "font-urdu text-lg" : ""}`}>{f.title}</h3>
              <p className={`mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed ${isUrdu ? "font-urdu text-sm leading-[2.1]" : ""}`}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card/60 pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 text-xs text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <span className="font-semibold text-foreground/80">© Quran Companion AI</span>
          <span className={isUrdu ? "font-urdu text-xs" : ""}>
            {isUrdu
              ? "احترام و عقیدت کے ساتھ تیار کردہ۔ فقہی مسائل کے لیے ہمیشہ مستند علماء سے رجوع کریں۔"
              : "Built with reverence. Always consult qualified scholars for religious rulings."}
          </span>
        </div>
      </footer>
    </div>
  );
}

