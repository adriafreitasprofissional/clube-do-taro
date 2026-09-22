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

type PessoaBanco = {
  id: string;
  nome: string;
  nome_referencia: string;
  email: string;
  whatsapp: string;
  slug: string;
  status: string;
  vinculado_ao_profissional: boolean;
  vinculado_em_terapia: boolean;
};

const vazio: Formulario = {
  nome: "",
  nomeReferencia: "",
  email: "",
  whatsapp: "",
};

export default function ClientesPage() {
  const [clientes, setClientes] =
    useState<any[] | null>(null);

  const [formularioAberto, setFormularioAberto] =
    useState(false);

  const [mostrarNovoCadastro, setMostrarNovoCadastro] =
    useState(false);

  const [formulario, setFormulario] =
    useState<Formulario>(vazio);

  const [busca, setBusca] =
    useState("");

  const [resultados, setResultados] =
    useState<PessoaBanco[]>([]);

  const [buscando, setBuscando] =
    useState(false);

  const [salvando, setSalvando] =
    useState(false);

  const [vinculandoId, setVinculandoId] =
    useState<string | null>(null);

  const [mensagem, setMensagem] =
    useState<string | null>(null);

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
          error instanceof Error
            ? error.message
            : "Erro ao carregar pacientes."
        )
    );
  }, []);

  useEffect(() => {
    if (!formularioAberto) {
      return;
    }

    const termo =
      busca.trim();

    if (termo.length < 2) {
      setResultados([]);
      setBuscando(false);
      return;
    }

    const timer =
      window.setTimeout(
        async () => {
          try {
            setBuscando(true);

            const response =
              await adminFetch(
                `/api/terapia/admin/clientes/buscar?q=${encodeURIComponent(
                  termo
                )}`
              );

            const data =
              await response.json();

            if (!response.ok) {
              throw new Error(
                data?.error ||
                  "Não foi possível buscar."
              );
            }

            setResultados(
              Array.isArray(
                data?.pessoas
              )
                ? data.pessoas
                : []
            );
          } catch (error) {
            setMensagem(
              error instanceof Error
                ? error.message
                : "Não foi possível buscar."
            );
          } finally {
            setBuscando(false);
          }
        },
        350
      );

    return () =>
      window.clearTimeout(timer);
  }, [
    busca,
    formularioAberto,
  ]);

  function alterar(
    campo: keyof Formulario,
    valor: string
  ) {
    setFormulario({
      ...formulario,
      [campo]: valor,
    });
  }

  async function vincular(
    pessoa: PessoaBanco
  ) {
    setVinculandoId(
      pessoa.id
    );
    setMensagem(null);

    try {
      const response =
        await adminFetch(
          "/api/terapia/admin/clientes",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              clientId:
                pessoa.id,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Não foi possível adicionar a paciente."
        );
      }

      setMensagem(
        `${data.cliente?.nome || "Paciente"} foi adicionada ao Terapia em Dia sem duplicar o cadastro.`
      );

      setBusca("");
      setResultados([]);
      setFormularioAberto(false);

      await carregar();
    } catch (error) {
      setMensagem(
        error instanceof Error
          ? error.message
          : "Não foi possível adicionar a paciente."
      );
    } finally {
      setVinculandoId(null);
    }
  }

  async function cadastrar() {
    setSalvando(true);
    setMensagem(null);

    try {
      const response =
        await adminFetch(
          "/api/terapia/admin/clientes",
          {
            method: "POST",
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

      setFormulario(vazio);
      setMostrarNovoCadastro(false);
      setFormularioAberto(false);

      setMensagem(
        data.novo_usuario
          ? data.email_enviado
            ? "Paciente cadastrada. O e-mail de acesso foi enviado."
            : "Paciente cadastrada. O cadastro foi criado, mas o e-mail de acesso precisa ser reenviado."
          : "A pessoa já existia no banco e foi vinculada ao Terapia em Dia."
      );

      await carregar();
    } catch (error) {
      setMensagem(
        error instanceof Error
          ? error.message
          : "Não foi possível cadastrar."
      );
    } finally {
      setSalvando(false);
    }
  }

  function abrirAdicionar() {
    setFormularioAberto(
      (atual) => !atual
    );
    setMostrarNovoCadastro(false);
    setBusca("");
    setResultados([]);
    setMensagem(null);
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
            Cadastre e acompanhe seus pacientes.
          </p>
        </div>

        <button
          type="button"
          onClick={abrirAdicionar}
          className="rounded-xl bg-[#5E7357] px-5 py-3 text-sm font-bold text-white shadow"
        >
          + Adicionar paciente
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
            Adicionar paciente
          </h2>

          <p className="mt-2 text-sm leading-6 text-[#6C8465]">
            Primeiro procure a pessoa no seu banco de dados. Se ela já existir, o Terapia em Dia apenas cria o vínculo e mantém o cadastro original.
          </p>

          <div className="mt-5">
            <label className="text-xs font-bold uppercase tracking-wide text-[#6C8465]">
              Buscar pessoa já cadastrada
            </label>

            <input
              value={busca}
              onChange={(e) =>
                setBusca(
                  e.target.value
                )
              }
              placeholder="Nome, nome de referência, e-mail ou WhatsApp"
              className="mt-2 w-full rounded-xl border border-[#C8B8A8] bg-white px-4 py-3 outline-none focus:border-[#8AA27A]"
            />

            <p className="mt-2 text-xs text-[#7A8D73]">
              Digite pelo menos 2 caracteres.
            </p>
          </div>

          {buscando && (
            <div className="mt-4 rounded-2xl bg-white p-4 text-sm text-[#6C8465]">
              Buscando no banco de dados...
            </div>
          )}

          {!buscando &&
            busca.trim().length >= 2 &&
            resultados.length === 0 && (
              <div className="mt-4 rounded-2xl border border-[#DCCFB8] bg-white p-4 text-sm text-[#6C8465]">
                Nenhuma pessoa encontrada com essa busca.
              </div>
            )}

          {resultados.length > 0 && (
            <div className="mt-4 grid gap-3">
              {resultados.map(
                (pessoa) => (
                  <div
                    key={pessoa.id}
                    className="rounded-2xl border border-[#DCCFB8] bg-white p-4"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-extrabold text-[#5E7357]">
                          {pessoa.nome_referencia ||
                            pessoa.nome}
                        </p>

                        <p className="mt-1 text-sm text-[#6C8465]">
                          {pessoa.nome}
                        </p>

                        <div className="mt-2 space-y-1 text-xs text-[#7A8D73]">
                          {pessoa.email && (
                            <p>
                              {pessoa.email}
                            </p>
                          )}

                          {pessoa.whatsapp && (
                            <p>
                              WhatsApp:{" "}
                              {pessoa.whatsapp}
                            </p>
                          )}
                        </div>
                      </div>

                      {pessoa.vinculado_ao_profissional ? (
                        <span className="rounded-full bg-[#E8F0E4] px-3 py-2 text-xs font-bold text-[#4F6548]">
                          Já é paciente
                        </span>
                      ) : pessoa.vinculado_em_terapia ? (
                        <span className="rounded-full bg-amber-50 px-3 py-2 text-xs font-bold text-amber-700">
                          Já vinculada no Terapia em Dia
                        </span>
                      ) : (
                        <button
                          type="button"
                          disabled={
                            vinculandoId ===
                            pessoa.id
                          }
                          onClick={() =>
                            vincular(
                              pessoa
                            )
                          }
                          className="rounded-xl bg-[#5E7357] px-4 py-3 text-xs font-bold text-white disabled:opacity-50"
                        >
                          {vinculandoId ===
                          pessoa.id
                            ? "Adicionando..."
                            : "Adicionar como paciente"}
                        </button>
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          )}

          <div className="mt-6 border-t border-[#DCCFB8] pt-5">
            <button
              type="button"
              onClick={() =>
                setMostrarNovoCadastro(
                  (atual) =>
                    !atual
                )
              }
              className="text-sm font-bold text-[#5E7357]"
            >
              {mostrarNovoCadastro
                ? "▾ Fechar novo cadastro"
                : "› Não encontrou? Cadastrar nova pessoa"}
            </button>
          </div>

          {mostrarNovoCadastro && (
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <input
                value={formulario.nome}
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
                value={formulario.email}
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
                value={formulario.whatsapp}
                onChange={(e) =>
                  alterar(
                    "whatsapp",
                    e.target.value
                  )
                }
                placeholder="WhatsApp"
                className="rounded-xl border border-[#C8B8A8] bg-white px-4 py-3"
              />

              <div className="md:col-span-2 flex flex-wrap gap-3">
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
                    : "Criar e adicionar paciente"}
                </button>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() =>
              setFormularioAberto(false)
            }
            className="mt-5 rounded-xl border border-[#C8B8A8] px-5 py-3 text-sm font-bold text-[#5E7357]"
          >
            Cancelar
          </button>
        </section>
      )}

      <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {clientes?.map(
          (cliente) => (
            <div
              key={cliente.id}
              className="rounded-3xl border border-[#DCCFB8] bg-[#F7F1E4] p-5"
            >
              <p className="text-lg font-extrabold text-[#5E7357]">
                {cliente.nome}
              </p>

              <p className="mt-1 text-xs text-[#7A8D73]">
                {cliente.nome_completo}
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
                  Ver como paciente
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
          clientes.length === 0 && (
            <p className="text-sm text-[#6C8465]">
              Nenhum paciente cadastrado ainda.
            </p>
          )}
      </div>
    </div>
  );
}
