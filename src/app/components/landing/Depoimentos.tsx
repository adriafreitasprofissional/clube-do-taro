"use client";

const depoimentos = [
  {
    nome: "Patrícia M.",
    texto:
      "As orientações semanais me ajudam a enxergar situações que eu não conseguia perceber sozinha. Hoje tomo decisões com muito mais segurança.",
  },
  {
    nome: "Fernanda R.",
    texto:
      "O Clube do Tarô se tornou um momento especial da minha semana. Sempre recebo exatamente a mensagem que precisava ouvir.",
  },
  {
    nome: "Juliana S.",
    texto:
      "É muito mais do que uma leitura de cartas. É acolhimento, direcionamento e crescimento espiritual.",
  },
];

export default function Depoimentos() {
  return (
    <section className="py-24 px-6 bg-[#12061E]">
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-16">
          <span className="inline-block text-yellow-400 uppercase tracking-[0.3em] text-sm font-semibold mb-4">
            Depoimentos
          </span>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Quem já faz parte do Clube do Tarô
          </h2>

          <p className="max-w-3xl mx-auto text-lg text-gray-300 leading-relaxed">
            Mulheres que encontraram clareza, direcionamento e mais confiança
            para viver cada fase da vida.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {depoimentos.map((item, index) => (
            <div
              key={index}
              className="
                bg-[#1B0C2F]
                border border-yellow-500/25
                rounded-3xl
                p-8
                transition-all
                duration-300
                hover:-translate-y-2
                hover:border-yellow-400
                hover:shadow-2xl
                hover:shadow-yellow-500/10
              "
            >
              <div className="text-yellow-400 text-xl mb-6 tracking-wider">
                ★★★★★
              </div>

              <p className="text-gray-300 leading-8 italic mb-8">
                “{item.texto}”
              </p>

              <div className="border-t border-yellow-500/15 pt-6">
                <h3 className="text-white font-semibold">{item.nome}</h3>

                <span className="text-sm text-yellow-400">
                  Assinante do Clube
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}