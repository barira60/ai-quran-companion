import logo from "@/assets/logo.png";

export function Logo({ size = 32, withWordmark = false }: { size?: number; withWordmark?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <img src={logo} alt="Quran Companion AI" width={size} height={size} className="rounded-md" />
      {withWordmark && (
        <span className="font-serif font-semibold tracking-tight text-foreground">
          Quran Companion <span className="text-primary">AI</span>
        </span>
      )}
    </div>
  );
}
