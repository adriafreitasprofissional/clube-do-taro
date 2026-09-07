"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { adminFetch } from "../../components/adminFetch";

const secoes = [
  ["Dados pessoais", [
    ["dataNascimento", "Data de nascimento"],
    ["telefone", "Telefone / WhatsApp"],
    ["email", "E-mail"],
  ]],
  ["Motivo e objetivos", [
    ["motivoPrincipal", "Motivo principal"],
    ["areasTrabalho", "Áreas para trabalhar"],
    ["objetivoCiclo", "Objetivo do ciclo"],
  ]],
  ["Momento atual", [
    ["ansiedade", "Ansiedade / preocupação"],
    ["estresse", "Estresse"],
    ["sobrecarga", "Sobrecarga emocional"],
    ["qualidadeSono", "Qualidade do sono"],
    ["frequenciaPreocupacao", "Frequência das preocupações"],
  ]],
  ["História emocional e familiar", [
    ["relacaoFamilia", "Relação familiar"],
    ["padroesRepetidos", "Padrões repetidos"],
    ["padroesDescricao", "Descrição dos padrões"],
    ["passadoInfluencia", "Acontecimentos do passado"],
  ]],
  ["Saúde e acompanhamentos", [
    ["acompanhamentoSaude", "Acompanhamento de saúde"],
    ["acompanhamentoDescricao", "Descrição do acompanhamento"],
    ["medicamentos", "Medicamentos"],
    ["medicamentosDescricao", "Quais medicamentos"],
    ["condicaoSaude", "Condição de saúde"],
    ["condicaoSaudeDescricao", "Descrição da condição"],
  ]],
  ["Relações e limites", [
    ["dificuldadeDizerNao", "Dificuldade para dizer não"],
    ["culpaPriorizar", "Culpa ao se priorizar"],
    ["responsabilidadeOutros", "Responsabilidade pelos outros"],
    ["deixaNecessidades", "Deixa as próprias necessidades"],
  ]],
  ["Apoio e recursos", [
    ["redeApoio", "Rede de apoio"],
    ["recursosPessoais", "Recursos pessoais"],
    ["praticaPessoal", "Prática pessoal"],
    ["praticaDescricao", "Descrição da prática"],
  ]],
  ["Observações finais", [
    ["observacoes", "Observações"],
    ["consentimento", "Confirmação"],
  ]],
] as const;

function mostrar(v: any) {
  if (v === null || v === undefined || v === "") return "Não informado";
  if (Array.isArray(v)) return v.length ? v.join(", ") : "Não informado";
  if (typeof v === "boolean") return v ? "Confirmado" : "Não";
  return String(v);
}

export default function AnamneseDetalhePage() {
  const params = useParams();
  const router = useRouter();
  const clientId = String(params?.clientId || "");
  const [dados, setDados] = useState<any>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (!clientId) return;

    adminFetch(`/api/terapia/admin/anamneses/${encodeURIComponent(clientId)}`)
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data?.error || "Erro ao abrir anamnese.");
        setDados(data);
      })
      .catch((error) =>
        setErro(error instanceof Error ? error.message : "Erro ao abrir anamnese.")
      );
  }, [clientId]);

  if (erro) {
    return <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">{erro}</div>;
  }

  if (!dados) return <p className="text-[#6C8465]">Carregando anamnese...</p>;

  if (!dados.anamnese) {
    return (
      <div>
        <button onClick={() => router.back()} className="text-sm font-bold text-[#6C8465]">
          ← Voltar
        </button>

        <div className="mt-5 rounded-3xl border border-[#DCCFB8] bg-[#F7F1E4] p-6">
          <h1 className="text-2xl font-extrabold text-[#5E7357]">
            {dados.cliente.nome}
          </h1>
          <p className="mt-2 text-sm text-[#6C8465]">
            A anamnese ainda não foi enviada.
          </p>
        </div>
      </div>
    );
  }

  const respostas = dados.anamnese.answers || {};

  return (
    <div className="mx-auto max-w-6xl">
      <button onClick={() => router.back()} className="text-sm font-bold text-[#6C8465]">
        ← Voltar para Anamneses
      </button>

      <div className="mt-5 rounded-3xl border border-[#DCCFB8] bg-[#F7F1E4] p-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8AA27A]">
          Anamnese Inicial · Terapia TRG
        </p>

        <h1 className="mt-2 text-3xl font-extrabold text-[#5E7357]">
          {dados.cliente.nome}
        </h1>

        <p className="mt-2 text-sm text-[#6C8465]">
          Recebida em {new Date(dados.anamnese.submitted_at).toLocaleString("pt-BR")}
        </p>
      </div>

      <div className="mt-6 grid gap-5">
        {secoes.map(([titulo, campos]) => (
          <section
            key={titulo}
            className="rounded-3xl border border-[#DCCFB8] bg-[#F7F1E4] p-6"
          >
            <h2 className="text-lg font-extrabold text-[#5E7357]">
              {titulo}
            </h2>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {campos.map(([chave, label]) => (
                <div
                  key={chave}
                  className="rounded-2xl border border-[#E1D6C5] bg-white/70 p-4"
                >
                  <p className="text-xs font-bold uppercase tracking-wide text-[#7A8D73]">
                    {label}
                  </p>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#4F5E4A]">
                    {mostrar(respostas[chave])}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
