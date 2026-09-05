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
    <div className="flex items-center gap-1.5 shrink-0">
      <img
        src={logo}
        alt="Quran Companion AI"
        width={size}
        height={size}
        className="rounded-md shrink-0 object-contain"
      />
      {withWordmark && (
        <span className="font-serif font-semibold tracking-tight text-foreground whitespace-nowrap text-sm sm:text-base">
          Quran {compact ? "" : <span className="hidden xs:inline sm:inline">Companion </span>}
          <span className="text-primary">AI</span>
        </span>
      )}
    </div>
  );
}
