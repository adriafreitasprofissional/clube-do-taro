"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Evento = {
  id: string;
  event_type: "individual" | "group";
  title: string;
  starts_at: string;
  duration_minutes: number;
  status: "open" | "booked" | "completed" | "cancelled";
};

const DIAS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MESES = [
  "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
  "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro",
];

function isoDate(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function dataHora(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AgendaMentoriasAdminPage() {
  const hoje = new Date();
  const [cursor, setCursor] = useState(
    new Date(hoje.getFullYear(), hoje.getMonth(), 1)
  );
  const [selecionadas, setSelecionadas] = useState<string[]>([]);
  const [tipo, setTipo] = useState<"individual" | "group">("individual");
  const [horariosTexto, setHorariosTexto] = useState("19:00");
  const [duracao, setDuracao] = useState(60);
  const [titulo, setTitulo] = useState("");
  const [dados, setDados] = useState<any>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [secoesAbertas, setSecoesAbertas] = useState<Record<string, boolean>>({});
  const [convidadosPorEvento, setConvidadosPorEvento] = useState<Record<string, string[]>>({});
  const [enviandoConvites, setEnviandoConvites] = useState<string | null>(null);

  const authFetch = useCallback(async (url: string, init?: RequestInit) => {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.access_token) {
      throw new Error("Sessão administrativa expirada.");
    }

    const headers = new Headers(init?.headers);
    headers.set("Authorization", `Bearer ${session.access_token}`);

    return fetch(url, {
      ...init,
      headers,
      cache: "no-store",
    });
  }, []);

  const carregar = useCallback(async () => {
    try {
      const response = await authFetch("/api/admin/agenda/mentorias");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Erro ao carregar agenda de mentorias.");
      }

      setDados(data);
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro ao carregar agenda."
      );
    }
  }, [authFetch]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  useEffect(() => {
    const intervalo = window.setInterval(() => {
      void carregar();
    }, 30_000);

    return () => window.clearInterval(intervalo);
  }, [carregar]);

  const celulas = useMemo(() => {
    const ano = cursor.getFullYear();
    const mes = cursor.getMonth();
    const primeiro = new Date(ano, mes, 1).getDay();
    const total = new Date(ano, mes + 1, 0).getDate();
    const itens: Array<string | null> = [];

    for (let i = 0; i < primeiro; i += 1) itens.push(null);
    for (let dia = 1; dia <= total; dia += 1) itens.push(isoDate(ano, mes, dia));
    while (itens.length % 7 !== 0) itens.push(null);

    return itens;
  }, [cursor]);

  const participantesPorEvento = useMemo(() => {
    const mapa = new Map<string, any[]>();

    (dados?.participants || []).forEach((item: any) => {
      const atuais = mapa.get(item.event_id) || [];
      atuais.push(item);
      mapa.set(item.event_id, atuais);
    });

    return mapa;
  }, [dados]);

  const proximos = useMemo(
    () =>
      (dados?.events || [])
        .filter(
          (evento: Evento) =>
            new Date(evento.starts_at) >= new Date() &&
            evento.status !== "cancelled"
        )
        .sort(
          (a: Evento, b: Evento) =>
            new Date(a.starts_at).getTime() -
            new Date(b.starts_at).getTime()
        ),
    [dados]
  );

  const historico = useMemo(
    () =>
      (dados?.events || [])
        .filter(
          (evento: Evento) =>
            new Date(evento.starts_at) < new Date() ||
            evento.status === "completed"
        )
        .sort(
          (a: Evento, b: Evento) =>
            new Date(b.starts_at).getTime() -
            new Date(a.starts_at).getTime()
        ),
    [dados]
  );

  const compromissosEspelhados = useMemo(
    () =>
      (dados?.appointments || [])
        .filter(
          (item: any) =>
            new Date(item.scheduled_at) >= new Date()
        )
        .sort(
          (a: any, b: any) =>
            new Date(a.scheduled_at).getTime() -
            new Date(b.scheduled_at).getTime()
        ),
    [dados]
  );

  const compromissosPorMes = useMemo(() => {
    const grupos = new Map<string, any[]>();

    compromissosEspelhados.forEach((item: any) => {
      const rotulo = new Date(item.scheduled_at).toLocaleDateString(
        "pt-BR",
        {
          timeZone: "America/Sao_Paulo",
          month: "long",
          year: "numeric",
        }
      );

      const chave = rotulo.charAt(0).toUpperCase() + rotulo.slice(1);
      const atuais = grupos.get(chave) || [];
      atuais.push(item);
      grupos.set(chave, atuais);
    });

    return Array.from(grupos.entries()).map(([mes, itens]) => ({
      mes,
      itens,
    }));
  }, [compromissosEspelhados]);

  const historicoPorMes = useMemo(() => {
    const grupos = new Map<string, Evento[]>();

    historico.forEach((evento: Evento) => {
      const rotulo = new Date(evento.starts_at).toLocaleDateString(
        "pt-BR",
        {
          timeZone: "America/Sao_Paulo",
          month: "long",
          year: "numeric",
        }
      );

      const chave = rotulo.charAt(0).toUpperCase() + rotulo.slice(1);
      const atuais = grupos.get(chave) || [];
      atuais.push(evento);
      grupos.set(chave, atuais);
    });

    return Array.from(grupos.entries()).map(([mes, eventos]) => ({
      mes,
      eventos,
    }));
  }, [historico]);

  function toggleDate(date: string) {
    setSelecionadas((atuais) =>
      atuais.includes(date)
        ? atuais.filter((item) => item !== date)
        : [...atuais, date]
    );
  }

  function horarios() {
    return Array.from(
      new Set(
        horariosTexto
          .split(/[,\s;]+/)
          .map((item) => item.trim())
          .filter((item) => /^\d{2}:\d{2}$/.test(item))
      )
    );
  }

  async function criar() {
    const times = horarios();

    if (!selecionadas.length) {
      setErro("Selecione pelo menos um dia no calendário.");
      return;
    }

    if (!times.length) {
      setErro("Informe pelo menos um horário no formato 19:00.");
      return;
    }

    if (tipo === "group" && !titulo.trim()) {
      setErro("Informe o tema da mentoria em grupo.");
      return;
    }

    setSalvando(true);
    setErro(null);
    setMensagem(null);

    try {
      const response = await authFetch("/api/admin/agenda/mentorias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_events",
          event_type: tipo,
          dates: selecionadas,
          times,
          duration_minutes: duracao,
          title:
            tipo === "group"
              ? titulo.trim()
              : "Mentoria Individual",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Erro ao criar horários.");
      }

      const criados = data.created?.length || 0;
      const pulados = data.skipped?.length || 0;

      setMensagem(
        `${criados} ${criados === 1 ? "horário criado" : "horários criados"}${
          pulados
            ? ` · ${pulados} ${pulados === 1 ? "conflito ignorado" : "conflitos ignorados"}`
            : ""
        }.`
      );

      setSelecionadas([]);
      if (tipo === "group") {
        setTitulo("");
      }
      await carregar();
    } catch (error) {
      setErro(
        error instanceof Error ? error.message : "Erro ao criar agenda."
      );
    } finally {
      setSalvando(false);
    }
  }

  async function definirEspelho(valor: boolean) {
    setErro(null);

    const response = await authFetch("/api/admin/agenda/mentorias", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "set_mirror",
        mirror_club_therapy: valor,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setErro(data?.error || "Não foi possível alterar o espelho.");
      return;
    }

    await carregar();
  }

  async function atualizarPresenca(
    eventId: string,
    clientId: string,
    attendance: "not_marked" | "present" | "absent"
  ) {
    const response = await authFetch("/api/admin/agenda/mentorias", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "attendance",
        event_id: eventId,
        client_id: clientId,
        attendance,
      }),
    });

    if (response.ok) {
      await carregar();
    }
  }

  async function atualizarStatus(
    eventId: string,
    status: "open" | "booked" | "completed" | "cancelled"
  ) {
    const response = await authFetch("/api/admin/agenda/mentorias", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "event_status",
        event_id: eventId,
        status,
      }),
    });

    if (response.ok) {
      await carregar();
    }
  }

  function alternarConvidado(eventId: string, clientId: string) {
    setConvidadosPorEvento((atuais) => {
      const selecionados = atuais[eventId] || [];
      const proximo = selecionados.includes(clientId)
        ? selecionados.filter((id) => id !== clientId)
        : [...selecionados, clientId];

      return {
        ...atuais,
        [eventId]: proximo,
      };
    });
  }

  function selecionarTodosConvidados(eventId: string, clientIds: string[]) {
    setConvidadosPorEvento((atuais) => ({
      ...atuais,
      [eventId]: clientIds,
    }));
  }

  async function enviarConvites(
    evento: Evento,
    audience: "guests" | "diamond"
  ) {
    const clientIds =
      audience === "guests"
        ? convidadosPorEvento[evento.id] || []
        : [];

    if (audience === "guests" && clientIds.length === 0) {
      setErro("Selecione pelo menos um convidado.");
      return;
    }

    const chaveEnvio = `${evento.id}-${audience}`;
    setEnviandoConvites(chaveEnvio);
    setErro(null);
    setMensagem(null);

    try {
      const response = await authFetch("/api/admin/agenda/mentorias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "send_group_invites",
          event_id: evento.id,
          audience,
          client_ids: clientIds,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Não foi possível enviar os convites.");
      }

      setMensagem(
        data?.message ||
          (audience === "diamond"
            ? "Aviso enviado aos mentorados Diamante."
            : "Convites enviados aos convidados.")
      );

      if (audience === "guests") {
        setConvidadosPorEvento((atuais) => ({
          ...atuais,
          [evento.id]: [],
        }));
      }

      await carregar();
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro ao enviar convites."
      );
    } finally {
      setEnviandoConvites(null);
    }
  }

  function secaoEstaAberta(
    chave: string,
    abertaPorPadrao = false
  ) {
    return secoesAbertas[chave] ?? abertaPorPadrao;
  }

  function alternarSecao(
    chave: string,
    abertaPorPadrao = false
  ) {
    setSecoesAbertas((atuais) => ({
      ...atuais,
      [chave]: !(atuais[chave] ?? abertaPorPadrao),
    }));
  }

  function linhaParticipante(
    evento: Evento,
    item: any,
    status: "pending" | "confirmed" | "declined"
  ) {
    const cliente = item.cliente;
    const participante = item.participante;

    const nome =
      cliente.nome_referencia ||
      cliente.nome ||
      "Mentorada";

    const textoStatus =
      status === "confirmed"
        ? "Confirmado"
        : status === "declined"
        ? "Não vai participar"
        : "Aguardando resposta";

    return (
      <div
        key={cliente.id}
        className="flex flex-col gap-3 rounded-xl bg-white/[0.04] p-4 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <p className="text-base font-bold text-white">
            {nome}
          </p>

          <p
            className={`mt-1 text-sm ${
              status === "confirmed"
                ? "text-green-300"
                : status === "declined"
                ? "text-red-300"
                : "text-purple-300/80"
            }`}
          >
            {textoStatus}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() =>
              atualizarPresenca(
                evento.id,
                cliente.id,
                "present"
              )
            }
            className={`rounded-lg px-3 py-2 text-xs font-bold ${
              participante?.attendance === "present"
                ? "bg-green-500 text-white"
                : "border border-green-400/30 text-green-200"
            }`}
          >
            Presente
          </button>

          <button
            type="button"
            onClick={() =>
              atualizarPresenca(
                evento.id,
                cliente.id,
                "absent"
              )
            }
            className={`rounded-lg px-3 py-2 text-xs font-bold ${
              participante?.attendance === "absent"
                ? "bg-red-500 text-white"
                : "border border-red-400/30 text-red-200"
            }`}
          >
            Faltou
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium text-yellow-300">
            Agenda oficial do Clube do Tarô
          </p>

          <h1 className="mt-1 text-3xl font-semibold text-purple-200">
            Mentorias
          </h1>

          <p className="mt-1 text-sm text-purple-300/70">
            Individual, em grupo, confirmações, presença e histórico.
          </p>
        </div>

        <Link
          href="/admin/agenda"
          className="rounded-xl border border-purple-500/30 px-5 py-3 text-center text-sm font-semibold text-purple-100"
        >
          ← Agenda geral
        </Link>
      </div>

      {erro && (
        <div className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">
          {erro}
        </div>
      )}

      {mensagem && (
        <div className="rounded-xl border border-green-400/30 bg-green-400/10 px-4 py-3 text-sm text-green-200">
          {mensagem}
        </div>
      )}

      <section className="rounded-3xl border border-yellow-500/20 bg-[#1d0023] p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-bold text-yellow-300">
              Espelho Clube + Terapia
            </h2>

            <p className="mt-1 text-sm text-purple-200/70">
              Quando ativo, compromissos da Terapia e do Clube bloqueiam os mesmos horários.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              definirEspelho(
                !(dados?.settings?.mirror_club_therapy === true)
              )
            }
            className={`rounded-full px-5 py-2 text-sm font-bold ${
              dados?.settings?.mirror_club_therapy
                ? "bg-green-500 text-white"
                : "bg-white/10 text-purple-200"
            }`}
          >
            {dados?.settings?.mirror_club_therapy
              ? "✓ Espelho ativado"
              : "Espelho desativado"}
          </button>
        </div>
      </section>

      <section className="rounded-3xl border border-purple-500/20 bg-[#1d0023] p-5">
        <h2 className="text-xl font-bold text-purple-100">
          Liberar novas mentorias
        </h2>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setTipo("individual")}
            className={`rounded-xl px-4 py-3 text-sm font-bold ${
              tipo === "individual"
                ? "bg-yellow-400 text-black"
                : "bg-white/5 text-purple-100"
            }`}
          >
            Individual
          </button>

          <button
            type="button"
            onClick={() => setTipo("group")}
            className={`rounded-xl px-4 py-3 text-sm font-bold ${
              tipo === "group"
                ? "bg-yellow-400 text-black"
                : "bg-white/5 text-purple-100"
            }`}
          >
            Em Grupo
          </button>
        </div>

        {tipo === "group" && (
          <label className="mt-5 block text-sm font-bold text-purple-100">
            Tema da mentoria
            <input
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex.: Limites, autoestima e novos ciclos"
              className="mt-2 w-full rounded-xl border border-purple-500/30 bg-black/20 px-4 py-3 text-white"
            />
            <span className="mt-2 block text-xs font-normal text-purple-300/70">
              Este tema aparecerá no convite enviado aos participantes.
            </span>
          </label>
        )}

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="text-sm font-bold text-purple-100">
            Horários
            <input
              value={horariosTexto}
              onChange={(e) => setHorariosTexto(e.target.value)}
              placeholder="Ex.: 14:00, 16:00, 19:00"
              className="mt-2 w-full rounded-xl border border-purple-500/30 bg-black/20 px-4 py-3 text-white"
            />
            <span className="mt-2 block text-xs font-normal text-purple-300/70">
              Pode informar vários horários separados por vírgula.
            </span>
          </label>

          <label className="text-sm font-bold text-purple-100">
            Duração (minutos)
            <input
              type="number"
              min={15}
              value={duracao}
              onChange={(e) => setDuracao(Number(e.target.value))}
              className="mt-2 w-full rounded-xl border border-purple-500/30 bg-black/20 px-4 py-3 text-white"
            />
          </label>
        </div>

        <div className="mt-6 rounded-2xl border border-yellow-500/20 bg-black/20 p-4">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() =>
                setCursor(
                  new Date(
                    cursor.getFullYear(),
                    cursor.getMonth() - 1,
                    1
                  )
                )
              }
              className="rounded-xl border border-yellow-500/20 px-4 py-2 text-yellow-300"
            >
              ‹
            </button>

            <h3 className="font-bold text-yellow-300">
              {MESES[cursor.getMonth()]} {cursor.getFullYear()}
            </h3>

            <button
              type="button"
              onClick={() =>
                setCursor(
                  new Date(
                    cursor.getFullYear(),
                    cursor.getMonth() + 1,
                    1
                  )
                )
              }
              className="rounded-xl border border-yellow-500/20 px-4 py-2 text-yellow-300"
            >
              ›
            </button>
          </div>

          <div className="mt-4 grid grid-cols-7 gap-2">
            {DIAS.map((dia) => (
              <div
                key={dia}
                className="py-2 text-center text-[11px] font-bold text-purple-300"
              >
                {dia}
              </div>
            ))}

            {celulas.map((date, index) => {
              if (!date) {
                return <div key={`empty-${index}`} className="aspect-square" />;
              }

              const selected = selecionadas.includes(date);

              return (
                <button
                  key={date}
                  type="button"
                  onClick={() => toggleDate(date)}
                  className={`aspect-square rounded-2xl border text-sm font-bold transition ${
                    selected
                      ? "border-yellow-300 bg-yellow-400 text-black"
                      : "border-purple-500/20 bg-white/[0.03] text-purple-100 hover:border-yellow-400/50"
                  }`}
                >
                  {Number(date.slice(-2))}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={criar}
            disabled={salvando}
            className="rounded-xl bg-purple-800 px-5 py-3 text-sm font-bold text-white disabled:opacity-50"
          >
            {salvando
              ? "Salvando..."
              : tipo === "group"
              ? "Criar Mentoria em Grupo"
              : "Liberar horários individuais"}
          </button>

          <span className="text-xs text-purple-300/70">
            {selecionadas.length}{" "}
            {selecionadas.length === 1 ? "dia selecionado" : "dias selecionados"}
          </span>
        </div>
      </section>

      <section className="rounded-3xl border border-purple-500/20 bg-[#1d0023] p-5">
        <h2 className="text-xl font-bold text-purple-100">
          Próximas mentorias
        </h2>

        <div className="mt-5 grid gap-4">
          {proximos.length === 0 && (
            <p className="rounded-2xl bg-black/20 p-4 text-sm text-purple-300/70">
              Nenhuma mentoria futura.
            </p>
          )}

          {proximos.map((evento: Evento) => {
            const participantes =
              participantesPorEvento.get(evento.id) || [];

            const confirmadoIndividual =
              evento.event_type === "individual"
                ? participantes.find(
                    (item) => item.response === "confirmed"
                  )
                : null;

            return (
              <div
                key={evento.id}
                className="rounded-2xl border border-purple-500/20 bg-black/20 p-5"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-yellow-500/30 px-3 py-1 text-xs font-bold text-yellow-300">
                        {evento.event_type === "group"
                          ? "Em Grupo"
                          : "Individual"}
                      </span>

                      <span className="text-xs text-purple-300">
                        {evento.status}
                      </span>
                    </div>

                    <h3 className="mt-3 text-lg font-bold text-white">
                      {evento.title}
                    </h3>

                    <p className="mt-1 text-sm capitalize text-purple-200">
                      {dataHora(evento.starts_at)} · {evento.duration_minutes} min
                    </p>

                    {confirmadoIndividual && (
                      <p className="mt-3 text-sm font-bold text-green-300">
                        Agendada por {confirmadoIndividual.client_name}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        atualizarStatus(evento.id, "completed")
                      }
                      className="rounded-xl border border-green-400/30 px-3 py-2 text-xs font-bold text-green-200"
                    >
                      Marcar realizada
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        atualizarStatus(evento.id, "cancelled")
                      }
                      className="rounded-xl border border-red-400/30 px-3 py-2 text-xs font-bold text-red-200"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>

                {evento.event_type === "group" &&
                  (() => {
                    const convidadosDisponiveis = (dados?.active_clients || [])
                      .filter(
                        (cliente: any) =>
                          String(cliente.plano || "").toLowerCase() !== "diamante"
                      );

                    const selecionados =
                      convidadosPorEvento[evento.id] || [];

                    const idsDisponiveis = convidadosDisponiveis.map(
                      (cliente: any) => cliente.id
                    );

                    const convidadosIncluidos = participantes.filter(
                      (item: any) =>
                        String(item.client_plan || "").toLowerCase() !== "diamante"
                    );

                    const chaveConvidados = `${evento.id}-convidados`;
                    const chaveIncluidos = `${evento.id}-convidados-incluidos`;

                    return (
                      <div className="mt-5 border-t border-purple-500/20 pt-5">
                        <div className="rounded-2xl border border-yellow-400/20 bg-yellow-400/[0.04] p-4">
                          <p className="text-xs font-bold uppercase tracking-[0.18em] text-yellow-300">
                            Convites da mentoria
                          </p>

                          <p className="mt-2 text-base font-bold text-white">
                            Tema: {evento.title}
                          </p>

                          <p className="mt-1 text-sm capitalize text-purple-200">
                            {dataHora(evento.starts_at)} · via Google Meet
                          </p>

                          <div className="mt-4 flex flex-wrap gap-3">
                            <button
                              type="button"
                              onClick={() => enviarConvites(evento, "diamond")}
                              disabled={
                                enviandoConvites === `${evento.id}-diamond`
                              }
                              className="rounded-xl border border-purple-400/30 bg-purple-500/10 px-4 py-3 text-sm font-bold text-purple-100 disabled:opacity-50"
                            >
                              {enviandoConvites === `${evento.id}-diamond`
                                ? "Enviando..."
                                : "Avisar mentorados Diamante"}
                            </button>
                          </div>
                        </div>

                        <div className="mt-3 overflow-hidden rounded-2xl border border-purple-400/20 bg-purple-400/[0.03]">
                          <button
                            type="button"
                            onClick={() =>
                              alternarSecao(chaveConvidados)
                            }
                            className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left"
                          >
                            <div>
                              <p className="text-base font-bold text-purple-100">
                                Convidados do Clube ({selecionados.length} selecionados)
                              </p>
                              <p className="mt-1 text-xs text-purple-300/70">
                                Escolha uma ou várias pessoas para receber o convite.
                              </p>
                            </div>

                            <span className="text-xl text-purple-300">
                              {secaoEstaAberta(chaveConvidados) ? "▾" : "›"}
                            </span>
                          </button>

                          {secaoEstaAberta(chaveConvidados) && (
                            <div className="border-t border-purple-400/10 p-4">
                              <div className="mb-3 flex flex-wrap gap-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    selecionarTodosConvidados(
                                      evento.id,
                                      idsDisponiveis
                                    )
                                  }
                                  className="rounded-lg border border-purple-400/20 px-3 py-2 text-xs font-bold text-purple-200"
                                >
                                  Selecionar todos
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    selecionarTodosConvidados(evento.id, [])
                                  }
                                  className="rounded-lg border border-purple-400/20 px-3 py-2 text-xs font-bold text-purple-200"
                                >
                                  Limpar seleção
                                </button>
                              </div>

                              <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
                                {convidadosDisponiveis.length === 0 ? (
                                  <p className="rounded-xl bg-black/20 p-4 text-sm text-purple-300/70">
                                    Não há outros assinantes ativos para convidar.
                                  </p>
                                ) : (
                                  convidadosDisponiveis.map((cliente: any) => {
                                    const nome =
                                      cliente.nome_referencia ||
                                      cliente.nome ||
                                      "Assinante";

                                    const marcado = selecionados.includes(
                                      cliente.id
                                    );

                                    return (
                                      <label
                                        key={cliente.id}
                                        className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition ${
                                          marcado
                                            ? "border-yellow-400/40 bg-yellow-400/[0.08]"
                                            : "border-purple-500/10 bg-black/10"
                                        }`}
                                      >
                                        <input
                                          type="checkbox"
                                          checked={marcado}
                                          onChange={() =>
                                            alternarConvidado(
                                              evento.id,
                                              cliente.id
                                            )
                                          }
                                          className="h-4 w-4 accent-yellow-400"
                                        />

                                        <div>
                                          <p className="font-bold text-white">
                                            {nome}
                                          </p>
                                          <p className="mt-1 text-xs capitalize text-purple-300/70">
                                            Plano {cliente.plano || "—"}
                                          </p>
                                        </div>
                                      </label>
                                    );
                                  })
                                )}
                              </div>

                              <button
                                type="button"
                                onClick={() =>
                                  enviarConvites(evento, "guests")
                                }
                                disabled={
                                  selecionados.length === 0 ||
                                  enviandoConvites === `${evento.id}-guests`
                                }
                                className="mt-4 w-full rounded-xl bg-yellow-400 px-5 py-3 text-sm font-extrabold text-black disabled:opacity-40"
                              >
                                {enviandoConvites === `${evento.id}-guests`
                                  ? "Enviando convites..."
                                  : `Enviar convite aos convidados (${selecionados.length})`}
                              </button>
                            </div>
                          )}
                        </div>

                        {convidadosIncluidos.length > 0 && (
                          <div className="mt-3 overflow-hidden rounded-2xl border border-blue-400/20 bg-blue-400/[0.03]">
                            <button
                              type="button"
                              onClick={() =>
                                alternarSecao(chaveIncluidos)
                              }
                              className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left"
                            >
                              <span className="text-base font-bold text-blue-100">
                                Convidados incluídos ({convidadosIncluidos.length})
                              </span>

                              <span className="text-xl text-blue-300">
                                {secaoEstaAberta(chaveIncluidos) ? "▾" : "›"}
                              </span>
                            </button>

                            {secaoEstaAberta(chaveIncluidos) && (
                              <div className="grid gap-2 border-t border-blue-400/10 p-3">
                                {convidadosIncluidos.map((item: any) => (
                                  <div
                                    key={item.client_id}
                                    className="rounded-xl bg-black/20 p-3"
                                  >
                                    <p className="font-bold text-white">
                                      {item.client_name || "Convidado"}
                                    </p>
                                    <p className="mt-1 text-xs text-blue-200/80">
                                      {item.response === "confirmed"
                                        ? "Confirmado"
                                        : item.response === "declined"
                                        ? "Não vai participar"
                                        : "Convite enviado · aguardando resposta"}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })()}

                {evento.event_type === "group" &&
                  (() => {
                    const itensDiamante = (dados?.diamond_clients || []).map(
                      (cliente: any) => ({
                        cliente,
                        participante: participantes.find(
                          (item) => item.client_id === cliente.id
                        ),
                      })
                    );

                    const aguardando = itensDiamante.filter(
                      (item: any) =>
                        item.participante?.response !== "confirmed" &&
                        item.participante?.response !== "declined"
                    );

                    const confirmados = itensDiamante.filter(
                      (item: any) =>
                        item.participante?.response === "confirmed"
                    );

                    const recusados = itensDiamante.filter(
                      (item: any) =>
                        item.participante?.response === "declined"
                    );

                    const chaveAguardando = `${evento.id}-aguardando`;
                    const chaveConfirmados = `${evento.id}-confirmados`;
                    const chaveRecusados = `${evento.id}-recusados`;

                    return (
                      <div className="mt-5 border-t border-purple-500/20 pt-5">
                        <p className="text-base font-bold uppercase tracking-wide text-yellow-300">
                          Confirmações do grupo Diamante
                        </p>

                        <div className="mt-4 grid gap-3">
                          <div className="overflow-hidden rounded-2xl border border-yellow-400/20 bg-yellow-400/[0.04]">
                            <button
                              type="button"
                              onClick={() =>
                                alternarSecao(chaveAguardando, true)
                              }
                              className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left"
                            >
                              <span className="text-base font-bold text-yellow-200">
                                Aguardando confirmação ({aguardando.length})
                              </span>

                              <span className="text-xl text-yellow-300">
                                {secaoEstaAberta(chaveAguardando, true)
                                  ? "▾"
                                  : "›"}
                              </span>
                            </button>

                            {secaoEstaAberta(chaveAguardando, true) && (
                              <div className="grid gap-2 border-t border-yellow-400/10 p-3">
                                {aguardando.length === 0 ? (
                                  <p className="rounded-xl bg-black/20 p-4 text-sm text-purple-300/70">
                                    Ninguém aguardando confirmação.
                                  </p>
                                ) : (
                                  aguardando.map((item: any) =>
                                    linhaParticipante(
                                      evento,
                                      item,
                                      "pending"
                                    )
                                  )
                                )}
                              </div>
                            )}
                          </div>

                          <div className="overflow-hidden rounded-2xl border border-green-400/20 bg-green-400/[0.04]">
                            <button
                              type="button"
                              onClick={() =>
                                alternarSecao(chaveConfirmados)
                              }
                              className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left"
                            >
                              <span className="text-base font-bold text-green-200">
                                Confirmados ({confirmados.length})
                              </span>

                              <span className="text-xl text-green-300">
                                {secaoEstaAberta(chaveConfirmados)
                                  ? "▾"
                                  : "›"}
                              </span>
                            </button>

                            {secaoEstaAberta(chaveConfirmados) && (
                              <div className="grid gap-2 border-t border-green-400/10 p-3">
                                {confirmados.length === 0 ? (
                                  <p className="rounded-xl bg-black/20 p-4 text-sm text-purple-300/70">
                                    Ainda não há confirmações.
                                  </p>
                                ) : (
                                  confirmados.map((item: any) =>
                                    linhaParticipante(
                                      evento,
                                      item,
                                      "confirmed"
                                    )
                                  )
                                )}
                              </div>
                            )}
                          </div>

                          <div className="overflow-hidden rounded-2xl border border-red-400/20 bg-red-400/[0.03]">
                            <button
                              type="button"
                              onClick={() =>
                                alternarSecao(chaveRecusados)
                              }
                              className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left"
                            >
                              <span className="text-base font-bold text-red-200">
                                Não participarão ({recusados.length})
                              </span>

                              <span className="text-xl text-red-300">
                                {secaoEstaAberta(chaveRecusados)
                                  ? "▾"
                                  : "›"}
                              </span>
                            </button>

                            {secaoEstaAberta(chaveRecusados) && (
                              <div className="grid gap-2 border-t border-red-400/10 p-3">
                                {recusados.length === 0 ? (
                                  <p className="rounded-xl bg-black/20 p-4 text-sm text-purple-300/70">
                                    Ninguém recusou esta mentoria.
                                  </p>
                                ) : (
                                  recusados.map((item: any) =>
                                    linhaParticipante(
                                      evento,
                                      item,
                                      "declined"
                                    )
                                  )
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
              </div>
            );
          })}
        </div>
      </section>

      {dados?.settings?.mirror_club_therapy && (
        <section className="overflow-hidden rounded-3xl border border-green-500/20 bg-[#1d0023]">
          <button
            type="button"
            onClick={() => alternarSecao("agenda-mae")}
            className="flex w-full items-center justify-between gap-4 p-5 text-left"
          >
            <div>
              <h2 className="text-xl font-bold text-green-200">
                Compromissos espelhados da Agenda-Mãe ({compromissosEspelhados.length})
              </h2>

              <p className="mt-1 text-sm text-purple-300/70">
                Estes horários também impedem que você libere uma mentoria no mesmo período.
              </p>
            </div>

            <span className="text-2xl text-green-300">
              {secaoEstaAberta("agenda-mae") ? "▾" : "›"}
            </span>
          </button>

          {secaoEstaAberta("agenda-mae") && (
            <div className="grid gap-3 border-t border-green-500/10 p-5">
              {compromissosPorMes.length === 0 ? (
                <p className="rounded-xl bg-black/20 p-4 text-sm text-purple-300/70">
                  Nenhum compromisso futuro espelhado.
                </p>
              ) : (
                compromissosPorMes.map((grupo, indice) => {
                  const chave = `agenda-mae-${grupo.mes}`;
                  const abertaPorPadrao = indice === 0;

                  return (
                    <div
                      key={grupo.mes}
                      className="overflow-hidden rounded-2xl border border-green-500/10 bg-green-500/[0.03]"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          alternarSecao(chave, abertaPorPadrao)
                        }
                        className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left"
                      >
                        <span className="font-bold text-green-100">
                          {grupo.mes} ({grupo.itens.length})
                        </span>

                        <span className="text-lg text-green-300">
                          {secaoEstaAberta(chave, abertaPorPadrao)
                            ? "▾"
                            : "›"}
                        </span>
                      </button>

                      {secaoEstaAberta(chave, abertaPorPadrao) && (
                        <div className="grid gap-3 border-t border-green-500/10 p-3">
                          {grupo.itens.map((item: any) => (
                            <div
                              key={item.id}
                              className="rounded-xl border border-green-500/10 bg-green-500/5 p-4"
                            >
                              <p className="font-bold text-white">
                                {item.client_name}
                              </p>

                              <p className="mt-1 text-sm capitalize text-green-200/80">
                                {item.service_type} · {dataHora(item.scheduled_at)}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </section>
      )}

      <section className="overflow-hidden rounded-3xl border border-purple-500/20 bg-[#1d0023]">
        <button
          type="button"
          onClick={() => alternarSecao("historico-mentorias")}
          className="flex w-full items-center justify-between gap-4 p-5 text-left"
        >
          <h2 className="text-xl font-bold text-purple-100">
            Histórico de mentorias ({historico.length})
          </h2>

          <span className="text-2xl text-purple-300">
            {secaoEstaAberta("historico-mentorias") ? "▾" : "›"}
          </span>
        </button>

        {secaoEstaAberta("historico-mentorias") && (
          <div className="grid gap-3 border-t border-purple-500/10 p-5">
            {historico.length === 0 ? (
              <p className="text-sm text-purple-300/70">
                O histórico aparecerá aqui após os encontros.
              </p>
            ) : (
              historicoPorMes.map((grupo, indice) => {
                const chave = `historico-${grupo.mes}`;
                const abertaPorPadrao = indice === 0;

                return (
                  <div
                    key={grupo.mes}
                    className="overflow-hidden rounded-2xl border border-purple-500/20 bg-black/10"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        alternarSecao(chave, abertaPorPadrao)
                      }
                      className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left"
                    >
                      <span className="font-bold text-purple-100">
                        {grupo.mes} ({grupo.eventos.length})
                      </span>

                      <span className="text-lg text-purple-300">
                        {secaoEstaAberta(chave, abertaPorPadrao)
                          ? "▾"
                          : "›"}
                      </span>
                    </button>

                    {secaoEstaAberta(chave, abertaPorPadrao) && (
                      <div className="grid gap-3 border-t border-purple-500/10 p-3">
                        {grupo.eventos.map((evento: Evento) => {
                          const participantes =
                            participantesPorEvento.get(evento.id) || [];

                          return (
                            <div
                              key={evento.id}
                              className="rounded-xl border border-purple-500/20 bg-black/20 p-4"
                            >
                              <div className="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                  <p className="font-bold text-white">
                                    {evento.title}
                                  </p>

                                  <p className="mt-1 text-sm capitalize text-purple-300">
                                    {dataHora(evento.starts_at)} ·{" "}
                                    {evento.event_type === "group"
                                      ? "Em Grupo"
                                      : "Individual"}
                                  </p>
                                </div>

                                <span className="rounded-full border border-purple-500/30 px-3 py-1 text-xs text-purple-200">
                                  {participantes.filter(
                                    (item) => item.attendance === "present"
                                  ).length}{" "}
                                  presentes
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </section>
    </div>
  );
}
