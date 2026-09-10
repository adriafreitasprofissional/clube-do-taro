"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Paciente = {
  id: string;
  nome: string;
  nome_completo: string;
  email: string;
  slug: string;
  anamnese?: {
    id: string;
    status: string;
    submitted_at: string;
  } | null;
};

type Atendimento = {
  id: string;
  client_id: string;
  client_name: string;
  service_type: string;
  scheduled_at: string;
  status: string;
};

export default function PacientesPage() {
  const [pacientes, setPacientes] =
    useState<Paciente[]>([]);

  const [atendimentos, setAtendimentos] =
    useState<Atendimento[]>([]);

  const [carregando, setCarregando] =
    useState(true);

  const [erro, setErro] =
    useState<string | null>(null);

  useEffect(() => {
    async function carregar() {
      setCarregando(true);
      setErro(null);

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.access_token) {
          throw new Error(
            "Sessão administrativa expirada."
          );
        }

        const response = await fetch(
          "/api/terapia/admin/dashboard",
          {
            cache: "no-store",
            headers: {
              Authorization:
                `Bearer ${session.access_token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.error ||
              "Não foi possível carregar as pacientes."
          );
        }

        setPacientes(data.clientes || []);
        setAtendimentos(
          data.proximos_atendimentos || []
        );
      } catch (error) {
        setErro(
          error instanceof Error
            ? error.message
            : "Erro ao carregar pacientes."
        );
      } finally {
        setCarregando(false);
      }
    }

    carregar();
  }, []);

  function proximoAtendimento(
    pacienteId: string
  ) {
    return atendimentos.find(
      (item) =>
        item.client_id === pacienteId
    );
  }

  if (carregando) {
    return (
      <div className="rounded-2xl border border-purple-500/30 bg-[#28002f] p-6 text-purple-300">
        Carregando pacientes...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8 flex flex-wrap gap-4">
        <Link
          href="/admin/terapia"
          className="text-sm font-bold text-[#cbd69d]"
        >
          ← Terapia em Dia
        </Link>

        <Link
          href="/admin"
          className="text-sm font-bold text-purple-300"
        >
          Central de Negócios
        </Link>
      </div>

      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#b7c28b]">
        Gestão terapêutica
      </p>

      <h1 className="mt-2 text-3xl font-semibold text-white">
        Pacientes
      </h1>

      <p className="mt-2 text-sm text-purple-300">
        Pacientes com acesso ativo ao
        Terapia em Dia.
      </p>

      {erro && (
        <div className="mt-6 rounded-2xl border border-red-400/30 bg-red-400/10 p-5 text-red-200">
          {erro}
        </div>
      )}

      {!erro && pacientes.length === 0 && (
        <div className="mt-7 rounded-2xl border border-purple-500/30 bg-[#28002f] p-6 text-purple-300">
          Nenhuma paciente ativa encontrada.
        </div>
      )}

      <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {pacientes.map((paciente) => {
          const proximo =
            proximoAtendimento(
              paciente.id
            );

          const anamneseRecebida =
            paciente.anamnese?.status ===
              "enviada" ||
            paciente.anamnese?.status ===
              "revisada";

          return (
            <article
              key={paciente.id}
              className="rounded-2xl border border-[#b7c28b]/20 bg-[#28002f] p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold text-white">
                    {paciente.nome}
                  </p>

                  {paciente.nome_completo &&
                    paciente.nome_completo !==
                      paciente.nome && (
                      <p className="mt-1 text-xs text-purple-300">
                        {
                          paciente.nome_completo
                        }
                      </p>
                    )}
                </div>

                <span className="rounded-full bg-[#aebe79]/15 px-3 py-1 text-xs font-bold text-[#cbd69d]">
                  ATIVA
                </span>
              </div>

              {paciente.email && (
                <p className="mt-4 text-sm text-purple-200">
                  {paciente.email}
                </p>
              )}

              <div className="mt-5 rounded-xl border border-purple-500/20 bg-[#1d0023] p-4">
                <p className="text-xs uppercase tracking-wide text-purple-300">
                  Anamnese
                </p>

                <p className="mt-2 text-sm font-semibold text-white">
                  {anamneseRecebida
                    ? "Recebida"
                    : "Pendente"}
                </p>
              </div>

              <div className="mt-3 rounded-xl border border-purple-500/20 bg-[#1d0023] p-4">
                <p className="text-xs uppercase tracking-wide text-purple-300">
                  Próximo atendimento
                </p>

                {proximo ? (
                  <>
                    <p className="mt-2 text-sm font-semibold text-white">
                      {
                        proximo.service_type
                      }
                    </p>

                    <p className="mt-1 text-xs text-purple-300">
                      {new Date(
                        proximo.scheduled_at
                      ).toLocaleString(
                        "pt-BR"
                      )}
                    </p>
                  </>
                ) : (
                  <p className="mt-2 text-sm text-purple-300">
                    Nenhum agendamento
                    futuro.
                  </p>
                )}
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <Link
                  href={`/admin/terapia/anamneses/${paciente.id}`}
                  className="rounded-xl border border-[#aebe79]/35 px-4 py-2 text-xs font-bold text-[#cbd69d]"
                >
                  Ver anamnese
                </Link>

                {proximo && (
                  <Link
                    href={`/admin/agenda/${proximo.id}/atendimento`}
                    className="rounded-xl bg-[#aebe79] px-4 py-2 text-xs font-bold text-[#243018]"
                  >
                    Abrir atendimento
                  </Link>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}