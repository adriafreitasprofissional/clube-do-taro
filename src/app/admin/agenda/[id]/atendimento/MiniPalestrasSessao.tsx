"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { supabase } from "@/lib/supabase";

type Palestra = {
  id: string;
  title: string;
  subtitle: string | null;
  category: string | null;
  duration_minutes: number | null;
  visibility:
    | "public"
    | "patients"
    | "private";
  active: boolean;
};

type Indicacao = {
  id: string;
  lecture_id: string;
  client_id: string;
  appointment_id: string | null;
  session_date: string | null;
  therapist_note: string | null;
  featured: boolean;
  assigned_at: string;

  therapy_lectures:
    | {
        id: string;
        title: string;
        subtitle: string | null;
        description: string | null;
        category: string | null;
        video_url: string;
        cover_url: string | null;
        duration_minutes: number | null;
        visibility:
          | "public"
          | "patients"
          | "private";
        active: boolean;
      }
    | null;
};

type Props = {
  clientId: string;
  appointmentId?: string | null;
  sessionDate?: string | null;
};

function formatarData(valor?: string | null) {
  if (!valor) return "";

  const data = new Date(
    `${valor.slice(0, 10)}T12:00:00`
  );

  return new Intl.DateTimeFormat(
    "pt-BR",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }
  ).format(data);
}

