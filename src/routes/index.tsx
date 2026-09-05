import hero from "@/assets/hero.jpg";
import { AyahCard } from "@/components/AyahCard";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language-store";
import { createLocalThread } from "@/lib/local-store";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { BookHeart, Heart, MessageCircleHeart, Sparkles, Compass, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Quran Companion AI — Find peace in the Qur'an" },
      {
        name: "description",
        content:
          "Share how you feel and receive Quranic verses, authentic hadith, duas, and practical Islamic guidance from a thoughtful AI companion.",
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
  { en: "Stress", ur: "پریشانی", color: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  { en: "Anxiety", ur: "بے چینی", color: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  { en: "Sadness", ur: "اداسی و غم", color: "border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400" },
  { en: "Patience", ur: "صبر و استقامت", color: "border-teal-500/30 bg-teal-500/10 text-teal-600 dark:text-teal-400" },
  { en: "Gratitude", ur: "شکر گزاری", color: "border-orange-500/30 bg-orange-500/10 text-orange-600 dark:text-orange-400" },
];

function Landing() {
  const [appLang] = useLanguage();
  const navigate = useNavigate();
  const isUrdu = appLang === "ur";

  const startWithMood = (mood: string, urMood: string) => {
    const title = isUrdu ? `ہیلنگ موڈ · ${urMood}` : `Healing · ${mood}`;
    const t = createLocalThread({ mood, title });
    navigate({ to: "/chat/$threadId", params: { threadId: t.id } });
  };

  return (
    <div className={`min-h-[100dvh] bg-background flex flex-col ${isUrdu ? "font-urdu" : ""}`} dir={isUrdu ? "rtl" : "ltr"}>
      {/* Header */}
      <header className="sticky top-0 z-40 mx-auto flex w-full max-w-6xl items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-background/80 backdrop-blur-md border-b">
        <Link to="/">
          <Logo size={30} withWordmark />
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageToggle />
          <ThemeToggle />
          <Button size="sm" className={`h-8 sm:h-9 px-3 sm:px-4 text-xs sm:text-sm font-medium rounded-xl shadow-xs ${isUrdu ? "font-urdu text-sm" : ""}`} asChild>
            <Link to="/chat">{isUrdu ? "شروع کریں" : "Get started"}</Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="mx-auto grid max-w-6xl flex-1 gap-8 sm:gap-12 px-4 sm:px-6 py-6 sm:py-12 md:grid-cols-2 md:items-center">
        <div className="space-y-4 sm:space-y-6 text-left" dir={isUrdu ? "rtl" : "ltr"}>
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs text-gold font-medium">
            <Sparkles className="size-3.5 shrink-0" />
            <span className={isUrdu ? "font-urdu text-xs sm:text-sm" : ""}>
              {isUrdu ? "قرآن و سنت سے براہ راست رہنمائی" : "Guidance from Qur'an & Sunnah"}
            </span>
          </div>

          <h1 className={`font-serif text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight text-foreground ${isUrdu ? "font-urdu text-3xl sm:text-4xl md:text-5xl leading-[1.6]" : ""}`}>
            {isUrdu ? (
              <>
                قرآن پاک کی ہر آیت میں <span className="text-primary underline decoration-gold/40">سکون اور رہنمائی</span> پائیں۔
              </>
            ) : (
              <>
                Find peace in every <span className="text-primary underline decoration-gold/40">Ayah</span>.
              </>
            )}
          </h1>

          <p className={`text-sm sm:text-base md:text-lg leading-relaxed text-muted-foreground ${isUrdu ? "font-urdu text-base sm:text-lg leading-[2.1]" : ""}`}>
            {isUrdu
              ? "اپنی کیفیت، پریشانی یا سوال بیان کریں — اداسی، خوف، بے چینی، شکر — اور قرآن و سنت سے براہ راست منتخب آیات، احادیث اور مسنون دعائیں حاصل کریں۔"
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

        {/* Hero Showcase Side */}
        <div className="relative flex flex-col gap-4">
          <div className="relative">
            <img
              src={hero}
              alt="An open Qur'an bathed in gentle light"
              width={1536}
              height={1024}
              className="w-full max-h-56 sm:max-h-72 object-cover rounded-2xl sm:rounded-3xl border shadow-lg"
            />
            <div className="absolute inset-0 rounded-2xl sm:rounded-3xl ring-2 ring-gold/25 pointer-events-none" />
          </div>

          {/* Live Ayah Showcase Card */}
          <AyahCard
            data={{
              surah: 65,
              ayah: 3,
              name: "Surah At-Talaq",
              arabic: "وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ",
              translation:
                "And will provide for him from where he does not expect. And whoever relies upon Allah - then He is sufficient for him.",
              urduTranslation:
                "اور اس کو ایسی جگہ سے رزق دے گا جہاں سے (وہم و) گمان بھی نہ ہو۔ اور جو خدا پر بھروسہ رکھے گا تو وہ اس کو کفایت کرے گا۔",
              explanation:
                isUrdu
                  ? "جب انسان اپنا معاملہ خلوص دل سے اللہ کے سپرد کر دیتا ہے تو اللہ اس کے لیے کفایت کرتا ہے۔"
                  : "When a believer places their complete trust in Allah, Allah becomes sufficient for all their needs.",
            }}
            isUrdu={isUrdu}
          />
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
