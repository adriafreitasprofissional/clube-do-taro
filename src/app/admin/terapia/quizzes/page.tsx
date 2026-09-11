"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  ImproveQuestionButton,
  QuizAiAssistant,
  type PerguntaIA,
  type QuizIA,
} from "./QuizAiAssistant";

type Paciente = {
  id: string;
  nome: string;
  nome_completo?: string;
  email?: string;
};

type TipoPergunta =
  | "single_choice"
  | "multiple_choice"
  | "short_text"
  | "long_text"
  | "scale";

type Pergunta = {
  id: string;
  type: TipoPergunta;
  prompt: string;
  helper: string;
  options: string[];
  min: number;
  max: number;
  min_label: string;
  max_label: string;
};

type Quiz = {
  id: string;
  client_id: string;
  appointment_id?: string | null;
  title: string;
  subtitle?: string | null;
  source_notes?: string | null;
  instructions?: string | null;
  questions?: Pergunta[];
  status: string;
  quiz_type: string;
  published_at?: string | null;
  created_at: string;
  updated_at?: string | null;
};

function novaPergunta(): Pergunta {
  return {
    id: crypto.randomUUID(),
    type: "single_choice",
    prompt: "",
    helper: "",
    options: ["", ""],
    min: 0,
    max: 10,
    min_label: "",
    max_label: "",
  };
}

function statusTexto(status: string) {
  if (status === "published") return "PUBLICADO";
  if (status === "completed") return "CONCLUÃDO";
  if (status === "draft") return "RASCUNHO";
  return status.toUpperCase();
}

function tipoQuizTexto(tipo: string) {
  if (tipo === "feedback") return "Feedback";
  if (tipo === "reflection") return "ReflexÃ£o";
  if (tipo === "checkin") return "Check-in";
  return "TerapÃªutico";
}

