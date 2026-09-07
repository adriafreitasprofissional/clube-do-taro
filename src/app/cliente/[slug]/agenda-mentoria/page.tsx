"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Evento = {
  id: string;
  event_type: "individual" | "group";
  title: string;
  starts_at: string;
  duration_minutes: number;
  status: "open" | "booked" | "completed" | "cancelled";
};

type Participacao = {
  id: string;
  event_id: string;
  client_id: string;
  response: "pending" | "confirmed" | "declined";
  attendance: "not_marked" | "present" | "absent";
  responded_at: string | null;
};

const NOMES_MESES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const DIAS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

function dataLocal(iso: string) {
  return new Date(iso).toLocaleDateString("en-CA", {
    timeZone: "America/Sao_Paulo",
  });
}

function horario(iso: string) {
  return new Date(iso).toLocaleTimeString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function dataCompleta(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AgendaMentoriaClientePage() {
  const params = useParams();
  const router = useRouter();
  const slug = String(params.slug || "");

  const hoje = new Date();
  const [mes, setMes] = useState(
    new Date(hoje.getFullYear(), hoje.getMonth(), 1)
  );

  const [cliente, setCliente] = useState<any>(null);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [participacoes, setParticipacoes] = useState<Participacao[]>([]);
  const [diaSelecionado, setDiaSelecionado] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [salvando, setSalvando] = useState<string | null>(null);

  const authFetch = useCallback(
    async (url: string, init?: RequestInit) => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        router.replace("/login");
        throw new Error("Sessão expirada. Entre novamente.");
      }

      const headers = new Headers(init?.headers);
      headers.set(
        "Authorization",
        `Bearer ${session.access_token}`
      );

      return fetch(url, {
        ...init,
        headers,
        cache: "no-store",
      });
    },
    [router]
  );

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro(null);

    try {
      const response = await authFetch(
        `/api/cliente/${encodeURIComponent(slug)}/agenda-mentoria`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Não foi possível carregar a agenda."
        );
      }

      setCliente(data.cliente || null);
      setEventos(data.events || []);
      setParticipacoes(data.participations || []);
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro ao carregar a agenda."
      );
    } finally {
      setCarregando(false);
    }
  }, [authFetch, slug]);

  useEffect(() => {
    if (slug) carregar();
  }, [slug, carregar]);

  const participacaoPorEvento = useMemo(() => {
    const mapa = new Map<string, Participacao>();

    participacoes.forEach((item) => {
      mapa.set(item.event_id, item);
    });

    return mapa;
  }, [participacoes]);

  const eventosVisiveis = useMemo(
    () =>
      eventos.filter((evento) => {
        if (evento.status === "cancelled") return false;

        if (evento.event_type === "group") {
          return true;
        }

        const minhaParticipacao =
          participacaoPorEvento.get(evento.id);

        if (minhaParticipacao?.response === "confirmed") {
          return true;
        }

        return evento.status === "open";
      }),
    [eventos, participacaoPorEvento]
  );

  const eventosPorData = useMemo(() => {
    const mapa = new Map<string, Evento[]>();

    eventosVisiveis.forEach((evento) => {
      const chave = dataLocal(evento.starts_at);
      const atuais = mapa.get(chave) || [];
      atuais.push(evento);
      mapa.set(chave, atuais);
    });

    return mapa;
  }, [eventosVisiveis]);

  const celulas = useMemo(() => {
    const ano = mes.getFullYear();
    const indiceMes = mes.getMonth();
    const primeiroDia = new Date(ano, indiceMes, 1).getDay();
    const totalDias = new Date(ano, indiceMes + 1, 0).getDate();

    const itens: Array<string | null> = [];

    for (let i = 0; i < primeiroDia; i += 1) {
      itens.push(null);
    }

    for (let dia = 1; dia <= totalDias; dia += 1) {
      itens.push(
        `${ano}-${String(indiceMes + 1).padStart(2, "0")}-${String(
          dia
        ).padStart(2, "0")}`
      );
    }

    while (itens.length % 7 !== 0) {
      itens.push(null);
    }

    return itens;
  }, [mes]);

  const eventosDoDia = useMemo(() => {
    if (!diaSelecionado) return [];

    return (eventosPorData.get(diaSelecionado) || []).sort(
      (a, b) =>
        new Date(a.starts_at).getTime() -
        new Date(b.starts_at).getTime()
    );
  }, [diaSelecionado, eventosPorData]);

  const meusProximos = useMemo(
    () =>
      eventos
        .filter((evento) => {
          const participacao = participacaoPorEvento.get(evento.id);

          return (
            participacao?.response === "confirmed" &&
            new Date(evento.starts_at) >= new Date() &&
            evento.status !== "cancelled"
          );
        })
        .sort(
          (a, b) =>
            new Date(a.starts_at).getTime() -
            new Date(b.starts_at).getTime()
        ),
    [eventos, participacaoPorEvento]
  );

  const meuHistorico = useMemo(
    () =>
      eventos
        .filter((evento) => {
          const participacao = participacaoPorEvento.get(evento.id);

          return (
            Boolean(participacao) &&
            new Date(evento.starts_at) < new Date()
          );
        })
        .sort(
          (a, b) =>
            new Date(b.starts_at).getTime() -
            new Date(a.starts_at).getTime()
        ),
    [eventos, participacaoPorEvento]
  );

  async function agir(
    evento: Evento,
    action: "book_individual" | "respond_group",
    response?: "confirmed" | "declined"
  ) {
    setSalvando(evento.id);
    setMensagem(null);
    setErro(null);

    try {
      const resposta = await authFetch(
        `/api/cliente/${encodeURIComponent(slug)}/agenda-mentoria`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action,
            event_id: evento.id,
            response,
          }),
        }
      );

      const data = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          data?.error || "Não foi possível atualizar a mentoria."
        );
      }

      setMensagem(data?.message || "Agenda atualizada.");
      await carregar();
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro ao atualizar a mentoria."
      );
    } finally {
      setSalvando(null);
    }
  }

  if (carregando) {
    return (
      <main className="min-h-screen bg-[#08070f] p-10 text-center text-white">
        Abrindo sua agenda de mentoria...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#08070f] text-white">
      <div className="mx-auto max-w-5xl px-5 py-8 md:px-8">
        <button
          type="button"
          onClick={() => router.push(`/cliente/${slug}`)}
          className="text-sm font-bold text-yellow-300"
        >
          ← Voltar ao Portal
        </button>

        <div className="mt-8 text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-purple-300">
            Clube do Tarô
          </p>

          <h1 className="mt-3 text-3xl font-extrabold text-yellow-400 md:text-4xl">
            Agendamento de Mentoria
          </h1>

          <p className="mt-2 text-sm text-purple-200">
            {cliente?.nome
              ? `${cliente.nome}, escolha entre os horários individuais disponíveis ou confirme sua participação nas mentorias em grupo.`
              : "Escolha sua mentoria."}
          </p>
        </div>

        {erro && (
          <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
            {erro}
          </div>
        )}

        {mensagem && (
          <div className="mt-6 rounded-2xl border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-200">
            {mensagem}
          </div>
        )}

        <section className="mt-8 rounded-3xl border border-yellow-500/30 bg-[#0f0d16] p-5 md:p-7">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() =>
                setMes(
                  new Date(
                    mes.getFullYear(),
                    mes.getMonth() - 1,
                    1
                  )
                )
              }
              className="rounded-xl border border-yellow-500/20 px-4 py-2 text-xl text-yellow-300"
            >
              ‹
            </button>

            <h2 className="text-lg font-extrabold text-yellow-300">
              {NOMES_MESES[mes.getMonth()]} {mes.getFullYear()}
            </h2>

            <button
              type="button"
              onClick={() =>
                setMes(
                  new Date(
                    mes.getFullYear(),
                    mes.getMonth() + 1,
                    1
                  )
                )
              }
              className="rounded-xl border border-yellow-500/20 px-4 py-2 text-xl text-yellow-300"
            >
              ›
            </button>
          </div>

          <div className="mt-6 grid grid-cols-7 gap-2">
            {DIAS.map((dia) => (
              <div
                key={dia}
                className="py-2 text-center text-[11px] font-bold text-purple-300"
              >
                {dia}
              </div>
            ))}

            {celulas.map((data, index) => {
              if (!data) {
                return (
                  <div
                    key={`vazio-${index}`}
                    className="aspect-square"
                  />
                );
              }

              const eventosData = eventosPorData.get(data) || [];

              const temIndividual = eventosData.some(
                (evento) =>
                  evento.event_type === "individual" &&
                  evento.status === "open"
              );

              const temGrupo = eventosData.some(
                (evento) => evento.event_type === "group"
              );

              const selecionado = diaSelecionado === data;

              return (
                <button
                  key={data}
                  type="button"
                  onClick={() =>
                    eventosData.length
                      ? setDiaSelecionado(data)
                      : undefined
                  }
                  className={`relative aspect-square rounded-2xl border text-sm font-extrabold transition ${
                    selecionado
                      ? "border-yellow-300 bg-yellow-400 text-black shadow-[0_0_20px_rgba(250,204,21,.35)]"
                      : eventosData.length
                      ? "border-yellow-500/40 bg-yellow-500/10 text-yellow-200 hover:border-yellow-300"
                      : "border-white/5 bg-white/[0.02] text-white/25"
                  }`}
                >
                  {Number(data.slice(-2))}

                  <span className="absolute bottom-1.5 left-1/2 flex -translate-x-1/2 gap-1">
                    {temIndividual && (
                      <span className="h-1.5 w-1.5 rounded-full bg-yellow-300" />
                    )}

                    {temGrupo && (
                      <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-5 flex flex-wrap gap-4 border-t border-yellow-500/20 pt-4 text-xs text-purple-200">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-yellow-300" />
              Individual disponível
            </span>

            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-orange-400" />
              Mentoria em grupo
            </span>
          </div>
        </section>

        {diaSelecionado && (
          <section className="mt-6 rounded-3xl border border-yellow-500/30 bg-[#0f0d16] p-5 md:p-7">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-purple-300">
              Horários e encontros do dia
            </p>

            <h2 className="mt-2 text-xl font-extrabold text-yellow-300">
              {new Date(`${diaSelecionado}T12:00:00`).toLocaleDateString(
                "pt-BR",
                {
                  weekday: "long",
                  day: "2-digit",
                  month: "long",
                }
              )}
            </h2>

            <div className="mt-5 grid gap-4">
              {eventosDoDia.map((evento) => {
                const participacao =
                  participacaoPorEvento.get(evento.id);

                if (evento.event_type === "individual") {
                  const meu =
                    participacao?.response === "confirmed";

                  return (
                    <div
                      key={evento.id}
                      className="rounded-2xl border border-yellow-500/20 bg-black/20 p-5"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <span className="rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-bold text-yellow-300">
                            Individual
                          </span>

                          <p className="mt-3 text-xl font-extrabold text-white">
                            {horario(evento.starts_at)}
                          </p>

                          <p className="mt-1 text-xs text-purple-300">
                            {evento.duration_minutes} minutos
                          </p>
                        </div>

                        {meu ? (
                          <span className="rounded-xl border border-green-400/30 bg-green-400/10 px-4 py-3 text-sm font-bold text-green-200">
                            ✓ Sua mentoria está agendada
                          </span>
                        ) : (
                          <button
                            type="button"
                            disabled={
                              evento.status !== "open" ||
                              salvando === evento.id
                            }
                            onClick={() =>
                              agir(evento, "book_individual")
                            }
                            className="rounded-xl bg-yellow-400 px-5 py-3 text-sm font-extrabold text-black disabled:opacity-40"
                          >
                            {salvando === evento.id
                              ? "Agendando..."
                              : "Agendar este horário"}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                }

                const resposta = participacao?.response || "pending";

                return (
                  <div
                    key={evento.id}
                    className="rounded-2xl border border-orange-400/30 bg-orange-400/5 p-5"
                  >
                    <span className="rounded-full bg-orange-400/10 px-3 py-1 text-xs font-bold text-orange-300">
                      Mentoria em Grupo
                    </span>

                    <h3 className="mt-3 text-xl font-extrabold text-white">
                      {evento.title}
                    </h3>

                    <p className="mt-2 text-sm text-purple-200">
                      {horario(evento.starts_at)} ·{" "}
                      {evento.duration_minutes} minutos
                    </p>

                    <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                      <button
                        type="button"
                        disabled={salvando === evento.id}
                        onClick={() =>
                          agir(
                            evento,
                            "respond_group",
                            "confirmed"
                          )
                        }
                        className={`rounded-xl px-5 py-3 text-sm font-bold ${
                          resposta === "confirmed"
                            ? "bg-green-500 text-white"
                            : "border border-green-400/40 bg-green-400/10 text-green-200"
                        }`}
                      >
                        ✓ Vou participar
                      </button>

                      <button
                        type="button"
                        disabled={salvando === evento.id}
                        onClick={() =>
                          agir(
                            evento,
                            "respond_group",
                            "declined"
                          )
                        }
                        className={`rounded-xl px-5 py-3 text-sm font-bold ${
                          resposta === "declined"
                            ? "bg-red-500 text-white"
                            : "border border-red-400/40 bg-red-400/10 text-red-200"
                        }`}
                      >
                        Não vou poder
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        <section className="mt-6 rounded-3xl border border-purple-500/20 bg-[#12101d] p-5 md:p-7">
          <h2 className="text-lg font-extrabold text-yellow-300">
            Meus próximos encontros
          </h2>

          <div className="mt-4 grid gap-3">
            {meusProximos.length === 0 && (
              <p className="rounded-2xl bg-white/[0.03] p-4 text-sm text-purple-300">
                Nenhuma mentoria confirmada no momento.
              </p>
            )}

            {meusProximos.map((evento) => (
              <div
                key={evento.id}
                className="rounded-2xl border border-purple-500/20 bg-white/[0.03] p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-bold text-white">
                      {evento.event_type === "group"
                        ? evento.title
                        : "Mentoria Individual"}
                    </p>

                    <p className="mt-1 text-xs capitalize text-purple-300">
                      {dataCompleta(evento.starts_at)}
                    </p>
                  </div>

                  <span className="rounded-full border border-yellow-500/30 px-3 py-1 text-xs font-bold text-yellow-300">
                    {evento.event_type === "group"
                      ? "Em Grupo"
                      : "Individual"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {meuHistorico.length > 0 && (
          <section className="mt-6 rounded-3xl border border-purple-500/20 bg-[#12101d] p-5 md:p-7">
            <h2 className="text-lg font-extrabold text-yellow-300">
              Histórico de Mentorias
            </h2>

            <div className="mt-4 grid gap-3">
              {meuHistorico.map((evento) => {
                const participacao =
                  participacaoPorEvento.get(evento.id);

                return (
                  <div
                    key={evento.id}
                    className="rounded-2xl border border-purple-500/20 bg-white/[0.03] p-4"
                  >
                    <p className="font-bold text-white">
                      {evento.event_type === "group"
                        ? evento.title
                        : "Mentoria Individual"}
                    </p>

                    <p className="mt-1 text-xs capitalize text-purple-300">
                      {dataCompleta(evento.starts_at)}
                    </p>

                    <p className="mt-2 text-xs font-bold text-yellow-300">
                      {participacao?.attendance === "present"
                        ? "Presente"
                        : participacao?.attendance === "absent"
                        ? "Não participou"
                        : participacao?.response === "declined"
                        ? "Informou que não participaria"
                        : "Presença ainda não registrada"}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
