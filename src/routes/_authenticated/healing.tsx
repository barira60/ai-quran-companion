import { AppShell } from "@/components/AppShell";
import { useLanguage } from "@/lib/language-store";
import { createLocalThread } from "@/lib/local-store";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { BookHeart } from "lucide-react";

export const Route = createFileRoute("/_authenticated/healing")({
  component: HealingPage,
});

const MOODS = [
  { key: "Stress", urTitle: "پریشانی و دباؤ", desc: "Calm an overwhelmed heart", urDesc: "بے چین دل کو سکون اور راحت دیں", color: "from-emerald-100 to-emerald-50" },
  { key: "Anxiety", urTitle: "بے چینی و گھبراہٹ", desc: "Verses to steady your breath", urDesc: "دل کو قرار بخشنے والی آیات و دعائیں", color: "from-amber-100 to-amber-50" },
  { key: "Sadness", urTitle: "اداسی و غم", desc: "Comfort in moments of grief", urDesc: "غم اور صدمے کے لمحات میں تسلی", color: "from-blue-100 to-blue-50" },
  { key: "Fear", urTitle: "خوف و ڈر", desc: "Strength when you feel afraid", urDesc: "ڈر اور خوف میں اللہ کی پناہ اور ہمت", color: "from-rose-100 to-rose-50" },
  { key: "Patience", urTitle: "صبر و استقامت", desc: "Sabr — the beauty of waiting", urDesc: "صبر اور برداشت کا خوبصورت اجر", color: "from-teal-100 to-teal-50" },
  { key: "Hope", urTitle: "امید و آس", desc: "Light at the end of hardship", urDesc: "مایوسی کے اندھیروں میں اللہ کی رحمت کی کرن", color: "from-yellow-100 to-yellow-50" },
  { key: "Tawakkul", urTitle: "توکل علی اللہ", desc: "Trust your affairs to Allah", urDesc: "اپنے تمام معاملات اللہ کے سپرد کرنا", color: "from-green-100 to-green-50" },
  { key: "Gratitude", urTitle: "شکر گزاری", desc: "Open your heart to shukr", urDesc: "اللہ کی بے شمار نعمتوں پر دل سے شکر", color: "from-orange-100 to-orange-50" },
];

function HealingPage() {
  const [appLang] = useLanguage();
  const navigate = useNavigate();
  const isUrdu = appLang === "ur";

  const start = (mood: string, urTitle: string) => {
    const title = isUrdu ? `ہیلنگ موڈ · ${urTitle}` : `Healing · ${mood}`;
    const t = createLocalThread({ mood, title });
    navigate({ to: "/chat/$threadId", params: { threadId: t.id } });
  };

  return (
    <AppShell>
      <div className={`mx-auto max-w-5xl px-6 py-10 ${isUrdu ? "font-urdu text-right" : ""}`} dir={isUrdu ? "rtl" : "ltr"}>
        <div className="flex items-center gap-3 mb-2">
          <div className="rounded-lg bg-gold/15 p-2 text-gold">
            <BookHeart className="size-5" />
          </div>
          <h1 className={isUrdu ? "font-urdu text-2xl font-bold text-foreground" : "font-serif text-2xl font-semibold text-foreground"}>
            {isUrdu ? "قرآنی شفا و ہیلنگ موڈ" : "Healing Quran Mode"}
          </h1>
        </div>
        <p className={isUrdu ? "font-urdu text-sm text-muted-foreground max-w-2xl leading-loose" : "text-muted-foreground max-w-2xl"}>
          {isUrdu
            ? "اپنی موجودہ کیفیت یا جذبہ منتخب کریں۔ قرآن و سنت سے منتخب آیات، احادیث اور مسنون دعائیں آپ کی تسکین کے لیے پیش کی جائیں گی۔"
            : "Choose what you're feeling. I'll curate verses, hadith, duas, and reflections from the Qur'an and Sunnah to help you sit with this emotion."}
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {MOODS.map((m) => (
            <div
              key={m.key}
              role="button"
              tabIndex={0}
              onClick={() => start(m.key, m.urTitle)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  start(m.key, m.urTitle);
                }
              }}
              className="group cursor-pointer rounded-2xl border bg-card p-5 text-left shadow-sm hover:border-primary/40 hover:shadow-md transition"
            >
              <div className={`mb-3 h-16 rounded-xl bg-gradient-to-br ${m.color} dark:opacity-40`} />
              <h3 className={isUrdu ? "font-urdu text-lg font-bold text-foreground text-right" : "font-serif text-lg font-semibold text-foreground"}>
                {isUrdu ? m.urTitle : m.key}
              </h3>
              <p className={isUrdu ? "font-urdu mt-1 text-xs text-muted-foreground text-right leading-loose" : "mt-1 text-xs text-muted-foreground"}>
                {isUrdu ? m.urDesc : m.desc}
              </p>
              <div className={`mt-3 ${isUrdu ? "text-right" : ""}`}>
                <span className={`inline-flex items-center text-sm font-medium text-primary group-hover:underline ${isUrdu ? "font-urdu" : ""}`}>
                  {isUrdu ? "← رہنمائی شروع کریں" : "Open Healing Mode →"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