export default function MiniPalestrasSessao({
  clientId,
  appointmentId = null,
  sessionDate = null,
}: Props) {
  const [palestras, setPalestras] =
    useState<Palestra[]>([]);

  const [indicacoes, setIndicacoes] =
    useState<Indicacao[]>([]);

  const [lectureId, setLectureId] =
    useState("");

  const [observacao, setObservacao] =
    useState("");

  const [carregando, setCarregando] =
    useState(true);

  const [salvando, setSalvando] =
    useState(false);

  const [erro, setErro] =
    useState("");

  const [sucesso, setSucesso] =
    useState("");

  async function obterToken() {
    const {
      data: { session },
    } =
      await supabase.auth.getSession();

    if (!session?.access_token) {
      throw new Error(
        "Sua sessão expirou. Entre novamente."
      );
    }

    return session.access_token;
  }

  async function carregarDados() {
    if (!clientId) return;

    try {
      setCarregando(true);
      setErro("");

      const token =
        await obterToken();

      const [
        respostaPalestras,
        respostaIndicacoes,
      ] = await Promise.all([
        fetch(
          "/api/admin/terapia/palestras",
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
            cache: "no-store",
          }
        ),

        fetch(
          `/api/admin/terapia/palestras/indicacoes?client_id=${encodeURIComponent(
            clientId
          )}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
            cache: "no-store",
          }
        ),
      ]);

      const jsonPalestras =
        await respostaPalestras.json();

      const jsonIndicacoes =
        await respostaIndicacoes.json();

      if (!respostaPalestras.ok) {
        throw new Error(
          jsonPalestras.error ||
            "Erro ao carregar mini palestras."
        );
      }

      if (!respostaIndicacoes.ok) {
        throw new Error(
          jsonIndicacoes.error ||
            "Erro ao carregar indicações."
        );
      }

      setPalestras(
        (
          jsonPalestras.palestras || []
        ).filter(
          (item: Palestra) =>
            item.active
        )
      );

      setIndicacoes(
        jsonIndicacoes.indicacoes || []
      );
    } catch (error: unknown) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro ao carregar conteúdos."
      );
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    void carregarDados();
  }, [clientId]);

  const indicacoesSessao =
    useMemo(() => {
      return indicacoes.filter(
        (item) => {
          if (
            appointmentId &&
            item.appointment_id
          ) {
            return (
              item.appointment_id ===
              appointmentId
            );
          }

          if (
            sessionDate &&
            item.session_date
          ) {
            return (
              item.session_date ===
              sessionDate
            );
          }

          return false;
        }
      );
    }, [
      indicacoes,
      appointmentId,
      sessionDate,
    ]);

  const historico =
    useMemo(() => {
      const idsSessao = new Set(
        indicacoesSessao.map(
          (item) => item.id
        )
      );

      return indicacoes.filter(
        (item) =>
          !idsSessao.has(item.id)
      );
    }, [
      indicacoes,
      indicacoesSessao,
    ]);

  const palestrasDisponiveis =
    useMemo(() => {
      const jaIndicadas = new Set(
        indicacoesSessao.map(
          (item) => item.lecture_id
        )
      );

      return palestras.filter(
        (item) =>
          !jaIndicadas.has(item.id)
      );
    }, [
      palestras,
      indicacoesSessao,
    ]);

  async function indicarPalestra() {
    if (!lectureId) {
      setErro(
        "Selecione uma mini palestra."
      );
      return;
    }

    try {
      setSalvando(true);
      setErro("");
      setSucesso("");

      const token =
        await obterToken();

      const resposta = await fetch(
        "/api/admin/terapia/palestras/indicacoes",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
            Authorization:
              `Bearer ${token}`,
          },
          body: JSON.stringify({
            lecture_id: lectureId,
            client_id: clientId,
            appointment_id:
              appointmentId,
            session_date:
              sessionDate,
            therapist_note:
              observacao.trim(),
            featured: true,
          }),
        }
      );

      const json =
        await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          json.error ||
            "Não foi possível indicar a palestra."
        );
      }

      setLectureId("");
      setObservacao("");

      setSucesso(
        "Mini palestra indicada ao paciente."
      );

      await carregarDados();
    } catch (error: unknown) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro ao indicar palestra."
      );
    } finally {
      setSalvando(false);
    }
  }

  async function removerIndicacao(
    indicacao: Indicacao
  ) {
    const titulo =
      indicacao
        .therapy_lectures
        ?.title ||
      "esta mini palestra";

    const confirmar =
      window.confirm(
        `Remover a indicação de "${titulo}" desta sessão?`
      );

    if (!confirmar) return;

    try {
      setErro("");
      setSucesso("");

      const token =
        await obterToken();

      const resposta = await fetch(
        `/api/admin/terapia/palestras/indicacoes?id=${encodeURIComponent(
          indicacao.id
        )}`,
        {
          method: "DELETE",
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      const json =
        await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          json.error ||
            "Não foi possível remover a indicação."
        );
      }

      setSucesso(
        "Indicação removida."
      );

      await carregarDados();
    } catch (error: unknown) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro ao remover indicação."
      );
    }
  }

 return (
  <section className="rounded-2xl border border-purple-500/30 bg-[#28002f] p-5 shadow-lg shadow-black/20">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#b7c28b]">
          Conteúdo complementar
        </p>

        <h2 className="mt-1 text-lg font-semibold text-white">
          Mini palestras
        </h2>

        <p className="mt-1 text-sm text-purple-200/60">
          Indique um conteúdo somente quando fizer sentido para esta sessão.
        </p>
      </div>

      <div className="rounded-full border border-[#aebe79]/30 bg-[#aebe79]/10 px-3 py-1 text-xs font-semibold text-[#cbd69d]">
        {indicacoesSessao.length} indicada
        {indicacoesSessao.length === 1 ? "" : "s"}
      </div>
    </div>

    {erro && (
      <div className="mt-4 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">
        {erro}
      </div>
    )}

    {sucesso && (
      <div className="mt-4 rounded-xl border border-[#aebe79]/30 bg-[#aebe79]/10 px-4 py-3 text-sm text-[#dce5c0]">
        {sucesso}
      </div>
    )}

    {carregando ? (
      <p className="mt-4 text-sm text-purple-200/60">
        Carregando conteúdos...
      </p>
    ) : (
      <>
        <details className="mt-5 overflow-hidden rounded-2xl border border-purple-500/25 bg-[#1d0023]">
          <summary className="cursor-pointer list-none px-4 py-4 text-sm font-semibold text-[#cbd69d]">
            + Indicar mini palestra para esta sessão
          </summary>

          <div className="border-t border-purple-500/20 p-4">
            <label className="mb-2 block text-sm font-semibold text-purple-100">
              Mini palestra
            </label>

            <select
              value={lectureId}
              onChange={(event) =>
                setLectureId(event.target.value)
              }
              className="w-full rounded-xl border border-purple-500/30 bg-[#16001d] px-4 py-3 text-sm text-white outline-none focus:border-[#aebe79]"
            >
              <option value="">
                Selecione um conteúdo
              </option>

              {palestrasDisponiveis.map((palestra) => (
                <option
                  key={palestra.id}
                  value={palestra.id}
                >
                  {palestra.title}
                  {palestra.duration_minutes
                    ? ` — ${palestra.duration_minutes} min`
                    : ""}
                </option>
              ))}
            </select>

            {palestrasDisponiveis.length === 0 && (
              <p className="mt-2 text-xs text-purple-200/50">
                Todas as palestras disponíveis já foram indicadas nesta sessão.
              </p>
            )}

            <label className="mb-2 mt-4 block text-sm font-semibold text-purple-100">
              Recado para o paciente{" "}
              <span className="font-normal text-purple-200/45">
                (opcional)
              </span>
            </label>

            <textarea
              value={observacao}
              onChange={(event) =>
                setObservacao(event.target.value)
              }
              rows={3}
              placeholder="Ex.: Assista quando estiver tranquila. Este vídeo complementa o tema trabalhado hoje."
              className="w-full resize-none rounded-xl border border-purple-500/30 bg-[#16001d] px-4 py-3 text-sm text-white outline-none placeholder:text-purple-200/30 focus:border-[#aebe79]"
            />

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={indicarPalestra}
                disabled={salvando || !lectureId}
                className="rounded-xl bg-[#aebe79] px-5 py-3 text-sm font-bold text-[#243018] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {salvando
                  ? "Indicando..."
                  : "Indicar ao paciente"}
              </button>
            </div>
          </div>
        </details>

        {indicacoesSessao.length > 0 && (
          <div className="mt-5">
            <h3 className="text-sm font-semibold text-white">
              Indicadas nesta sessão
            </h3>

            <div className="mt-3 space-y-2">
              {indicacoesSessao.map((item) => {
                const palestra =
                  item.therapy_lectures;

                return (
                  <div
                    key={item.id}
                    className="rounded-xl border border-purple-500/25 bg-[#1d0023] p-4"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="font-semibold text-white">
                          {palestra?.title ||
                            "Mini palestra"}
                        </p>

                        <div className="mt-1 flex flex-wrap gap-2 text-xs text-purple-200/55">
                          {palestra?.category && (
                            <span>
                              {palestra.category}
                            </span>
                          )}

                          {palestra?.duration_minutes && (
                            <span>
                              • {palestra.duration_minutes} min
                            </span>
                          )}
                        </div>

                        {item.therapist_note && (
                          <p className="mt-3 text-sm leading-6 text-purple-100/65">
                            {item.therapist_note}
                          </p>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          removerIndicacao(item)
                        }
                        className="shrink-0 rounded-lg border border-red-400/25 px-3 py-2 text-xs font-medium text-red-300 transition hover:bg-red-400/10"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {historico.length > 0 && (
          <details className="mt-5 overflow-hidden rounded-xl border border-purple-500/20 bg-[#1d0023]">
            <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-purple-200/70">
              Histórico de mini palestras ({historico.length})
            </summary>

            <div className="space-y-2 border-t border-purple-500/20 p-3">
              {historico.map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg bg-[#16001d] px-4 py-3"
                >
                  <p className="text-sm font-semibold text-purple-100">
                    {item.therapy_lectures?.title ||
                      "Mini palestra"}
                  </p>

                  <p className="mt-1 text-xs text-purple-200/45">
                    {item.session_date
                      ? `Sessão de ${formatarData(
                          item.session_date
                        )}`
                      : `Indicada em ${formatarData(
                          item.assigned_at
                        )}`}
                  </p>
                </div>
              ))}
            </div>
          </details>
        )}
      </>
    )}
  </section>
);
}