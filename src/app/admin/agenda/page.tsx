"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

import AgendaResumo from "./components/AgendaResumo";
import AgendaCalendario from "./components/AgendaCalendario";
import AgendaListas from "./components/AgendaListas";
import NovoAtendimentoModal from "./components/NovoAtendimentoModal";
import EditarAtendimentoModal from "./components/EditarAtendimentoModal";

import type {
  AgendaAtendimento,
  EdicaoAgendaModo,
} from "./components/agenda-types";

export default function AgendaPage() {
  const router = useRouter();

  const [
    novoAtendimentoAberto,
    setNovoAtendimentoAberto,
  ] = useState(false);

  const [atendimentos, setAtendimentos] =
    useState<AgendaAtendimento[]>([]);

  const [carregando, setCarregando] =
    useState(true);

  const [erro, setErro] =
    useState<string | null>(null);

  const [itemEditando, setItemEditando] =
    useState<AgendaAtendimento | null>(null);

  const [modoEdicao, setModoEdicao] =
    useState<EdicaoAgendaModo>("editar");

  const carregarAtendimentos =
    useCallback(async () => {
      setCarregando(true);
      setErro(null);

      try {
        const {
          data: { session },
        } =
          await supabase.auth.getSession();

        if (!session?.access_token) {
          throw new Error(
            "Sessão administrativa expirada. Entre novamente."
          );
        }

        const response = await fetch(
          "/api/admin/agenda",
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
              "Erro ao carregar a agenda."
          );
        }

        setAtendimentos(
          Array.isArray(data?.atendimentos)
            ? data.atendimentos
            : []
        );
      } catch (error) {
        setErro(
          error instanceof Error
            ? error.message
            : "Erro ao carregar a agenda."
        );
      } finally {
        setCarregando(false);
      }
    }, []);

  useEffect(() => {
    carregarAtendimentos();
  }, [carregarAtendimentos]);

  async function authFetch(
    url: string,
    init?: RequestInit
  ) {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      throw new Error(
        "Sessão administrativa expirada. Entre novamente."
      );
    }

    const headers = new Headers(init?.headers);
    headers.set(
      "Authorization",
      `Bearer ${session.access_token}`
    );

    return fetch(url, {
      ...init,
      headers,
    });
  }

  function abrirEditar(
    item: AgendaAtendimento
  ) {
    setModoEdicao("editar");
    setItemEditando(item);
  }

  function abrirRemarcar(
    item: AgendaAtendimento
  ) {
    setModoEdicao("remarcar");
    setItemEditando(item);
  }

  async function cancelar(
    item: AgendaAtendimento
  ) {
    const confirmou = window.confirm(
      `Cancelar o atendimento de ${item.client_name}? O registro continuará no histórico.`
    );

    if (!confirmou) return;

    try {
      const response = await authFetch(
        "/api/admin/agenda",
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            id: item.id,
            status: "cancelado",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Não foi possível cancelar."
        );
      }

      await carregarAtendimentos();
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível cancelar."
      );
    }
  }

  async function excluir(
    item: AgendaAtendimento
  ) {
    const confirmou = window.confirm(
      `Excluir definitivamente o atendimento de ${item.client_name}? Use esta opção somente quando o cadastro foi feito por engano.`
    );

    if (!confirmou) return;

    try {
      const response = await authFetch(
        `/api/admin/agenda?id=${encodeURIComponent(
          item.id
        )}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Não foi possível excluir."
        );
      }

      await carregarAtendimentos();
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível excluir."
      );
    }
  }

  function atender(
    item: AgendaAtendimento
  ) {
    router.push(
      `/admin/agenda/${item.id}/atendimento`
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-yellow-300">
              Gestão de atendimentos
            </p>

            <h1 className="mt-1 text-3xl font-semibold text-purple-200">
              Agenda
            </h1>

            <p className="mt-1 text-sm text-purple-300/70">
              Organize seus atendimentos e próximas sessões.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setNovoAtendimentoAberto(true)
            }
            className="rounded-xl bg-purple-800 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-black/20 transition hover:bg-purple-700"
          >
            + Novo atendimento
          </button>
        </div>

        {erro && (
          <div className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">
            {erro}
          </div>
        )}

        <AgendaResumo
          atendimentos={atendimentos}
          carregando={carregando}
        />

        <AgendaCalendario
          atendimentos={atendimentos}
          carregando={carregando}
          onNovoAtendimento={() =>
            setNovoAtendimentoAberto(true)
          }
          onEditar={abrirEditar}
        />

        <AgendaListas
          atendimentos={atendimentos}
          carregando={carregando}
          onEditar={abrirEditar}
          onRemarcar={abrirRemarcar}
          onCancelar={cancelar}
          onExcluir={excluir}
          onAtender={atender}
        />
      </div>

      <NovoAtendimentoModal
        aberto={novoAtendimentoAberto}
        onFechar={() =>
          setNovoAtendimentoAberto(false)
        }
        onSalvo={carregarAtendimentos}
      />

      <EditarAtendimentoModal
        aberto={Boolean(itemEditando)}
        item={itemEditando}
        modo={modoEdicao}
        onFechar={() =>
          setItemEditando(null)
        }
        onSalvo={carregarAtendimentos}
      />
    </>
  );
}
