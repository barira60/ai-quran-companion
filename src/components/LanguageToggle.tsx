import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language-store";
import { Languages } from "lucide-react";
import { toast } from "sonner";

export function LanguageToggle() {
  const [lang, setLang] = useLanguage();

  const toggleLanguage = () => {
    const next = lang === "en" ? "ur" : "en";
    setLang(next);
    toast.success(next === "ur" ? "زبان اردو منتخب کی گئی" : "Language set to English");
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      title={lang === "en" ? "Switch to Urdu (اردو)" : "انگریزی میں تبدیل کریں"}
      aria-label="Toggle language"
      className="h-8 gap-1.5 px-2.5 text-xs font-medium border-primary/20 hover:bg-primary/10 hover:text-primary transition-all"
    >
      <Languages className="size-3.5 text-primary" />
      <span className={lang === "ur" ? "font-urdu text-sm font-semibold text-primary" : "font-semibold"}>
        {lang === "en" ? "اردو" : "English"}
      </span>
    </Button>
  );
}
