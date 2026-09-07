"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import ProgressBar from "./ProgressBar";

import Passo1 from "./anamnese/Passo1";
import Passo2 from "./anamnese/Passo2";
import Passo3 from "./anamnese/Passo3";
import Passo4 from "./anamnese/Passo4";
import Passo5 from "./anamnese/Passo5";
import Passo6 from "./anamnese/Passo6";
import Passo7 from "./anamnese/Passo7";
import Passo8 from "./anamnese/Passo8";

type Props = {
  token: string;
  nomeCliente: string;
  emailCliente: string;
};

const TOTAL = 8;

const estadoInicial = {
  dataNascimento: "",
  telefone: "",
  email: "",

  motivoPrincipal: "",
  areasTrabalho: [] as string[],
  objetivoCiclo: "",

  ansiedade: 5,
  estresse: 5,
  sobrecarga: 5,
  qualidadeSono: 5,
  frequenciaPreocupacao: "",

  relacaoFamilia: "",
  padroesRepetidos: "",
  padroesDescricao: "",
  passadoInfluencia: "",

  acompanhamentoSaude: "",
  acompanhamentoDescricao: "",
  medicamentos: "",
  medicamentosDescricao: "",
  condicaoSaude: "",
  condicaoSaudeDescricao: "",

  dificuldadeDizerNao: 5,
  culpaPriorizar: 5,
  responsabilidadeOutros: 5,
  deixaNecessidades: "",

  redeApoio: "",
  recursosPessoais: "",
  praticaPessoal: "",
  praticaDescricao: "",

  observacoes: "",
  consentimento: false,
};

export default function AnamneseTRGWizard({
  token,
  nomeCliente,
  emailCliente,
}: Props) {
  const router = useRouter();

  const [step, setStep] =
    useState(1);

  const [dados, setDados] =
    useState({
      ...estadoInicial,
      email: emailCliente || "",
    });

  const [loading, setLoading] =
    useState(false);

  const [erro, setErro] =
    useState<string | null>(null);

  const storageKey = useMemo(
    () =>
      `terapia_anamnese_${token}`,
    [token]
  );

  useEffect(() => {
    try {
      const salvo =
        window.localStorage.getItem(
          storageKey
        );

      if (!salvo) return;

      const convertido =
        JSON.parse(salvo);

      setDados((atual) => ({
        ...atual,
        ...convertido,
      }));
    } catch {
      // Se o navegador tiver um rascunho inválido,
      // apenas ignoramos.
    }
  }, [storageKey]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        storageKey,
        JSON.stringify(dados)
      );
    } catch {
      // O formulário continua funcionando
      // mesmo sem armazenamento local.
    }
  }, [dados, storageKey]);

  function validarEtapaAtual() {
    if (
      step === 1 &&
      !dados.dataNascimento
    ) {
      return "Informe sua data de nascimento.";
    }

    if (
      step === 2 &&
      !dados.motivoPrincipal.trim()
    ) {
      return "Conte brevemente o que fez você buscar terapia neste momento.";
    }

    if (
      step === 8 &&
      !dados.consentimento
    ) {
      return "Confirme as informações antes de enviar.";
    }

    return null;
  }

  function proximo() {
    const mensagem =
      validarEtapaAtual();

    if (mensagem) {
      setErro(mensagem);
      return;
    }

    setErro(null);

    setStep((atual) =>
      Math.min(TOTAL, atual + 1)
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function voltar() {
    setErro(null);

    setStep((atual) =>
      Math.max(1, atual - 1)
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function enviar() {
    const mensagem =
      validarEtapaAtual();

    if (mensagem) {
      setErro(mensagem);
      return;
    }

    setLoading(true);
    setErro(null);

    try {
      const response = await fetch(
        "/api/terapia/anamnese",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            token,
            answers: {
              ...dados,
              nomeCliente,
            },
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Não foi possível enviar sua anamnese."
        );
      }

      window.localStorage.removeItem(
        storageKey
      );

      router.replace(
        `/terapia/acesso/${token}?anamnese=enviada`
      );
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível enviar sua anamnese."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <ProgressBar
        step={step}
        total={TOTAL}
      />

      <div className="rounded-[32px] border border-[#DCCFB8] bg-white p-6 shadow-xl md:p-9">
        {erro && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {erro}
          </div>
        )}

        {step === 1 && (
          <Passo1
            dados={dados}
            setDados={setDados}
            nomeCliente={nomeCliente}
            emailCliente={emailCliente}
          />
        )}

        {step === 2 && (
          <Passo2
            dados={dados}
            setDados={setDados}
          />
        )}

        {step === 3 && (
          <Passo3
            dados={dados}
            setDados={setDados}
          />
        )}

        {step === 4 && (
          <Passo4
            dados={dados}
            setDados={setDados}
          />
        )}

        {step === 5 && (
          <Passo5
            dados={dados}
            setDados={setDados}
          />
        )}

        {step === 6 && (
          <Passo6
            dados={dados}
            setDados={setDados}
          />
        )}

        {step === 7 && (
          <Passo7
            dados={dados}
            setDados={setDados}
          />
        )}

        {step === 8 && (
          <Passo8
            dados={dados}
            setDados={setDados}
          />
        )}

        <div className="mt-9 flex flex-col-reverse gap-3 border-t border-[#EFE5D3] pt-6 sm:flex-row sm:justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={voltar}
              disabled={loading}
              className="rounded-xl border border-[#DCCFB8] px-6 py-3 text-sm font-bold text-[#5E7357] transition hover:bg-[#F7F1E4] disabled:opacity-50"
            >
              ← Voltar
            </button>
          ) : (
            <div />
          )}

          {step < TOTAL ? (
            <button
              type="button"
              onClick={proximo}
              className="rounded-xl bg-[#8AA27A] px-7 py-3 text-sm font-bold text-white shadow transition hover:bg-[#769566]"
            >
              Próximo →
            </button>
          ) : (
            <button
              type="button"
              onClick={enviar}
              disabled={loading}
              className="rounded-xl bg-[#8AA27A] px-7 py-3 text-sm font-bold text-white shadow transition hover:bg-[#769566] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Enviando..."
                : "Enviar minha anamnese"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
