"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type {
  AgendaAtendimento,
  EdicaoAgendaModo,
} from "./agenda-types";

type Props = {
  aberto: boolean;
  item: AgendaAtendimento | null;
  modo: EdicaoAgendaModo;
  onFechar: () => void;
  onSalvo: () => void | Promise<void>;
};

function duasCasas(numero: number) {
  return String(numero).padStart(2, "0");
}

function dataLocal(iso: string) {
  const data = new Date(iso);

  return `${data.getFullYear()}-${duasCasas(
    data.getMonth() + 1
  )}-${duasCasas(data.getDate())}`;
}

function horaLocal(iso: string) {
  const data = new Date(iso);

  return `${duasCasas(data.getHours())}:${duasCasas(
    data.getMinutes()
  )}`;
}

const campo =
  "w-full rounded-xl border border-purple-500/30 bg-[#1d0023] p-4 text-white placeholder:text-purple-300/60 outline-none focus:border-yellow-300/50";

export default function EditarAtendimentoModal({
  aberto,
  item,
  modo,
  onFechar,
  onSalvo,
}: Props) {
  const [serviceType, setServiceType] =
    useState("");
  const [professional, setProfessional] =
    useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] =
    useState("60");
  const [notes, setNotes] = useState("");
  const [meetUrl, setMeetUrl] = useState("");
  const [status, setStatus] =
    useState("agendado");

  const [salvando, setSalvando] =
    useState(false);
  const [erro, setErro] =
    useState<string | null>(null);

  useEffect(() => {
    if (!item || !aberto) return;

    setServiceType(item.service_type);
    setProfessional(item.professional);
    setDate(dataLocal(item.scheduled_at));
    setTime(horaLocal(item.scheduled_at));
    setDuration(
      String(item.duration_minutes || 60)
    );
    setNotes(item.notes || "");
    setMeetUrl(item.meet_url || "");
    setStatus(item.status || "agendado");
    setErro(null);
  }, [item, aberto]);

  if (!aberto || !item) return null;

  const itemAtual = item;

  async function salvar() {
    if (
      !serviceType ||
      !professional ||
      !date ||
      !time
    ) {
      setErro(
        "Preencha atendimento, profissional, data e horário."
      );
      return;
    }

    setSalvando(true);
    setErro(null);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        throw new Error(
          "Sessão administrativa expirada. Entre novamente."
        );
      }

      const response = await fetch(
        "/api/admin/agenda",
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
            Authorization:
              `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            id: itemAtual.id,
            service_type: serviceType,
            professional,
            date,
            time,
            duration_minutes:
              Number(duration),
            notes,
            meet_url: meetUrl,
            status,
          }),
        }
      );

      const dataResposta =
        await response.json();

      if (!response.ok) {
        throw new Error(
          dataResposta?.error ||
            "Não foi possível atualizar o atendimento."
        );
      }

      await onSalvo();
      onFechar();
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível atualizar o atendimento."
      );
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-purple-500/40 bg-[#28002f] shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-purple-500/30 bg-[#28002f] p-5">
          <div>
            <p className="text-sm text-yellow-300">
              {modo === "remarcar"
                ? "Remarcar atendimento"
                : "Editar atendimento"}
            </p>
            <h2 className="mt-1 text-xl font-semibold text-white">
              {itemAtual.client_name}
            </h2>
          </div>

          <button
            type="button"
            onClick={onFechar}
            className="rounded-lg px-3 py-2 text-purple-300 transition hover:bg-white/5 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4 p-5 md:p-6">
          {erro && (
            <div className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">
              {erro}
            </div>
          )}

          {modo === "editar" && (
            <>
              <select
                value={serviceType}
                onChange={(e) =>
                  setServiceType(e.target.value)
                }
                className={campo}
              >
                <option value="Mentoria">
                  Mentoria
                </option>
                <option value="Terapia Holística">
                  Terapia Holística
                </option>
                <option value="Terapia TRG">
                  Terapia TRG
                </option>
                <option value="Psicologia">
                  Psicologia
                </option>
                <option value="Psiquiatria">
                  Psiquiatria
                </option>
                <option value="Massoterapia">
                  Massoterapia
                </option>
                <option value="Fisioterapia">
                  Fisioterapia
                </option>
                <option value="Reunião Comercial">
                  Reunião Comercial
                </option>
                <option value="Reunião">
                  Reunião
                </option>
              </select>

              <input
                value={professional}
                onChange={(e) =>
                  setProfessional(
                    e.target.value
                  )
                }
                placeholder="Profissional"
                className={campo}
              />
            </>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-purple-300">
                Data
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) =>
                  setDate(e.target.value)
                }
                className={campo}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-purple-300">
                Horário
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) =>
                  setTime(e.target.value)
                }
                className={campo}
              />
            </div>
          </div>

          <select
            value={duration}
            onChange={(e) =>
              setDuration(e.target.value)
            }
            className={campo}
          >
            <option value="30">
              30 minutos
            </option>
            <option value="45">
              45 minutos
            </option>
            <option value="60">
              1 hora
            </option>
            <option value="90">
              1 hora e 30 minutos
            </option>
            <option value="120">
              2 horas
            </option>
          </select>

          {modo === "editar" && (
            <>
              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value)
                }
                className={campo}
              >
                <option value="agendado">
                  Agendado
                </option>
                <option value="confirmado">
                  Confirmado
                </option>
                <option value="realizado">
                  Realizado
                </option>
                <option value="faltou">
                  Faltou
                </option>
                <option value="cancelado">
                  Cancelado
                </option>
              </select>

              <div>
                <label className="mb-2 block text-sm text-purple-300">
                  Link do Google Meet
                </label>
                <input
                  value={meetUrl}
                  onChange={(e) =>
                    setMeetUrl(e.target.value)
                  }
                  placeholder="https://meet.google.com/..."
                  className={campo}
                />
              </div>

              <textarea
                value={notes}
                onChange={(e) =>
                  setNotes(e.target.value)
                }
                placeholder="Observações do atendimento"
                rows={4}
                className={campo}
              />
            </>
          )}
        </div>

        <div className="sticky bottom-0 flex items-center justify-end gap-3 border-t border-purple-500/30 bg-[#28002f] p-5">
          <button
            type="button"
            onClick={onFechar}
            disabled={salvando}
            className="rounded-xl border border-purple-500/40 px-5 py-3 text-sm font-semibold text-purple-200 transition hover:bg-white/5 disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={salvar}
            disabled={salvando}
            className="rounded-xl bg-yellow-300 px-5 py-3 text-sm font-semibold text-purple-950 transition hover:bg-yellow-200 disabled:opacity-60"
          >
            {salvando
              ? "Salvando..."
              : modo === "remarcar"
              ? "Confirmar remarcação"
              : "Salvar alterações"}
          </button>
        </div>
      </div>
    </div>
  );
}
