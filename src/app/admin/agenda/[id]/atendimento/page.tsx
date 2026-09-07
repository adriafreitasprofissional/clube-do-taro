"use client";

import {
  useEffect,
  useState,
} from "react";
import {
  useParams,
  useRouter,
} from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { AgendaAtendimento } from "../../components/agenda-types";

const campo =
  "w-full rounded-xl border border-purple-500/30 bg-[#1d0023] p-4 text-white placeholder:text-purple-300/60 outline-none focus:border-yellow-300/50";

export default function AtendimentoPage() {
  const params = useParams();
  const router = useRouter();

  const id = String(params?.id || "");

  const [item, setItem] =
    useState<AgendaAtendimento | null>(null);

  const [privateNotes, setPrivateNotes] =
    useState("");
  const [evolution, setEvolution] =
    useState("");
  const [activity, setActivity] =
    useState("");

  const [carregando, setCarregando] =
    useState(true);
  const [salvando, setSalvando] =
    useState(false);
  const [erro, setErro] =
    useState<string | null>(null);

  async function token() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      throw new Error(
        "Sessão administrativa expirada. Entre novamente."
      );
    }

    return session.access_token;
  }

  async function carregar() {
    setCarregando(true);
    setErro(null);

    try {
      const accessToken = await token();

      const response = await fetch(
        `/api/admin/agenda?id=${encodeURIComponent(
          id
        )}`,
        {
          cache: "no-store",
          headers: {
            Authorization:
              `Bearer ${accessToken}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Atendimento não encontrado."
        );
      }

      const atendimento =
        data.atendimento as AgendaAtendimento;

      setItem(atendimento);
      setPrivateNotes(
        atendimento.private_session_notes ||
          ""
      );
      setEvolution(
        atendimento.evolution_summary || ""
      );
      setActivity(
        atendimento.client_activity || ""
      );
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro ao carregar o atendimento."
      );
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    if (id) {
      carregar();
    }
  }, [id]);

  async function salvar(
    finalizar = false
  ) {
    if (!item) return;

    setSalvando(true);
    setErro(null);

    try {
      const accessToken = await token();

      const response = await fetch(
        "/api/admin/agenda",
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
            Authorization:
              `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            id: item.id,
            private_session_notes:
              privateNotes,
            evolution_summary: evolution,
            client_activity: activity,
            ...(finalizar
              ? {
                  status: "realizado",
                  completed_at:
                    new Date().toISOString(),
                }
              : {}),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Não foi possível salvar a sessão."
        );
      }

      setItem(data.atendimento);

      if (finalizar) {
        router.push("/admin/agenda");
      }
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível salvar a sessão."
      );
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) {
    return (
      <div className="rounded-2xl border border-purple-500/30 bg-[#28002f] p-6 text-purple-300">
        Carregando atendimento...
      </div>
    );
  }

  if (!item) {
    return (
      <div className="rounded-2xl border border-red-400/30 bg-red-400/10 p-6 text-red-200">
        {erro || "Atendimento não encontrado."}
      </div>
    );
  }

  const data = new Date(item.scheduled_at);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <button
            type="button"
            onClick={() =>
              router.push("/admin/agenda")
            }
            className="mb-3 text-sm font-medium text-yellow-300 hover:text-yellow-200"
          >
            ← Voltar para Agenda
          </button>

          <p className="text-sm text-yellow-300">
            Sessão em atendimento
          </p>

          <h1 className="mt-1 text-3xl font-semibold text-purple-100">
            {item.client_name}
          </h1>

          <p className="mt-2 text-sm text-purple-300">
            {item.service_type} ·{" "}
            {data.toLocaleDateString(
              "pt-BR"
            )}{" "}
            às{" "}
            {data.toLocaleTimeString(
              "pt-BR",
              {
                hour: "2-digit",
                minute: "2-digit",
              }
            )}{" "}
            · {item.duration_minutes} min
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {item.meet_url ? (
            <a
              href={item.meet_url}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl bg-purple-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-600"
            >
              Entrar no Google Meet
            </a>
          ) : (
            <div className="rounded-xl border border-yellow-300/30 bg-yellow-300/5 px-4 py-3 text-sm text-yellow-200">
              Adicione o link do Meet em
              Editar atendimento.
            </div>
          )}
        </div>
      </div>

      {erro && (
        <div className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">
          {erro}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-purple-500/30 bg-[#28002f] p-5">
          <p className="text-xs uppercase tracking-wide text-purple-300">
            Cliente
          </p>
          <p className="mt-2 font-semibold text-white">
            {item.client_name}
          </p>
        </div>

        <div className="rounded-2xl border border-purple-500/30 bg-[#28002f] p-5">
          <p className="text-xs uppercase tracking-wide text-purple-300">
            Profissional
          </p>
          <p className="mt-2 font-semibold text-white">
            {item.professional}
          </p>
        </div>

        <div className="rounded-2xl border border-purple-500/30 bg-[#28002f] p-5">
          <p className="text-xs uppercase tracking-wide text-purple-300">
            Situação
          </p>
          <p className="mt-2 capitalize font-semibold text-white">
            {item.status}
          </p>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <section className="rounded-2xl border border-purple-500/30 bg-[#28002f] p-5">
          <div>
            <h2 className="text-lg font-semibold text-yellow-300">
              Anotações privadas
            </h2>
            <p className="mt-1 text-xs text-purple-300">
              Visíveis somente para a terapeuta.
            </p>
          </div>

          <textarea
            value={privateNotes}
            onChange={(e) =>
              setPrivateNotes(e.target.value)
            }
            rows={10}
            placeholder="Registre observações privadas da sessão..."
            className={`${campo} mt-4`}
          />
        </section>

        <section className="rounded-2xl border border-purple-500/30 bg-[#28002f] p-5">
          <div>
            <h2 className="text-lg font-semibold text-yellow-300">
              Evolução da sessão
            </h2>
            <p className="mt-1 text-xs text-purple-300">
              Síntese profissional do encontro.
            </p>
          </div>

          <textarea
            value={evolution}
            onChange={(e) =>
              setEvolution(e.target.value)
            }
            rows={10}
            placeholder="Registre a evolução percebida..."
            className={`${campo} mt-4`}
          />
        </section>
      </div>

      <section className="rounded-2xl border border-purple-500/30 bg-[#28002f] p-5">
        <h2 className="text-lg font-semibold text-yellow-300">
          Atividade para a cliente
        </h2>

        <p className="mt-1 text-xs text-purple-300">
          Depois conectaremos este campo ao portal da cliente.
        </p>

        <textarea
          value={activity}
          onChange={(e) =>
            setActivity(e.target.value)
          }
          rows={5}
          placeholder="Atividade, orientação ou tarefa para o próximo encontro..."
          className={`${campo} mt-4`}
        />
      </section>

      <div className="flex flex-col gap-3 border-t border-purple-500/20 pt-5 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => salvar(false)}
          disabled={salvando}
          className="rounded-xl border border-purple-500/40 px-5 py-3 text-sm font-semibold text-purple-100 transition hover:bg-white/5 disabled:opacity-50"
        >
          {salvando
            ? "Salvando..."
            : "Salvar sessão"}
        </button>

        <button
          type="button"
          onClick={() => salvar(true)}
          disabled={salvando}
          className="rounded-xl bg-yellow-300 px-5 py-3 text-sm font-semibold text-purple-950 transition hover:bg-yellow-200 disabled:opacity-60"
        >
          Finalizar sessão
        </button>
      </div>
    </div>
  );
}
