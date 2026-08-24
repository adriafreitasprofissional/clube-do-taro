"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Link } from "lucide-react";

type Cliente = {
  id: string;
  nome: string;
  email: string;
  plano: string | null;
  status: string | null;
};

type Curso = {
  id: string;
  titulo: string;
  descricao: string | null;
  imagem_url: string | null;
};

type Liberacao = {
  id: string;
  client_id: string;
  course_id: string;
  tipo_acesso: string;
  data_inicio: string;
  data_fim: string | null;
  status: string;
  cliente?: Cliente;
  curso?: Curso;
};

type Recado = {
  id: string;
  client_id: string | null;
  titulo: string;
  mensagem: string;
  tipo_destino: string;
  lido: boolean;
  lido_em: string | null;
  publicado: boolean;
  created_at: string;
  cliente?: Cliente;
};

export default function LiberacaoCursosPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [liberacoes, setLiberacoes] = useState<Liberacao[]>([]);
  const [recados, setRecados] = useState<Recado[]>([]);

  const [clienteId, setClienteId] = useState("");
  const [cursoId, setCursoId] = useState("");
  const [tipoAcesso, setTipoAcesso] = useState("cortesia");
  const [validade, setValidade] = useState("permanente");

  const [buscaCliente, setBuscaCliente] = useState("");

  const [tituloRecado, setTituloRecado] = useState(
    "Você tem um recado da Ádria"
  );
  const [mensagemRecado, setMensagemRecado] = useState("");
  const [destinoRecado, setDestinoRecado] = useState("cliente");

  const [loading, setLoading] = useState(true);
  const [salvandoCurso, setSalvandoCurso] = useState(false);
  const [publicandoRecado, setPublicandoRecado] = useState(false);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    setLoading(true);

    const [
      clientesResponse,
      cursosResponse,
      liberacoesResponse,
      recadosResponse,
    ] = await Promise.all([
      supabase
        .from("club_clients")
        .select("id, nome, email, plano, status")
        .eq("status", "ativo")
        .order("nome", { ascending: true }),

      supabase
        .from("courses")
        .select("id, titulo, descricao, imagem_url")
        .eq("published", true)
        .order("ordem", { ascending: true }),

      supabase
        .from("course_students")
        .select(`
  id,
  nome,
  email,
  senha_temporaria,
  status,
  created_at,
  club_client_id,
  course_id,
  slug
`)
        .order("created_at", { ascending: false })
        .limit(50),

      supabase
        .from("client_messages")
        .select(`
          id,
          client_id,
          titulo,
          mensagem,
          tipo_destino,
          lido,
          lido_em,
          publicado,
          created_at
        `)
        .order("created_at", { ascending: false })
        .limit(50),
    ]);

    const listaClientes = clientesResponse.data || [];
    const listaCursos = cursosResponse.data || [];

    setClientes(listaClientes);
    setCursos(listaCursos);

    if (liberacoesResponse.data) {
  const dados = liberacoesResponse.data.map((item) => ({
    ...item,
    client_id: item.club_client_id,
    tipo_acesso: "curso",
    data_inicio: item.created_at,
    data_fim: null,
    cliente: listaClientes.find(
      (cliente) => cliente.id === item.club_client_id
    ),
    curso: listaCursos.find(
      (curso) => curso.id === item.course_id
    ),
  }));

  setLiberacoes(dados);
}

