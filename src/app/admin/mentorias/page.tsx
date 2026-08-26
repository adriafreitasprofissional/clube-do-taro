"use client";

import { useEffect, useMemo, useState } from "react";

import { supabase } from "@/lib/supabase";

type Cliente = {
  id: string;
  nome: string;
  nome_referencia?: string | null;
  slug: string;
  plano: string | null;
};

type Registro = {
  id: string;
  client_id: string;
  service_type: string;
  title: string;
  occurred_at: string;
  video_file_id: string | null;
  report_adria: string | null;
  report_estella: string | null;
  pdf_file_id: string | null;
  published: boolean;

  club_clients?: {
    nome: string;
    nome_referencia?: string | null;
    slug: string;
    plano: string | null;
  } | null;
};

type Formulario = {
  id: string;
  client_id: string;
  title: string;
  occurred_at: string;
  video_file_id: string;
  report_adria: string;
  report_estella: string;
  pdf_file_id: string;
  published: boolean;
};

const FORMULARIO_INICIAL: Formulario = {
  id: "",
  client_id: "",
  title: "",
  occurred_at: "",
  video_file_id: "",
  report_adria: "",
  report_estella: "",
  pdf_file_id: "",
  published: false,
};

function paraDataDoFormulario(valor: string) {
  const data = new Date(valor);

  const deslocamento =
    data.getTimezoneOffset() * 60_000;

  return new Date(
    data.getTime() - deslocamento
  )
    .toISOString()
    .slice(0, 16);
}

function nomeCliente(registro: Registro) {
  return (
    registro.club_clients?.nome_referencia ||
    registro.club_clients?.nome ||
    "Assinante"
  );
}

