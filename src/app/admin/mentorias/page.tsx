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

type RelatorioGerado = {
  sintese: string;
  pontos_desenvolver: string;
  exercicios_praticos: string;
  orientacoes_vida_saudavel: string;
  plano_acompanhamento: string;
  mensagem_final: string;
};

const RELATORIO_VAZIO: RelatorioGerado = {
  sintese: "",
  pontos_desenvolver: "",
  exercicios_praticos: "",
  orientacoes_vida_saudavel: "",
  plano_acompanhamento: "",
  mensagem_final: "",
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
  generated_report:
    | Partial<RelatorioGerado>
    | null;
   generated_report_at: string | null;
  pdf_file_id: string | null;
  pdf_storage_path: string | null;
  pdf_file_name: string | null;
  pdf_url: string | null;
  pdf_generated_at: string | null;
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
  generated_report: RelatorioGerado;
  pdf_file_id: string;
  pdf_storage_path: string;
  pdf_file_name: string;
  pdf_url: string;
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
  generated_report: {
    ...RELATORIO_VAZIO,
  },
  
  pdf_file_id: "",
  pdf_storage_path: "",
  pdf_file_name: "",
  pdf_url: "",
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

function normalizarRelatorio(
  relatorio:
    | Partial<RelatorioGerado>
    | null
    | undefined
): RelatorioGerado {
  return {
    sintese:
      String(relatorio?.sintese || ""),

    pontos_desenvolver:
      String(
        relatorio?.pontos_desenvolver || ""
      ),

    exercicios_praticos:
      String(
        relatorio?.exercicios_praticos || ""
      ),

    orientacoes_vida_saudavel:
      String(
        relatorio?.orientacoes_vida_saudavel ||
          ""
      ),

    plano_acompanhamento:
      String(
        relatorio?.plano_acompanhamento || ""
      ),

    mensagem_final:
      String(relatorio?.mensagem_final || ""),
  };
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

   const [
    gerandoRelatorio,
    setGerandoRelatorio,
  ] = useState(false);

  const [
    gerandoPdf,
    setGerandoPdf,
  ] = useState(false);

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

  function atualizarRelatorio(
    campo: keyof RelatorioGerado,
    valor: string
  ) {
    setFormulario((anterior) => ({
      ...anterior,

      generated_report: {
        ...anterior.generated_report,
        [campo]: valor,
      },
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

      pdf_storage_path:
        registro.pdf_storage_path || "",

      pdf_file_name:
        registro.pdf_file_name || "",

      pdf_url:
        registro.pdf_url || "",

            generated_report:
        normalizarRelatorio(
          registro.generated_report
        ),

      published: registro.published,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

    function limparFormulario() {
    setFormulario({
      ...FORMULARIO_INICIAL,

      generated_report: {
        ...RELATORIO_VAZIO,
      },
    });
  }

  async function gerarRelatorio() {
    if (!formulario.client_id) {
      alert("Escolha a assinante.");

      return;
    }

    if (
      !formulario.report_adria.trim() ||
      !formulario.report_estella.trim()
    ) {
      alert(
        "Preencha o relatório da Ádria e o relatório da Estella."
      );

      return;
    }

    setGerandoRelatorio(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        throw new Error(
          "Sessão administrativa expirada. Entre novamente."
        );
      }

      const clienteSelecionada =
        clientes.find(
          (cliente) =>
            cliente.id === formulario.client_id
        );

      const response = await fetch(
        "/api/admin/mentorias/gerar-relatorio",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",

            Authorization:
              `Bearer ${session.access_token}`,
          },

          body: JSON.stringify({
            nome_assinante:
              clienteSelecionada
                ?.nome_referencia ||
              clienteSelecionada?.nome ||
              "",

            titulo: formulario.title,

            report_adria:
              formulario.report_adria,

            report_estella:
              formulario.report_estella,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Não foi possível gerar o relatório."
        );
      }

      setFormulario((anterior) => ({
        ...anterior,

        generated_report:
          normalizarRelatorio(
            data.relatorio
          ),
      }));

      window.setTimeout(() => {
        document
          .getElementById(
            "relatorio-gerado"
          )
          ?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
      }, 100);

      alert(
        "Relatório criado. Revise e edite tudo antes de salvar."
      );
    } catch (error: unknown) {
      alert(
        error instanceof Error
          ? error.message
          : "Erro ao gerar relatório."
      );
    } finally {
      setGerandoRelatorio(false);
    }
  }

    async function gerarPdf() {
    if (!formulario.id) {
      alert(
        "Cadastre a mentoria primeiro. Depois clique em Editar para gerar o PDF."
      );

      return;
    }

    const possuiRelatorio =
      Object.values(
        formulario.generated_report
      ).some((valor) =>
        valor.trim()
      );

    if (!possuiRelatorio) {
      alert(
        "Gere o relatório com o agente antes de criar o PDF."
      );

      return;
    }

    setGerandoPdf(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        throw new Error(
          "Sessão administrativa expirada. Entre novamente."
        );
      }

      const salvarResponse =
        await fetch(
          "/api/admin/mentorias",
          {
            method: "PATCH",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${session.access_token}`,
            },

            body: JSON.stringify({
              ...formulario,

              service_type:
                "mentoria",

              occurred_at:
                new Date(
                  formulario.occurred_at
                ).toISOString(),
            }),
          }
        );

      const salvarData =
        await salvarResponse.json();

      if (!salvarResponse.ok) {
        throw new Error(
          salvarData.error ||
            "Não foi possível salvar o relatório."
        );
      }

      const pdfResponse =
        await fetch(
           "/api/mentorias/gerar-pdf",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${session.access_token}`,
            },

            body: JSON.stringify({
              id: formulario.id,
            }),
          }
        );

            const pdfTexto =
        await pdfResponse.text();

      let pdfData: {
        error?: string;
        pdf_storage_path?: string;
        pdf_file_name?: string;
        pdf_url?: string;
        pdf_generated_at?: string;
      } = {};

      try {
        pdfData = JSON.parse(pdfTexto);
      } catch {
        console.error(
          "Resposta recebida da rota gerar-pdf:",
          pdfTexto
        );

        throw new Error(
          `A rota de geração do PDF retornou uma resposta inválida. Código HTTP: ${pdfResponse.status}.`
        );
      }

      if (!pdfResponse.ok) {
        throw new Error(
          pdfData.error ||
            "Não foi possível gerar o PDF."
        );
      }

      setFormulario((anterior) => ({
        ...anterior,

        pdf_storage_path:
          pdfData.pdf_storage_path || "",

        pdf_file_name:
          pdfData.pdf_file_name || "",

        pdf_url:
          pdfData.pdf_url || "",
      }));

      await carregarDados();

      alert(
        "PDF criado com sucesso. Agora você pode visualizá-lo."
      );
    } catch (error: unknown) {
      alert(
        error instanceof Error
          ? error.message
          : "Erro ao gerar o PDF."
      );
    } finally {
      setGerandoPdf(false);
    }
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

  async function alterarPublicacao(
    registro: Registro
  ) {
    const publicar = !registro.published;

    const confirmou = confirm(
      publicar
        ? `Publicar “${registro.title}” no portal da assinante?`
        : `Ocultar “${registro.title}” do portal da assinante?`
    );

    if (!confirmou) {
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
      "/api/admin/mentorias",
      {
        method: "PATCH",

        headers: {
          "Content-Type": "application/json",

          Authorization:
            `Bearer ${session.access_token}`,
        },

        body: JSON.stringify({
          id: registro.id,
          client_id: registro.client_id,
          service_type: registro.service_type,
          title: registro.title,
          occurred_at: registro.occurred_at,
          video_file_id:
            registro.video_file_id,
          report_adria:
            registro.report_adria,
          report_estella:
            registro.report_estella,
          pdf_file_id:
            registro.pdf_file_id,
          published: publicar,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(
        data.error ||
          "Não foi possível alterar a publicação."
      );

      return;
    }

    alert(
      publicar
        ? "Mentoria publicada no portal."
        : "Mentoria retirada do portal."
    );

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

          <div
            id="relatorio-gerado"
            className="gerador-relatorio"
          >
            <div className="topo-gerador">
              <div>
                <p className="titulo-gerador">
                  ✨ Gerador do Relatório
                </p>

                <p className="descricao-gerador">
                  O agente usará os dois pareceres
                  para criar exercícios, orientações
                  e próximos passos.
                </p>
              </div>

              <button
                type="button"
                onClick={gerarRelatorio}
                disabled={gerandoRelatorio}
                className="botao-gerar"
              >
                {gerandoRelatorio
                  ? "Criando relatório..."
                  : "✨ Gerar com o agente"}
              </button>
            </div>

            {Object.values(
              formulario.generated_report
            ).some((valor) =>
              valor.trim()
            ) && (
              <div className="campos-gerados">
                <p className="aviso-edicao">
                  Revise e edite todo o conteúdo
                  antes de gerar o PDF.
                </p>

                <label>
                  Síntese do momento atual

                  <textarea
                    rows={6}
                    value={
                      formulario
                        .generated_report
                        .sintese
                    }
                    onChange={(event) =>
                      atualizarRelatorio(
                        "sintese",
                        event.target.value
                      )
                    }
                  />
                </label>

                <label>
                  Pontos para desenvolver

                  <textarea
                    rows={7}
                    value={
                      formulario
                        .generated_report
                        .pontos_desenvolver
                    }
                    onChange={(event) =>
                      atualizarRelatorio(
                        "pontos_desenvolver",
                        event.target.value
                      )
                    }
                  />
                </label>

                <label>
                  Exercícios personalizados

                  <textarea
                    rows={9}
                    value={
                      formulario
                        .generated_report
                        .exercicios_praticos
                    }
                    onChange={(event) =>
                      atualizarRelatorio(
                        "exercicios_praticos",
                        event.target.value
                      )
                    }
                  />
                </label>

                <label>
                  Orientações para uma vida saudável

                  <textarea
                    rows={8}
                    value={
                      formulario
                        .generated_report
                        .orientacoes_vida_saudavel
                    }
                    onChange={(event) =>
                      atualizarRelatorio(
                        "orientacoes_vida_saudavel",
                        event.target.value
                      )
                    }
                  />
                </label>

                <label>
                  Plano para os próximos sete dias

                  <textarea
                    rows={8}
                    value={
                      formulario
                        .generated_report
                        .plano_acompanhamento
                    }
                    onChange={(event) =>
                      atualizarRelatorio(
                        "plano_acompanhamento",
                        event.target.value
                      )
                    }
                  />
                </label>

                <label>
                  Mensagem final

                  <textarea
                    rows={6}
                    value={
                      formulario
                        .generated_report
                        .mensagem_final
                    }
                    onChange={(event) =>
                      atualizarRelatorio(
                        "mensagem_final",
                        event.target.value
                      )
                    }
                  />
                </label>
              </div>
            )}
          </div>

                   <div className="area-pdf">
            <div>
              <p className="titulo-pdf">
                📄 Relatório em PDF
              </p>

              <p className="descricao-pdf">
                Gere o PDF depois de revisar
                todo o conteúdo criado pelo agente.
              </p>

              {formulario.pdf_file_name && (
                <p className="nome-pdf">
                  {formulario.pdf_file_name}
                </p>
              )}
            </div>

            <div className="acoes-pdf">
              <button
                type="button"
                onClick={gerarPdf}
                disabled={
                  gerandoPdf ||
                  !formulario.id
                }
                className="botao-pdf"
              >
                {gerandoPdf
                  ? "Gerando PDF..."
                  : formulario.pdf_storage_path
                  ? "🔄 Gerar novamente"
                  : formulario.id
                  ? "📄 Gerar PDF"
                  : "Cadastre para gerar o PDF"}
              </button>

              {formulario.pdf_url && (
                <a
                  href={formulario.pdf_url}
                  target="_blank"
                  rel="noreferrer"
                  className="visualizar-pdf"
                >
                  👁️ Visualizar PDF
                </a>
              )}
            </div>
          </div> 

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
      alterarPublicacao(registro)
    }
    className={
      registro.published
        ? "ocultar-portal"
        : "publicar-portal"
    }
  >
    {registro.published
      ? "🔒 Ocultar do portal"
      : "✨ Publicar no portal"}
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

        .gerador-relatorio {
          margin: 26px 0;
          padding: 20px;
          border: 1px solid
            rgba(244, 212, 106, 0.28);
          border-radius: 18px;
          background:
            linear-gradient(
              145deg,
              rgba(139, 92, 246, 0.12),
              rgba(244, 212, 106, 0.05)
            );
        }

        .topo-gerador {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 18px;
        }

        .titulo-gerador {
          margin: 0;
          color: #f4d46a;
          font-size: 18px;
          font-weight: 800;
        }

        .descricao-gerador {
          margin: 8px 0 0;
          max-width: 470px;
          color: rgba(255, 255, 255, 0.68);
          font-size: 13px;
          line-height: 1.6;
        }

        .botao-gerar {
          flex-shrink: 0;
          border: 1px solid
            rgba(244, 212, 106, 0.4);
          background: #e7c96f;
          color: #1a0921;
        }

        .botao-gerar:disabled {
          cursor: wait;
          opacity: 0.65;
        }

        .campos-gerados {
          margin-top: 22px;
          padding-top: 20px;
          border-top: 1px solid
            rgba(244, 212, 106, 0.18);
        }

        .aviso-edicao {
          margin: 0 0 18px;
          padding: 12px 14px;
          border-radius: 11px;
          background: rgba(74, 222, 128, 0.08);
          color: #bbf7d0;
          font-size: 13px;
          line-height: 1.6;
        }

        @media (max-width: 680px) {
          .topo-gerador {
            flex-direction: column;
          }

          .botao-gerar {
            width: 100%;
          }
        }

                .area-pdf {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          margin: 22px 0;
          padding: 18px;
          border: 1px solid
            rgba(244, 212, 106, 0.22);
          border-radius: 16px;
          background: rgba(
            255,
            255,
            255,
            0.035
          );
        }

        .titulo-pdf {
          margin: 0;
          color: #f4d46a;
          font-weight: 800;
        }

        .descricao-pdf {
          margin: 7px 0 0;
          color: rgba(
            255,
            255,
            255,
            0.65
          );
          font-size: 13px;
          line-height: 1.5;
        }

        .nome-pdf {
          margin: 8px 0 0;
          color: #c4b5fd;
          font-size: 12px;
          word-break: break-word;
        }

        .acoes-pdf {
          display: flex;
          flex-shrink: 0;
          gap: 10px;
          flex-wrap: wrap;
        }

        .botao-pdf {
          background: #e7c96f;
          color: #1a0921;
        }

        .botao-pdf:disabled {
          cursor: not-allowed;
          opacity: 0.55;
        }

        .visualizar-pdf {
          display: inline-flex;
          align-items: center;
          border: 1px solid
            rgba(167, 139, 250, 0.35);
          border-radius: 11px;
          background: rgba(
            139,
            92,
            246,
            0.16
          );
          padding: 11px 15px;
          color: #ede9fe;
          text-decoration: none;
          font-weight: 800;
        }

        @media (max-width: 680px) {
          .area-pdf {
            align-items: stretch;
            flex-direction: column;
          }

          .acoes-pdf {
            flex-direction: column;
          }

          .botao-pdf,
          .visualizar-pdf {
            width: 100%;
            box-sizing: border-box;
            justify-content: center;
          }
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

        .acoes-registro .publicar-portal {
  background: rgba(74, 222, 128, 0.14);
  color: #86efac;
}

.acoes-registro .ocultar-portal {
  background: rgba(250, 204, 21, 0.12);
  color: #fde047;
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