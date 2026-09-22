"use client";

import {
  useEffect,
  useState,
} from "react";
import Link from "next/link";
import {
  useParams,
} from "next/navigation";
import { supabase } from "@/lib/supabase";

type Quiz = {
  id: string;
  title: string;
  subtitle: string | null;
  instructions: string | null;
  questions: any[];
  quiz_type: string;
  published_at: string | null;
  resposta: {
    status: string;
    submitted_at: string | null;
  } | null;
};

export default function AtividadesPage() {
  const params =
    useParams();

  const token =
    String(
      params?.token || ""
    );

  const preview =
    token.startsWith(
      "preview-"
    );

  const [
    quizzes,
    setQuizzes,
  ] = useState<Quiz[]>([]);

  const [
    carregando,
    setCarregando,
  ] = useState(true);

  const [
    erro,
    setErro,
  ] = useState<
    string | null
  >(null);

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
              "Sua sessÃ£o administrativa expirou."
            );
          }

          headers.Authorization =
            `Bearer ${session.access_token}`;
        }

        const response =
          await fetch(
            `/api/terapia/atividades?token=${encodeURIComponent(
              token
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
              "NÃ£o foi possÃ­vel carregar suas atividades."
          );
        }

        setQuizzes(
          Array.isArray(
            data?.quizzes
          )
            ? data.quizzes
            : []
        );
      } catch (
        error
      ) {
        setErro(
          error instanceof
            Error
            ? error.message
            : "Erro ao carregar atividades."
        );
      } finally {
        setCarregando(
          false
        );
      }
    }

    if (token) {
      carregar();
    }
  }, [
    token,
    preview,
  ]);

  return (
    <main className="min-h-screen bg-[#F8F4EC] px-5 py-8 text-[#4F5E4A]">
      <div className="mx-auto max-w-3xl">
        {preview && (
          <div className="mb-5 rounded-2xl bg-[#5E7357] p-4 text-sm font-bold text-white">
            VisualizaÃ§Ã£o do ADM â€” nenhuma resposta serÃ¡ salva.
          </div>
        )}

        <Link
          href={`/terapia/acesso/${token}`}
          className="text-sm font-bold text-[#6C8465]"
        >
          â† Voltar ao meu portal
        </Link>

        <p className="mt-8 text-xs font-bold uppercase tracking-[0.18em] text-[#8AA27A]">
          Terapia em Dia
        </p>

        <h1 className="mt-2 text-3xl font-extrabold text-[#4F5E4A]">
          Minhas Atividades
        </h1>

        <p className="mt-3 text-sm leading-6 text-[#6C8465]">
          Aqui ficam as atividades preparadas para acompanhar seu processo entre as sessÃµes.
        </p>

        {carregando && (
          <div className="mt-7 rounded-2xl border border-[#DCCFB8] bg-white p-5 text-sm text-[#6C8465]">
            Carregando atividades...
          </div>
        )}

        {erro && (
          <div className="mt-7 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            {erro}
          </div>
        )}

        {!carregando &&
          !erro &&
          quizzes.length ===
            0 && (
            <div className="mt-7 rounded-3xl border border-[#DCCFB8] bg-white p-7 text-center shadow-sm">
              <p className="font-bold">
                Nenhuma atividade disponÃ­vel agora.
              </p>

              <p className="mt-2 text-sm leading-6 text-[#6C8465]">
                Quando uma nova atividade for liberada, ela aparecerÃ¡ aqui.
              </p>
            </div>
          )}

        <div className="mt-7 grid gap-4">
          {quizzes.map(
            (quiz) => {
              const concluida =
                quiz.resposta
                  ?.status ===
                "submitted";

              const emAndamento =
                quiz.resposta
                  ?.status ===
                "in_progress";

              return (
                <Link
                  key={
                    quiz.id
                  }
                  href={`/terapia/acesso/${token}/atividades/${quiz.id}`}
                  className="block rounded-3xl border border-[#DCCFB8] bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-[#8AA27A]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-extrabold text-[#4F5E4A]">
                        {
                          quiz.title
                        }
                      </h2>

                      {quiz.subtitle && (
                        <p className="mt-2 text-sm leading-6 text-[#6C8465]">
                          {
                            quiz.subtitle
                          }
                        </p>
                      )}
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-black ${
                        concluida
                          ? "bg-emerald-100 text-emerald-700"
                          : emAndamento
                            ? "bg-[#EFE5D3] text-[#806A55]"
                            : "bg-[#E8F0E4] text-[#4F6548]"
                      }`}
                    >
                      {concluida
                        ? "CONCLUÃDA"
                        : emAndamento
                          ? "EM ANDAMENTO"
                          : "NOVA"}
                    </span>
                  </div>

                  <p className="mt-5 text-sm font-bold text-[#8AA27A]">
                    {concluida
                      ? "Ver atividade â†’"
                      : emAndamento
                        ? "Continuar â†’"
                        : "ComeÃ§ar â†’"}
                  </p>
                </Link>
              );
            }
          )}
        </div>
      </div>
    </main>
  );
}