if (recadosResponse.data) {
  const dados = recadosResponse.data.map((item) => ({
    ...item,
    cliente: listaClientes.find(
      (cliente) => cliente.id === item.client_id
    ),
  }));

  setRecados(dados);
}

    setLoading(false);
  }

  async function liberarCurso() {
    if (!clienteId) {
      alert("Selecione um cliente.");
      return;
    }

    if (!cursoId) {
      alert("Selecione um curso.");
      return;
    }

    setSalvandoCurso(true);

    try {
      const { data: existente, error: buscaError } = await supabase
       .from("course_students")
        .select("id")
        .eq("client_id", clienteId)
        .eq("course_id", cursoId)
        .eq("status", "ativo")
        .maybeSingle();

      if (buscaError) {
        console.error(buscaError);
        alert("Erro ao verificar a liberação.");
        return;
      }

      if (existente) {
        alert("Este curso já está liberado para este cliente.");
        return;
      }

      const dataInicio = new Date();
      let dataFim: string | null = null;

      if (validade === "7dias") {
        const fim = new Date(dataInicio);
        fim.setDate(fim.getDate() + 7);
        dataFim = fim.toISOString();
      }

      if (validade === "30dias") {
        const fim = new Date(dataInicio);
        fim.setDate(fim.getDate() + 30);
        dataFim = fim.toISOString();
      }

      const { error } = await supabase
        .from("course_students")
        .insert({
          client_id: clienteId,
          course_id: cursoId,
          tipo_acesso: tipoAcesso,
          data_inicio: dataInicio.toISOString(),
          data_fim: dataFim,
          status: "ativo",
        });

      if (error) {
        console.error(error);
        alert("Erro ao liberar o curso.");
        return;
      }

      alert("Curso liberado com sucesso.");

      setClienteId("");
      setCursoId("");
      setTipoAcesso("cortesia");
      setValidade("permanente");

      await carregarDados();
    } finally {
      setSalvandoCurso(false);
    }
  }

  async function publicarRecado() {
    if (destinoRecado === "cliente" && !clienteId) {
      alert("Selecione o cliente que receberá o recado.");
      return;
    }

    if (!mensagemRecado.trim()) {
      alert("Escreva o recado antes de publicar.");
      return;
    }

    setPublicandoRecado(true);

    try {
      const { error } = await supabase
        .from("client_messages")
        .insert({
          client_id:
            destinoRecado === "todos" ? null : clienteId,
          titulo:
            tituloRecado.trim() ||
            "Você tem um recado da Ádria",
          mensagem: mensagemRecado.trim(),
          tipo_destino: destinoRecado,
          publicado: true,
          lido: false,
        });

      if (error) {
  console.error("ERRO AO PUBLICAR RECADO:", error);
  console.error("MENSAGEM:", error.message);
  console.error("CÓDIGO:", error.code);
  console.error("DETALHES:", error.details);
  console.error("HINT:", error.hint);

  alert(
    `Erro ao publicar o recado.\n\n${error.message || "Erro desconhecido"}`
  );

  return;
}

      alert("Recado publicado no aplicativo.");

      setTituloRecado("Você tem um recado da Ádria");
      setMensagemRecado("");

      await carregarDados();
    } finally {
      setPublicandoRecado(false);
    }
  }

  const clientesFiltrados = clientes.filter((cliente) => {
    const busca = buscaCliente.toLowerCase();

    return (
      cliente.nome.toLowerCase().includes(busca) ||
      cliente.email.toLowerCase().includes(busca)
    );
  });

  const clienteSelecionado = clientes.find(
    (cliente) => cliente.id === clienteId
  );

  const cursoSelecionado = cursos.find(
    (curso) => curso.id === cursoId
  );

  if (loading) {
    return (
      <div
        style={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#E7C96F",
          fontSize: "18px",
        }}
      >
        Carregando...
      </div>
    );
    
  }

  return (
    <main
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        paddingBottom: "60px",
      }}
    >
      {/* CABEÇALHO */}
      <header style={{ marginBottom: "32px" }}>
        <div
          style={{
            color: "#E7C96F",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "3px",
            textTransform: "uppercase",
            marginBottom: "10px",
          }}
        >
          Conteúdo
        </div>

        <h1
          style={{
            margin: 0,
            fontSize: "36px",
            color: "#fff",
            fontWeight: 700,
          }}
        >
          🎁 Liberação de Cursos
        </h1>

        <p
          style={{
            marginTop: "10px",
            color: "rgba(255,255,255,.65)",
            fontSize: "15px",
          }}
        >
          Gerencie cursos liberados e deixe recados especiais
          diretamente no aplicativo.
        </p>
      </header>

      {/* =========================
          LIBERAÇÃO DE CURSO
      ========================= */}

      <section
        style={{
          background: "#1B1029",
          border: "1px solid rgba(231,201,111,.16)",
          borderRadius: "22px",
          padding: "26px",
          marginBottom: "24px",
        }}
      >
        <h2
          style={{
            margin: "0 0 22px",
            color: "#E7C96F",
            fontSize: "22px",
          }}
        >
          🎓 Liberar um curso
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "24px",
          }}
        >
          {/* CLIENTE */}
          <div>
            <label style={labelStyle}>
              Cliente
            </label>

            <input
              type="text"
              value={buscaCliente}
              onChange={(e) => setBuscaCliente(e.target.value)}
              placeholder="Buscar cliente..."
              style={inputStyle}
            />

            <select
              value={clienteId}
              onChange={(e) => setClienteId(e.target.value)}
              style={inputStyle}
            >
              <option value="">Selecione o cliente</option>

              {clientesFiltrados.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nome} — {cliente.email}
                </option>
              ))}
            </select>

            {clienteSelecionado && (
              <div style={selectedStyle}>
                <strong>{clienteSelecionado.nome}</strong>
                <span>{clienteSelecionado.email}</span>
                <small>
                  Plano: {clienteSelecionado.plano || "Não informado"}
                </small>
              </div>
            )}
          </div>

          {/* CURSO */}
          <div>
            <label style={labelStyle}>
              Curso
            </label>

            <select
              value={cursoId}
              onChange={(e) => setCursoId(e.target.value)}
              style={inputStyle}
            >
              <option value="">Selecione o curso</option>

              {cursos.map((curso) => (
                <option key={curso.id} value={curso.id}>
                  {curso.titulo}
                </option>
              ))}
            </select>

            {cursoSelecionado && (
              <div style={selectedStyle}>
                <strong>{cursoSelecionado.titulo}</strong>

                {cursoSelecionado.descricao && (
                  <span>{cursoSelecionado.descricao}</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* TIPO E VALIDADE */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "24px",
            marginTop: "24px",
          }}
        >
          <div>
            <label style={labelStyle}>
              Tipo de acesso
            </label>

            <select
              value={tipoAcesso}
              onChange={(e) => setTipoAcesso(e.target.value)}
              style={inputStyle}
            >
              <option value="cortesia">Cortesia</option>
              <option value="oferta">Oferta</option>
              <option value="plano">Benefício de Plano</option>
              <option value="permanente">Permanente</option>
              <option value="manual">Manual</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>
              Validade
            </label>

            <select
              value={validade}
              onChange={(e) => setValidade(e.target.value)}
              style={inputStyle}
            >
              <option value="permanente">Permanente</option>
              <option value="7dias">7 dias</option>
              <option value="30dias">30 dias</option>
            </select>
          </div>
        </div>

        <button
          onClick={liberarCurso}
          disabled={salvandoCurso}
          style={primaryButton}
        >
          {salvandoCurso
            ? "LIBERANDO..."
            : "🎁 LIBERAR CURSO"}
        </button>
      </section>

      {/* =========================
          RECADO
      ========================= */}

      <section
        style={{
          background:
            "linear-gradient(145deg, #211431, #160C22)",
          border: "1px solid rgba(231,201,111,.22)",
          borderRadius: "22px",
          padding: "26px",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "8px",
          }}
        >
          <span
            style={{
              fontSize: "28px",
            }}
          >
            ✦
          </span>

          <h2
            style={{
              margin: 0,
              color: "#E7C96F",
              fontSize: "22px",
            }}
          >
            Recado da Ádria
          </h2>
        </div>

        <p
          style={{
            margin: "0 0 24px",
            color: "rgba(255,255,255,.62)",
            fontSize: "14px",
          }}
        >
          O recado aparece dentro do aplicativo como:
          <strong style={{ color: "#fff" }}>
            {" "}“Você tem um recado da Ádria”
          </strong>
          .
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "24px",
          }}
        >
          <div>
            <label style={labelStyle}>
              Destinatário
            </label>

            <select
              value={destinoRecado}
              onChange={(e) => setDestinoRecado(e.target.value)}
              style={inputStyle}
            >
              <option value="cliente">
                Cliente específico
              </option>

              <option value="todos">
                Todos os clientes ativos
              </option>
            </select>

            {destinoRecado === "cliente" && (
              <>
                <input
                  type="text"
                  value={buscaCliente}
                  onChange={(e) =>
                    setBuscaCliente(e.target.value)
                  }
                  placeholder="Buscar cliente..."
                  style={{
                    ...inputStyle,
                    marginTop: "12px",
                  }}
                />

                <select
                  value={clienteId}
                  onChange={(e) =>
                    setClienteId(e.target.value)
                  }
                  style={{
                    ...inputStyle,
                    marginTop: "12px",
                  }}
                >
                  <option value="">
                    Selecione o cliente
                  </option>

                  {clientesFiltrados.map((cliente) => (
                    <option
                      key={cliente.id}
                      value={cliente.id}
                    >
                      {cliente.nome}
                    </option>
                  ))}
                </select>
              </>
            )}
          </div>

          <div>
            <label style={labelStyle}>
              Título
            </label>

            <input
              value={tituloRecado}
              onChange={(e) =>
                setTituloRecado(e.target.value)
              }
              style={inputStyle}
            />
          </div>
        </div>

        <div style={{ marginTop: "22px" }}>
          <label style={labelStyle}>
            Mensagem
          </label>

          <textarea
            value={mensagemRecado}
            onChange={(e) =>
              setMensagemRecado(e.target.value)
            }
            placeholder="Escreva aqui o seu recado..."
            rows={6}
            style={{
              ...inputStyle,
              resize: "vertical",
              lineHeight: 1.6,
            }}
          />
        </div>

        <button
          onClick={publicarRecado}
          disabled={publicandoRecado}
          style={secondaryButton}
        >
          {publicandoRecado
            ? "PUBLICANDO..."
            : "✦ PUBLICAR RECADO NO APLICATIVO"}
        </button>
      </section>

      {/* =========================
          HISTÓRICO DE CURSOS
      ========================= */}

      <section style={historySection}>
        <h2 style={historyTitle}>
          Histórico de liberações
        </h2>

        {liberacoes.length === 0 ? (
          <Empty text="Nenhuma liberação registrada ainda." />
        ) : (
          liberacoes.map((item) => (
            <div key={item.id} style={historyItem}>
              <div>
                <strong>
                  {item.cliente?.nome || "Cliente"}
                </strong>

                <span>
                  {item.curso?.titulo || "Curso"}
                </span>
              </div>

              <div style={historyMeta}>
                <span>{item.tipo_acesso}</span>

                <span>
                  {item.data_fim
                    ? `Até ${new Date(
                        item.data_fim
                      ).toLocaleDateString("pt-BR")}`
                    : "Permanente"}
                </span>
              </div>
            </div>
          ))
        )}
      </section>

      {/* =========================
          HISTÓRICO DE RECADOS
      ========================= */}

      <section style={historySection}>
        <h2 style={historyTitle}>
          ✦ Histórico de Recados
        </h2>

        {recados.length === 0 ? (
          <Empty text="Nenhum recado publicado ainda." />
        ) : (
          recados.map((recado) => (
            <div key={recado.id} style={historyItem}>
              <div>
                <strong>
                  {recado.tipo_destino === "todos"
                    ? "Todos os clientes ativos"
                    : recado.cliente?.nome || "Cliente"}
                </strong>

                <span>
                  {recado.titulo}
                </span>

                <small
                  style={{
                    display: "block",
                    marginTop: "6px",
                    color: "rgba(255,255,255,.5)",
                  }}
                >
                  {recado.mensagem}
                </small>
              </div>

              <div style={historyMeta}>
                <span>
                  {new Date(
                    recado.created_at
                  ).toLocaleDateString("pt-BR")}
                </span>

                <span
                  style={{
                    color: recado.lido
                      ? "#8BD5A4"
                      : "#E7C96F",
                  }}
                >
                  {recado.tipo_destino === "todos"
                    ? "Publicado"
                    : recado.lido
                    ? "Lido"
                    : "Não lido"}
                </span>
              </div>
            </div>
          ))
        )}
      </section>

      <style jsx>{`
        @media (max-width: 800px) {
          section > div[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  fontSize: "13px",
  color: "rgba(255,255,255,.7)",
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box" as const,
  padding: "13px 14px",
  borderRadius: "12px",
  border: "1px solid rgba(255,255,255,.12)",
  background: "#120018",
  color: "#fff",
  outline: "none",
};

const selectedStyle = {
  marginTop: "14px",
  padding: "14px",
  borderRadius: "14px",
  background: "rgba(231,201,111,.07)",
  border: "1px solid rgba(231,201,111,.15)",
  display: "grid",
  gap: "5px",
  color: "#fff",
};

const primaryButton = {
  width: "100%",
  marginTop: "24px",
  padding: "15px",
  border: "none",
  borderRadius: "14px",
  background: "linear-gradient(90deg,#E7C96F,#CFAE45)",
  color: "#18091f",
  fontWeight: 800,
  fontSize: "15px",
  cursor: "pointer",
};

const secondaryButton = {
  width: "100%",
  marginTop: "22px",
  padding: "15px",
  border: "1px solid rgba(231,201,111,.35)",
  borderRadius: "14px",
  background: "rgba(231,201,111,.1)",
  color: "#E7C96F",
  fontWeight: 800,
  fontSize: "15px",
  cursor: "pointer",
};

const historySection = {
  background: "#1B1029",
  border: "1px solid rgba(231,201,111,.16)",
  borderRadius: "22px",
  padding: "26px",
  marginBottom: "24px",
};

const historyTitle = {
  margin: "0 0 18px",
  color: "#E7C96F",
  fontSize: "20px",
};

const historyItem = {
  display: "flex",
  justifyContent: "space-between",
  gap: "20px",
  padding: "16px",
  marginBottom: "10px",
  borderRadius: "14px",
  background: "#120018",
  border: "1px solid rgba(255,255,255,.07)",
};

const historyMeta = {
  display: "flex",
  flexDirection: "column" as const,
  alignItems: "flex-end",
  gap: "6px",
  fontSize: "12px",
  color: "rgba(255,255,255,.55)",
};

function Empty({ text }: { text: string }) {
  return (
    <p
      style={{
        color: "rgba(255,255,255,.5)",
        margin: 0,
      }}
    >
      {text}
    </p>
  );
}