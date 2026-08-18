"use client";

import {
  Compass,
  Gem,
  Heart,
  User,
  Target,
  Mountain,
  AlertTriangle,
  Infinity,
  Calendar,
  CalendarDays,
  Sun,
} from "lucide-react";

interface Props {
  resultado: any;
}

const items = [
  {
    title: "Caminho de Vida",
    value: (r: any) => r.numerology.lifeLesson,
    icon: Compass,
  },
  {
    title: "Destino",
    value: (r: any) => r.numerology.destiny,
    icon: Target,
  },
  {
    title: "Alma",
    value: (r: any) => r.numerology.soul,
    icon: Heart,
  },
  {
    title: "Personalidade",
    value: (r: any) => r.numerology.personality,
    icon: User,
  },
  {
    title: "Missão",
    value: (r: any) => r.numerology.mission,
    icon: Gem,
  },
  {
    title: "Maturidade",
    value: (r: any) => r.numerology.maturity,
    icon: Mountain,
  },
  {
    title: "Desafios",
    value: (r: any) => r.numerology.challenge,
    icon: AlertTriangle,
  },
  {
    title: "Dívidas Kármicas",
    value: (r: any) =>
      r.numerology.karmicDebts?.join(", ") || "Nenhuma",
    icon: Infinity,
  },
  {
    title: "Ano Pessoal",
    value: (r: any) => r.numerology.personalYear,
    icon: Calendar,
  },
  {
    title: "Mês Pessoal",
    value: (r: any) => r.numerology.personalMonth,
    icon: CalendarDays,
  },
  {
    title: "Dia Pessoal",
    value: (r: any) => r.numerology.personalDay,
    icon: Sun,
  },
];

export function GenerateStepNumerology({
  resultado,
}: Props) {
  return (
    <section className="mt-10 overflow-hidden rounded-3xl border border-yellow-500/20 bg-[#22163A] shadow-xl">

      <div className="border-b border-yellow-500/10 px-10 py-8">

        <h2 className="text-3xl font-light tracking-[0.25em] uppercase text-yellow-400">
          Numerologia Cabalística
        </h2>

        <p className="mt-4 max-w-3xl text-lg leading-8 text-[#B7A8D6]">
          Os números revelam padrões, potenciais e aprendizados da sua
          jornada. Cada vibração representa uma parte importante da sua
          missão de vida.
        </p>

      </div>

      <div className="grid gap-6 p-10 md:grid-cols-2 xl:grid-cols-3">

        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="group rounded-3xl border border-yellow-500/10 bg-[#2B1F46] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-yellow-500/40 hover:shadow-[0_0_25px_rgba(212,175,55,.12)]"
            >
              <div className="flex items-center gap-3">

                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-yellow-500/20 bg-[#1A132C]">

                  <Icon
                    size={22}
                    className="text-yellow-400"
                  />

                </div>

                <h3 className="text-lg font-semibold text-[#F5F1E8]">
                  {item.title}
                </h3>

              </div>

              <div className="mt-8 flex items-center justify-center rounded-2xl border border-yellow-500/10 bg-[#1A132C] py-8">

                <span className="text-5xl font-light text-yellow-400">
                  {item.value(resultado) ?? "-"}
                </span>

              </div>

            </div>
          );
        })}

      </div>

    </section>
  );
}