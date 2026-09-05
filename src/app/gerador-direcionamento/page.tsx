"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

const PLANILHA_CONTEUDOS_CSV =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSr7qra9Jsh2IO6vDO_8vVxe-8lkf9zbFeuDPtw5Wny7zHUKIhVa7lIqqshLo_4JbRDUhWjv0sb_5y3/pub?gid=0&single=true&output=csv";

type ConteudoPlanilha = {
  slug: string;
  ano: string;
  mes: string;
  semana: string;
  tipo: string;
  titulo: string;
  drive_file: string;
  ativo: string;
};

type PerguntaExclusiva = {
  id: string;
  cliente_id: string;
  nome_cliente: string | null;
  email_cliente: string | null;
  plano: string | null;
  categoria: string | null;
  pergunta: string;
  urgente: boolean | null;
  referencia_mes: string | null;
  status: string | null;
  ativo: boolean | null;
  created_at: string;
};

type InteracaoDirecionamento = {
  id: string;
  ano: string;
  mes: string;
  semana: string;
  opcao:
    | "muito_bom"
    | "duvida"
    | "elogio"
    | "sugestao";
  interaction_type:
    | "feedback"
    | "duvida"
    | "sugestao";
  message: string;
  admin_reply: string | null;
  replied_at: string | null;
  status: string | null;
  created_at: string;
};

const NOMES_MESES = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

