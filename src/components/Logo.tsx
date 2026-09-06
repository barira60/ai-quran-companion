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
        alt="قرآن و سنت رہنمائی"
        width={size}
        height={size}
        className="shrink-0 object-contain drop-shadow-xs"
        style={{ width: size, height: size }}
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


