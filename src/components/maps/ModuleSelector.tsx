"use client";

export interface ModuleSelection {
  numerology: boolean;
  astrology: boolean;
  nominal: boolean;
  cards: boolean;
  business: boolean;
  couple: boolean;
  baby: boolean;
  house: boolean;
  dating: boolean;
}

interface ModuleSelectorProps {
  value: ModuleSelection;
  onChange: (value: ModuleSelection) => void;
}

const modules = [
  {
    key: "numerology",
    icon: "🔢",
    title: "Numerologia",
    description: "Missão de Vida",
  },
  {
    key: "astrology",
    icon: "✨",
    title: "Astrologia",
    description: "Mapa Astral",
  },
  {
    key: "nominal",
    icon: "📝",
    title: "Nominal",
    description: "Nome de Nascimento",
  },
  {
    key: "business",
    icon: "💼",
    title: "Empresa",
    description: "Energia do Negócio",
  },
  {
    key: "couple",
    icon: "❤️",
    title: "Casal",
    description: "Compatibilidade",
  },
  {
    key: "baby",
    icon: "👶",
    title: "Bebê",
    description: "Potenciais",
  },
  {
    key: "house",
    icon: "🏡",
    title: "Casa",
    description: "Energia do Lar",
  },
  {
    key: "cards",
    icon: "🃏",
    title: "Cartas",
    description: "Direcionamento",
  },
  {
    key: "dating",
    icon: "💕",
    title: "Namorados",
    description: "Relacionamento",
  },
] as const;

export default function ModuleSelector({
  value,
  onChange,
}: ModuleSelectorProps) {
  function toggle(key: keyof ModuleSelection) {
    onChange({
      ...value,
      [key]: !value[key],
    });
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {modules.map((module) => (
        <button
          key={module.key}
          type="button"
          onClick={() => toggle(module.key)}
          className={`rounded-3xl border p-6 text-left transition-all duration-300 ${
            value[module.key]
              ? "border-[#B794F6] bg-[#3A2A59]"
              : "border-[#43325F] bg-[#24183A] hover:border-[#9F8AC9] hover:bg-[#2C2047]"
          }`}
        >
          <div className="text-4xl">
            {module.icon}
          </div>

          <h3 className="mt-4 text-xl font-bold text-[#F5F2FF]">
            {module.title}
          </h3>

          <p className="mt-2 text-sm text-[#B8A8D9]">
            {module.description}
          </p>

          <div className="mt-6">
            {value[module.key] ? (
              <span className="rounded-full border border-[#B794F6] bg-[#4B3572] px-4 py-2 text-sm font-semibold text-white">
  ✦ Incluído
</span>
            ) : (
              <span className="rounded-full border border-[#43325F] bg-[#24183A] px-4 py-2 text-sm text-[#B8A8D9] hover:border-[#9F8AC9] hover:bg-[#2C2047]">
                Selecionar
              </span>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}