const ORDEM_MESES = [
  "janeiro",
  "fevereiro",
  "março",
  "marco",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

function lerCsv(linha: string) {
  const colunas: string[] = [];
  let atual = "";
  let dentroDeAspas = false;

  for (let i = 0; i < linha.length; i++) {
    const caractere = linha[i];

    if (caractere === '"') {
      dentroDeAspas = !dentroDeAspas;
    } else if (caractere === "," && !dentroDeAspas) {
      colunas.push(atual.trim().replace(/^"|"$/g, ""));
      atual = "";
    } else {
      atual += caractere;
    }
  }

  colunas.push(atual.trim().replace(/^"|"$/g, ""));

  return colunas;
}

function linkDrive(valor: string, tipo: string) {
  if (!valor) return "";

  const valorLimpo = valor.trim();

  const idEncontrado = valorLimpo.startsWith("http")
    ? valorLimpo.match(/\/d\/([^/]+)/)?.[1]
    : valorLimpo;

  if (!idEncontrado) return "";

  const ehAudio =
    tipo === "audio_individual" ||
    tipo === "audio_geral";

  return ehAudio
    ? `https://drive.google.com/file/d/${idEncontrado}/preview`
    : `https://drive.google.com/file/d/${idEncontrado}/view`;
}

function nomeMes(numeroMes: number) {
  return NOMES_MESES[numeroMes - 1] || "";
}

function capitalizar(texto: string) {
  if (!texto) return "";

  return (
    texto.charAt(0).toUpperCase() +
    texto.slice(1)
  );
}

function referenciaDaPergunta(
  pergunta: PerguntaExclusiva
) {
  if (
    pergunta.referencia_mes &&
    /^\d{4}-\d{2}$/.test(pergunta.referencia_mes)
  ) {
    return pergunta.referencia_mes;
  }

  const data = new Date(pergunta.created_at);

  return `${data.getFullYear()}-${String(
    data.getMonth() + 1
  ).padStart(2, "0")}`;
}

export default function PortalPremium() {
  const params = useParams();
  const router = useRouter();

  const slug = String(params.slug || "");

  const agora = new Date();

  const anoAtual = String(
    agora.getFullYear()
  );

  const numeroMesAtual =
    agora.getMonth() + 1;

  const mesAtual =
    NOMES_MESES[agora.getMonth()];

  const referenciaAtual =
    `${anoAtual}-${String(
      numeroMesAtual
    ).padStart(2, "0")}`;

  const [audioAberto, setAudioAberto] =
    useState(false);

  const [audioUrl, setAudioUrl] =
    useState("");

  const [
    direcionamentos,
    setDirecionamentos,
  ] = useState<PerguntaExclusiva[]>([]);

  const [
    direcionamentoExclusivo,
    setDirecionamentoExclusivo,
  ] = useState<PerguntaExclusiva | null>(
    null
  );

  const [
    reformulacao,
    setReformulacao,
  ] = useState<any>(null);

  const [anoAberto, setAnoAberto] =
    useState<string | null>(anoAtual);

  const [mesAberto, setMesAberto] =
    useState<string | null>(
      `${anoAtual}-${mesAtual}`
    );

  const [
    direcionamentoAberto,
    setDirecionamentoAberto,
  ] = useState(false);

  const [categoria, setCategoria] =
    useState("");

  const [urgente, setUrgente] =
    useState(false);

    const [mensagensAbertas, setMensagensAbertas] =
  useState<Record<string, boolean>>({});

  const [
    feedbackDirecionamentoAberto,
    setFeedbackDirecionamentoAberto,
  ] = useState<Record<string, boolean>>({});

  const [
    historicoDirecionamentoAberto,
    setHistoricoDirecionamentoAberto,
  ] = useState<Record<string, boolean>>({});

  const [
    opcaoDirecionamento,
    setOpcaoDirecionamento,
  ] = useState<Record<string, string>>({});

  const [
    textoDirecionamento,
    setTextoDirecionamento,
  ] = useState<Record<string, string>>({});

  const [
    enviandoDirecionamento,
    setEnviandoDirecionamento,
  ] = useState<string | null>(null);

  const [
    interacoesDirecionamento,
    setInteracoesDirecionamento,
  ] = useState<InteracaoDirecionamento[]>([]);

  const [pergunta, setPergunta] =
    useState("");

  const [nome, setNome] =
    useState("");

  const [plano, setPlano] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [clienteId, setClienteId] =
    useState("");

  const [
    perguntasRestantes,
    setPerguntasRestantes,
  ] = useState(0);

  const [
    conteudosPlanilha,
    setConteudosPlanilha,
  ] = useState<ConteudoPlanilha[]>([]);

  const [
    carregandoConteudos,
    setCarregandoConteudos,
  ] = useState(true);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [mobile, setMobile] =
    useState(false);

  useEffect(() => {
    const verificar = () => {
      setMobile(
        window.innerWidth <= 900
      );
    };

    verificar();

    window.addEventListener(
      "resize",
      verificar
    );

    return () =>
      window.removeEventListener(
        "resize",
        verificar
      );
  }, []);

  useEffect(() => {
    async function carregarCliente() {
      setLoading(true);
      setError(null);

      try {
        const {
          data,
          error: clienteError,
        } = await supabase
          .from("club_clients")
          .select(
            `
              id,
              plano,
              nome,
              nome_referencia,
              email,
              slug
            `
          )
          .eq("slug", slug)
          .maybeSingle();

        if (clienteError) {
          throw new Error(
            clienteError.message
          );
        }

        if (!data) {
          throw new Error(
            "Assinante não encontrada."
          );
        }

        setClienteId(data.id);

        setNome(
          data.nome_referencia ||
            data.nome ||
            ""
        );

        setEmail(data.email || "");

        const planoCliente =
          String(
            data.plano || ""
          ).toLowerCase();

        setPlano(planoCliente);

        const limitePerguntas =
          planoCliente === "cortesia"
            ? 1
            : planoCliente === "bronze"
            ? 1
            : planoCliente === "prata"
            ? 2
            : planoCliente === "ouro"
            ? 2
            : planoCliente === "diamante"
            ? 3
            : 0;

        const {
          data: perguntasData,
          error: perguntasError,
        } = await supabase
          .from("exclusive_questions")
          .select("*")
          .eq("cliente_id", data.id)
          .order("created_at", {
            ascending: true,
          });

        if (perguntasError) {
          throw new Error(
            perguntasError.message
          );
        }

        const todasPerguntas =
          (perguntasData || []) as PerguntaExclusiva[];

        setDirecionamentos(
          todasPerguntas
        );

        const perguntasDoMesAtual =
          todasPerguntas.filter(
            (item) =>
              referenciaDaPergunta(
                item
              ) === referenciaAtual
          );

        setPerguntasRestantes(
          Math.max(
            0,
            limitePerguntas -
              perguntasDoMesAtual.length
          )
        );

        const exclusivo =
          perguntasDoMesAtual.length > 0
            ? perguntasDoMesAtual[
                perguntasDoMesAtual.length -
                  1
              ]
            : null;

        setDirecionamentoExclusivo(
          exclusivo
        );

        if (exclusivo) {
          const {
            data: recado,
            error: recadoError,
          } = await supabase
            .from(
              "exclusive_messages"
            )
            .select("*")
            .eq(
              "question_id",
              exclusivo.id
            )
            .eq("autor", "admin")
            .order("created_at", {
              ascending: false,
            })
            .limit(1)
            .maybeSingle();

          if (recadoError) {
            console.error(
              "Erro ao carregar reformulação:",
              recadoError
            );
          }

          setReformulacao(
            recado || null
          );
        } else {
          setReformulacao(null);
        }
      } catch (err: unknown) {
        setError(
          err instanceof Error
            ? err.message
            : "Erro ao carregar dados do cliente."
        );
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      carregarCliente();
    }
  }, [slug, referenciaAtual]);

  useEffect(() => {
    async function carregarConteudosDaPlanilha() {
      try {
        const resposta = await fetch(
          PLANILHA_CONTEUDOS_CSV,
          {
            cache: "no-store",
          }
        );

        if (!resposta.ok) {
          throw new Error(
            "Não foi possível carregar a planilha de conteúdos."
          );
        }

        const texto =
          await resposta.text();

        const linhas = texto
          .split(/\r?\n/)
          .map((linha) =>
            linha.trim()
          )
          .filter(Boolean);

        if (linhas.length === 0) {
          setConteudosPlanilha([]);
          return;
        }

        const cabecalho =
          lerCsv(linhas[0]).map(
            (item) =>
              item
                .toLowerCase()
                .trim()
          );

        const conteudos =
          linhas
            .slice(1)
            .map((linha) => {
              const valores =
                lerCsv(linha);

              const item: Record<
                string,
                string
              > = {};

              cabecalho.forEach(
                (
                  coluna,
                  indice
                ) => {
                  item[coluna] =
                    valores[indice] ||
                    "";
                }
              );

              return {
                slug: (
                  item.slug || ""
                )
                  .toLowerCase()
                  .trim(),

                ano: (
                  item.ano || ""
                ).trim(),

                mes: (
                  item.mes || ""
                )
                  .toLowerCase()
                  .trim(),

                semana: (
                  item.semana || ""
                ).trim(),

                tipo: (
                  item.tipo || ""
                )
                  .toLowerCase()
                  .trim(),

                titulo: (
                  item.titulo || ""
                ).trim(),

                drive_file: (
                  item.drive_file ||
                  ""
                ).trim(),

                ativo: (
                  item.ativo || ""
                )
                  .toLowerCase()
                  .trim(),
              };
            });

        setConteudosPlanilha(
          conteudos
        );
      } catch (err) {
        console.error(
          "Erro ao carregar planilha:",
          err
        );
      } finally {
        setCarregandoConteudos(
          false
        );
      }
    }

    carregarConteudosDaPlanilha();
  }, []);

  const anos = useMemo(() => {
    const anosConteudos =
      conteudosPlanilha
        .filter(
          (item) =>
            item.slug === slug &&
            item.ativo === "sim"
        )
        .map((item) => item.ano);

    const anosPerguntas =
      direcionamentos.map(
        (item) =>
          referenciaDaPergunta(
            item
          ).slice(0, 4)
      );

    return [
      ...new Set([
        ...anosConteudos,
        ...anosPerguntas,
      ]),
    ]
      .filter(Boolean)
      .sort(
        (a, b) =>
          Number(b) -
          Number(a)
      );
  }, [
    conteudosPlanilha,
    direcionamentos,
    slug,
  ]);

  function mesesDoAno(
    ano: string
  ) {
    const mesesConteudos =
      conteudosPlanilha
        .filter(
          (item) =>
            item.slug === slug &&
            item.ano === ano &&
            item.ativo === "sim"
        )
        .map(
          (item) =>
            item.mes
        );

    const mesesPerguntas =
      direcionamentos
        .filter((item) =>
          referenciaDaPergunta(
            item
          ).startsWith(
            `${ano}-`
          )
        )
        .map((item) => {
          const referencia =
            referenciaDaPergunta(
              item
            );

          const numero =
            Number(
              referencia.slice(
                5,
                7
              )
            );

          return nomeMes(
            numero
          );
        });

    return [
      ...new Set([
        ...mesesConteudos,
        ...mesesPerguntas,
      ]),
    ]
      .filter(Boolean)
      .sort(
        (a, b) =>
          ORDEM_MESES.indexOf(
            b
          ) -
          ORDEM_MESES.indexOf(
            a
          )
      );
  }

  function conteudosDoMes(
    ano: string,
    mes: string
  ) {
    return conteudosPlanilha.filter(
      (item) =>
        item.slug === slug &&
        item.ano === ano &&
        item.mes === mes &&
        item.ativo === "sim"
    );
  }

  function numeroDoMes(
    mes: string
  ) {
    const indice =
      ORDEM_MESES.indexOf(mes);

    if (indice === 3) {
      return 3;
    }

    if (indice < 0) {
      return 0;
    }

    const ajusteMarco =
      indice > 3 ? indice : indice + 1;

    return ajusteMarco;
  }

  function perguntasDoMes(
    ano: string,
    mes: string
  ) {
    const numero =
      numeroDoMes(mes);

    if (!numero) {
      return [];
    }

    const referencia =
      `${ano}-${String(
        numero
      ).padStart(2, "0")}`;

    return direcionamentos.filter(
      (item) =>
        referenciaDaPergunta(
          item
        ) === referencia
    );
  }

  function chaveDirecionamento(
    ano: string,
    mes: string,
    semana: string
  ) {
    return `${ano}|${mes}|${semana}`;
  }

  function rotuloOpcaoDirecionamento(
    opcao: string
  ) {
    if (opcao === "muito_bom") {
      return "Muito bom";
    }

    if (opcao === "duvida") {
      return "Ainda tenho dúvidas";
    }

    if (opcao === "elogio") {
      return "Elogios";
    }

    if (opcao === "sugestao") {
      return "Sugestões";
    }

    return "Interação";
  }

  function interacoesDaSemana(
    ano: string,
    mes: string,
    semana: string
  ) {
    return interacoesDirecionamento.filter(
      (item) =>
        item.ano === ano &&
        item.mes === mes &&
        item.semana === semana
    );
  }

  async function carregarInteracoesDirecionamento() {
    if (!slug) {
      return;
    }

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        return;
      }

      const response = await fetch(
        `/api/direcionamentos/interacoes?slug=${encodeURIComponent(
          slug
        )}`,
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
          data.error ||
            "Não foi possível carregar o acompanhamento."
        );
      }

      setInteracoesDirecionamento(
        Array.isArray(data.interacoes)
          ? data.interacoes
          : []
      );
    } catch (erro) {
      console.error(
        "Erro ao carregar interações dos direcionamentos:",
        erro
      );
    }
  }

  useEffect(() => {
    if (slug && clienteId) {
      void carregarInteracoesDirecionamento();
    }
  }, [slug, clienteId]);

  async function enviarInteracaoDirecionamento(
    ano: string,
    mes: string,
    semana: string
  ) {
    const chave = chaveDirecionamento(
      ano,
      mes,
      semana
    );

    const opcao =
      opcaoDirecionamento[chave] || "";

    const mensagem =
      textoDirecionamento[chave]?.trim() || "";

    if (!opcao) {
      alert(
        "Escolha uma opção sobre este direcionamento."
      );
      return;
    }

    if (!mensagem) {
      alert(
        "Escreva sua percepção, dúvida, elogio ou sugestão."
      );
      return;
    }

    setEnviandoDirecionamento(chave);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        router.replace("/login");
        return;
      }

      const response = await fetch(
        "/api/direcionamentos/interacoes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            slug,
            ano,
            mes,
            semana,
            opcao,
            message: mensagem,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Não foi possível enviar sua mensagem."
        );
      }

      setOpcaoDirecionamento((atual) => ({
        ...atual,
        [chave]: "",
      }));

      setTextoDirecionamento((atual) => ({
        ...atual,
        [chave]: "",
      }));

      setFeedbackDirecionamentoAberto(
        (atual) => ({
          ...atual,
          [chave]: false,
        })
      );

      await carregarInteracoesDirecionamento();

      alert(
        "Mensagem enviada para Ádria. 💜"
      );
    } catch (erro) {
      alert(
        erro instanceof Error
          ? erro.message
          : "Erro ao enviar sua mensagem."
      );
    } finally {
      setEnviandoDirecionamento(null);
    }
  }

  function buscarConteudo(
    ano: string,
    mes: string,
    semana: string,
    tipo: string
  ) {
    return conteudosPlanilha.find(
      (item) =>
        item.slug === slug &&
        item.ano === ano &&
        item.mes === mes &&
        item.semana === semana &&
        item.tipo === tipo &&
        item.ativo === "sim"
    );
  }

  async function abrirAudio(
  ano: string,
  mes: string,
  semana: string
) {
  const conteudo = buscarConteudo(
    ano,
    mes,
    semana,
    "audio_individual"
  );

  if (!conteudo) {
    alert("Áudio ainda não disponível.");
    return;
  }

  const url = linkDrive(
    conteudo.drive_file,
    conteudo.tipo
  );

  if (!clienteId) {
    alert("Não foi possível identificar a assinante.");
    return;
  }

  try {
    const { data: escutaExistente, error: buscaError } =
      await supabase
        .from("direction_listens")
        .select("id, listen_count")
        .eq("cliente_id", clienteId)
        .eq("ano", ano)
        .eq("mes", mes)
        .eq("semana", semana)
        .eq("tipo", "audio")
        .maybeSingle();

    if (buscaError) {
      throw buscaError;
    }

    if (escutaExistente) {
      const { error: updateError } = await supabase
        .from("direction_listens")
        .update({
          last_listened_at: new Date().toISOString(),
          listen_count:
            (escutaExistente.listen_count || 0) + 1,
          updated_at: new Date().toISOString(),
        })
        .eq("id", escutaExistente.id);

      if (updateError) {
        throw updateError;
      }
    } else {
      const agora = new Date().toISOString();

      const { error: insertError } = await supabase
        .from("direction_listens")
        .insert({
          cliente_id: clienteId,
          slug,
          ano,
          mes,
          semana,
          tipo: "audio",
          first_listened_at: agora,
          last_listened_at: agora,
          listen_count: 1,
          updated_at: agora,
        });

      if (insertError) {
        throw insertError;
      }
    }
  } catch (erro: any) {
  console.error(
    "Erro ao registrar escuta do direcionamento:",
    erro
  );

  alert(
    `ERRO AO REGISTRAR ESCUTA:\n\n` +
    `Mensagem: ${erro?.message || "sem mensagem"}\n` +
    `Código: ${erro?.code || "sem código"}\n` +
    `Detalhes: ${erro?.details || "sem detalhes"}\n` +
    `Dica: ${erro?.hint || "sem dica"}`
  );
}

  setAudioUrl(url);
  setAudioAberto(true);
}

  function abrirPdf(
    ano: string,
    mes: string,
    semana: string
  ) {
    const conteudo =
      buscarConteudo(
        ano,
        mes,
        semana,
        "pdf_individual"
      );

    if (!conteudo) {
      alert(
        "PDF ainda não disponível."
      );

      return;
    }

    window.open(
      conteudo.drive_file,
      "_blank"
    );
  }

  function renderPergunta(
  item: PerguntaExclusiva
) {
  return (
    <div
      key={item.id}
      style={{
        marginTop: 15,
        padding: 20,
        borderRadius: 18,
        background: "#1b0227",
        border:
          "1px solid rgba(244,212,106,.20)",
      }}
    >
      {reformulacao &&
        direcionamentoExclusivo?.id === item.id &&
        item.status ===
          "Aguardando resposta da assinante" && (
          <div
            style={{
              marginBottom: 18,
              padding: 16,
              borderRadius: 14,
              background:
                "rgba(244,180,0,.10)",
              border:
                "1px solid rgba(244,180,0,.35)",
            }}
          >
            <strong
              style={{
                color: "#f4d46a",
              }}
            >
              🟡 Mensagem da Estella
            </strong>

            <div
              style={{
                color: "#fff",
                marginTop: 10,
                lineHeight: 1.7,
                whiteSpace: "pre-wrap",
              }}
            >
              {reformulacao.mensagem}
            </div>
          </div>
        )}

      {item.status === "Respondida em áudio" && (
        <>
          <p
            style={{
              color: "#7CFC90",
              fontWeight: 700,
              fontSize: 17,
            }}
          >
            ✅ Sua pergunta foi respondida.
          </p>

          <p
            style={{
              color: "#ddd",
              marginTop: 10,
              lineHeight: 1.7,
            }}
          >
            Esta pergunta foi respondida no
            Direcionamento Exclusivo deste mês.
          </p>
        </>
      )}

      {item.status === "Aceita" && (
        <>
          <p
            style={{
              color: "#7CFC90",
              fontWeight: 700,
              fontSize: 17,
            }}
          >
            💜 Sua pergunta foi aceita.
          </p>

          <p
            style={{
              color: "#ddd",
              marginTop: 10,
              lineHeight: 1.7,
            }}
          >
            Ela será respondida no próximo
            direcionamento.
          </p>
        </>
      )}

      {item.status === "Nova pergunta" && (
        <>
          <p
            style={{
              color: "#fff",
              fontWeight: 700,
            }}
          >
            💜 Sua pergunta foi recebida.
          </p>

          <p
            style={{
              color: "#ddd",
              marginTop: 10,
              lineHeight: 1.7,
            }}
          >
            Ela está aguardando análise.
          </p>
        </>
      )}

      {item.status ===
        "Aguardando resposta da assinante" && (
        <>
          <p
            style={{
              color: "#f4d46a",
              fontWeight: 700,
              fontSize: 17,
            }}
          >
            🟡 Sua pergunta precisa ser reformulada.
          </p>

          <p
            style={{
              color: "#ddd",
              marginTop: 10,
              lineHeight: 1.7,
            }}
          >
            A Cigana Estella solicitou uma
            reformulação antes de aceitar esta
            pergunta.
          </p>

          <button
            type="button"
            onClick={() => {
              setDirecionamentoExclusivo(item);

              setPergunta(item.pergunta || "");

              setCategoria(item.categoria || "");

              setUrgente(item.urgente || false);

              setDirecionamentoAberto(true);
            }}
            style={{
              marginTop: 16,
              padding: "12px 20px",
              borderRadius: 999,
              border: "none",
              background: "#f4b400",
              color: "#2b0a3d",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: 15,
            }}
          >
            ✍️ Reformular minha pergunta
          </button>
        </>
      )}

      <div
        style={{
          marginTop: 16,
          padding: 16,
          borderRadius: 12,
          background:
            "rgba(255,255,255,.05)",
        }}
      >
        <strong
          style={{
            color: "#fff",
          }}
        >
          Pergunta
        </strong>

        <div
          style={{
            marginTop: 10,
            color: "#ddd",
            fontStyle: "italic",
            lineHeight: 1.7,
          }}
        >
          “{item.pergunta}”
        </div>
      </div>

      <div
        style={{
          marginTop: 15,
          color: "#999",
          fontSize: 13,
        }}
      >
        📅{" "}
        {new Date(
          item.created_at
        ).toLocaleDateString("pt-BR")}
      </div>
    </div>
  );
}

  if (loading) {
    return (
      <div>
        Carregando...
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <main
      style={{
        display: "grid",
        gridTemplateColumns:
          mobile
            ? "1fr"
            : "280px 1fr",
        gap: mobile ? 20 : 30,
        alignItems: "start",
        padding: mobile
          ? 15
          : 40,
      }}
    >
      <aside
        style={{
          background: "#1b0227",
          borderRadius: 22,
          padding: 30,
          border:
            "1px solid rgba(244,212,106,.20)",
          position: mobile
            ? "relative"
            : "sticky",
          top: mobile ? 0 : 30,
          minHeight: mobile
            ? "auto"
            : "calc(100vh - 80px)",
          marginBottom: mobile
            ? 20
            : 0,
          display: "flex",
          flexDirection:
            "column",
        }}
      >
        <h2
          style={{
            color: "#ffd000",
            marginBottom: 30,
          }}
        >
          ✨ Direcionamentos
        </h2>

        <h3
          style={{
            color: "#fff",
            fontSize: 30,
            fontWeight: 700,
            lineHeight: 1.2,
            letterSpacing:
              "0.3px",
            marginTop: 24,
            marginBottom: 12,
          }}
        >
          {nome}
        </h3>

        <div
          style={{
            display:
              "inline-flex",
            alignItems: "center",
            gap: 8,
            padding:
              "8px 16px",
            borderRadius: 999,
            border:
              "1px solid rgba(212,164,0,.65)",
            background:
              "rgba(212,164,0,.08)",
            color: "#ffd54a",
            fontWeight: 700,
            fontSize: 15,
            width:
              "fit-content",
            marginTop: 10,
          }}
        >
          💎 Plano {plano}
        </div>

        <div
          style={{
            marginTop: 35,
            padding: 18,
            borderRadius: 18,
            border:
              "1px solid rgba(244,212,106,.20)",
            background:
              "rgba(255,255,255,.03)",
          }}
        >
          <div
            style={{
              color: "#f4d46a",
              fontWeight: 700,
              fontSize: 17,
              marginBottom: 12,
            }}
          >
            🔮 Direcionamento
            Exclusivo
          </div>

          <p
            style={{
              color: "#ddd",
              fontSize: 14,
              lineHeight: 1.6,
              marginBottom: 16,
            }}
          >
            Receba uma orientação
            exclusiva da Cigana
            Estella.
          </p>

          <div
            style={{
              color: "#f4d46a",
              fontWeight: 600,
              fontSize: 14,
              marginBottom: 6,
            }}
          >
            Você possui
          </div>

          <div
            style={{
              color: "#fff",
              fontSize: 26,
              fontWeight: 700,
              marginBottom: 6,
            }}
          >
            {perguntasRestantes}{" "}
            pergunta
            {perguntasRestantes !==
            1
              ? "s"
              : ""}
          </div>

          <div
            style={{
              color: "#bbb",
              fontSize: 14,
              marginBottom: 18,
            }}
          >
            disponível
            {perguntasRestantes !==
            1
              ? "is"
              : ""}{" "}
            neste mês.
          </div>

          {!reformulacao ? (
            <button
              disabled={
                perguntasRestantes ===
                0
              }
              onClick={() => {
                if (
                  perguntasRestantes ===
                  0
                ) {
                  return;
                }

                setDirecionamentoAberto(
                  true
                );
              }}
              style={{
                width: "100%",
                padding: 14,
                borderRadius: 999,
                border: "none",
                cursor:
                  perguntasRestantes ===
                  0
                    ? "not-allowed"
                    : "pointer",
                background:
                  perguntasRestantes ===
                  0
                    ? "#666"
                    : "linear-gradient(90deg,#6d28d9,#8b5cf6)",
                color: "#fff",
                fontWeight: 700,
                fontSize: 15,
                opacity:
                  perguntasRestantes ===
                  0
                    ? 0.6
                    : 1,
              }}
            >
              {perguntasRestantes ===
              0
                ? "Limite mensal atingido"
                : "✨ Fazer minha pergunta"}
            </button>
          ) : (
            <button
              onClick={() => {
                setPergunta(
                  direcionamentoExclusivo?.pergunta ||
                    ""
                );

                setCategoria(
                  direcionamentoExclusivo?.categoria ||
                    ""
                );

                setDirecionamentoAberto(
                  true
                );
              }}
              style={{
                width: "100%",
                padding: 14,
                borderRadius: 999,
                border: "none",
                cursor: "pointer",
                background:
                  "#f4b400",
                color: "#2b0a3d",
                fontWeight: 700,
                fontSize: 15,
              }}
            >
              ✍️ Reformular minha
              pergunta
            </button>
          )}

          {reformulacao && (
            <div
              style={{
                marginTop: 18,
                padding: 18,
                borderRadius: 16,
                background:
                  "rgba(244,180,0,.10)",
                border:
                  "1px solid rgba(244,180,0,.35)",
              }}
            >
              <h3
                style={{
                  color:
                    "#f4d46a",
                  marginBottom: 10,
                }}
              >
                🟡 Reformule sua
                pergunta
              </h3>

              <p
                style={{
                  color: "#ddd",
                  fontSize: 14,
                  lineHeight: 1.6,
                  marginBottom: 15,
                }}
              >
                Para que seu
                Direcionamento
                Exclusivo seja o
                mais preciso
                possível, a Cigana
                solicitou uma
                reformulação.
              </p>

              <div
                style={{
                  background:
                    "rgba(255,255,255,.05)",
                  borderRadius: 12,
                  padding: 15,
                  color: "#fff",
                  lineHeight: 1.7,
                  whiteSpace:
                    "pre-wrap",
                }}
              >
                {
                  reformulacao.mensagem
                }
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() =>
            router.push(
              `/cliente/${slug}`
            )
          }
          style={{
            width: "100%",
            padding: 14,
            borderRadius: 999,
            background:
              "#6d28d9",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            marginTop: mobile
              ? 25
              : "auto",
          }}
        >
          ← Voltar ao Portal
        </button>
      </aside>

      <section>
        <h1
          style={{
            color: "#f4d46a",
            fontSize: mobile
              ? 28
              : 34,
            marginBottom: 8,
          }}
        >
          Portal de
          Direcionamentos
        </h1>

        <p
          style={{
            color: "#ddd",
            marginBottom: 35,
          }}
        >
          Que os oráculos
          iluminem seu caminho...
        </p>

        {carregandoConteudos &&
          direcionamentos.length ===
            0 && (
            <div
              style={{
                color: "#aaa",
                marginBottom: 20,
              }}
            >
              Carregando histórico...
            </div>
          )}

        {anos.length === 0 ? (
          <div
            style={{
              padding: 25,
              borderRadius: 20,
              background:
                "#1b0227",
              border:
                "1px solid rgba(244,212,106,.20)",
              color: "#ddd",
            }}
          >
            Ainda não há
            direcionamentos
            disponíveis.
          </div>
        ) : (
          anos.map((ano) => {
            const meses =
              mesesDoAno(ano);

            const aberto =
              anoAberto === ano;

            return (
              <div
                key={ano}
                style={{
                  marginBottom: 22,
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setAnoAberto(
                      aberto
                        ? null
                        : ano
                    );

                    if (!aberto) {
                      const mesesAno =
                        mesesDoAno(
                          ano
                        );

                      if (
                        ano ===
                          anoAtual &&
                        mesesAno.includes(
                          mesAtual
                        )
                      ) {
                        setMesAberto(
                          `${ano}-${mesAtual}`
                        );
                      } else {
                        setMesAberto(
                          null
                        );
                      }
                    }
                  }}
                  style={{
                    width: "100%",
                    padding: 22,
                    borderRadius: 20,
                    border:
                      "1px solid rgba(244,212,106,.25)",
                    background:
                      "#21042e",
                    color:
                      "#f4d46a",
                    cursor:
                      "pointer",
                    textAlign:
                      "left",
                    fontSize: 24,
                    fontWeight: 800,
                  }}
                >
                  {aberto
                    ? "▼"
                    : "▶"}{" "}
                  {ano}
                </button>

                {aberto && (
                  <div
                    style={{
                      marginTop: 15,
                      display: "grid",
                      gap: 14,
                    }}
                  >
                    {meses.map(
                      (mes) => {
                        const chaveMes =
                          `${ano}-${mes}`;

                        const abertoMes =
                          mesAberto ===
                          chaveMes;

                        const conteudos =
                          conteudosDoMes(
                            ano,
                            mes
                          );

                        const perguntasMes =
                          perguntasDoMes(
                            ano,
                            mes
                          );

                        const semanas =
                          Array.from(
                            new Set(
                              conteudos.map(
                                (item) =>
                                  item.semana
                              )
                            )
                          ).sort(
                            (a, b) =>
                              Number(a) -
                              Number(b)
                          );

                        return (
                          <div
                            key={
                              chaveMes
                            }
                          >
                            <button
                              type="button"
                              onClick={() =>
                                setMesAberto(
                                  abertoMes
                                    ? null
                                    : chaveMes
                                )
                              }
                              style={{
                                width:
                                  "100%",
                                padding:
                                  20,
                                borderRadius:
                                  18,
                                background:
                                  "#2a0738",
                                color:
                                  "#f4d46a",
                                border:
                                  "1px solid rgba(244,212,106,.12)",
                                cursor:
                                  "pointer",
                                fontSize:
                                  21,
                                fontWeight:
                                  700,
                                textAlign:
                                  "left",
                              }}
                            >
                              {abertoMes
                                ? "▼"
                                : "▶"}{" "}
                              {capitalizar(
                                mes
                              )}
                            </button>

                            {abertoMes && (
                              <div
                                style={{
                                  marginTop:
                                    15,
                                  display:
                                    "grid",
                                  gap: 18,
                                  paddingLeft:
                                    mobile
                                      ? 0
                                      : 18,
                                }}
                              >
                                {perguntasMes.length > 0 && (
  <div
    style={{
      border:
        "1px solid rgba(244,212,106,.15)",
      borderRadius: 16,
      overflow: "hidden",
    }}
  >
    <button
      type="button"
      onClick={() =>
        setMensagensAbertas((atual) => ({
          ...atual,
          [chaveMes]:
            !atual[chaveMes],
        }))
      }
      style={{
        width: "100%",
        padding: 18,
        border: "none",
        background: "#1b0227",
        color: "#f4d46a",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        fontWeight: 700,
        fontSize: 17,
        textAlign: "left",
      }}
    >
      <span>
        🔮 Mensagens da Estella
      </span>

      <span>
        {mensagensAbertas[chaveMes]
          ? "▲ Fechar"
          : "▼ Ver histórico"}
      </span>
    </button>

    {mensagensAbertas[chaveMes] && (
      <div
        style={{
          padding: mobile
            ? 12
            : 18,
        }}
      >
        {perguntasMes.map(
          renderPergunta
        )}
      </div>
    )}
  </div>
)}

                                {semanas.length >
                                0 ? (
                                  <div>
                                    <h3
                                      style={{
                                        color:
                                          "#f4d46a",
                                        marginBottom:
                                          12,
                                      }}
                                    >
                                      🎧
                                      Direcionamentos
                                      da semana
                                    </h3>

                                    {semanas.map(
                                      (
                                        semana
                                      ) => {
                                        const chave =
                                          chaveDirecionamento(
                                            ano,
                                            mes,
                                            semana
                                          );

                                        const historicoSemana =
                                          interacoesDaSemana(
                                            ano,
                                            mes,
                                            semana
                                          );

                                        const caixaAberta =
                                          Boolean(
                                            feedbackDirecionamentoAberto[
                                              chave
                                            ]
                                          );

                                        const historicoAberto =
                                          Boolean(
                                            historicoDirecionamentoAberto[
                                              chave
                                            ]
                                          );

                                        return (
                                          <div
                                            key={
                                              semana
                                            }
                                            style={{
                                              background:
                                                "#1b0227",
                                              borderRadius:
                                                20,
                                              padding:
                                                24,
                                              border:
                                                "1px solid rgba(244,212,106,.20)",
                                              marginBottom:
                                                14,
                                            }}
                                          >
                                            <h4
                                              style={{
                                                color:
                                                  "#f4d46a",
                                                marginBottom:
                                                  14,
                                                fontSize:
                                                  18,
                                              }}
                                            >
                                              ✦{" "}
                                              {
                                                semana
                                              }
                                              ª
                                              Semana
                                            </h4>

                                            <div
                                              style={{
                                                display:
                                                  "flex",
                                                gap: 12,
                                                flexWrap:
                                                  "wrap",
                                                alignItems:
                                                  "center",
                                              }}
                                            >
                                              <button
                                                onClick={() =>
                                                  abrirAudio(
                                                    ano,
                                                    mes,
                                                    semana
                                                  )
                                                }
                                                style={{
                                                  background:
                                                    "#6d28d9",
                                                  color:
                                                    "#fff",
                                                  border:
                                                    "none",
                                                  borderRadius:
                                                    999,
                                                  padding:
                                                    "12px 20px",
                                                  cursor:
                                                    "pointer",
                                                }}
                                              >
                                                🎧
                                                Ouvir
                                                Direcionamento
                                              </button>

                                              <button
                                                onClick={() =>
                                                  abrirPdf(
                                                    ano,
                                                    mes,
                                                    semana
                                                  )
                                                }
                                                style={{
                                                  background:
                                                    "#6aa1f4",
                                                  color:
                                                    "#2a0738",
                                                  border:
                                                    "none",
                                                  borderRadius:
                                                    999,
                                                  padding:
                                                    "12px 20px",
                                                  cursor:
                                                    "pointer",
                                                  fontWeight:
                                                    700,
                                                }}
                                              >
                                                📄
                                                Baixar
                                                PDF
                                              </button>

                                              <button
                                                type="button"
                                                onClick={() =>
                                                  setFeedbackDirecionamentoAberto(
                                                    (
                                                      atual
                                                    ) => ({
                                                      ...atual,
                                                      [chave]:
                                                        !atual[
                                                          chave
                                                        ],
                                                    })
                                                  )
                                                }
                                                style={{
                                                  marginLeft:
                                                    mobile
                                                      ? 0
                                                      : 24,
                                                  background:
                                                    caixaAberta
                                                      ? "rgba(244,212,106,.16)"
                                                      : "rgba(255,255,255,.05)",
                                                  color:
                                                    "#f4d46a",
                                                  border:
                                                    "1px solid rgba(244,212,106,.35)",
                                                  borderRadius:
                                                    999,
                                                  padding:
                                                    "12px 20px",
                                                  cursor:
                                                    "pointer",
                                                  fontWeight:
                                                    700,
                                                }}
                                              >
                                                ✏️ O que
                                                achou do
                                                direcionamento?
                                              </button>
                                            </div>

                                            {caixaAberta && (
                                              <div
                                                style={{
                                                  marginTop:
                                                    18,
                                                  padding:
                                                    18,
                                                  borderRadius:
                                                    16,
                                                  background:
                                                    "rgba(255,255,255,.035)",
                                                  border:
                                                    "1px solid rgba(244,212,106,.16)",
                                                }}
                                              >
                                                <div
                                                  style={{
                                                    color:
                                                      "#f4d46a",
                                                    fontWeight:
                                                      800,
                                                    fontSize:
                                                      15,
                                                    marginBottom:
                                                      12,
                                                    textTransform:
                                                      "uppercase",
                                                    letterSpacing:
                                                      ".04em",
                                                  }}
                                                >
                                                  O que
                                                  achou do
                                                  direcionamento?
                                                </div>

                                                <select
                                                  value={
                                                    opcaoDirecionamento[
                                                      chave
                                                    ] ||
                                                    ""
                                                  }
                                                  onChange={(
                                                    e
                                                  ) =>
                                                    setOpcaoDirecionamento(
                                                      (
                                                        atual
                                                      ) => ({
                                                        ...atual,
                                                        [chave]:
                                                          e
                                                            .target
                                                            .value,
                                                      })
                                                    )
                                                  }
                                                  style={{
                                                    width:
                                                      "100%",
                                                    maxWidth:
                                                      360,
                                                    padding:
                                                      "12px 14px",
                                                    borderRadius:
                                                      12,
                                                    background:
                                                      "#2a0738",
                                                    color:
                                                      "#fff",
                                                    border:
                                                      "1px solid rgba(244,212,106,.30)",
                                                    outline:
                                                      "none",
                                                  }}
                                                >
                                                  <option value="">
                                                    Escolha
                                                    uma
                                                    opção...
                                                  </option>

                                                  <option value="muito_bom">
                                                    Muito
                                                    bom
                                                  </option>

                                                  <option value="duvida">
                                                    Ainda
                                                    tenho
                                                    dúvidas
                                                  </option>

                                                  <option value="elogio">
                                                    Elogios
                                                  </option>

                                                  <option value="sugestao">
                                                    Sugestões
                                                  </option>
                                                </select>

                                                <div
                                                  style={{
                                                    position:
                                                      "relative",
                                                    marginTop:
                                                      12,
                                                  }}
                                                >
                                                  <span
                                                    style={{
                                                      position:
                                                        "absolute",
                                                      left: 14,
                                                      top: 13,
                                                      color:
                                                        "#f4d46a",
                                                      pointerEvents:
                                                        "none",
                                                    }}
                                                  >
                                                    ✏️
                                                  </span>

                                                  <textarea
                                                    value={
                                                      textoDirecionamento[
                                                        chave
                                                      ] ||
                                                      ""
                                                    }
                                                    onChange={(
                                                      e
                                                    ) =>
                                                      setTextoDirecionamento(
                                                        (
                                                          atual
                                                        ) => ({
                                                          ...atual,
                                                          [chave]:
                                                            e
                                                              .target
                                                              .value,
                                                        })
                                                      )
                                                    }
                                                    rows={
                                                      3
                                                    }
                                                    placeholder="Escreva aqui sua percepção, dúvida, elogio ou sugestão..."
                                                    style={{
                                                      width:
                                                        "100%",
                                                      padding:
                                                        "12px 14px 12px 42px",
                                                      borderRadius:
                                                        12,
                                                      background:
                                                        "#2a0738",
                                                      color:
                                                        "#fff",
                                                      border:
                                                        "1px solid rgba(244,212,106,.25)",
                                                      resize:
                                                        "vertical",
                                                      minHeight:
                                                        82,
                                                      outline:
                                                        "none",
                                                      lineHeight:
                                                        1.5,
                                                    }}
                                                  />
                                                </div>

                                                <button
                                                  type="button"
                                                  disabled={
                                                    enviandoDirecionamento ===
                                                    chave
                                                  }
                                                  onClick={() =>
                                                    enviarInteracaoDirecionamento(
                                                      ano,
                                                      mes,
                                                      semana
                                                    )
                                                  }
                                                  style={{
                                                    marginTop:
                                                      12,
                                                    background:
                                                      "#6d28d9",
                                                    color:
                                                      "#fff",
                                                    border:
                                                      "none",
                                                    borderRadius:
                                                      999,
                                                    padding:
                                                      "11px 20px",
                                                    cursor:
                                                      enviandoDirecionamento ===
                                                      chave
                                                        ? "not-allowed"
                                                        : "pointer",
                                                    fontWeight:
                                                      700,
                                                    opacity:
                                                      enviandoDirecionamento ===
                                                      chave
                                                        ? 0.6
                                                        : 1,
                                                  }}
                                                >
                                                  {enviandoDirecionamento ===
                                                  chave
                                                    ? "Enviando..."
                                                    : "Enviar para Ádria"}
                                                </button>
                                              </div>
                                            )}

                                            {historicoSemana.length >
                                              0 && (
                                              <div
                                                style={{
                                                  marginTop:
                                                    14,
                                                  paddingTop:
                                                    12,
                                                  borderTop:
                                                    "1px solid rgba(244,212,106,.12)",
                                                }}
                                              >
                                                <button
                                                  type="button"
                                                  onClick={() =>
                                                    setHistoricoDirecionamentoAberto(
                                                      (
                                                        atual
                                                      ) => ({
                                                        ...atual,
                                                        [chave]:
                                                          !atual[
                                                            chave
                                                          ],
                                                      })
                                                    )
                                                  }
                                                  style={{
                                                    background:
                                                      "transparent",
                                                    color:
                                                      "#cbb9d4",
                                                    border:
                                                      "none",
                                                    padding:
                                                      0,
                                                    cursor:
                                                      "pointer",
                                                    fontWeight:
                                                      700,
                                                  }}
                                                >
                                                  {historicoAberto
                                                    ? "▲ Fechar histórico"
                                                    : `▼ Seu acompanhamento deste direcionamento (${historicoSemana.length})`}
                                                </button>

                                                {historicoAberto && (
                                                  <div
                                                    style={{
                                                      marginTop:
                                                        12,
                                                      display:
                                                        "grid",
                                                      gap: 10,
                                                    }}
                                                  >
                                                    {historicoSemana.map(
                                                      (
                                                        item
                                                      ) => (
                                                        <div
                                                          key={
                                                            item.id
                                                          }
                                                          style={{
                                                            padding:
                                                              14,
                                                            borderRadius:
                                                              12,
                                                            background:
                                                              "rgba(255,255,255,.04)",
                                                            border:
                                                              "1px solid rgba(255,255,255,.07)",
                                                          }}
                                                        >
                                                          <div
                                                            style={{
                                                              color:
                                                                "#f4d46a",
                                                              fontWeight:
                                                                700,
                                                              marginBottom:
                                                                7,
                                                            }}
                                                          >
                                                            {rotuloOpcaoDirecionamento(
                                                              item.opcao
                                                            )}
                                                          </div>

                                                          <div
                                                            style={{
                                                              color:
                                                                "#eee",
                                                              whiteSpace:
                                                                "pre-wrap",
                                                              lineHeight:
                                                                1.6,
                                                            }}
                                                          >
                                                            {
                                                              item.message
                                                            }
                                                          </div>

                                                          <div
                                                            style={{
                                                              marginTop:
                                                                8,
                                                              color:
                                                                "#8f8197",
                                                              fontSize:
                                                                12,
                                                            }}
                                                          >
                                                            {new Date(
                                                              item.created_at
                                                            ).toLocaleString(
                                                              "pt-BR"
                                                            )}
                                                          </div>

                                                          {item.admin_reply && (
                                                            <div
                                                              style={{
                                                                marginTop:
                                                                  12,
                                                                padding:
                                                                  12,
                                                                borderRadius:
                                                                  10,
                                                                background:
                                                                  "rgba(244,212,106,.07)",
                                                                border:
                                                                  "1px solid rgba(244,212,106,.16)",
                                                              }}
                                                            >
                                                              <div
                                                                style={{
                                                                  color:
                                                                    "#f4d46a",
                                                                  fontWeight:
                                                                    700,
                                                                  marginBottom:
                                                                    6,
                                                                }}
                                                              >
                                                                🌹
                                                                Resposta
                                                                da
                                                                Ádria
                                                              </div>

                                                              <div
                                                                style={{
                                                                  color:
                                                                    "#fff",
                                                                  whiteSpace:
                                                                    "pre-wrap",
                                                                  lineHeight:
                                                                    1.6,
                                                                }}
                                                              >
                                                                {
                                                                  item.admin_reply
                                                                }
                                                              </div>
                                                            </div>
                                                          )}
                                                        </div>
                                                      )
                                                    )}
                                                  </div>
                                                )}
                                              </div>
                                            )}
                                          </div>
                                        );
                                      }
                                    )}
                                  </div>
                                ) : (
                                  perguntasMes.length ===
                                    0 && (
                                    <div
                                      style={{
                                        color:
                                          "#999",
                                        padding:
                                          18,
                                      }}
                                    >
                                      Ainda
                                      não há
                                      conteúdo
                                      neste
                                      mês.
                                    </div>
                                  )
                                )}
                              </div>
                            )}
                          </div>
                        );
                      }
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </section>

      {audioAberto && (
        <div
          onClick={() =>
            setAudioAberto(false)
          }
          style={{
            position: "fixed",
            inset: 0,
            background:
              "rgba(0,0,0,.75)",
            display: "flex",
            justifyContent:
              "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            onClick={(e) =>
              e.stopPropagation()
            }
            style={{
              width: "90%",
              maxWidth: 700,
              background:
                "#1b0227",
              borderRadius: 20,
              padding: 24,
            }}
          >
            <h2
              style={{
                color:
                  "#f4d46a",
                marginBottom: 20,
              }}
            >
              🎧 Direcionamento
              da Semana
            </h2>

            <iframe
              key={audioUrl}
              src={audioUrl}
              title="Direcionamento"
              width="100%"
              height="180"
              allow="autoplay"
              allowFullScreen
              style={{
                border: "none",
                borderRadius: 12,
                background:
                  "#fff",
              }}
            />

            <button
              onClick={() => {
                setAudioAberto(
                  false
                );
                setAudioUrl("");
              }}
              style={{
                marginTop: 20,
                background:
                  "#6d28d9",
                color: "#fff",
                border: "none",
                borderRadius: 999,
                padding:
                  "12px 20px",
                cursor:
                  "pointer",
              }}
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {direcionamentoAberto && (
        <div
          onClick={() =>
            setDirecionamentoAberto(
              false
            )
          }
          style={{
            position: "fixed",
            inset: 0,
            background:
              "rgba(0,0,0,.75)",
            display: "flex",
            justifyContent:
              "center",
            alignItems: "center",
            zIndex: 9999,
            padding: 15,
          }}
        >
          <div
            onClick={(e) =>
              e.stopPropagation()
            }
            style={{
              width: "95%",
              maxWidth: 620,
              background:
                "#1b0227",
              borderRadius: 24,
              padding: 28,
              border:
                "1px solid rgba(244,212,106,.25)",
            }}
          >
            <h2
              style={{
                color:
                  "#f4d46a",
                marginBottom: 20,
              }}
            >
              🔮 Direcionamento
              Exclusivo
            </h2>

            <p
              style={{
                color: "#fff",
                marginBottom: 18,
              }}
            >
              Escolha a área da
              sua pergunta.
            </p>

            <select
              value={categoria}
              onChange={(e) =>
                setCategoria(
                  e.target.value
                )
              }
              style={{
                width: "100%",
                padding: 14,
                borderRadius: 12,
                background:
                  "#2a0738",
                color:
                  "#f4d46a",
                border:
                  "1px solid rgba(244,212,106,.30)",
                marginBottom: 20,
              }}
            >
              <option value="">
                Escolha o tema...
              </option>

              <option>
                ❤️ Amor
              </option>

              <option>
                💰 Trabalho
              </option>

              <option>
                🌿 Saúde
              </option>

              <option>
                ✨ Espiritualidade
              </option>

              <option>
                👨‍👩‍👧
                Relacionamentos
              </option>

              <option>
                🧠 Emocional
              </option>
            </select>

            <div
              style={{
                marginBottom: 20,
              }}
            >
              <p
                style={{
                  color: "#fff",
                  marginBottom: 10,
                  fontWeight: 600,
                }}
              >
                Sua situação
                precisa de uma
                resposta antes da
                próxima leitura
                semanal?
              </p>

              <label
                style={{
                  display:
                    "flex",
                  alignItems:
                    "center",
                  gap: 8,
                  color: "#fff",
                  marginBottom: 8,
                  cursor:
                    "pointer",
                }}
              >
                <input
                  type="radio"
                  name="urgente"
                  checked={
                    urgente ===
                    true
                  }
                  onChange={() =>
                    setUrgente(
                      true
                    )
                  }
                />

                Sim, preciso de
                uma orientação
                com urgência.
              </label>

              <label
                style={{
                  display:
                    "flex",
                  alignItems:
                    "center",
                  gap: 8,
                  color: "#fff",
                  cursor:
                    "pointer",
                }}
              >
                <input
                  type="radio"
                  name="urgente"
                  checked={
                    urgente ===
                    false
                  }
                  onChange={() =>
                    setUrgente(
                      false
                    )
                  }
                />

                Não, posso
                aguardar
                normalmente.
              </label>
            </div>

            <textarea
              value={pergunta}
              onChange={(e) =>
                setPergunta(
                  e.target.value
                )
              }
              placeholder="Digite sua pergunta..."
              rows={6}
              style={{
                width: "100%",
                padding: 16,
                borderRadius: 12,
                background:
                  "#2a0738",
                color: "#fff",
                border:
                  "1px solid rgba(244,212,106,.30)",
                resize: "none",
              }}
            />

            <div
              style={{
                display: "flex",
                gap: 12,
                marginTop: 24,
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={async () => {
                  if (
                    !categoria ||
                    !pergunta.trim()
                  ) {
                    alert(
                      "Escolha um tema e escreva sua pergunta."
                    );

                    return;
                  }

                  let envioError =
                    null;

                  if (
  direcionamentoExclusivo &&
  direcionamentoExclusivo.status ===
    "Aguardando resposta da assinante"
) {
  const resultado =
    await supabase
      .from("exclusive_questions")
      .update({
        categoria,
        pergunta: pergunta.trim(),
        urgente,
        status: "Nova pergunta",
      })
      .eq(
        "id",
        direcionamentoExclusivo.id
      );

  envioError = resultado.error;

  if (!envioError) {
    const { error: mensagemError } =
      await supabase
        .from("exclusive_messages")
        .insert({
          question_id:
            direcionamentoExclusivo.id,
          autor: "assinante",
          mensagem:
            pergunta.trim(),
        });

    if (mensagemError) {
      console.error(
        "Erro ao registrar reformulação:",
        mensagemError
      );
    }
  }
}

                  if (
                    envioError
                  ) {
                    console.error(
                      envioError
                    );

                    alert(
                      `Erro: ${envioError.message}`
                    );

                    return;
                  }

                  alert(
                    "Pergunta enviada com sucesso! 💜"
                  );

                  setCategoria("");
                  setPergunta("");
                  setDirecionamentoAberto(
                    false
                  );

                  window.location.reload();
                }}
                style={{
                  background:
                    "#6d28d9",
                  color: "#fff",
                  border: "none",
                  borderRadius: 999,
                  padding:
                    "12px 24px",
                  cursor:
                    "pointer",
                }}
              >
                ✨ Enviar Pergunta
              </button>

              <button
                onClick={() =>
                  setDirecionamentoAberto(
                    false
                  )
                }
                style={{
                  background:
                    "#4b0f63",
                  color: "#fff",
                  border: "none",
                  borderRadius: 999,
                  padding:
                    "12px 24px",
                  cursor:
                    "pointer",
                }}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}