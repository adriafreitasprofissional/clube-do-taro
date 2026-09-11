"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export type TipoPerguntaIA =
  | "single_choice"
  | "multiple_choice"
  | "short_text"
  | "long_text"
  | "scale";

export type PerguntaIA = {
  type: TipoPerguntaIA;
  prompt: string;
  helper: string;
  options: string[];
  min: number;
  max: number;
  min_label: string;
  max_label: string;
};

export type QuizIA = {
  title: string;
  subtitle: string;
  instructions: string;
  questions: PerguntaIA[];
};

type ModoCriacao =
  | "manual"
  | "questions"
  | "full_quiz";

type QuizAiAssistantProps = {
  quizType: string;
  onApplyQuestions: (
    questions: PerguntaIA[]
  ) => void;
  onApplyFullQuiz: (
    quiz: QuizIA
  ) => void;
};

type ImproveQuestionButtonProps = {
  question: string;
  quizType: string;
  onImproved: (
    question: PerguntaIA
  ) => void;
  onError?: (message: string) => void;
};

async function chamarAgente(
  body: Record<string, unknown>
) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new Error(
      "Sessão administrativa expirada."
    );
  }

  const response = await fetch(
    "/api/admin/agents/quiz",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify(body),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error ||
        "Não foi possível gerar o conteúdo com IA."
    );
  }

  return data;
}

export function QuizAiAssistant({
  quizType,
  onApplyQuestions,
  onApplyFullQuiz,
}: QuizAiAssistantProps) {
  const [modo, setModo] =
    useState<ModoCriacao>("manual");

  const [tema, setTema] =
    useState("");

  const [objetivo, setObjetivo] =
    useState("");

  const [contexto, setContexto] =
    useState("");

  const [quantidade, setQuantidade] =
    useState(8);

  const [gerando, setGerando] =
    useState(false);

  const [erro, setErro] =
    useState<string | null>(null);

  const [mensagem, setMensagem] =
    useState<string | null>(null);

  async function gerar() {
    if (modo === "manual") {
      return;
    }

    if (!tema.trim()) {
      setErro(
        "Informe o tema central."
      );
      return;
    }

    setGerando(true);
    setErro(null);
    setMensagem(null);

    try {
      const data =
        await chamarAgente({
          mode: modo,
          theme: tema.trim(),
          goal:
            objetivo.trim(),
          context:
            contexto.trim(),
          count: Math.min(
            20,
            Math.max(
              1,
              Number(quantidade) || 1
            )
          ),
          quiz_type: quizType,
        });

      const quiz =
        data?.quiz as QuizIA;

      if (
        !quiz ||
        !Array.isArray(
          quiz.questions
        ) ||
        quiz.questions.length === 0
      ) {
        throw new Error(
          "O agente não retornou perguntas válidas."
        );
      }

      if (
        modo === "questions"
      ) {
        onApplyQuestions(
          quiz.questions
        );

        setMensagem(
          `${quiz.questions.length} pergunta(s) gerada(s). Revise e edite como desejar.`
        );
      }

      if (
        modo === "full_quiz"
      ) {
        onApplyFullQuiz(quiz);

        setMensagem(
          "Quiz completo criado. Revise antes de salvar ou publicar."
        );
      }
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro ao gerar conteúdo."
      );
    } finally {
      setGerando(false);
    }
  }

  return (
    <div className="mt-8 rounded-2xl border border-[#b7c28b]/20 bg-[#13170f]/65 p-5 md:p-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b7c28b]">
          Agente inteligente
        </p>

        <h3 className="mt-2 text-lg font-semibold text-white">
          Como você quer criar?
        </h3>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-white/45">
          Você continua no controle.
          A IA apenas ajuda a criar
          uma primeira versão que
          pode ser totalmente editada.
        </p>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-3">
        <BotaoModo
          ativo={
            modo === "manual"
          }
          titulo="✏️ Montar manualmente"
          descricao="Crie cada pergunta do seu jeito, como já funciona hoje."
          onClick={() =>
            setModo("manual")
          }
        />

        <BotaoModo
          ativo={
            modo === "questions"
          }
          titulo="✨ Gerar perguntas com IA"
          descricao="Informe o tema e quantas perguntas deseja."
          onClick={() =>
            setModo("questions")
          }
        />

        <BotaoModo
          ativo={
            modo === "full_quiz"
          }
          titulo="✨ Criar quiz completo com IA"
          descricao="A IA cria título, orientação e todas as perguntas."
          onClick={() =>
            setModo("full_quiz")
          }
        />
      </div>

      {modo === "manual" ? (
        <div className="mt-5 rounded-xl border border-white/8 bg-white/[0.025] p-4 text-sm leading-6 text-white/45">
          Continue usando o editor
          normalmente logo abaixo.
        </div>
      ) : (
        <div className="mt-5 rounded-2xl border border-[#b7c28b]/15 bg-[#1b2015]/70 p-5">
          <div className="grid gap-4 md:grid-cols-2">
            <CampoIA label="Tema central">
              <input
                type="text"
                value={tema}
                onChange={(e) =>
                  setTema(
                    e.target.value
                  )
                }
                placeholder="Ex.: autoestima, satisfação, experiência do cliente..."
                className={
                  inputClassIA
                }
              />
            </CampoIA>

            <CampoIA label="Quantidade de perguntas">
              <input
                type="number"
                min={1}
                max={20}
                value={quantidade}
                onChange={(e) =>
                  setQuantidade(
                    Number(
                      e.target.value
                    )
                  )
                }
                className={
                  inputClassIA
                }
              />
            </CampoIA>
          </div>

          <div className="mt-4">
            <CampoIA label="Objetivo">
              <input
                type="text"
                value={objetivo}
                onChange={(e) =>
                  setObjetivo(
                    e.target.value
                  )
                }
                placeholder="Ex.: compreender como a pessoa percebe essa situação"
                className={
                  inputClassIA
                }
              />
            </CampoIA>
          </div>

          <div className="mt-4">
            <CampoIA label="Contexto adicional — opcional">
              <textarea
                rows={3}
                value={contexto}
                onChange={(e) =>
                  setContexto(
                    e.target.value
                  )
                }
                placeholder="Acrescente apenas informações necessárias para orientar a criação. Evite nomes e dados pessoais."
                className={
                  inputClassIA
                }
              />
            </CampoIA>
          </div>

          <p className="mt-3 text-[11px] leading-5 text-white/35">
            O agente não recebe
            automaticamente dados da
            paciente, anamnese ou
            anotações da sessão.
          </p>

          {erro && (
            <div className="mt-4 rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-xs text-red-200">
              {erro}
            </div>
          )}

          {mensagem && (
            <div className="mt-4 rounded-xl border border-[#b7c28b]/20 bg-[#5c6c3d]/15 p-3 text-xs text-[#dce5c0]">
              {mensagem}
            </div>
          )}

          <button
            type="button"
            onClick={gerar}
            disabled={gerando}
            className="mt-5 rounded-xl bg-[#b8c68a] px-5 py-3 text-sm font-bold text-[#263019] transition hover:brightness-110 disabled:opacity-50"
          >
            {gerando
              ? "Criando..."
              : modo ===
                  "questions"
                ? "✨ Gerar perguntas"
                : "✨ Criar quiz completo"}
          </button>
        </div>
      )}
    </div>
  );
}

