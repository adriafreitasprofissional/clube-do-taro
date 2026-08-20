"use client";

import {
  Sparkles,
  Compass,
  Target,
  Heart,
  User,
  Gem,
  Mountain,
  Eye,
  Calendar,
  CalendarDays,
  Sun,
  Layers,
  Crown,
  Infinity,
  ChevronRight,
    Palette,
  Lightbulb,
} from "lucide-react";

import { PremiumChapter } from "./PremiumChapter";

interface Props {
  resultado: any;
  selected: string | null;
  onSelect: (id: string | null) => void;
}

const chapters = [
  {
    id: "lifeLesson",
    number: "01",
    title: "Caminho de Vida",
    subtitle: "A direção essencial da sua jornada",
    icon: Compass,
    value: (r: any) => r.numerology.lifeLesson,
  },
  {
    id: "destiny",
    number: "02",
    title: "Destino",
    subtitle: "O potencial que você veio desenvolver",
    icon: Target,
    value: (r: any) => r.numerology.destiny,
  },
  {
    id: "expression",
    number: "03",
    title: "Expressão",
    subtitle: "Como sua essência se manifesta no mundo",
    icon: Gem,
    value: (r: any) => r.numerology.expression,
  },
  {
    id: "motivation",
    number: "04",
    title: "Motivação",
    subtitle: "O que move sua essência interior",
    icon: Heart,
    value: (r: any) => r.numerology.motivation,
  },
  {
    id: "impression",
    number: "05",
    title: "Impressão",
    subtitle: "A imagem que você transmite",
    icon: Eye,
    value: (r: any) => r.numerology.impression,
  },
  {
    id: "soul",
    number: "06",
    title: "Alma",
    subtitle: "Seus desejos mais profundos",
    icon: Heart,
    value: (r: any) => r.numerology.soul,
  },
  {
    id: "personality",
    number: "07",
    title: "Personalidade",
    subtitle: "A forma como você se apresenta",
    icon: User,
    value: (r: any) => r.numerology.personality,
  },
  {
    id: "mission",
    number: "08",
    title: "Missão",
    subtitle: "O propósito que orienta sua caminhada",
    icon: Target,
    value: (r: any) => r.numerology.mission,
  },
  {
    id: "maturity",
    number: "09",
    title: "Maturidade",
    subtitle: "A consciência que se desenvolve com o tempo",
    icon: Mountain,
    value: (r: any) => r.numerology.maturity,
  },
  {
    id: "personalYear",
    number: "10",
    title: "Ano Pessoal",
    subtitle: "A vibração do seu ciclo atual",
    icon: Calendar,
    value: (r: any) => r.numerology.personalYear,
  },
  {
    id: "personalMonth",
    number: "11",
    title: "Mês Pessoal",
    subtitle: "A energia do período que você atravessa",
    icon: CalendarDays,
    value: (r: any) => r.numerology.personalMonth,
  },
  {
    id: "personalDay",
    number: "12",
    title: "Dia Pessoal",
    subtitle: "A vibração específica do seu dia",
    icon: Sun,
    value: (r: any) => r.numerology.personalDay,
  },
  {
    id: "cycle1",
    number: "13",
    title: "Primeiro Ciclo",
    subtitle: "A primeira grande fase da sua vida",
    icon: Layers,
    value: (r: any) => r.numerology.cycles?.first ?? "-",
  },
  {
    id: "cycle2",
    number: "14",
    title: "Segundo Ciclo",
    subtitle: "A fase central de desenvolvimento",
    icon: Layers,
    value: (r: any) => r.numerology.cycles?.second ?? "-",
  },
  {
    id: "cycle3",
    number: "15",
    title: "Terceiro Ciclo",
    subtitle: "A fase de realização e síntese",
    icon: Layers,
    value: (r: any) => r.numerology.cycles?.third ?? "-",
  },
  {
    id: "pinnacle1",
    number: "16",
    title: "Primeiro Pináculo",
    subtitle: "A primeira grande oportunidade de realização",
    icon: Crown,
    value: (r: any) => r.numerology.pinnacles?.first ?? "-",
  },
  {
    id: "pinnacle2",
    number: "17",
    title: "Segundo Pináculo",
    subtitle: "A segunda fase de expansão",
    icon: Crown,
    value: (r: any) => r.numerology.pinnacles?.second ?? "-",
  },
  {
    id: "pinnacle3",
    number: "18",
    title: "Terceiro Pináculo",
    subtitle: "A fase de consolidação",
    icon: Crown,
    value: (r: any) => r.numerology.pinnacles?.third ?? "-",
  },
  {
    id: "pinnacle4",
    number: "19",
    title: "Quarto Pináculo",
    subtitle: "A síntese da experiência",
    icon: Crown,
    value: (r: any) => r.numerology.pinnacles?.fourth ?? "-",
  },
  {
  id: "energizing-colors",
  number: "20",
  title: "Cores Favoráveis",
  subtitle: "As cores que harmonizam e fortalecem sua energia",
  icon: Sparkles,
  value: () => "✦",
},

{
  id: "hiddenTalents",
  number: "21",
  title: "Talentos Ocultos",
  subtitle: "Potenciais que podem ser desenvolvidos ao longo da sua jornada",
  icon: Gem,
  value: () => "✦",
},
];

