"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const perguntas = [
  {
    pergunta: "Como funciona o Clube do Tarô?",
    resposta:
      "Ao assinar, você recebe acesso à área exclusiva do clube, onde encontrará direcionamentos, conteúdos e materiais de acordo com o seu plano.",
  },
  {
    pergunta: "Posso cancelar quando quiser?",
    resposta:
      "Sim. Os planos mensais podem ser cancelados a qualquer momento, sem fidelidade.",
  },
  {
    pergunta: "Qual a diferença entre os planos?",
    resposta:
      "Cada plano oferece uma quantidade diferente de benefícios, conteúdos exclusivos e direcionamentos personalizados.",
  },
  {
    pergunta: "Quando recebo meu primeiro direcionamento?",
    resposta:
      "Assim que sua assinatura for confirmada, seu acesso é liberado e você já poderá aproveitar os conteúdos disponíveis do seu plano.",
  },
  {
    pergunta: "O atendimento é individual?",
    resposta:
      "Os direcionamentos exclusivos seguem os benefícios previstos em cada plano, respeitando os limites e recursos oferecidos.",
  },
];

export default function FAQ() {
  const [aberto, setAberto] = useState<number | null>(0);

  return (
    <section
  id="faq"
  className="py-24 px-6 bg-[#0E0617]"
>
      <div className="max-w-4xl mx-auto">

        <div className="text-center mb-16">
          <span className="text-yellow-400 uppercase tracking-[0.3em] text-sm font-semibold">
            FAQ
          </span>

          <h2 className="text-4xl md:text-5xl font-bold text-white mt-4">
            Perguntas Frequentes
          </h2>

          <p className="text-gray-300 mt-6 text-lg">
            Tire suas dúvidas antes de fazer parte do Clube.
          </p>
        </div>

        <div className="space-y-5">
          {perguntas.map((item, index) => (
            <div
              key={index}
              className="rounded-2xl border border-yellow-500/20 bg-[#1A0D2B]"
            >
              <button
                onClick={() =>
                  setAberto(aberto === index ? null : index)
                }
                className="w-full flex items-center justify-between px-7 py-6 text-left"
              >
                <span className="text-white font-semibold text-lg">
                  {item.pergunta}
                </span>

                <ChevronDown
                  className={`transition-transform duration-300 ${
                    aberto === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              {aberto === index && (
                <div className="px-7 pb-7 text-gray-300 leading-8">
                  {item.resposta}
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}