export function ImproveQuestionButton({
  question,
  quizType,
  onImproved,
  onError,
}: ImproveQuestionButtonProps) {
  const [gerando, setGerando] =
    useState(false);

  async function melhorar() {
    if (!question.trim()) {
      onError?.(
        "Escreva a pergunta antes de pedir uma melhoria para a IA."
      );
      return;
    }

    setGerando(true);

    try {
      const data =
        await chamarAgente({
          mode:
            "improve_question",
          question:
            question.trim(),
          quiz_type: quizType,
          goal:
            "Deixar a pergunta mais clara, natural, respeitosa e fácil de compreender.",
        });

      const pergunta =
        data?.quiz
          ?.questions?.[0] as
          | PerguntaIA
          | undefined;

      if (!pergunta) {
        throw new Error(
          "A IA não retornou uma pergunta válida."
        );
      }

      onImproved(pergunta);
    } catch (error) {
      onError?.(
        error instanceof Error
          ? error.message
          : "Não foi possível melhorar a pergunta."
      );
    } finally {
      setGerando(false);
    }
  }

  return (
    <button
      type="button"
      onClick={melhorar}
      disabled={
        gerando ||
        !question.trim()
      }
      className="rounded-lg border border-[#b7c28b]/25 bg-[#5c6c3d]/10 px-3 py-1.5 text-xs font-bold text-[#dce5c0] transition hover:bg-[#5c6c3d]/20 disabled:cursor-not-allowed disabled:opacity-30"
    >
      {gerando
        ? "Melhorando..."
        : "✨ Melhorar com IA"}
    </button>
  );
}

function BotaoModo({
  ativo,
  titulo,
  descricao,
  onClick,
}: {
  ativo: boolean;
  titulo: string;
  descricao: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border p-4 text-left transition ${
        ativo
          ? "border-[#b7c28b]/45 bg-[#5c6c3d]/25"
          : "border-white/10 bg-white/[0.025] hover:border-[#b7c28b]/25 hover:bg-[#5c6c3d]/10"
      }`}
    >
      <span className="block text-sm font-bold text-white">
        {titulo}
      </span>

      <span className="mt-2 block text-xs leading-5 text-white/45">
        {descricao}
      </span>
    </button>
  );
}

function CampoIA({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold text-white/60">
        {label}
      </span>

      {children}
    </label>
  );
}

const inputClassIA =
  "w-full rounded-xl border border-[#b7c28b]/20 bg-[#13170f]/80 px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-[#b7c28b]/50";