export function MapSummary({
  resultado,
  selected,
  onSelect,
}: Props) {
  const currentChapter =
    resultado?.interpretation?.chapters?.find(
      (chapter: any) => chapter.id === selected
    );

  const selectedDefinition =
    chapters.find((chapter) => chapter.id === selected);

  return (
    <section className="bg-[#170F29]">

      {/* CABEÇALHO DO LIVRO */}
      <header className="border-b border-[#4A3A72] bg-[#211536] px-8 py-12 md:px-12">

        <div className="mx-auto max-w-6xl">

          <div className="flex items-center gap-3">
            <Sparkles
              size={18}
              className="text-[#D4AF37]"
            />

            <span className="text-xs font-medium uppercase tracking-[0.45em] text-[#D4AF37]">
              Mapa Numerológico Premium
            </span>
          </div>

          <h2 className="mt-5 text-3xl font-light tracking-[0.08em] text-[#F5F2FF] md:text-4xl">
            Sumário da sua jornada
          </h2>

          <p className="mt-4 max-w-2xl text-[15px] leading-7 text-[#B7A8D6]">
            Explore cada dimensão do seu mapa. Escolha um capítulo para
            abrir sua leitura.
          </p>

        </div>

      </header>

      {/* LIVRO */}
      <div className="mx-auto max-w-6xl px-5 py-8 md:px-10 md:py-12">

        <div className="grid gap-8 lg:grid-cols-[330px_minmax(0,1fr)]">

          {/* ÍNDICE */}
          <aside className="h-fit rounded-[28px] border border-[#4A3A72] bg-[#211536] p-4 lg:sticky lg:top-6">

            <div className="px-4 pb-4 pt-3">

              <p className="text-[10px] uppercase tracking-[0.4em] text-[#D4AF37]">
                Índice
              </p>

              <p className="mt-2 text-sm text-[#A994C7]">
                Capítulos do mapa
              </p>

            </div>

            <div className="space-y-1">

              {chapters.map((chapter) => {

                const Icon = chapter.icon;
                const active = selected === chapter.id;

                return (
                  <button
                    key={chapter.id}
                    type="button"
                    onClick={() => onSelect(chapter.id)}
                    className={`group flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition-all ${
                      active
                        ? "border border-[#D4AF37]/30 bg-[#302044]"
                        : "border border-transparent hover:bg-[#2A1D3D]"
                    }`}
                  >

                    <span
                      className={`w-7 text-[11px] ${
                        active
                          ? "text-[#D4AF37]"
                          : "text-[#806D9E]"
                      }`}
                    >
                      {chapter.number}
                    </span>

                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${
                        active
                          ? "border-[#D4AF37]/50 text-[#D4AF37]"
                          : "border-[#5A467D] text-[#9E8BB9]"
                      }`}
                    >
                      <Icon size={16} />
                    </div>

                    <div className="min-w-0 flex-1">

                      <p
                        className={`truncate text-sm ${
                          active
                            ? "font-semibold text-[#F5F2FF]"
                            : "text-[#D8CEE9]"
                        }`}
                      >
                        {chapter.title}
                      </p>

                    </div>

                    {active && (
                      <ChevronRight
                        size={15}
                        className="text-[#D4AF37]"
                      />
                    )}

                  </button>
                );
              })}

              {/* DÍVIDAS KÁRMICAS */}
              <button
                type="button"
                onClick={() => onSelect("karmicDebts")}
                className={`group flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition-all ${
                  selected === "karmicDebts"
                    ? "border border-[#D4AF37]/30 bg-[#302044]"
                    : "border border-transparent hover:bg-[#2A1D3D]"
                }`}
              >
                <span className="w-7 text-[11px] text-[#806D9E]">
  22
</span>

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#5A467D] text-[#9E8BB9]">
                  <Infinity size={16} />
                </div>

                <p className="flex-1 truncate text-sm text-[#D8CEE9]">
                  Dívidas Kármicas
                </p>
              </button>

            </div>

          </aside>

          {/* ÁREA DE LEITURA */}
          <main className="min-w-0">

            {!selected && (
              <div className="flex min-h-[560px] items-center justify-center rounded-[32px] border border-[#4A3A72] bg-[#211536] px-8 py-16 text-center">

                <div className="max-w-md">

                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#D4AF37]/40 bg-[#1A132C]">
                    <Sparkles
                      size={28}
                      className="text-[#D4AF37]"
                    />
                  </div>

                  <p className="mt-8 text-xs uppercase tracking-[0.4em] text-[#D4AF37]">
                    Seu mapa
                  </p>

                  <h3 className="mt-4 text-3xl font-light text-[#F5F2FF]">
                    Comece sua leitura
                  </h3>

                  <p className="mt-5 text-[15px] leading-8 text-[#A994C7]">
                    Escolha um capítulo no índice ao lado para abrir
                    sua interpretação.
                  </p>

                </div>

              </div>
            )}

        {selected && currentChapter && (
  <div
    key={selected}
    className="animate-in fade-in slide-in-from-bottom-2 duration-500"
  >

    <button
      type="button"
      onClick={() => onSelect(null)}
      className="mb-6 flex items-center gap-2 text-sm font-medium text-[#D4AF37] transition hover:text-[#F1D36A]"
    >
      ← Voltar ao Sumário
    </button>

    {/* ====================================================== */}
    {/* CORES FAVORÁVEIS */}
    {/* ====================================================== */}

    {selected === "energizing-colors" ? (

      <div className="overflow-hidden rounded-[32px] border border-[#4A3A72] bg-[#211536]">

        <div className="border-b border-[#4A3A72] px-8 py-10 text-center">

          <div className="flex items-center justify-center gap-3">
            <Palette
              size={20}
              className="text-[#D4AF37]"
            />

            <span className="text-xs uppercase tracking-[0.4em] text-[#D4AF37]">
              Capítulo 20
            </span>
          </div>

          <h2 className="mt-5 text-3xl font-light text-[#F5F2FF] md:text-4xl">
            Cores Favoráveis
          </h2>

          <p className="mt-3 text-sm text-[#A994C7]">
            As cores que harmonizam e fortalecem sua energia
          </p>

        </div>

        <div className="space-y-8 p-8 md:p-10">

          {/* CORES PRINCIPAIS */}

          <div>

            <h3 className="mb-5 text-sm font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">
              Cores principais
            </h3>

            <div className="flex flex-wrap gap-8">

              <div className="text-center">

                <div
                  className="mx-auto h-24 w-24 rounded-full border-4 border-[#D4AF37] shadow-[0_0_30px_rgba(139,92,246,.45)]"
                  style={{
                    background:
                      currentChapter.content?.mainColorHex ||
                      "#7C3AED",
                  }}
                />

                <p className="mt-4 text-lg font-medium text-[#F5F2FF]">
                  {currentChapter.content?.mainColor || "Violeta"}
                </p>

              </div>

            </div>

          </div>

          {/* CORES COMPLEMENTARES */}

          <div>

            <h3 className="mb-5 text-sm font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">
              Cores complementares
            </h3>

            <div className="flex flex-wrap gap-8">

              {(currentChapter.content?.complementaryColors || "Branco • Dourado")
                .split("•")
                .map((cor: string, index: number) => {

                  const nome = cor.trim();

                  const hex =
                    nome.toLowerCase().includes("branco")
                      ? "#FFFFFF"
                      : nome.toLowerCase().includes("dourado")
                      ? "#E7C96F"
                      : "#8B5CF6";

                  return (
                    <div
                      key={index}
                      className="text-center"
                    >

                      <div
                        className="mx-auto h-20 w-20 rounded-full border-2 border-[#D4AF37] shadow-[0_0_22px_rgba(212,175,55,.25)]"
                        style={{
                          background: hex,
                        }}
                      />

                      <p className="mt-3 text-sm font-medium text-[#F5F2FF]">
                        {nome}
                      </p>

                    </div>
                  );
                })}

            </div>

          </div>

          {/* ENERGIA */}

          <div className="rounded-2xl border border-[#4A3A72] bg-[#1A132C] p-6">

            <div className="flex items-center gap-3">

              <Sparkles
                size={20}
                className="text-[#D4AF37]"
              />

              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
                Energia das cores
              </h3>

            </div>

            <p className="mt-4 leading-7 text-[#D8CEE9]">
              {currentChapter.content?.energy ||
                "Essas cores ajudam a harmonizar e fortalecer sua energia."}
            </p>

          </div>

          {/* DIRECIONAMENTO */}

          <div className="rounded-2xl border border-[#D4AF37]/30 bg-[#24183A] p-6">

            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
              Direcionamento
            </h3>

            <p className="mt-4 leading-7 text-[#D8CEE9]">
              {currentChapter.content?.direction ||
                "Utilize essas cores conscientemente em momentos em que deseja fortalecer sua energia."}
            </p>

          </div>

        </div>

      </div>

    ) : selected === "hiddenTalents" ? (

      /* ====================================================== */
      /* TALENTOS OCULTOS */
      /* ====================================================== */

      <div className="overflow-hidden rounded-[32px] border border-[#4A3A72] bg-[#211536]">

        <div className="border-b border-[#4A3A72] px-8 py-10 text-center">

          <div className="flex items-center justify-center gap-3">
            <Lightbulb
              size={20}
              className="text-[#D4AF37]"
            />

            <span className="text-xs uppercase tracking-[0.4em] text-[#D4AF37]">
              Capítulo 21
            </span>
          </div>

          <h2 className="mt-5 text-3xl font-light text-[#F5F2FF] md:text-4xl">
            Talentos Ocultos
          </h2>

          <p className="mt-3 text-sm text-[#A994C7]">
            Potenciais que podem ser desenvolvidos ao longo da sua jornada
          </p>

        </div>

        <div className="space-y-5 p-8 md:p-10">

          {resultado?.interpretation?.chapters
            ?.filter(
              (chapter: any) =>
                chapter.id.startsWith("hidden-tendency-")
            )
            .map((chapter: any) => (

              <div
                key={chapter.id}
                className="rounded-2xl border border-[#4A3A72] bg-[#1A132C] p-6"
              >

                <div className="flex items-start gap-4">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#D4AF37]/40 bg-[#24183A]">

                    <Lightbulb
                      size={20}
                      className="text-[#D4AF37]"
                    />

                  </div>

                  <div>

                    <h3 className="text-xl font-medium text-[#F5F2FF]">
                      {chapter.title}
                    </h3>

                    <div className="mt-3 leading-7 text-[#C7B9DC]">
                      {typeof chapter.content === "string"
                        ? chapter.content
                        : Object.values(chapter.content || {})
                            .filter(Boolean)
                            .map(String)
                            .join(" ")}
                    </div>

                  </div>

                </div>

              </div>

            ))}

          {!resultado?.interpretation?.chapters?.some(
            (chapter: any) =>
              chapter.id.startsWith("hidden-tendency-")
          ) && (

            <div className="rounded-2xl border border-[#4A3A72] bg-[#1A132C] p-8 text-center">

              <Lightbulb
                size={28}
                className="mx-auto text-[#D4AF37]"
              />

              <h3 className="mt-4 text-xl font-medium text-[#F5F2FF]">
                Nenhum talento oculto identificado
              </h3>

              <p className="mt-3 text-sm leading-7 text-[#A994C7]">
                Não foram encontrados talentos ocultos nos números analisados.
              </p>

            </div>

          )}

        </div>

      </div>

    ) : (

      /* ====================================================== */
      /* CAPÍTULOS NORMAIS */
      /* ====================================================== */

      <PremiumChapter
        title={
          selectedDefinition?.title ||
          currentChapter.title
        }
        number={
          selectedDefinition
            ? selectedDefinition.value(resultado)
            : "—"
        }
        subtitle={
          selectedDefinition?.subtitle ||
          "Uma dimensão importante da sua jornada."
        }
        content={currentChapter.content}
      />

    )}

  </div>
)}   

            {selected === "karmicDebts" && (
              <div className="space-y-6">

                {resultado?.numerology?.karmicDebts?.length ? (
                  resultado.numerology.karmicDebts.map(
                    (debt: number) => {

                      const chapter =
                        resultado?.interpretation?.chapters?.find(
                          (item: any) =>
                            item.id === `debt-${debt}`
                        );

                      if (!chapter) return null;

                      return (
                        <PremiumChapter
                          key={debt}
                          title={chapter.title}
                          number={debt}
                          content={chapter.content}
                        />
                      );
                    }
                  )
                ) : (
                  <div className="rounded-[32px] border border-[#4A3A72] bg-[#211536] px-8 py-16 text-center">

                    <Infinity
                      size={28}
                      className="mx-auto text-[#D4AF37]"
                    />

                    <h3 className="mt-5 text-2xl font-light text-[#F5F2FF]">
                      Nenhuma dívida kármica identificada
                    </h3>

                    <p className="mt-4 text-sm leading-7 text-[#A994C7]">
                      Não foram encontradas dívidas kármicas nos
                      números analisados.
                    </p>

                  </div>
                )}

              </div>
            )}

          </main>

        </div>

      </div>

    </section>
  );
}