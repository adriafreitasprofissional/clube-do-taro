"use client";

import {
  Sparkles,
  Star,
  Heart,
  Compass,
  WandSparkles,
  Shield,
  MoonStar,
} from "lucide-react";

interface Props {
  title: string;
  number: string | number;
  subtitle?: string;
  content: string;
}

function formatContent(content: string) {
  return content
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function SectionIcon({ title }: { title: string }) {
  const value = title.toLowerCase();

  if (value === "dons") {
    return <Star size={24} strokeWidth={1.5} />;
  }

  if (value === "desafios") {
    return <Shield size={24} strokeWidth={1.5} />;
  }

  if (value === "missão") {
    return <Compass size={24} strokeWidth={1.5} />;
  }

  if (value.includes("conselho")) {
    return <Heart size={24} strokeWidth={1.5} />;
  }

  if (value === "significado") {
    return <WandSparkles size={24} strokeWidth={1.5} />;
  }

  return <MoonStar size={24} strokeWidth={1.5} />;
}

function sectionStyle(title: string) {
  const value = title.toLowerCase();

  if (value === "dons") {
    return {
      color: "#9BE3A7",
      border: "#5FAE70",
      glow: "rgba(115,220,130,0.12)",
    };
  }

  if (value === "desafios") {
    return {
      color: "#F0CE65",
      border: "#B89535",
      glow: "rgba(212,175,55,0.12)",
    };
  }

  if (value === "missão") {
    return {
      color: "#C9A5F4",
      border: "#8D69B7",
      glow: "rgba(185,148,232,0.12)",
    };
  }

  if (value.includes("conselho")) {
    return {
      color: "#7CDAE8",
      border: "#4C9DA9",
      glow: "rgba(80,210,230,0.10)",
    };
  }

  return {
    color: "#E6C65C",
    border: "#A88B32",
    glow: "rgba(212,175,55,0.10)",
  };
}

export function PremiumChapter({
  title,
  number,
  subtitle,
  content,
}: Props) {
  const lines = formatContent(content);

  return (
    <article className="relative mx-auto w-full max-w-5xl overflow-hidden rounded-[38px] border border-[#614879] bg-[#0B0712] shadow-[0_30px_90px_rgba(0,0,0,0.45)]">

      {/* BRILHO DE FUNDO */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[700px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(117,72,168,0.22),transparent_68%)]" />

      {/* ESTRELAS DECORATIVAS */}
      <Star
        className="pointer-events-none absolute left-8 top-12 text-[#D4AF37]/60"
        size={15}
        fill="currentColor"
      />

      <Sparkles
        className="pointer-events-none absolute right-10 top-24 text-[#C9A5F4]/60"
        size={18}
      />

      <Star
        className="pointer-events-none absolute right-24 top-12 text-[#F1D36A]/40"
        size={9}
        fill="currentColor"
      />

      <Sparkles
        className="pointer-events-none absolute bottom-[300px] left-8 text-[#B994E8]/30"
        size={16}
      />

      <Star
        className="pointer-events-none absolute bottom-[180px] right-8 text-[#D4AF37]/40"
        size={11}
        fill="currentColor"
      />

      {/* CABEÇALHO */}
      <header className="relative px-7 pb-14 pt-16 text-center md:px-16 md:pb-20 md:pt-20">

        <div className="mx-auto flex items-center justify-center gap-4">
          <span className="h-px w-12 bg-gradient-to-r from-transparent to-[#D4AF37]" />

          <Sparkles
            size={20}
            className="text-[#D4AF37]"
          />

          <span className="h-px w-12 bg-gradient-to-l from-transparent to-[#D4AF37]" />
        </div>

        <p className="mt-7 text-[11px] font-semibold uppercase tracking-[0.55em] text-[#D4AF37]">
          Capítulo {number}
        </p>

        <h1 className="mt-7 text-4xl font-light leading-tight tracking-[0.03em] text-[#FFF8EA] md:text-6xl">
          {title}
        </h1>

        <div className="mx-auto mt-7 flex items-center justify-center gap-3">
          <span className="h-px w-10 bg-[#6C4D8B]" />
          <span className="h-1 w-1 rounded-full bg-[#D4AF37]" />
          <span className="h-px w-10 bg-[#6C4D8B]" />
        </div>

        {subtitle && (
          <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-[#D7C9E7] md:text-xl md:leading-9">
            {subtitle}
          </p>
        )}

        {/* NÚMERO */}
        <div className="relative mx-auto mt-10 flex h-28 w-28 items-center justify-center rounded-full border border-[#D4AF37]/70 bg-[#120B1C] shadow-[0_0_45px_rgba(212,175,55,0.15)]">

          <div className="absolute inset-2 rounded-full border border-[#8D69B7]/30" />

          <span className="text-5xl font-light text-[#F1D36A]">
            {number}
          </span>

        </div>

      </header>

      {/* LINHA DE LUZ */}
      <div className="mx-auto h-px w-[82%] bg-gradient-to-r from-transparent via-[#684C85] to-transparent" />

      {/* LEITURA */}
      <div className="relative px-7 py-12 md:px-16 md:py-16">

        <div className="mx-auto max-w-4xl space-y-12 md:space-y-16">

          {lines.map((line, index) => {

            const lower = line.toLowerCase();

            const isTitle =
              lower === "significado" ||
              lower === "dons" ||
              lower === "desafios" ||
              lower === "missão" ||
              lower === "conselho" ||
              lower === "conselho espiritual" ||
              lower === "conselho prático";

            if (isTitle) {
              const style = sectionStyle(line);

              return (
                <div
                  key={`${line}-${index}`}
                  className="relative pt-2"
                >

                  <div className="flex items-center gap-5">

                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border"
                      style={{
                        color: style.color,
                        borderColor: style.border,
                        backgroundColor: style.glow,
                        boxShadow: `0 0 25px ${style.glow}`,
                      }}
                    >
                      <SectionIcon title={line} />
                    </div>

                    <div className="flex-1">

                      <div className="flex items-center gap-4">

                        <h2
                          className="text-xl font-semibold tracking-[0.08em] md:text-2xl"
                          style={{ color: style.color }}
                        >
                          {line}
                        </h2>

                        <div
                          className="h-px flex-1 opacity-40"
                          style={{ backgroundColor: style.border }}
                        />

                      </div>

                    </div>

                  </div>

                </div>
              );
            }

            return (
              <p
                key={`${line}-${index}`}
                className="max-w-4xl text-[18px] leading-[1.9] text-[#F2ECF8] md:text-[19px] md:leading-[1.95]"
              >
                {line}
              </p>
            );
          })}

        </div>

      </div>

      {/* FECHAMENTO */}
      <footer className="relative px-7 pb-14 pt-4 text-center md:px-16 md:pb-16">

        <div className="mx-auto flex items-center justify-center gap-3">

          <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#76569D]" />

          <Sparkles
            size={18}
            className="text-[#D4AF37]"
          />

          <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#76569D]" />

        </div>

        <p className="mt-6 text-xs uppercase tracking-[0.35em] text-[#9F89B7]">
          Leitura do seu Mapa
        </p>

      </footer>

    </article>
  );
}