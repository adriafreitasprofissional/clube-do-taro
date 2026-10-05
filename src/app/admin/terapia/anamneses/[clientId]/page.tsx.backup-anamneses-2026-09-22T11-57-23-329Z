"use client";

import {
  useEffect,
  useState,
} from "react";
import {
  useParams,
  useRouter,
} from "next/navigation";

import { supabase } from "@/lib/supabase";

type Registro = {
  id: string;
  client_id: string;
  professional: string;
  therapy_type: string;
  answers: Record<
    string,
    any
  >;
  status: string;
  submitted_at: string;
};

type Resposta = {
  cliente: {
    id: string;
    nome: string;
    nome_completo: string;
    email: string;
    slug: string;
  };

  anamnese:
    | Registro
    | null;
};

const SECOES = [
  {
    titulo: "Dados pessoais",
    campos: [
      ["dataNascimento", "Data de nascimento"],
      ["telefone", "Telefone / WhatsApp"],
      ["email", "E-mail"],
    ],
  },
  {
    titulo: "Motivo e objetivos",
    campos: [
      ["motivoPrincipal", "Motivo principal"],
      ["areasTrabalho", "Áreas para trabalhar"],
      ["objetivoCiclo", "Objetivo do ciclo"],
    ],
  },
  {
    titulo: "Momento atual",
    campos: [
      ["ansiedade", "Ansiedade / preocupação"],
      ["estresse", "Estresse"],
      ["sobrecarga", "Sobrecarga emocional"],
      ["qualidadeSono", "Qualidade do sono"],
      [
        "frequenciaPreocupacao",
        "Frequência das preocupações",
      ],
    ],
  },
  {
    titulo: "História emocional e familiar",
    campos: [
      ["relacaoFamilia", "Relação familiar"],
      ["padroesRepetidos", "Padrões repetidos"],
      ["padroesDescricao", "Descrição dos padrões"],
      [
        "passadoInfluencia",
        "Acontecimentos do passado",
      ],
    ],
  },
  {
    titulo: "Saúde e acompanhamentos",
    campos: [
      [
        "acompanhamentoSaude",
        "Acompanhamento de saúde",
      ],
      [
        "acompanhamentoDescricao",
        "Descrição do acompanhamento",
      ],
      ["medicamentos", "Medicamentos"],
      [
        "medicamentosDescricao",
        "Quais medicamentos",
      ],
      ["condicaoSaude", "Condição de saúde"],
      [
        "condicaoSaudeDescricao",
        "Descrição da condição",
      ],
    ],
  },
  {
    titulo: "Relações e limites",
    campos: [
      [
        "dificuldadeDizerNao",
        "Dificuldade para dizer não",
      ],
      [
        "culpaPriorizar",
        "Culpa ao se priorizar",
      ],
      [
        "responsabilidadeOutros",
        "Responsabilidade pelos outros",
      ],
      [
        "deixaNecessidades",
        "Deixa as próprias necessidades",
      ],
    ],
  },
  {
    titulo: "Apoio e recursos",
    campos: [
      ["redeApoio", "Rede de apoio"],
      ["recursosPessoais", "Recursos pessoais"],
      ["praticaPessoal", "Prática pessoal"],
      [
        "praticaDescricao",
        "Descrição da prática",
      ],
    ],
  },
  {
    titulo: "Observações finais",
    campos: [
      ["observacoes", "Observações"],
      ["consentimento", "Confirmação"],
    ],
  },
] as const;

function mostrarValor(valor: any) {
  if (
    valor === null ||
    valor === undefined ||
    valor === ""
  ) {
    return "Não informado";
  }

  if (Array.isArray(valor)) {
    return valor.length
      ? valor.join(", ")
      : "Não informado";
  }

  if (typeof valor === "boolean") {
    return valor
      ? "Confirmado"
      : "Não";
  }

  return String(valor);
}

export default function AdminAnamneseTRGPage() {
  const params = useParams();
  const router = useRouter();

  const clientId = String(
    params?.clientId || ""
  );

  const [dados, setDados] =
    useState<Resposta | null>(null);

  const [carregando, setCarregando] =
    useState(true);

  const [erro, setErro] =
    useState<string | null>(null);

  useEffect(() => {
    if (!clientId) return;

    async function carregar() {
      setCarregando(true);
      setErro(null);

      try {
        const {
          data: { session },
        } =
          await supabase.auth.getSession();

        if (!session?.access_token) {
          throw new Error(
            "Sessão administrativa expirada."
          );
        }

        const response = await fetch(
          `/api/admin/terapia/anamnese?client_id=${encodeURIComponent(
            clientId
          )}`,
          {
            cache: "no-store",
            headers: {
              Authorization:
                `Bearer ${session.access_token}`,
            },
          }
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data?.error ||
              "Não foi possível carregar a anamnese."
          );
        }

        setDados(data);
      } catch (error) {
        setErro(
          error instanceof Error
            ? error.message
            : "Não foi possível carregar a anamnese."
        );
      } finally {
        setCarregando(false);
      }
    }

    carregar();
  }, [clientId]);

  if (carregando) {
    return (
      <div className="rounded-2xl border border-purple-500/30 bg-[#28002f] p-6 text-purple-300">
        Carregando anamnese...
      </div>
    );
  }

  if (erro || !dados) {
    return (
      <div className="rounded-2xl border border-red-400/30 bg-red-400/10 p-6 text-red-200">
        {erro ||
          "Não foi possível carregar a anamnese."}
      </div>
    );
  }

  if (!dados.anamnese) {
    return (
      <div className="space-y-5">
        <button
          type="button"
          onClick={() =>
            router.back()
          }
          className="text-sm font-bold text-yellow-300"
        >
          ← Voltar
        </button>

        <div className="rounded-2xl border border-purple-500/30 bg-[#28002f] p-6">
          <h1 className="text-2xl font-bold text-white">
            {dados.cliente.nome}
          </h1>

          <p className="mt-2 text-sm text-purple-300">
            A anamnese ainda não foi enviada.
          </p>
        </div>
      </div>
    );
  }

  const respostas =
    dados.anamnese.answers || {};

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={() =>
          router.back()
        }
        className="text-sm font-bold text-yellow-300"
      >
        ← Voltar
      </button>

      <div className="rounded-2xl border border-purple-500/30 bg-[#28002f] p-6">
        <p className="text-sm text-yellow-300">
          Anamnese Inicial · Terapia TRG
        </p>

        <h1 className="mt-2 text-3xl font-semibold text-white">
          {dados.cliente.nome}
        </h1>

        <p className="mt-3 text-sm text-purple-300">
          Enviada em{" "}
          {new Date(
            dados.anamnese.submitted_at
          ).toLocaleString("pt-BR")}
        </p>
      </div>

      {SECOES.map((secao) => (
        <section
          key={secao.titulo}
          className="rounded-2xl border border-purple-500/30 bg-[#28002f] p-6"
        >
          <h2 className="text-lg font-semibold text-yellow-300">
            {secao.titulo}
          </h2>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {secao.campos.map(
              ([chave, label]) => (
                <div
                  key={chave}
                  className="rounded-xl border border-purple-500/20 bg-[#1d0023] p-4"
                >
                  <p className="text-xs uppercase tracking-wide text-purple-300">
                    {label}
                  </p>

                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-white">
                    {mostrarValor(
                      respostas[chave]
                    )}
                  </p>
                </div>
              )
            )}
          </div>
        </section>
      ))}
    </div>
  );
}