function formatarData(valor?: string | null) {
  if (!valor) return "";

  return new Date(valor).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function QuizzesPage() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [mensagem, setMensagem] = useState<string | null>(null);

  const [editandoId, setEditandoId] = useState<string | null>(null);

  const [clientId, setClientId] = useState("");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [sourceNotes, setSourceNotes] = useState("");
  const [instructions, setInstructions] = useState("");
  const [quizType, setQuizType] = useState("therapeutic");
  const [questions, setQuestions] = useState<Pergunta[]>([
    novaPergunta(),
  ]);

  async function tokenAdmin() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      throw new Error("SessÃ£o administrativa expirada.");
    }

    return session.access_token;
  }

  async function carregar() {
    setCarregando(true);
    setErro(null);

    try {
      const token = await tokenAdmin();

      const [resPacientes, resQuizzes] = await Promise.all([
        fetch("/api/terapia/admin/dashboard", {
          cache: "no-store",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),

        fetch("/api/admin/terapia/quizzes", {
          cache: "no-store",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      const dadosPacientes = await resPacientes.json();
      const dadosQuizzes = await resQuizzes.json();

      if (!resPacientes.ok) {
        throw new Error(
          dadosPacientes?.error ||
            "NÃ£o foi possÃ­vel carregar as pacientes."
        );
      }

      if (!resQuizzes.ok) {
        throw new Error(
          dadosQuizzes?.error ||
            "NÃ£o foi possÃ­vel carregar os quizzes."
        );
      }

      setPacientes(
        Array.isArray(dadosPacientes?.clientes)
          ? dadosPacientes.clientes
          : []
      );

      setQuizzes(
        Array.isArray(dadosQuizzes?.quizzes)
          ? dadosQuizzes.quizzes
          : []
      );
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro ao carregar Quiz e Atividades."
      );
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  const nomePaciente = useMemo(() => {
    const mapa = new Map<string, string>();

    pacientes.forEach((paciente) => {
      mapa.set(paciente.id, paciente.nome);
    });

    return mapa;
  }, [pacientes]);

  function limparFormulario() {
    setEditandoId(null);
    setClientId("");
    setTitle("");
    setSubtitle("");
    setSourceNotes("");
    setInstructions("");
    setQuizType("therapeutic");
    setQuestions([novaPergunta()]);
    setErro(null);
    setMensagem(null);
  }

  function atualizarPergunta(
    id: string,
    campo: keyof Pergunta,
    valor: string | number | string[]
  ) {
    setQuestions((atual) =>
      atual.map((pergunta) =>
        pergunta.id === id
          ? {
              ...pergunta,
              [campo]: valor,
            }
          : pergunta
      )
    );
  }

  function adicionarPergunta() {
    setQuestions((atual) => [...atual, novaPergunta()]);
  }

  function removerPergunta(id: string) {
    setQuestions((atual) => {
      if (atual.length === 1) {
        return atual;
      }

      return atual.filter((pergunta) => pergunta.id !== id);
    });
  }

  function moverPergunta(index: number, direcao: -1 | 1) {
    const novoIndex = index + direcao;

    if (novoIndex < 0 || novoIndex >= questions.length) {
      return;
    }

    setQuestions((atual) => {
      const copia = [...atual];

      [copia[index], copia[novoIndex]] = [
        copia[novoIndex],
        copia[index],
      ];

      return copia;
    });
  }

  function adicionarOpcao(perguntaId: string) {
    setQuestions((atual) =>
      atual.map((pergunta) =>
        pergunta.id === perguntaId
          ? {
              ...pergunta,
              options: [...pergunta.options, ""],
            }
          : pergunta
      )
    );
  }

  function atualizarOpcao(
    perguntaId: string,
    index: number,
    valor: string
  ) {
    setQuestions((atual) =>
      atual.map((pergunta) => {
        if (pergunta.id !== perguntaId) {
          return pergunta;
        }

        const options = [...pergunta.options];
        options[index] = valor;

        return {
          ...pergunta,
          options,
        };
      })
    );
  }

  function removerOpcao(perguntaId: string, index: number) {
    setQuestions((atual) =>
      atual.map((pergunta) => {
        if (pergunta.id !== perguntaId) {
          return pergunta;
        }

        return {
          ...pergunta,
          options: pergunta.options.filter(
            (_, indice) => indice !== index
          ),
        };
      })
    );
  }

  function converterPerguntaIA(
    pergunta: PerguntaIA
  ): Pergunta {
    const tipo =
      pergunta.type || "single_choice";

    const ehEscolha =
      tipo === "single_choice" ||
      tipo === "multiple_choice";

    const opcoes =
      ehEscolha &&
      Array.isArray(pergunta.options) &&
      pergunta.options.length > 0
        ? pergunta.options
        : ehEscolha
          ? ["", ""]
          : [];

    return {
      id: crypto.randomUUID(),
      type: tipo,
      prompt: pergunta.prompt || "",
      helper: pergunta.helper || "",
      options: opcoes,
      min: Number.isFinite(Number(pergunta.min))
        ? Number(pergunta.min)
        : 0,
      max: Number.isFinite(Number(pergunta.max))
        ? Number(pergunta.max)
        : 10,
      min_label: pergunta.min_label || "",
      max_label: pergunta.max_label || "",
    };
  }

  function aplicarPerguntasIA(
    geradas: PerguntaIA[]
  ) {
    const novas =
      geradas.map(converterPerguntaIA);

    setQuestions((atual) => {
      const existentes =
        atual.filter((pergunta) =>
          pergunta.prompt.trim()
        );

      return existentes.length
        ? [...existentes, ...novas]
        : novas;
    });

    setErro(null);
    setMensagem(
      `${novas.length} pergunta(s) adicionada(s) pela IA. Revise antes de publicar.`
    );
  }

  function aplicarQuizCompletoIA(
    quiz: QuizIA
  ) {
    if (quiz.title) {
      setTitle(quiz.title);
    }

    if (quiz.subtitle) {
      setSubtitle(quiz.subtitle);
    }

    if (quiz.instructions) {
      setInstructions(quiz.instructions);
    }

    setQuestions(
      quiz.questions.map(
        converterPerguntaIA
      )
    );

    setErro(null);
    setMensagem(
      "Quiz completo criado pela IA. Revise antes de publicar."
    );
  }

  function aplicarMelhoriaIA(
    perguntaId: string,
    gerada: PerguntaIA
  ) {
    const convertida =
      converterPerguntaIA(gerada);

    setQuestions((atual) =>
      atual.map((pergunta) =>
        pergunta.id === perguntaId
          ? {
              ...convertida,
              id: pergunta.id,
            }
          : pergunta
      )
    );

    setErro(null);
    setMensagem(
      "Pergunta aprimorada pela IA."
    );
  }
  function prepararPerguntas() {
    return questions
      .filter((pergunta) => pergunta.prompt.trim())
      .map((pergunta) => ({
        id: pergunta.id,
        type: pergunta.type,
        prompt: pergunta.prompt.trim(),
        helper: pergunta.helper.trim() || null,

        options:
          pergunta.type === "single_choice" ||
          pergunta.type === "multiple_choice"
            ? pergunta.options
                .map((opcao) => opcao.trim())
                .filter(Boolean)
            : [],

        min:
          pergunta.type === "scale"
            ? Number(pergunta.min)
            : undefined,

        max:
          pergunta.type === "scale"
            ? Number(pergunta.max)
            : undefined,

        min_label:
          pergunta.type === "scale"
            ? pergunta.min_label.trim() || null
            : null,

        max_label:
          pergunta.type === "scale"
            ? pergunta.max_label.trim() || null
            : null,

        required: false,
        allow_skip: true,
        allow_stop: true,
      }));
  }

  async function salvar(status: "draft" | "published") {
    setErro(null);
    setMensagem(null);

    if (!clientId) {
      setErro("Escolha uma paciente.");
      return;
    }

    if (!title.trim()) {
      setErro("Informe o tÃ­tulo do quiz.");
      return;
    }

    const perguntasValidas = prepararPerguntas();

    if (perguntasValidas.length === 0) {
      setErro("Crie pelo menos uma pergunta.");
      return;
    }

    setSalvando(true);

    try {
      const token = await tokenAdmin();

      const corpo = {
        ...(editandoId ? { id: editandoId } : {}),
        client_id: clientId,
        title: title.trim(),
        subtitle: subtitle.trim() || null,
        source_notes: sourceNotes.trim() || null,
        instructions: instructions.trim() || undefined,
        quiz_type: quizType,
        questions: perguntasValidas,
        status,
      };

      const response = await fetch("/api/admin/terapia/quizzes", {
        method: editandoId ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(corpo),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "NÃ£o foi possÃ­vel salvar o quiz."
        );
      }

      setMensagem(
        status === "published"
          ? "Quiz publicado com sucesso."
          : "Rascunho salvo com sucesso."
      );

      limparFormulario();
      await carregar();
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro ao salvar quiz."
      );
    } finally {
      setSalvando(false);
    }
  }

  function editarQuiz(quiz: Quiz) {
    setEditandoId(quiz.id);
    setClientId(quiz.client_id || "");
    setTitle(quiz.title || "");
    setSubtitle(quiz.subtitle || "");
    setSourceNotes(quiz.source_notes || "");
    setInstructions(quiz.instructions || "");
    setQuizType(quiz.quiz_type || "therapeutic");

    const perguntas =
      Array.isArray(quiz.questions) && quiz.questions.length > 0
        ? quiz.questions.map((pergunta) => ({
            id: pergunta.id || crypto.randomUUID(),
            type: pergunta.type || "single_choice",
            prompt: pergunta.prompt || "",
            helper: pergunta.helper || "",
            options: Array.isArray(pergunta.options)
              ? pergunta.options.filter(
                  (opcao) =>
                    !opcao
                      .toLowerCase()
                      .includes("nÃ£o consigo responder")
                )
              : [],
            min: Number(pergunta.min ?? 0),
            max: Number(pergunta.max ?? 10),
            min_label: pergunta.min_label || "",
            max_label: pergunta.max_label || "",
          }))
        : [novaPergunta()];

    setQuestions(perguntas);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function alterarStatus(
    id: string,
    status: "published" | "archived"
  ) {
    if (
      status === "archived" &&
      !window.confirm("Deseja arquivar este quiz?")
    ) {
      return;
    }

    setErro(null);
    setMensagem(null);

    try {
      const token = await tokenAdmin();

      const response = await fetch("/api/admin/terapia/quizzes", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id,
          status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "NÃ£o foi possÃ­vel atualizar o quiz."
        );
      }

      setMensagem(
        status === "published"
          ? "Quiz publicado."
          : "Quiz arquivado."
      );

      await carregar();
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro ao atualizar quiz."
      );
    }
  }

  return (
    <div className="mx-auto max-w-7xl">
      {/* NAVEGAÃ‡ÃƒO */}
      <div className="mb-8 flex flex-wrap gap-4">
        <Link
          href="/admin/terapia"
          className="text-sm font-bold text-[#cbd69d]"
        >
          â† Terapia em Dia
        </Link>

        <Link
          href="/admin"
          className="text-sm font-bold text-white/50 transition hover:text-white"
        >
          Central de NegÃ³cios
        </Link>
      </div>

      {/* TOPO */}
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#b7c28b]">
          GestÃ£o terapÃªutica
        </p>

        <h1 className="mt-2 text-3xl font-semibold text-white">
          Quiz e Atividades
        </h1>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-white/55">
          Crie atividades personalizadas para apoiar o processo
          terapÃªutico entre as sessÃµes. Todas as perguntas permitem
          que a paciente pule, pare ou escolha nÃ£o responder.
        </p>
      </div>

      {erro && (
        <div className="mb-5 rounded-2xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200">
          {erro}
        </div>
      )}

      {mensagem && (
        <div className="mb-5 rounded-2xl border border-[#b7c28b]/30 bg-[#5c6c3d]/20 p-4 text-sm text-[#dce5c0]">
          {mensagem}
        </div>
      )}

      {/* FORMULÃRIO */}
      <section className="rounded-3xl border border-[#b7c28b]/20 bg-[linear-gradient(145deg,rgba(61,70,42,.40),rgba(27,31,20,.88))] p-5 md:p-7">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b7c28b]">
              {editandoId ? "Editando atividade" : "Nova atividade"}
            </p>

            <h2 className="mt-2 text-xl font-semibold text-white">
              {editandoId
                ? "Editar Quiz"
                : "Criar Quiz"}
            </h2>
          </div>

          {editandoId && (
            <button
              type="button"
              onClick={limparFormulario}
              className="rounded-xl border border-white/15 px-4 py-2 text-xs font-bold text-white/60 transition hover:bg-white/5"
            >
              Cancelar ediÃ§Ã£o
            </button>
          )}
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <Campo label="Paciente">
            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className={inputClass}
            >
              <option value="">Selecione a paciente</option>

              {pacientes.map((paciente) => (
                <option key={paciente.id} value={paciente.id}>
                  {paciente.nome}
                </option>
              ))}
            </select>
          </Campo>

          <Campo label="Tipo de atividade">
            <select
              value={quizType}
              onChange={(e) => setQuizType(e.target.value)}
              className={inputClass}
            >
              <option value="therapeutic">
                TerapÃªutico
              </option>
              <option value="reflection">
                ReflexÃ£o
              </option>
              <option value="checkin">
                Check-in
              </option>
              <option value="feedback">
                Feedback da sessÃ£o
              </option>
            </select>
          </Campo>

          <Campo label="TÃ­tulo">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex.: Mapa das Primeiras MemÃ³rias"
              className={inputClass}
            />
          </Campo>

          <Campo label="SubtÃ­tulo">
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Uma breve explicaÃ§Ã£o para a paciente"
              className={inputClass}
            />
          </Campo>
        </div>

        <div className="mt-5">
          <Campo label="Texto-base ou anotaÃ§Ãµes da sessÃ£o">
            <textarea
              value={sourceNotes}
              onChange={(e) => setSourceNotes(e.target.value)}
              rows={5}
              placeholder="Cole aqui suas anotaÃ§Ãµes para registrar o contexto usado na criaÃ§Ã£o da atividade."
              className={inputClass}
            />
          </Campo>
        </div>

        <div className="mt-5">
          <Campo label="OrientaÃ§Ã£o para a paciente">
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows={4}
              placeholder="Se deixar vazio, o sistema usarÃ¡ a orientaÃ§Ã£o segura padrÃ£o."
              className={inputClass}
            />
          </Campo>
        </div>

        <QuizAiAssistant
          quizType={quizType}
          onApplyQuestions={
            aplicarPerguntasIA
          }
          onApplyFullQuiz={
            aplicarQuizCompletoIA
          }
        />

        {/* PERGUNTAS */}
        <div className="mt-8 border-t border-[#b7c28b]/15 pt-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-white">
                Perguntas
              </h3>

              <p className="mt-1 text-xs text-white/45">
                VocÃª pode editar, mudar a ordem e escolher o tipo de
                resposta.
              </p>
            </div>

            <button
              type="button"
              onClick={adicionarPergunta}
              className="rounded-xl bg-[#5c6c3d]/30 px-4 py-2 text-xs font-bold text-[#dce5c0] transition hover:bg-[#5c6c3d]/45"
            >
              + Adicionar pergunta
            </button>
          </div>

          <div className="mt-5 space-y-5">
            {questions.map((pergunta, index) => (
              <div
                key={pergunta.id}
                className="rounded-2xl border border-[#b7c28b]/15 bg-[#1b2015]/75 p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#b7c28b]">
                    Pergunta {index + 1}
                  </span>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => moverPergunta(index, -1)}
                      disabled={index === 0}
                      className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/55 disabled:opacity-25"
                    >
                      â†‘
                    </button>

                    <button
                      type="button"
                      onClick={() => moverPergunta(index, 1)}
                      disabled={index === questions.length - 1}
                      className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/55 disabled:opacity-25"
                    >
                      â†“
                    </button>

                    <button
                      type="button"
                      onClick={() => removerPergunta(pergunta.id)}
                      disabled={questions.length === 1}
                      className="rounded-lg border border-red-400/20 px-3 py-1.5 text-xs text-red-300 disabled:opacity-25"
                    >
                      Excluir
                    </button>
                  </div>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-[1fr_220px]">
                  <Campo label="Pergunta">
                    <input
                      type="text"
                      value={pergunta.prompt}
                      onChange={(e) =>
                        atualizarPergunta(
                          pergunta.id,
                          "prompt",
                          e.target.value
                        )
                      }
                      placeholder="Escreva a pergunta"
                      className={inputClass}
                    />
                  </Campo>

                  <Campo label="Tipo de resposta">
                    <select
                      value={pergunta.type}
                      onChange={(e) =>
                        atualizarPergunta(
                          pergunta.id,
                          "type",
                          e.target.value as TipoPergunta
                        )
                      }
                      className={inputClass}
                    >
                      <option value="single_choice">
                        Escolha Ãºnica
                      </option>
                      <option value="multiple_choice">
                        MÃºltiplas escolhas
                      </option>
                      <option value="short_text">
                        Texto curto
                      </option>
                      <option value="long_text">
                        Texto longo
                      </option>
                      <option value="scale">
                        Escala
                      </option>
                    </select>
                  </Campo>
                </div>

                <div className="mt-4">
                  <Campo label="Texto de apoio opcional">
                    <input
                      type="text"
                      value={pergunta.helper}
                      onChange={(e) =>
                        atualizarPergunta(
                          pergunta.id,
                          "helper",
                          e.target.value
                        )
                      }
                      placeholder="Uma orientaÃ§Ã£o leve para ajudar a paciente a compreender a pergunta"
                      className={inputClass}
                    />
                  </Campo>
                </div>

                {(pergunta.type === "single_choice" ||
                  pergunta.type === "multiple_choice") && (
                  <div className="mt-5">
                    <p className="mb-3 text-xs font-semibold text-white/60">
                      OpÃ§Ãµes de resposta
                    </p>

                    <div className="space-y-2">
                      {pergunta.options.map((opcao, optionIndex) => (
                        <div
                          key={optionIndex}
                          className="flex gap-2"
                        >
                          <input
                            type="text"
                            value={opcao}
                            onChange={(e) =>
                              atualizarOpcao(
                                pergunta.id,
                                optionIndex,
                                e.target.value
                              )
                            }
                            placeholder={`OpÃ§Ã£o ${optionIndex + 1}`}
                            className={inputClass}
                          />

                          <button
                            type="button"
                            onClick={() =>
                              removerOpcao(
                                pergunta.id,
                                optionIndex
                              )
                            }
                            className="rounded-xl border border-red-400/20 px-3 text-red-300"
                          >
                            Ã—
                          </button>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => adicionarOpcao(pergunta.id)}
                      className="mt-3 text-xs font-bold text-[#cbd69d]"
                    >
                      + Adicionar opÃ§Ã£o
                    </button>

                    <p className="mt-3 text-[11px] leading-5 text-white/35">
                      O sistema acrescentarÃ¡ automaticamente a opÃ§Ã£o
                      segura â€œNo momento nÃ£o consigo responder isso â€”
                      e tudo bem.â€
                    </p>
                  </div>
                )}

                {pergunta.type === "scale" && (
                  <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Campo label="MÃ­nimo">
                      <input
                        type="number"
                        value={pergunta.min}
                        onChange={(e) =>
                          atualizarPergunta(
                            pergunta.id,
                            "min",
                            Number(e.target.value)
                          )
                        }
                        className={inputClass}
                      />
                    </Campo>

                    <Campo label="MÃ¡ximo">
                      <input
                        type="number"
                        value={pergunta.max}
                        onChange={(e) =>
                          atualizarPergunta(
                            pergunta.id,
                            "max",
                            Number(e.target.value)
                          )
                        }
                        className={inputClass}
                      />
                    </Campo>

                    <Campo label="Nome do mÃ­nimo">
                      <input
                        type="text"
                        value={pergunta.min_label}
                        onChange={(e) =>
                          atualizarPergunta(
                            pergunta.id,
                            "min_label",
                            e.target.value
                          )
                        }
                        placeholder="Ex.: Nada confortÃ¡vel"
                        className={inputClass}
                      />
                    </Campo>

                    <Campo label="Nome do mÃ¡ximo">
                      <input
                        type="text"
                        value={pergunta.max_label}
                        onChange={(e) =>
                          atualizarPergunta(
                            pergunta.id,
                            "max_label",
                            e.target.value
                          )
                        }
                        placeholder="Ex.: Muito confortÃ¡vel"
                        className={inputClass}
                      />
                    </Campo>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* BOTÃ•ES */}
        <div className="mt-7 flex flex-wrap gap-3 border-t border-[#b7c28b]/15 pt-6">
          <button
            type="button"
            disabled={salvando}
            onClick={() => salvar("draft")}
            className="rounded-xl border border-[#b7c28b]/30 bg-[#5c6c3d]/15 px-5 py-3 text-sm font-bold text-[#dce5c0] disabled:opacity-50"
          >
            {salvando ? "Salvando..." : "Salvar rascunho"}
          </button>

          <button
            type="button"
            disabled={salvando}
            onClick={() => salvar("published")}
            className="rounded-xl bg-[#b8c68a] px-5 py-3 text-sm font-bold text-[#263019] transition hover:brightness-110 disabled:opacity-50"
          >
            {salvando ? "Salvando..." : "Publicar atividade"}
          </button>
        </div>
      </section>

      {/* HISTÃ“RICO */}
      <section className="mt-10">
        <div className="mb-4">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b7c28b]">
            HistÃ³rico
          </p>

          <h2 className="mt-2 text-xl font-semibold text-white">
            Atividades criadas
          </h2>
        </div>

        {carregando ? (
          <div className="rounded-2xl border border-[#b7c28b]/15 bg-[#1b2015]/70 p-5 text-sm text-white/50">
            Carregando...
          </div>
        ) : quizzes.length === 0 ? (
          <div className="rounded-2xl border border-[#b7c28b]/15 bg-[#1b2015]/70 p-5 text-sm text-white/50">
            Nenhuma atividade criada ainda.
          </div>
        ) : (
          <div className="grid gap-4">
            {quizzes.map((quiz) => (
              <article
                key={quiz.id}
                className="rounded-2xl border border-[#b7c28b]/18 bg-[linear-gradient(145deg,rgba(61,70,42,.40),rgba(27,31,20,.88))] p-5"
              >
                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold text-white">
                        {quiz.title}
                      </h3>

                      <span className="rounded-full bg-[#b7c28b]/12 px-3 py-1 text-[10px] font-bold text-[#dce5c0]">
                        {statusTexto(quiz.status)}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-[#cbd69d]">
                      {nomePaciente.get(quiz.client_id) ||
                        "Paciente"}{" "}
                      Â· {tipoQuizTexto(quiz.quiz_type)}
                    </p>

                    <p className="mt-1 text-xs text-white/40">
                      Criado em {formatarData(quiz.created_at)}
                    </p>

                    <p className="mt-2 text-xs text-white/45">
                      {Array.isArray(quiz.questions)
                        ? quiz.questions.length
                        : 0}{" "}
                      pergunta(s)
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => editarQuiz(quiz)}
                      className="rounded-xl border border-[#b7c28b]/25 px-4 py-2 text-xs font-bold text-[#dce5c0]"
                    >
                      Editar
                    </button>

                    {quiz.status === "draft" && (
                      <button
                        type="button"
                        onClick={() =>
                          alterarStatus(quiz.id, "published")
                        }
                        className="rounded-xl bg-[#b8c68a] px-4 py-2 text-xs font-bold text-[#263019]"
                      >
                        Publicar
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        alterarStatus(quiz.id, "archived")
                      }
                      className="rounded-xl border border-white/10 px-4 py-2 text-xs font-bold text-white/40"
                    >
                      Arquivar
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Campo({
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

const inputClass =
  "w-full rounded-xl border border-[#b7c28b]/20 bg-[#13170f]/80 px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-[#b7c28b]/50";
