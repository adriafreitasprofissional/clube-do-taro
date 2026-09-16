"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";
import Link from "next/link";
import { adminFetch } from "../components/adminFetch";

const FORM_INICIAL = {
  client_id: "",
  service_type:
    "Terapia TRG",
  date: "",
  time: "",
  duration_minutes:
    "60",
  meet_url: "",
  charge_type:
    "incluido_pacote",
  amount: "",
};

export default function AgendaTerapiaPage() {
  const [
    atendimentos,
    setAtendimentos,
  ] = useState<any[]>(
    []
  );

  const [
    clientes,
    setClientes,
  ] = useState<any[]>(
    []
  );

  const [
    formAberto,
    setFormAberto,
  ] = useState(false);

  const [
    form,
    setForm,
  ] = useState(
    FORM_INICIAL
  );

  const [
    mensagem,
    setMensagem,
  ] = useState<
    string | null
  >(null);

  const [
    salvando,
    setSalvando,
  ] = useState(false);

  async function carregar() {
    const [
      agendaResponse,
      clientesResponse,
    ] = await Promise.all([
      adminFetch(
        "/api/terapia/admin/agenda"
      ),
      adminFetch(
        "/api/terapia/admin/clientes"
      ),
    ]);

    const agenda =
      await agendaResponse.json();

    const clientesData =
      await clientesResponse.json();

    if (
      !agendaResponse.ok
    ) {
      throw new Error(
        agenda?.error ||
          "Erro ao carregar agenda."
      );
    }

    if (
      !clientesResponse.ok
    ) {
      throw new Error(
        clientesData?.error ||
          "Erro ao carregar pacientes."
      );
    }

    setAtendimentos(
      agenda.atendimentos ||
        []
    );

    setClientes(
      clientesData.clientes ||
        []
    );
  }

  useEffect(() => {
    carregar().catch(
      (error) =>
        setMensagem(
          error instanceof
            Error
            ? error.message
            : "Erro ao carregar agenda."
        )
    );
  }, []);

  const proximos =
    useMemo(
      () =>
        atendimentos.filter(
          (item) =>
            item.status !==
              "cancelado" &&
            new Date(
              item.scheduled_at
            ).getTime() >=
              Date.now()
        ),
      [atendimentos]
    );

  function alterar(
    campo: string,
    valor: string
  ) {
    setForm({
      ...form,
      [campo]: valor,
    });
  }

  async function salvar() {
    setSalvando(true);
    setMensagem(null);

    try {
      const response =
        await adminFetch(
          "/api/terapia/admin/agenda",
          {
            method:
              "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body:
              JSON.stringify(
                form
              ),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Não foi possível agendar."
        );
      }

      setForm(
        FORM_INICIAL
      );

      setFormAberto(
        false
      );

      setMensagem(
        "Atendimento agendado."
      );

      await carregar();
    } catch (error) {
      setMensagem(
        error instanceof
          Error
          ? error.message
          : "Não foi possível agendar."
      );
    } finally {
      setSalvando(false);
    }
  }

  async function cancelar(
    id: string
  ) {
    if (
      !window.confirm(
        "Cancelar este atendimento?"
      )
    ) {
      return;
    }

    const response =
      await adminFetch(
        "/api/terapia/admin/agenda",
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body:
            JSON.stringify({
              id,
              status:
                "cancelado",
            }),
        }
      );

    const data =
      await response.json();

    if (!response.ok) {
      setMensagem(
        data?.error ||
          "Não foi possível cancelar."
      );
      return;
    }

    setMensagem(
      "Atendimento cancelado."
    );

    await carregar();
  }

  return (
    <div className="mx-auto max-w-6xl">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8AA27A]">
        Terapia em Dia
      </p>

      <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-[#5E7357]">
            Agenda
          </h1>

          <p className="mt-2 text-sm text-[#6C8465]">
            Seus próximos
            atendimentos em um
            só lugar.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/terapia/admin/disponibilidade"
            className="rounded-xl border border-[#9FB093] px-4 py-3 text-sm font-bold text-[#5E7357]"
          >
            Liberar agenda
          </Link>

          <button
            type="button"
            onClick={() =>
              setFormAberto(
                !formAberto
              )
            }
            className="rounded-xl bg-[#5E7357] px-4 py-3 text-sm font-bold text-white shadow"
          >
            + Novo atendimento
          </button>
        </div>
      </div>

      {mensagem && (
        <div className="mt-5 rounded-2xl border border-[#C7D4C0] bg-[#E8F0E4] p-4 text-sm font-semibold text-[#4F6548]">
          {mensagem}
        </div>
      )}

      {formAberto && (
        <section className="mt-6 rounded-3xl border border-[#DCCFB8] bg-[#F7F1E4] p-6">
          <h2 className="text-xl font-extrabold text-[#5E7357]">
            Novo atendimento
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <select
              value={
                form.client_id
              }
              onChange={(e) =>
                alterar(
                  "client_id",
                  e.target.value
                )
              }
              className="rounded-xl border border-[#C8B8A8] bg-white px-4 py-3"
            >
              <option value="">
                Selecione o
                paciente
              </option>

              {clientes.map(
                (cliente) => (
                  <option
                    key={
                      cliente.id
                    }
                    value={
                      cliente.id
                    }
                  >
                    {
                      cliente.nome
                    }
                  </option>
                )
              )}
            </select>

            <select
              value={
                form.service_type
              }
              onChange={(e) =>
                alterar(
                  "service_type",
                  e.target.value
                )
              }
              className="rounded-xl border border-[#C8B8A8] bg-white px-4 py-3"
            >
              <option>
                Terapia TRG
              </option>
              <option>
                Terapia Holística
              </option>
              <option>
                Psicologia
              </option>
              <option>
                Psiquiatria
              </option>
              <option>
                Massoterapia
              </option>
              <option>
                Fisioterapia
              </option>
              <option>
                Mentoria
              </option>
            </select>

            <input
              type="date"
              value={
                form.date
              }
              onChange={(e) =>
                alterar(
                  "date",
                  e.target.value
                )
              }
              className="rounded-xl border border-[#C8B8A8] bg-white px-4 py-3"
            />

            <input
              type="time"
              value={
                form.time
              }
              onChange={(e) =>
                alterar(
                  "time",
                  e.target.value
                )
              }
              className="rounded-xl border border-[#C8B8A8] bg-white px-4 py-3"
            />

            <select
              value={
                form.duration_minutes
              }
              onChange={(e) =>
                alterar(
                  "duration_minutes",
                  e.target.value
                )
              }
              className="rounded-xl border border-[#C8B8A8] bg-white px-4 py-3"
            >
              <option value="60">
                60 minutos
              </option>
              <option value="90">
                90 minutos
              </option>
              <option value="120">
                120 minutos
              </option>
            </select>

            <input
              value={
                form.meet_url
              }
              onChange={(e) =>
                alterar(
                  "meet_url",
                  e.target.value
                )
              }
              placeholder="Link do Google Meet"
              className="rounded-xl border border-[#C8B8A8] bg-white px-4 py-3"
            />

            <select
              value={
                form.charge_type
              }
              onChange={(e) =>
                alterar(
                  "charge_type",
                  e.target.value
                )
              }
              className="rounded-xl border border-[#C8B8A8] bg-white px-4 py-3"
            >
              <option value="incluido_pacote">
                Incluído no pacote
              </option>
              <option value="avulso">
                Avulso
              </option>
            </select>

            <input
              type="number"
              min="0"
              step="0.01"
              value={
                form.amount
              }
              onChange={(e) =>
                alterar(
                  "amount",
                  e.target.value
                )
              }
              placeholder="Valor, se houver"
              className="rounded-xl border border-[#C8B8A8] bg-white px-4 py-3"
            />
          </div>

          <div className="mt-5 flex gap-3">
            <button
              type="button"
              onClick={salvar}
              disabled={
                salvando ||
                !form.client_id ||
                !form.date ||
                !form.time
              }
              className="rounded-xl bg-[#5E7357] px-5 py-3 text-sm font-bold text-white disabled:opacity-50"
            >
              {salvando
                ? "Salvando..."
                : "Agendar"}
            </button>

            <button
              type="button"
              onClick={() =>
                setFormAberto(
                  false
                )
              }
              className="rounded-xl border border-[#C8B8A8] px-5 py-3 text-sm font-bold text-[#5E7357]"
            >
              Fechar
            </button>
          </div>
        </section>
      )}

      <section className="mt-7 rounded-3xl border border-[#DCCFB8] bg-[#F7F1E4] p-6">
        <h2 className="text-xl font-extrabold text-[#5E7357]">
          Próximos
          atendimentos
        </h2>

        <div className="mt-5 grid gap-3">
          {proximos.map(
            (item) => (
              <div
                key={item.id}
                className="flex flex-col gap-4 rounded-2xl border border-[#E1D6C5] bg-white/70 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-extrabold text-[#5E7357]">
                    {
                      item.client_name
                    }
                  </p>

                  <p className="mt-1 text-sm text-[#6C8465]">
                    {
                      item.service_type
                    }{" "}
                    ·{" "}
                    {new Date(
                      item.scheduled_at
                    ).toLocaleString(
                      "pt-BR"
                    )}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {item.meet_url && (
                    <a
                      href={
                        item.meet_url
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-xl bg-[#5E7357] px-3 py-2 text-xs font-bold text-white"
                    >
                      Meet
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      cancelar(
                        item.id
                      )
                    }
                    className="rounded-xl border border-[#C8B8A8] px-3 py-2 text-xs font-bold text-[#6C8465]"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )
          )}

          {proximos.length ===
            0 && (
            <p className="text-sm text-[#6C8465]">
              Nenhum atendimento
              futuro.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
