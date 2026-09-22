"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";
import Link from "next/link";
import {
  useParams,
  useRouter,
} from "next/navigation";
import { supabase } from "@/lib/supabase";

type Pergunta = {
  id: string;
  type:
    | "single_choice"
    | "multiple_choice"
    | "short_text"
    | "long_text"
    | "scale";
  prompt: string;
  helper?: string | null;
  options?: string[];
  min?: number | null;
  max?: number | null;
  min_label?: string | null;
  max_label?: string | null;
};

type Quiz = {
  id: string;
  title: string;
  subtitle: string | null;
  instructions: string | null;
  questions: Pergunta[];
  resposta: {
    answers:
      | Record<
          string,
          unknown
        >
      | null;
    status: string;
    submitted_at: string | null;
  } | null;
};

export default function ResponderAtividadePage() {
  const params =
    useParams();

  const router =
    useRouter();

  const token =
    String(
      params?.token || ""
    );

  const quizId =
    String(
      params?.quizId || ""
    );

  const preview =
    token.startsWith(
      "preview-"
    );

  const [
    quiz,
    setQuiz,
  ] =
    useState<Quiz | null>(
      null
    );

  const [
    respostas,
    setRespostas,
  ] = useState<
    Record<
      string,
      unknown
    >
  >({});

  const [
    carregando,
    setCarregando,
  ] = useState(true);

  const [
    salvando,
    setSalvando,
  ] = useState(false);

  const [
    erro,
    setErro,
  ] = useState<
    string | null
  >(null);

  const [
    mensagem,
    setMensagem,
  ] = useState<
    string | null
  >(null);

  const concluida =
    quiz?.resposta
      ?.status ===
    "submitted";

  useEffect(() => {
    async function carregar() {
      try {
        setCarregando(true);
        setErro(null);

        const headers:
          Record<
            string,
            string
          > = {};

        if (preview) {
          const {
            data: {
              session,
            },
          } =
            await supabase
              .auth
              .getSession();

          if (
            !session
              ?.access_token
          ) {
            throw new Error(
              "Sua sessão administrativa expirou."
            );
          }

          headers.Authorization =
            `Bearer ${session.access_token}`;
        }

        const response =
          await fetch(
            `/api/terapia/atividades?token=${encodeURIComponent(
              token
            )}&quizId=${encodeURIComponent(
              quizId
            )}`,
            {
              cache:
                "no-store",
              headers,
            }
          );

        const data =
          await response.json();

        if (
          !response.ok
        ) {
          throw new Error(
            data?.error ||
              "Não foi possível abrir esta atividade."
          );
        }

        if (!data?.quiz) {
          throw new Error(
            "Atividade não encontrada."
          );
        }

        setQuiz(
          data.quiz
        );

        const salvas =
          data.quiz
            ?.resposta
            ?.answers;

        setRespostas(
          salvas &&
            typeof salvas ===
              "object"
            ? salvas
            : {}
        );
      } catch (
        error
      ) {
        setErro(
          error instanceof
            Error
            ? error.message
            : "Erro ao abrir atividade."
        );
      } finally {
        setCarregando(
          false
        );
      }
    }

    if (
      token &&
      quizId
    ) {
      carregar();
    }
  }, [
    token,
    quizId,
    preview,
  ]);

  const perguntas =
    useMemo(
      () =>
        Array.isArray(
          quiz?.questions
        )
          ? quiz
              ?.questions ||
            []
          : [],
      [quiz]
    );

  function atualizar(
    id: string,
    valor: unknown
  ) {
    if (
      concluida
    ) {
      return;
    }

    setRespostas(
      (atual) => ({
        ...atual,
        [id]: valor,
      })
    );
  }

  function alternarMultipla(
    id: string,
    opcao: string
  ) {
    const atual =
      Array.isArray(
        respostas[id]
      )
        ? (respostas[
            id
          ] as string[])
        : [];

    const existe =
      atual.includes(
        opcao
      );

    atualizar(
      id,
      existe
        ? atual.filter(
            (item) =>
              item !==
              opcao
          )
        : [
            ...atual,
            opcao,
          ]
    );
  }

  async function salvar(
    action:
      | "save"
      | "submit"
  ) {
    if (preview) {
      setMensagem(
        "Visualização do ADM: as respostas não são salvas."
      );
      return;
    }

    try {
      setSalvando(true);
      setErro(null);
      setMensagem(null);

      const response =
        await fetch(
          "/api/terapia/atividades",
          {
            method:
              "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body:
              JSON.stringify({
                token,
                quiz_id:
                  quizId,
                answers:
                  respostas,
                action,
              }),
          }
        );

      const data =
        await response.json();

      if (
        !response.ok
      ) {
        throw new Error(
          data?.error ||
            "Não foi possível salvar a atividade."
        );
      }

      if (
        action ===
        "submit"
      ) {
        setMensagem(
          "Atividade concluída e enviada."
        );

        setQuiz(
          (atual) =>
            atual
              ? {
                  ...atual,
                  resposta:
                    data.resposta,
                }
              : atual
        );
      } else {
        setMensagem(
          "Suas respostas foram salvas. Você pode continuar depois."
        );
      }
    } catch (
      error
    ) {
      setErro(
        error instanceof
          Error
          ? error.message
          : "Erro ao salvar atividade."
      );
    } finally {
      setSalvando(
        false
      );
    }
  }

  if (
    carregando
  ) {
    return (
      <main className="min-h-screen bg-[#F8F4EC] p-8 text-center text-[#6C8465]">
        Abrindo atividade...
      </main>
    );
  }

  if (
    erro ||
    !quiz
  ) {
    return (
      <main className="min-h-screen bg-[#F8F4EC] p-6">
        <div className="mx-auto max-w-xl rounded-3xl border border-red-200 bg-white p-7 text-center text-red-700">
          {erro ||
            "Atividade não encontrada."}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F4EC] px-5 py-8 text-[#4F5E4A]">
      <div className="mx-auto max-w-3xl">
        {preview && (
          <div className="mb-5 rounded-2xl bg-[#5E7357] p-4 text-sm font-bold text-white">
            Visualização do ADM — teste à vontade; nenhuma resposta será salva.
          </div>
        )}

        <Link
          href={`/terapia/acesso/${token}/atividades`}
          className="text-sm font-bold text-[#6C8465]"
        >
          ← Minhas Atividades
        </Link>

        <section className="mt-7 rounded-3xl border border-[#DCCFB8] bg-white p-6 shadow-sm md:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8AA27A]">
            Atividade terapêutica
          </p>

          <h1 className="mt-3 text-3xl font-extrabold text-[#4F5E4A]">
            {quiz.title}
          </h1>

          {quiz.subtitle && (
            <p className="mt-3 text-sm leading-6 text-[#6C8465]">
              {quiz.subtitle}
            </p>
          )}

          {quiz.instructions && (
            <div className="mt-6 rounded-2xl bg-[#F7F1E4] p-5 text-sm leading-7 text-[#5E7357] whitespace-pre-line">
              {quiz.instructions}
            </div>
          )}

          {concluida && (
            <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-bold text-emerald-700">
              ✓ Esta atividade já foi concluÃ­da.
            </div>
          )}
        </section>

        <div className="mt-6 space-y-5">
          {perguntas.map(
            (
              pergunta,
              index
            ) => {
              const valor =
                respostas[
                  pergunta.id
                ];

              return (
                <section
                  key={
                    pergunta.id
                  }
                  className="rounded-3xl border border-[#DCCFB8] bg-white p-6 shadow-sm"
                >
                  <p className="text-xs font-bold uppercase tracking-wide text-[#8AA27A]">
                    Pergunta{" "}
                    {index + 1}
                  </p>

                  <h2 className="mt-2 text-lg font-extrabold text-[#4F5E4A]">
                    {
                      pergunta.prompt
                    }
                  </h2>

                  {pergunta.helper && (
                    <p className="mt-2 text-sm leading-6 text-[#6C8465]">
                      {
                        pergunta.helper
                      }
                    </p>
                  )}

                  {pergunta.type ===
                    "single_choice" && (
                    <div className="mt-5 grid gap-2">
                      {(pergunta.options ||
                        []).map(
                        (
                          opcao
                        ) => (
                          <label
                            key={
                              opcao
                            }
                            className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#E1D6C5] bg-[#FDFBF7] p-4"
                          >
                            <input
                              type="radio"
                              name={
                                pergunta.id
                              }
                              checked={
                                valor ===
                                opcao
                              }
                              disabled={
                                concluida
                              }
                              onChange={() =>
                                atualizar(
                                  pergunta.id,
                                  opcao
                                )
                              }
                              className="mt-1"
                            />

                            <span className="text-sm leading-6">
                              {
                                opcao
                              }
                            </span>
                          </label>
                        )
                      )}
                    </div>
                  )}

                  {pergunta.type ===
                    "multiple_choice" && (
                    <div className="mt-5 grid gap-2">
                      {(pergunta.options ||
                        []).map(
                        (
                          opcao
                        ) => (
                          <label
                            key={
                              opcao
                            }
                            className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#E1D6C5] bg-[#FDFBF7] p-4"
                          >
                            <input
                              type="checkbox"
                              checked={
                                Array.isArray(
                                  valor
                                ) &&
                                (
                                  valor as string[]
                                ).includes(
                                  opcao
                                )
                              }
                              disabled={
                                concluida
                              }
                              onChange={() =>
                                alternarMultipla(
                                  pergunta.id,
                                  opcao
                                )
                              }
                              className="mt-1"
                            />

                            <span className="text-sm leading-6">
                              {
                                opcao
                              }
                            </span>
                          </label>
                        )
                      )}
                    </div>
                  )}

                  {pergunta.type ===
                    "short_text" && (
                    <input
                      type="text"
                      value={
                        typeof valor ===
                        "string"
                          ? valor
                          : ""
                      }
                      disabled={
                        concluida
                      }
                      onChange={(
                        e
                      ) =>
                        atualizar(
                          pergunta.id,
                          e.target
                            .value
                        )
                      }
                      placeholder="Escreva no seu tempo..."
                      className="mt-5 w-full rounded-xl border border-[#C8B8A8] bg-white px-4 py-3 outline-none focus:border-[#8AA27A]"
                    />
                  )}

                  {pergunta.type ===
                    "long_text" && (
                    <textarea
                      value={
                        typeof valor ===
                        "string"
                          ? valor
                          : ""
                      }
                      disabled={
                        concluida
                      }
                      onChange={(
                        e
                      ) =>
                        atualizar(
                          pergunta.id,
                          e.target
                            .value
                        )
                      }
                      rows={5}
                      placeholder="Escreva apenas o que se sentir confortável para responder..."
                      className="mt-5 w-full rounded-xl border border-[#C8B8A8] bg-white px-4 py-3 outline-none focus:border-[#8AA27A]"
                    />
                  )}

                  {pergunta.type ===
                    "scale" && (
                    <div className="mt-5">
                      <div className="mb-2 flex justify-between gap-3 text-xs text-[#6C8465]">
                        <span>
                          {pergunta.min_label ||
                            pergunta.min ||
                            0}
                        </span>

                        <span>
                          {pergunta.max_label ||
                            pergunta.max ||
                            10}
                        </span>
                      </div>

                      <input
                        type="range"
                        min={
                          pergunta.min ??
                          0
                        }
                        max={
                          pergunta.max ??
                          10
                        }
                        value={
                          typeof valor ===
                          "number"
                            ? valor
                            : pergunta.min ??
                              0
                        }
                        disabled={
                          concluida
                        }
                        onChange={(
                          e
                        ) =>
                          atualizar(
                            pergunta.id,
                            Number(
                              e
                                .target
                                .value
                            )
                          )
                        }
                        className="w-full"
                      />

                      <p className="mt-2 text-center text-sm font-bold text-[#5E7357]">
                        {typeof valor ===
                        "number"
                          ? valor
                          : pergunta.min ??
                            0}
                      </p>
                    </div>
                  )}

                  {!concluida && (
                    <button
                      type="button"
                      onClick={() =>
                        setRespostas(
                          (
                            atual
                          ) => {
                            const novo = {
                              ...atual,
                            };

                            delete novo[
                              pergunta
                                .id
                            ];

                            return novo;
                          }
                        )
                      }
                      className="mt-4 text-xs font-bold text-[#8A7A69]"
                    >
                      Pular esta pergunta
                    </button>
                  )}
                </section>
              );
            }
          )}
        </div>

        {mensagem && (
          <div className="mt-6 rounded-2xl border border-[#C7D4C0] bg-[#E8F0E4] p-4 text-sm font-semibold text-[#4F6548]">
            {mensagem}
          </div>
        )}

        {!concluida && (
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              disabled={
                salvando
              }
              onClick={() =>
                salvar(
                  "save"
                )
              }
              className="rounded-xl border border-[#8AA27A] bg-white px-5 py-4 text-sm font-bold text-[#5E7357] disabled:opacity-50"
            >
              {salvando
                ? "Salvando..."
                : "Salvar e continuar depois"}
            </button>

            <button
              type="button"
              disabled={
                salvando
              }
              onClick={() =>
                salvar(
                  "submit"
                )
              }
              className="rounded-xl bg-[#5E7357] px-5 py-4 text-sm font-bold text-white disabled:opacity-50"
            >
              {salvando
                ? "Enviando..."
                : "Finalizar atividade"}
            </button>

            <button
              type="button"
              disabled={
                salvando
              }
              onClick={async () => {
                if (!preview) {
                  await salvar(
                    "save"
                  );
                }

                router.push(
                  `/terapia/acesso/${token}/atividades`
                );
              }}
              className="sm:col-span-2 rounded-xl bg-[#F0E8DA] px-5 py-3 text-sm font-bold text-[#6C5B4C]"
            >
              Parar por aqui e voltar
            </button>
          </div>
        )}
      </div>
    </main>
  );
}