export default function MentoriasAdminPage() {
  const [clientes, setClientes] =
    useState<Cliente[]>([]);

  const [registros, setRegistros] =
    useState<Registro[]>([]);

  const [formulario, setFormulario] =
    useState<Formulario>(FORMULARIO_INICIAL);

  const [carregando, setCarregando] =
    useState(true);

  const [salvando, setSalvando] =
    useState(false);

  const [erro, setErro] = useState("");

  const clientesDisponiveis = useMemo(
    () =>
      clientes
        .filter(
          (cliente) =>
            String(
              cliente.plano || ""
            ).toLowerCase() === "diamante"
        )
        .sort((a, b) =>
          a.nome.localeCompare(b.nome, "pt-BR")
        ),
    [clientes]
  );

  async function carregarDados() {
    setCarregando(true);
    setErro("");

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        throw new Error(
          "Sessão administrativa expirada. Entre novamente."
        );
      }

      const [
        clientesResponse,
        registrosResponse,
      ] = await Promise.all([
        fetch("/api/admin/clientes", {
          cache: "no-store",
        }),

        fetch("/api/admin/mentorias", {
          cache: "no-store",

          headers: {
            Authorization:
              `Bearer ${session.access_token}`,
          },
        }),
      ]);

      const clientesData =
        await clientesResponse.json();

      const registrosData =
        await registrosResponse.json();

      if (!registrosResponse.ok) {
        throw new Error(
          registrosData.error ||
            "Não foi possível carregar as mentorias."
        );
      }

      setClientes(
        Array.isArray(clientesData)
          ? clientesData
          : []
      );

      setRegistros(
        registrosData.registros || []
      );
    } catch (error: unknown) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro ao carregar mentorias."
      );
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    const carregamento = window.setTimeout(() => {
      void carregarDados();
    }, 0);

    return () =>
      window.clearTimeout(carregamento);
  }, []);

  function atualizarCampo<
    K extends keyof Formulario
  >(
    campo: K,
    valor: Formulario[K]
  ) {
    setFormulario((anterior) => ({
      ...anterior,
      [campo]: valor,
    }));
  }

  function editar(registro: Registro) {
    setFormulario({
      id: registro.id,
      client_id: registro.client_id,
      title: registro.title,

      occurred_at: paraDataDoFormulario(
        registro.occurred_at
      ),

      video_file_id:
        registro.video_file_id || "",

      report_adria:
        registro.report_adria || "",

      report_estella:
        registro.report_estella || "",

      pdf_file_id:
        registro.pdf_file_id || "",

      published: registro.published,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function limparFormulario() {
    setFormulario(FORMULARIO_INICIAL);
  }

  async function salvar() {
    if (
      !formulario.client_id ||
      !formulario.title ||
      !formulario.occurred_at
    ) {
      alert(
        "Escolha a assinante e preencha o título e a data."
      );

      return;
    }

    if (
      !formulario.video_file_id &&
      !formulario.pdf_file_id
    ) {
      alert(
        "Cole o link do vídeo ou do PDF."
      );

      return;
    }

    setSalvando(true);

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
        "/api/admin/mentorias",
        {
          method: formulario.id
            ? "PATCH"
            : "POST",

          headers: {
            "Content-Type": "application/json",

            Authorization:
              `Bearer ${session.access_token}`,
          },

          body: JSON.stringify({
            ...formulario,

            service_type: "mentoria",

            occurred_at: new Date(
              formulario.occurred_at
            ).toISOString(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Não foi possível salvar a mentoria."
        );
      }

      alert(
        formulario.id
          ? "Mentoria atualizada com sucesso."
          : "Mentoria cadastrada com sucesso."
      );

      limparFormulario();
      await carregarDados();
    } catch (error: unknown) {
      alert(
        error instanceof Error
          ? error.message
          : "Erro ao salvar mentoria."
      );
    } finally {
      setSalvando(false);
    }
  }

  async function excluir(registro: Registro) {
    if (
      !confirm(
        `Excluir “${registro.title}”? O vídeo continuará protegido no Drive.`
      )
    ) {
      return;
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      alert(
        "Sessão administrativa expirada. Entre novamente."
      );

      return;
    }

    const response = await fetch(
      `/api/admin/mentorias?id=${encodeURIComponent(
        registro.id
      )}`,
      {
        method: "DELETE",

        headers: {
          Authorization:
            `Bearer ${session.access_token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(
        data.error ||
          "Não foi possível excluir o registro."
      );

      return;
    }

    await carregarDados();
  }

  return (
    <div className="mentorias-admin">
      <div className="cabecalho">
        <div>
          <p className="etiqueta">
            ATENDIMENTOS
          </p>

          <h1>🎥 Mentorias Gravadas</h1>

          <p className="descricao">
            Publique vídeos, relatórios e PDFs no
            espaço privado de cada assinante.
          </p>
        </div>

        <a
          href="https://drive.google.com/drive/folders/188PQSxIWI5O8dShcIcVHGkKcifMXcOU_"
          target="_blank"
          rel="noreferrer"
          className="botao-drive"
        >
          Abrir pasta privada no Drive ↗
        </a>
      </div>

      {erro && (
        <div className="erro">
          {erro}
        </div>
      )}

      <div className="grade-principal">
        <section className="painel formulario">
          <h2>
            {formulario.id
              ? "Editar mentoria"
              : "+ Nova mentoria gravada"}
          </h2>

          <label>
            Assinante Diamante

            <select
              value={formulario.client_id}
              onChange={(event) =>
                atualizarCampo(
                  "client_id",
                  event.target.value
                )
              }
            >
              <option value="">
                Escolha a assinante...
              </option>

              {clientesDisponiveis.map(
                (cliente) => (
                  <option
                    key={cliente.id}
                    value={cliente.id}
                  >
                    {cliente.nome_referencia ||
                      cliente.nome}
                  </option>
                )
              )}
            </select>
          </label>

          <label>
            Título da mentoria

            <input
              value={formulario.title}
              onChange={(event) =>
                atualizarCampo(
                  "title",
                  event.target.value
                )
              }
              placeholder="Ex.: Mentoria de agosto — Parte 1"
            />
          </label>

          <label>
            Data e horário

            <input
              type="datetime-local"
              value={formulario.occurred_at}
              onChange={(event) =>
                atualizarCampo(
                  "occurred_at",
                  event.target.value
                )
              }
            />
          </label>

          <label>
            Link ou código do vídeo no Drive

            <input
              value={formulario.video_file_id}
              onChange={(event) =>
                atualizarCampo(
                  "video_file_id",
                  event.target.value
                )
              }
              placeholder="Cole o link completo do vídeo"
            />
          </label>

          <label>
            Relatório da Ádria

            <textarea
              rows={7}
              value={formulario.report_adria}
              onChange={(event) =>
                atualizarCampo(
                  "report_adria",
                  event.target.value
                )
              }
              placeholder="Escreva seu parecer, orientações e próximos passos..."
            />
          </label>

          <label>
            Relatório da Estella

            <textarea
              rows={7}
              value={formulario.report_estella}
              onChange={(event) =>
                atualizarCampo(
                  "report_estella",
                  event.target.value
                )
              }
              placeholder="Registre o parecer espiritual da Estella..."
            />
          </label>

          <label>
            Link ou código do PDF

            <input
              value={formulario.pdf_file_id}
              onChange={(event) =>
                atualizarCampo(
                  "pdf_file_id",
                  event.target.value
                )
              }
              placeholder="Opcional — cole o link do relatório em PDF"
            />
          </label>

          <label className="publicar">
            <input
              type="checkbox"
              checked={formulario.published}
              onChange={(event) =>
                atualizarCampo(
                  "published",
                  event.target.checked
                )
              }
            />

            Publicar no portal da assinante
          </label>

          <div className="acoes">
            <button
              type="button"
              onClick={salvar}
              disabled={salvando}
              className="salvar"
            >
              {salvando
                ? "Salvando..."
                : formulario.id
                ? "Salvar alterações"
                : "Cadastrar mentoria"}
            </button>

            {formulario.id && (
              <button
                type="button"
                onClick={limparFormulario}
                className="cancelar"
              >
                Cancelar edição
              </button>
            )}
          </div>
        </section>

        <section className="painel historico">
          <h2>Histórico das mentorias</h2>

          {carregando ? (
            <p className="vazio">
              Carregando...
            </p>
          ) : registros.length === 0 ? (
            <p className="vazio">
              Nenhuma mentoria cadastrada.
            </p>
          ) : (
            <div className="lista">
              {registros.map((registro) => (
                <article
                  key={registro.id}
                  className="registro"
                >
                  <span
                    className={
                      registro.published
                        ? "status publicado"
                        : "status rascunho"
                    }
                  >
                    {registro.published
                      ? "Publicado"
                      : "Rascunho"}
                  </span>

                  <h3>{registro.title}</h3>

                  <p className="cliente">
                    💎 {nomeCliente(registro)}
                  </p>

                  <p className="data">
                    {new Date(
                      registro.occurred_at
                    ).toLocaleString("pt-BR", {
                      dateStyle: "long",
                      timeStyle: "short",
                    })}
                  </p>

                  <div className="itens">
                    {registro.video_file_id && (
                      <span>🎥 Vídeo</span>
                    )}

                    {registro.report_adria && (
                      <span>
                        🌹 Parecer da Ádria
                      </span>
                    )}

                    {registro.report_estella && (
                      <span>
                        🔮 Parecer da Estella
                      </span>
                    )}

                    {registro.pdf_file_id && (
                      <span>📄 PDF</span>
                    )}
                  </div>

                  <div className="acoes-registro">
                    <button
                      type="button"
                      onClick={() =>
                        editar(registro)
                      }
                    >
                      ✏️ Editar
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        excluir(registro)
                      }
                      className="excluir"
                    >
                      Excluir
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      <style jsx>{`
        .mentorias-admin {
          max-width: 1260px;
        }

        .cabecalho {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 28px;
        }

        .etiqueta {
          margin: 0 0 8px;
          color: #e7c96f;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 2px;
        }

        h1 {
          margin: 0;
          color: #fff;
          font-size: 36px;
        }

        .descricao {
          margin: 10px 0 0;
          color: rgba(255, 255, 255, 0.68);
          line-height: 1.6;
        }

        .botao-drive {
          flex-shrink: 0;
          color: #f4d46a;
          text-decoration: none;
          border: 1px solid
            rgba(244, 212, 106, 0.35);
          border-radius: 12px;
          padding: 12px 16px;
          background: rgba(244, 212, 106, 0.07);
          font-weight: 700;
        }

        .erro {
          margin-bottom: 20px;
          padding: 14px 16px;
          border: 1px solid
            rgba(248, 113, 113, 0.4);
          border-radius: 12px;
          background: rgba(127, 29, 29, 0.25);
          color: #fecaca;
        }

        .grade-principal {
          display: grid;
          grid-template-columns:
            minmax(0, 1fr)
            minmax(380px, 0.9fr);
          gap: 24px;
          align-items: start;
        }

        .painel {
          border: 1px solid
            rgba(244, 212, 106, 0.2);
          border-radius: 22px;
          background: #240032;
          padding: 26px;
        }

        .painel h2 {
          margin: 0 0 22px;
          color: #f4d46a;
        }

        label {
          display: grid;
          gap: 8px;
          margin-bottom: 16px;
          color: #f6e9ff;
          font-size: 14px;
          font-weight: 700;
        }

        input,
        select,
        textarea {
          width: 100%;
          box-sizing: border-box;
          border: 1px solid
            rgba(244, 212, 106, 0.2);
          border-radius: 12px;
          background: #16001e;
          padding: 13px 14px;
          color: #fff;
          font: inherit;
        }

        textarea {
          resize: vertical;
          line-height: 1.6;
        }

        .publicar {
          display: flex;
          align-items: center;
          gap: 10px;
          border: 1px solid
            rgba(244, 212, 106, 0.14);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.03);
          padding: 13px;
        }

        .publicar input {
          width: 18px;
          height: 18px;
        }

        .acoes,
        .acoes-registro {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        button {
          border: 0;
          border-radius: 11px;
          padding: 11px 15px;
          cursor: pointer;
          font-weight: 800;
        }

        .salvar {
          background: #e7c96f;
          color: #1a0921;
        }

        .salvar:disabled {
          cursor: wait;
          opacity: 0.65;
        }

        .cancelar,
        .acoes-registro button {
          background: rgba(255, 255, 255, 0.08);
          color: #fff;
        }

        .lista {
          display: grid;
          gap: 14px;
        }

        .registro {
          border: 1px solid
            rgba(255, 255, 255, 0.1);
          border-radius: 17px;
          background: #170020;
          padding: 18px;
        }

        .status {
          display: inline-flex;
          border-radius: 999px;
          padding: 5px 9px;
          font-size: 11px;
          font-weight: 800;
        }

        .publicado {
          background: rgba(74, 222, 128, 0.12);
          color: #86efac;
        }

        .rascunho {
          background: rgba(250, 204, 21, 0.1);
          color: #fde047;
        }

        .registro h3 {
          margin: 12px 0 7px;
          color: #fff;
          font-size: 18px;
        }

        .cliente {
          margin: 0;
          color: #f4d46a;
          font-weight: 700;
        }

        .data {
          margin: 7px 0 0;
          color: rgba(255, 255, 255, 0.6);
          font-size: 13px;
        }

        .itens {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
          margin: 16px 0;
        }

        .itens span {
          border-radius: 999px;
          background: rgba(139, 92, 246, 0.13);
          padding: 6px 9px;
          color: #ddd6fe;
          font-size: 12px;
        }

        .acoes-registro .excluir {
          color: #fca5a5;
        }

        .vazio {
          color: rgba(255, 255, 255, 0.6);
        }

        @media (max-width: 980px) {
          .grade-principal {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 680px) {
          .cabecalho {
            flex-direction: column;
          }

          h1 {
            font-size: 28px;
          }

          .painel {
            padding: 20px;
          }

          .botao-drive {
            width: 100%;
            box-sizing: border-box;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}