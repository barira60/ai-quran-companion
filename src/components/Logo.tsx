import logo from "@/assets/logo.png";

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
    <div className="flex items-center gap-2 shrink-0">
      <img
        src={logo}
        alt="Quran Companion AI"
        width={size}
        height={size}
        className="rounded-lg shrink-0 object-contain shadow-2xs"
      />
      {withWordmark && (
        <span className="font-serif font-bold tracking-tight text-foreground whitespace-nowrap text-base sm:text-lg">
          Quran {compact ? "" : <span className="hidden xs:inline sm:inline">Companion </span>}
          <span className="text-primary">AI</span>
        </span>
      )}
    </div>
  );
}
