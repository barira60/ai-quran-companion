import hero from "@/assets/hero.jpg";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Link, createFileRoute } from "@tanstack/react-router";
import { BookHeart, Heart, MessageCircleHeart, Sparkles } from "lucide-react";

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

function Landing() {
  return (
    <div className="min-h-[100dvh] bg-background flex flex-col">
      {/* Header */}
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 sm:px-6 py-3 sm:py-4 pt-[calc(0.75rem+env(safe-area-inset-top,0px))]">
        <Logo size={26} withWordmark />
        <div className="flex items-center gap-2">
          <Button size="sm" className="h-8 px-3 text-xs sm:text-sm" asChild>
            <Link to="/chat">Get started</Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="mx-auto grid max-w-6xl flex-1 gap-6 sm:gap-10 px-4 sm:px-6 py-4 sm:py-10 md:grid-cols-2 md:items-center">
        <div className="space-y-4 sm:space-y-6 text-left">
          <div className="inline-flex items-center gap-1.5 rounded-full border bg-card px-2.5 py-0.5 text-[11px] sm:text-xs">
            <Sparkles className="size-3 text-gold shrink-0" />
            <span className="text-muted-foreground">Guidance from Qur'an & Sunnah</span>
          </div>
          
          <h1 className="font-serif text-2xl sm:text-3xl md:text-5xl font-semibold leading-snug tracking-tight text-foreground">
            Find peace in every <span className="text-primary">Ayah</span>.
          </h1>
          
          <p className="text-sm sm:text-base md:text-lg leading-relaxed text-muted-foreground">
            Share how you're feeling — stress, sadness, fear, gratitude — and receive Qur'anic
            verses, authentic hadith, duas, and practical Islamic steps tailored to your moment.
          </p>
          
          <div className="flex flex-wrap gap-2.5 sm:gap-3 pt-1">
            <Button asChild className="h-9 sm:h-10 px-3.5 sm:px-4 text-xs sm:text-sm gap-2">
              <Link to="/chat">
                <MessageCircleHeart className="size-4 shrink-0" /> Start conversation
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-9 sm:h-10 px-3.5 sm:px-4 text-xs sm:text-sm gap-2">
              <Link to="/healing">
                <BookHeart className="size-4 shrink-0" /> Healing Mode
              </Link>
            </Button>
          </div>
          
          <p className="text-[11px] sm:text-xs text-muted-foreground leading-normal">
            Educational content — not a substitute for qualified scholars, therapists, or doctors.
          </p>
        </div>
        
        <div className="relative mt-2 md:mt-0">
          <img
            src={hero}
            alt="An open Qur'an on a wooden stand bathed in warm dawn light"
            width={1536}
            height={1024}
            className="w-full max-h-52 sm:max-h-80 md:max-h-none object-cover rounded-xl sm:rounded-2xl border shadow-md"
          />
          <div className="absolute inset-0 rounded-xl sm:rounded-2xl ring-1 ring-gold/20 pointer-events-none" />
        </div>
      </section>

      {/* Features Grid */}
      <section className="mx-auto max-w-6xl w-full px-4 sm:px-6 py-8 sm:py-14 border-t">
        <div className="grid gap-3.5 sm:gap-6 sm:grid-cols-2 md:grid-cols-3">
          {[
            {
              icon: MessageCircleHeart,
              title: "Tafsir-aware companion",
              desc: "Describe your feelings naturally. Receive relevant ayahs with translation, reflection, and why each one fits.",
            },
            {
              icon: BookHeart,
              title: "Healing Mode",
              desc: "Choose a theme — patience, hope, tawakkul, gratitude — and get a curated set of verses, hadith, and duas.",
            },
            {
              icon: Heart,
              title: "Save what speaks to you",
              desc: "Bookmark verses, listen to recitation by Mishary Alafasy, and return to the words that brought you peace.",
            },
          ].map((f) => (
            <div key={f.title} className="rounded-xl sm:rounded-2xl border bg-card p-4 sm:p-5 shadow-xs">
              <div className="mb-2.5 inline-flex rounded-lg bg-primary/10 p-2 text-primary">
                <f.icon className="size-4 sm:size-5" />
              </div>
              <h3 className="font-serif text-sm sm:text-base font-semibold">{f.title}</h3>
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card/20 pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4 text-[11px] sm:text-xs text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <span>© Quran Companion AI</span>
          <span>Built with reverence. Always consult qualified scholars for religious rulings.</span>
        </div>
      </footer>
    </div>
  );
}
