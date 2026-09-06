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
    <div className="flex items-center gap-2.5 shrink-0">
      <img
        src={logo}
        alt="قرآن و سنت رہنمائی"
        width={size}
        height={size}
        className="rounded-xl shrink-0 object-cover shadow-2xs aspect-square border border-emerald-500/20"
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

