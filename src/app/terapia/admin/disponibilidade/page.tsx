"use client";

import { useEffect, useMemo, useState } from "react";
import AvailabilityCalendar from "@/components/agenda/AvailabilityCalendar";
import { adminFetch } from "../components/adminFetch";

const DIAS = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

export default function DisponibilidadePage() {
  const [dias, setDias] = useState(
    DIAS.map((_, weekday) => ({
      weekday,
      enabled: false,
      start_time: "09:00",
      end_time: "18:00",
    }))
  );

  const [settings, setSettings] = useState({
    session_minutes: 60,
    break_minutes: 0,
    booking_window_days: 30,
    min_notice_hours: 12,
    client_reschedule_enabled: true,
  });

  const [exceptions, setExceptions] = useState<any[]>([]);
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  const blockedDates = useMemo(
    () =>
      exceptions
        .filter((item) => item.available === false)
        .map((item) => item.exception_date),
    [exceptions]
  );

  const specialDates = useMemo(
    () =>
      exceptions
        .filter((item) => item.available === true)
        .map((item) => item.exception_date),
    [exceptions]
  );

  async function carregar() {
    const response = await adminFetch(
      "/api/terapia/admin/disponibilidade"
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data?.error || "Erro ao carregar disponibilidade."
      );
    }

    if (data.settings) {
      setSettings({
        session_minutes:
          Number(data.settings.session_minutes) || 60,
        break_minutes:
          Number(data.settings.break_minutes) || 0,
        booking_window_days:
          Number(data.settings.booking_window_days) || 30,
        min_notice_hours:
          Number(data.settings.min_notice_hours) || 0,
        client_reschedule_enabled:
          data.settings.client_reschedule_enabled !== false,
      });
    }

    const map = new Map(
      (data.availability || []).map((item: any) => [
        Number(item.weekday),
        item,
      ])
    );

    setDias(
      DIAS.map((_, weekday) => {
        const item: any = map.get(weekday);

        return {
          weekday,
          enabled: Boolean(item?.enabled),
          start_time: String(
            item?.start_time || "09:00"
          ).slice(0, 5),
          end_time: String(
            item?.end_time || "18:00"
          ).slice(0, 5),
        };
      })
    );

    setExceptions(data.exceptions || []);
  }

  useEffect(() => {
    carregar().catch((error) =>
      setMensagem(
        error instanceof Error
          ? error.message
          : "Erro ao carregar."
      )
    );
  }, []);

  function alterarDia(
    weekday: number,
    patch: Record<string, unknown>
  ) {
    setDias((atuais) =>
      atuais.map((dia) =>
        dia.weekday === weekday
          ? { ...dia, ...patch }
          : dia
      )
    );
  }

  async function salvarRotina() {
    setSalvando(true);
    setMensagem(null);

    try {
      const response = await adminFetch(
        "/api/terapia/admin/disponibilidade",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            settings,
            availability: dias,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Erro ao salvar."
        );
      }

      setMensagem("Disponibilidade semanal salva.");
    } catch (error) {
      setMensagem(
        error instanceof Error
          ? error.message
          : "Erro ao salvar."
      );
    } finally {
      setSalvando(false);
    }
  }

  async function bulk(
    action: "block" | "unblock",
    dates: string[]
  ) {
    setMensagem(null);

    const response = await adminFetch(
      "/api/terapia/admin/disponibilidade",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action,
          dates,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data?.error ||
          "Erro ao atualizar bloqueios."
      );
    }

    await carregar();

    setMensagem(
      action === "block"
        ? `${dates.length} ${dates.length === 1 ? "dia bloqueado" : "dias bloqueados"}.`
        : `${dates.length} ${dates.length === 1 ? "dia desbloqueado" : "dias desbloqueados"}.`
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8AA27A]">
        Agenda Terapêutica
      </p>

      <h1 className="mt-2 text-3xl font-extrabold text-[#5E7357]">
        Disponibilidade
      </h1>

      <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6C8465]">
        Defina sua rotina semanal e bloqueie vários dias de uma vez no calendário.
      </p>

      {mensagem && (
        <div className="mt-5 rounded-2xl border border-[#C7D4C0] bg-[#E8F0E4] p-4 text-sm font-semibold text-[#4F6548]">
          {mensagem}
        </div>
      )}

      <section className="mt-7 rounded-3xl border border-[#DCCFB8] bg-[#F7F1E4] p-6">
        <h2 className="text-xl font-extrabold text-[#5E7357]">
          Regras da agenda
        </h2>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
  ["Duração da sessão (minutos)", "session_minutes"],
  ["Intervalo entre sessões (minutos)", "break_minutes"],
  ["Liberar agenda pelos próximos (dias)", "booking_window_days"],
  ["Antecedência mínima (horas)", "min_notice_hours"],
].map(([label, key]) => (
            <label
              key={key}
              className="text-sm font-bold text-[#5E7357]"
            >
              {label}
              <input
                type="number"
                min={0}
                value={(settings as any)[key]}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    [key]: Number(e.target.value),
                  })
                }
                className="mt-2 w-full rounded-xl border border-[#C8B8A8] bg-white px-4 py-3"
              />
            </label>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-3xl border border-[#DCCFB8] bg-[#F7F1E4] p-6">
        <h2 className="text-xl font-extrabold text-[#5E7357]">
          Dias fixos da semana
        </h2>

        <p className="mt-2 text-sm text-[#6C8465]">
          Se você não atende aos domingos, basta deixar Domingo desligado. Não precisa bloquear domingo por domingo.
        </p>

        <div className="mt-5 grid gap-3">
          {dias.map((dia) => (
            <div
              key={dia.weekday}
              className="grid gap-4 rounded-2xl border border-[#E1D6C5] bg-white/70 p-4 md:grid-cols-[1fr_150px_150px]"
            >
              <label className="flex items-center gap-3 font-bold text-[#5E7357]">
                <input
                  type="checkbox"
                  checked={dia.enabled}
                  onChange={(e) =>
                    alterarDia(dia.weekday, {
                      enabled: e.target.checked,
                    })
                  }
                  className="h-5 w-5 accent-[#5E7357]"
                />

                {DIAS[dia.weekday]}
              </label>

              <input
                type="time"
                disabled={!dia.enabled}
                value={dia.start_time}
                onChange={(e) =>
                  alterarDia(dia.weekday, {
                    start_time: e.target.value,
                  })
                }
                className="rounded-xl border border-[#C8B8A8] bg-white px-4 py-3 disabled:opacity-45"
              />

              <input
                type="time"
                disabled={!dia.enabled}
                value={dia.end_time}
                onChange={(e) =>
                  alterarDia(dia.weekday, {
                    end_time: e.target.value,
                  })
                }
                className="rounded-xl border border-[#C8B8A8] bg-white px-4 py-3 disabled:opacity-45"
              />
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={salvarRotina}
          disabled={salvando}
          className="mt-6 rounded-xl bg-[#5E7357] px-6 py-3 text-sm font-bold text-[#F8F4EC] shadow disabled:opacity-60"
        >
          {salvando
            ? "Salvando..."
            : "Salvar disponibilidade"}
        </button>
      </section>

      <div className="mt-6">
        <AvailabilityCalendar
          blockedDates={blockedDates}
          specialDates={specialDates}
          onBlockDates={(dates) =>
            bulk("block", dates)
          }
          onUnblockDates={(dates) =>
            bulk("unblock", dates)
          }
          title="Bloqueios no calendário"
          subtitle="Clique nos dias que não quer atender ou selecione um período inteiro. Depois bloqueie tudo de uma vez."
        />
      </div>
    </div>
  );
}
