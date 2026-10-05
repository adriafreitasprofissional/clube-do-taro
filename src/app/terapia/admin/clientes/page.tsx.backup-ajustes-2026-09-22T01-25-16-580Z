"use client";

import {
  useEffect,
  useState,
} from "react";
import Link from "next/link";
import { adminFetch } from "../components/adminFetch";

type Formulario = {
  nome: string;
  nomeReferencia: string;
  email: string;
  whatsapp: string;
};

const vazio: Formulario = {
  nome: "",
  nomeReferencia: "",
  email: "",
  whatsapp: "",
};

export default function ClientesPage() {
  const [
    clientes,
    setClientes,
  ] = useState<
    any[] | null
  >(null);

  const [
    formularioAberto,
    setFormularioAberto,
  ] = useState(false);

  const [
    formulario,
    setFormulario,
  ] =
    useState<Formulario>(
      vazio
    );

  const [
    salvando,
    setSalvando,
  ] = useState(false);

  const [
    mensagem,
    setMensagem,
  ] = useState<
    string | null
  >(null);

  async function carregar() {
    const response =
      await adminFetch(
        "/api/terapia/admin/clientes"
      );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data?.error ||
          "Erro ao carregar pacientes."
      );
    }

    setClientes(
      data.clientes || []
    );
  }

  useEffect(() => {
    carregar().catch(
      (error) =>
        setMensagem(
          error instanceof
            Error
            ? error.message
            : "Erro ao carregar pacientes."
        )
    );
  }, []);

  function alterar(
    campo:
      keyof Formulario,
    valor: string
  ) {
    setFormulario({
      ...formulario,
      [campo]: valor,
    });
  }

  async function cadastrar() {
    setSalvando(true);
    setMensagem(null);

    try {
      const response =
        await adminFetch(
          "/api/terapia/admin/clientes",
          {
            method:
              "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body:
              JSON.stringify(
                formulario
              ),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Não foi possível cadastrar."
        );
      }

      setFormulario(
        vazio
      );

      setFormularioAberto(
        false
      );

      setMensagem(
        data.novo_usuario
          ? data.email_enviado
            ? "Paciente cadastrada. O e-mail de acesso foi enviado."
            : "Paciente cadastrada. O cadastro foi criado, mas o e-mail de acesso precisa ser reenviado."
          : "Paciente já existia no sistema e foi vinculada ao seu Terapia em Dia."
      );

      await carregar();
    } catch (error) {
      setMensagem(
        error instanceof
          Error
          ? error.message
          : "Não foi possível cadastrar."
      );
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8AA27A]">
        Terapia em Dia
      </p>

      <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-[#5E7357]">
            Pacientes
          </h1>

          <p className="mt-2 text-sm text-[#6C8465]">
            Cadastre e acompanhe
            seus pacientes.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setFormularioAberto(
              !formularioAberto
            )
          }
          className="rounded-xl bg-[#5E7357] px-5 py-3 text-sm font-bold text-white shadow"
        >
          + Cadastrar novo
          paciente
        </button>
      </div>

      {mensagem && (
        <div className="mt-5 rounded-2xl border border-[#C7D4C0] bg-[#E8F0E4] p-4 text-sm font-semibold text-[#4F6548]">
          {mensagem}
        </div>
      )}

      {formularioAberto && (
        <section className="mt-6 rounded-3xl border border-[#DCCFB8] bg-[#F7F1E4] p-6 shadow-sm">
          <h2 className="text-xl font-extrabold text-[#5E7357]">
            Novo paciente
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <input
              value={
                formulario.nome
              }
              onChange={(e) =>
                alterar(
                  "nome",
                  e.target.value
                )
              }
              placeholder="Nome completo"
              className="rounded-xl border border-[#C8B8A8] bg-white px-4 py-3"
            />

            <input
              value={
                formulario.nomeReferencia
              }
              onChange={(e) =>
                alterar(
                  "nomeReferencia",
                  e.target.value
                )
              }
              placeholder="Como prefere ser chamada"
              className="rounded-xl border border-[#C8B8A8] bg-white px-4 py-3"
            />

            <input
              type="email"
              value={
                formulario.email
              }
              onChange={(e) =>
                alterar(
                  "email",
                  e.target.value
                )
              }
              placeholder="E-mail"
              className="rounded-xl border border-[#C8B8A8] bg-white px-4 py-3"
            />

            <input
              value={
                formulario.whatsapp
              }
              onChange={(e) =>
                alterar(
                  "whatsapp",
                  e.target.value
                )
              }
              placeholder="WhatsApp"
              className="rounded-xl border border-[#C8B8A8] bg-white px-4 py-3"
            />
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={cadastrar}
              disabled={
                salvando ||
                !formulario.nome ||
                !formulario.email
              }
              className="rounded-xl bg-[#5E7357] px-5 py-3 text-sm font-bold text-white disabled:opacity-50"
            >
              {salvando
                ? "Salvando..."
                : "Salvar paciente"}
            </button>

            <button
              type="button"
              onClick={() =>
                setFormularioAberto(
                  false
                )
              }
              className="rounded-xl border border-[#C8B8A8] px-5 py-3 text-sm font-bold text-[#5E7357]"
            >
              Cancelar
            </button>
          </div>
        </section>
      )}

      <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {clientes?.map(
          (cliente) => (
            <div
              key={
                cliente.id
              }
              className="rounded-3xl border border-[#DCCFB8] bg-[#F7F1E4] p-5"
            >
              <p className="text-lg font-extrabold text-[#5E7357]">
                {
                  cliente.nome
                }
              </p>

              <p className="mt-1 text-xs text-[#7A8D73]">
                {
                  cliente.nome_completo
                }
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <Link
                  href={`/terapia/admin/anamneses/${cliente.id}`}
                  className="inline-flex rounded-xl border border-[#9FB093] px-3 py-2 text-xs font-bold text-[#5E7357]"
                >
                  Ver anamnese
                </Link>

                <Link
                  href={`/terapia/acesso/preview-${cliente.id}`}
                  className="inline-flex rounded-xl bg-[#5E7357] px-3 py-2 text-xs font-bold text-white shadow transition hover:bg-[#4F5E4A]"
                >
                  Ver como
                  paciente
                </Link>
              </div>
            </div>
          )
        )}

        {!clientes && (
          <p className="text-sm text-[#6C8465]">
            Carregando...
          </p>
        )}

        {clientes &&
          clientes.length ===
            0 && (
            <p className="text-sm text-[#6C8465]">
              Nenhum paciente
              cadastrado ainda.
            </p>
          )}
      </div>
    </div>
  );
}
