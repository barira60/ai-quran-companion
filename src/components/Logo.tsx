import { QuranLogo } from "@/components/QuranLogo";

export function Logo({
  size = 28,
  withWordmark = false,
  compact = false,
}: {
  size?: number;
  withWordmark?: boolean;
  compact?: boolean;
}) {
  return (
    <div className="flex items-center gap-2.5 shrink-0">
      <div className="text-primary shrink-0 flex items-center justify-center">
        <QuranLogo size={size} className="shrink-0" />
      </div>
      {withWordmark && (
        <span className="font-serif font-bold tracking-tight text-foreground whitespace-nowrap text-base sm:text-lg">
          Quran {compact ? "" : <span className="hidden xs:inline sm:inline">Companion </span>}
          <span className="text-primary">AI</span>
        </span>
      )}
    </div>
  );
}
