import { AppShell } from "@/components/AppShell";
import { AyahCard } from "@/components/AyahCard";
import { useLanguage } from "@/lib/language-store";
import { removeLocalFavorite, useLocalFavorites } from "@/lib/local-store";
import { createFileRoute } from "@tanstack/react-router";
import { Heart } from "lucide-react";

export const Route = createFileRoute("/_authenticated/favorites")({
  component: FavoritesPage,
});

function FavoritesPage() {
  const [appLang] = useLanguage();
  const data = useLocalFavorites();
  const isUrdu = appLang === "ur";

  return (
    <AppShell>
      <div className={`mx-auto max-w-3xl px-6 py-10 ${isUrdu ? "font-urdu text-right" : ""}`} dir={isUrdu ? "rtl" : "ltr"}>
        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-lg bg-primary/10 p-2 text-primary">
            <Heart className="size-5" />
          </div>
          <h1 className={isUrdu ? "font-urdu text-2xl font-bold text-foreground" : "font-serif text-2xl font-semibold"}>
            {isUrdu ? "پسندیدہ محفوظ آیات و دعائیں" : "Saved verses"}
          </h1>
        </div>
        {data.length === 0 && (
          <p className={isUrdu ? "font-urdu text-sm text-muted-foreground leading-loose" : "text-sm text-muted-foreground"}>
            {isUrdu
              ? "آپ نے ابھی تک کوئی آیت محفوظ نہیں کی۔ چیٹ میں آیت کے بک مارک بٹن پر کلک کر کے اسے یہاں محفوظ کریں۔"
              : "You haven't saved any verses yet. Tap the bookmark on an ayah card in the chat to keep it here."}
          </p>
        )}
        <div className="space-y-4">
          {data.map((f) => (
            <AyahCard
              key={f.id}
              data={{
                surah: f.surah_number,
                ayah: f.ayah_number,
                name: f.surah_name,
                arabic: f.arabic,
                translation: f.translation,
              }}
              onRemove={() => removeLocalFavorite(f.id)}
            />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
