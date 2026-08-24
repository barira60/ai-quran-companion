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
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Logo withWordmark />
        <div className="flex items-center gap-2">
          <Button asChild><Link to="/chat">Get started</Link></Button>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-10 px-6 pb-16 pt-6 md:grid-cols-2 md:items-center md:pt-12">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs">
            <Sparkles className="size-3 text-gold" />
            <span className="text-muted-foreground">Guidance from the Qur'an & Sunnah</span>
          </div>
          <h1 className="font-serif text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
            Find peace in every <span className="text-primary">Ayah</span>.
          </h1>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Share how you're feeling — stress, sadness, fear, gratitude — and receive Qur'anic
            verses, authentic hadith, duas, and practical Islamic steps tailored to your moment.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" className="gap-2">
              <Link to="/chat"><MessageCircleHeart className="size-4" /> Start a conversation</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="gap-2">
              <Link to="/chat"><BookHeart className="size-4" /> Try Healing Mode</Link>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Educational content — not a substitute for qualified scholars, therapists, or doctors.
          </p>
        </div>
        <div className="relative">
          <img
            src={hero}
            alt="An open Qur'an on a wooden stand bathed in warm dawn light"
            width={1536}
            height={1024}
            className="rounded-2xl border shadow-lg"
          />
          <div className="absolute inset-0 rounded-2xl ring-1 ring-gold/20 pointer-events-none" />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-6 md:grid-cols-3">
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
            <div key={f.title} className="rounded-2xl border bg-card p-6 shadow-sm">
              <div className="mb-3 inline-flex rounded-lg bg-primary/10 p-2 text-primary">
                <f.icon className="size-5" />
              </div>
              <h3 className="font-serif text-lg font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-6 py-6 text-xs text-muted-foreground flex flex-wrap items-center justify-between gap-2">
          <span>© Quran Companion AI</span>
          <span>Built with reverence. Always consult qualified scholars for religious rulings.</span>
        </div>
      </footer>
    </div>
  );
}
