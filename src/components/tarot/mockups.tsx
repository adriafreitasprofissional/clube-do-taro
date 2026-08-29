import { cn } from "@/lib/utils";

function Dots() {
  return (
    <div className="flex gap-1.5">
      <span className="h-2 w-2 rounded-full bg-lavender/30" />
      <span className="h-2 w-2 rounded-full bg-lavender/20" />
      <span className="h-2 w-2 rounded-full bg-gold/40" />
    </div>
  );
}

function Bar({ w, tone = "muted" }: { w: string; tone?: "muted" | "gold" }) {
  return (
    <span
      className={cn(
        "block h-1.5 rounded-full",
        tone === "gold" ? "bg-gold/55" : "bg-lavender/20",
      )}
      style={{ width: w }}
    />
  );
}

/** Painel profissional (desktop). */
export function DesktopPanel({ className }: { className?: string }) {
  return (
    <div className={cn("glass-card rounded-2xl p-3 sm:p-4", className)}>
      <div className="mb-3 flex items-center justify-between">
        <Dots />
        <span className="font-display text-xs tracking-[0.25em] text-gold/70">PAINEL</span>
      </div>
      <div className="flex gap-3">
        <div className="hidden w-24 shrink-0 flex-col gap-2.5 rounded-xl bg-lavender/5 p-3 sm:flex">
          {["Clientes", "Assinaturas", "Agenda", "Loja", "Cursos", "Financeiro"].map((i, n) => (
            <div key={i} className="flex items-center gap-1.5">
              <span
                className={cn("h-1.5 w-1.5 rounded-full", n === 1 ? "bg-gold/80" : "bg-lavender/30")}
              />
              <span className="text-[0.55rem] text-muted-foreground">{i}</span>
            </div>
          ))}
        </div>
        <div className="flex-1 space-y-3">
          <div className="grid grid-cols-3 gap-2">
            {[
              ["Assinantes", "128"],
              ["Recorrência", "R$ 9,4k"],
              ["Sessões", "34"],
            ].map(([l, v]) => (
              <div key={l} className="rounded-xl border border-border/60 bg-lavender/5 p-2">
                <p className="text-[0.5rem] uppercase tracking-widest text-muted-foreground">{l}</p>
                <p className="font-display text-sm text-gold">{v}</p>
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-border/60 bg-lavender/5 p-3">
            <div className="flex h-16 items-end gap-1.5">
              {[35, 52, 44, 68, 60, 82, 74, 95].map((h, i) => (
                <span
                  key={i}
                  className="flex-1 rounded-t-sm"
                  style={{
                    height: `${h}%`,
                    background:
                      i > 5
                        ? "linear-gradient(180deg, oklch(0.87 0.085 88 / 85%), transparent)"
                        : "linear-gradient(180deg, oklch(0.82 0.07 300 / 45%), transparent)",
                  }}
                />
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Bar w="72%" tone="gold" />
            <Bar w="90%" />
            <Bar w="55%" />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Portal do cliente (celular). */
export function PhonePortal({ className }: { className?: string }) {
  return (
    <div className={cn("glass-card rounded-[1.75rem] p-2.5", className)}>
      <div className="rounded-[1.4rem] border border-border/60 bg-night/40 p-3">
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-lavender/25" />
        <p className="font-display text-sm text-gold">Portal do Cliente</p>
        <p className="mb-3 text-[0.55rem] text-muted-foreground">Seu espaço do mês</p>
        <div className="space-y-2">
          <div className="rounded-xl border border-gold/25 bg-gold/5 p-2.5">
            <p className="text-[0.6rem] text-foreground/90">Direcionamento da semana</p>
            <div className="mt-2 space-y-1.5">
              <Bar w="85%" />
              <Bar w="62%" />
            </div>
          </div>
          {["Minha agenda", "Minhas leituras", "Biblioteca"].map((t) => (
            <div
              key={t}
              className="flex items-center justify-between rounded-xl bg-lavender/8 px-2.5 py-2"
            >
              <span className="text-[0.6rem] text-muted-foreground">{t}</span>
              <span className="h-1.5 w-1.5 rotate-45 border-r border-t border-gold/60" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Loja (tela menor). */
export function StoreScreen({ className }: { className?: string }) {
  return (
    <div className={cn("glass-card rounded-2xl p-3", className)}>
      <div className="mb-2.5 flex items-center justify-between">
        <span className="font-display text-xs tracking-[0.2em] text-gold/80">LOJA</span>
        <span className="text-[0.5rem] text-muted-foreground">5 itens</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {["Consulta", "Curso", "Mentoria", "Ritual"].map((t, i) => (
          <div key={t} className="rounded-xl border border-border/60 bg-lavender/5 p-2">
            <div
              className="mb-1.5 h-8 rounded-lg"
              style={{
                background:
                  i % 2
                    ? "linear-gradient(135deg, oklch(0.4 0.12 320 / 60%), oklch(0.3 0.1 280 / 40%))"
                    : "linear-gradient(135deg, oklch(0.5 0.09 300 / 45%), oklch(0.35 0.09 260 / 40%))",
              }}
            />
            <p className="text-[0.55rem] text-foreground/85">{t}</p>
            <p className="text-[0.55rem] text-gold/80">R$ ---</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function FloatingTag({ children, className }: { children: string; className?: string }) {
  return (
    <span
      className={cn(
        "glass-card gold-hairline absolute whitespace-nowrap rounded-full px-3 py-1.5 text-[0.6rem] uppercase tracking-[0.2em] text-gold/90 sm:text-[0.65rem]",
        className,
      )}
    >
      {children}
    </span>
  );
}
