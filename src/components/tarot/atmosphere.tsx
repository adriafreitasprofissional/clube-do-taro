import { cn } from "@/lib/utils";

/** Estrelas, névoa e halos que atravessam a página inteira. */
export function Atmosphere() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="star-field absolute inset-0 opacity-70 animate-shimmer" />
      <div className="star-field absolute inset-0 scale-150 rotate-12 opacity-40" />
      <div
        className="halo h-[46rem] w-[46rem] -left-40 -top-52 opacity-50"
        style={{ background: "var(--plum)" }}
      />
      <div
        className="halo h-[38rem] w-[38rem] right-[-12rem] top-[28%] opacity-40"
        style={{ background: "var(--night)" }}
      />
      <div
        className="halo h-[34rem] w-[34rem] left-[20%] bottom-[-10rem] opacity-35"
        style={{ background: "var(--violet-deep)" }}
      />
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(60% 40% at 50% 0%, oklch(0.82 0.07 300 / 12%), transparent 70%)",
        }}
      />
    </div>
  );
}

/** Anéis orbitais finos e discretos. */
export function Orbits({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute animate-orbit", className)}>
      <div className="absolute inset-0 rounded-full border border-lavender/15" />
      <div className="absolute inset-[12%] rounded-full border border-gold/15" />
      <div className="absolute inset-[26%] rounded-full border border-lavender/10" />
      <div className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-gold/70 blur-[1px]" />
    </div>
  );
}

/** Constelação fina desenhada em SVG. */
export function Constellation({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 240 160"
      className={cn("pointer-events-none absolute opacity-50", className)}
    >
      <g stroke="oklch(0.87 0.085 88 / 45%)" strokeWidth="0.6" fill="none">
        <path d="M12 120 L60 86 L104 108 L150 52 L206 34" />
        <path d="M60 86 L74 30" />
        <path d="M150 52 L164 110" />
      </g>
      {[
        [12, 120],
        [60, 86],
        [104, 108],
        [150, 52],
        [206, 34],
        [74, 30],
        [164, 110],
      ].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1.9" fill="oklch(0.95 0.05 90 / 85%)" />
      ))}
    </svg>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-4 text-[0.68rem] font-medium uppercase tracking-[0.42em] text-gold/80">
      {children}
    </p>
  );
}
