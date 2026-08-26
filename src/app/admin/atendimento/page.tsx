"use client";

import { div } from "framer-motion/client";
import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";

type Pergunta = {
  id: string;
  nome_cliente: string;
  plano: string;
  categoria: string;
  pergunta: string;
  status: string;
  created_at: string;
};

type Interacao = {
  id: string;
  client_id: string;
  source_type: string;
  source_id: string | null;
  interaction_type: "feedback" | "sugestao" | "duvida";
  message: string;
  admin_reply: string | null;
  replied_at: string | null;
  status: string;
  created_at: string;
  nome_cliente: string;
  plano: string;
  titulo_origem: string;
};
export default function AtendimentoPage() {

const [perguntas, setPerguntas] = useState<Pergunta[]>([]);
const [selecionada, setSelecionada] = useState<Pergunta | null>(null);

const [interacoes, setInteracoes] = useState<Interacao[]>([]);
const [interacaoSelecionada, setInteracaoSelecionada] =
  useState<Interacao | null>(null);
  const [mostrarReformulacao, setMostrarReformulacao] = useState(false);
const [mensagem, setMensagem] = useState("");
const [historico, setHistorico] = useState<any[]>([]);

const [aba, setAba] = useState<
  | "novas"
  | "aceitas"
  | "reformular"
  | "respondidas"
  | "feedback"
  | "sugestoes"
  | "duvidas"
>("novas");

useEffect(() => {
  carregarPerguntas();
  carregarInteracoes();
}, []);
 
  async function carregarPerguntas() {
    const response = await fetch("/api/admin/perguntas");
    const data = await response.json();

    setPerguntas(Array.isArray(data) ? data : []);
  }

  async function carregarInteracoes() {
    const response = await fetch("/api/admin/interacoes");
    const data = await response.json();

    setInteracoes(Array.isArray(data) ? data : []);
  }

const novas = useMemo(
  () =>
    perguntas.filter(
      (p) =>
        !p.status ||
        p.status === "Nova pergunta"
    ),
  [perguntas]
);

  const aceitas = useMemo(
  () =>
    perguntas.filter(
      (p) => p.status === "Aceita"
    ),
  [perguntas]
);

const reformular = useMemo(
  () =>
    perguntas.filter(
      (p) => p.status === "Aguardando resposta da assinante"
    ),
  [perguntas]
);

const respondidas = useMemo(
  () =>
    perguntas.filter(
      (p) => p.status === "Respondida em áudio"
    ),
  [perguntas]
);
const feedbacks = useMemo(
  () =>
    interacoes.filter(
      (item) => item.interaction_type === "feedback"
    ),
  [interacoes]
);

const sugestoes = useMemo(
  () =>
    interacoes.filter(
      (item) => item.interaction_type === "sugestao"
    ),
  [interacoes]
);

const duvidas = useMemo(
  () =>
    interacoes.filter(
      (item) => item.interaction_type === "duvida"
    ),
  [interacoes]
);

const abaInteracao =
  aba === "feedback" ||
  aba === "sugestoes" ||
  aba === "duvidas";

const listaInteracoes =
  aba === "feedback"
    ? feedbacks
    : aba === "sugestoes"
    ? sugestoes
    : aba === "duvidas"
    ? duvidas
    : [];
  
    const lista =
  aba === "novas"
    ? novas
    : aba === "aceitas"
    ? aceitas
    : aba === "reformular"
    ? reformular
    : aba === "respondidas"
    ? respondidas
    : [];

async function excluirPergunta() {
  if (!selecionada) return;

  if (!confirm("Excluir esta pergunta?")) return;

  const response = await fetch(
    `/api/admin/perguntas?id=${selecionada.id}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    alert("Erro ao excluir.");
    return;
  }

  setSelecionada(null);
  carregarPerguntas();
}
async function enviarReformulacao() {
  if (!selecionada || !mensagem.trim()) return;

  // Salva a mensagem
  const r1 = await fetch("/api/admin/exclusive-messages/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      question_id: selecionada.id,
      autor: "admin",
      mensagem,
    }),
  });

  if (!r1.ok) {
    alert("Erro ao salvar a mensagem.");
    return;
  }

  // Atualiza o status da pergunta
  const r2 = await fetch("/api/admin/perguntas/status", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: selecionada.id,
      status: "Aguardando resposta da assinante",
    }),
  });

  if (!r2.ok) {
    alert("Erro ao atualizar o status.");
    return;
  }

  setMensagem("");
  setMostrarReformulacao(false);
  setSelecionada(null);

  carregarPerguntas();
}

async function carregarHistorico(questionId: string) {
  const response = await fetch(
    `/api/admin/exclusive-messages?questionId=${questionId}`
  );

  const data = await response.json();

  setHistorico(Array.isArray(data) ? data : []);
}

  return (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "360px 1fr",
      gap: 8
      ,
      padding: 30,
    }}
  >

<aside
        style={{
          background: "#240032",
          borderRadius: 20,
          padding: 20,
          border: "1px solid rgba(231,201,111,.20)",
        }}
      >
        <h2
          style={{
            color: "#E7C96F",
            marginBottom: 20,
          }}
        >
          🌹 Central da Cigana Estella
        </h2>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            marginBottom: 20,
          }}
        >
          <button
  onClick={() => setAba("novas")}
  style={botaoAba(
    aba === "novas",
    "#c62828"
  )}
>
  🔴 Novas ({novas.length})
</button>

         <button
  onClick={() => setAba("aceitas")}
  style={botaoAba(
    aba === "aceitas",
    "#2e7d32"
  )}
>
  🟢 Perguntas Aceitas ({aceitas.length})
</button>

          <button
  onClick={() => setAba("reformular")}
  style={botaoAba(
    aba === "reformular",
    "#f4b400"
  )}
>
  🟡 Reformular ({reformular.length})
</button>

          <button
  onClick={() => setAba("respondidas")}
  style={botaoAba(
    aba === "respondidas",
    "#2e7d32"
  )}
>
  🎧 Respondidas ({respondidas.length})
</button>

<div
  style={{
    marginTop: 10,
    paddingTop: 14,
    borderTop: "1px solid rgba(231,201,111,.15)",
  }}
>
  <div
    style={{
      color: "#E7C96F",
      fontSize: 13,
      fontWeight: 700,
      marginBottom: 10,
    }}
  >
    💬 Interações
  </div>

  <button
    onClick={() => {
      setAba("feedback");
      setSelecionada(null);
      setInteracaoSelecionada(null);
    }}
    style={botaoAba(
      aba === "feedback",
      "#7c3aed"
    )}
  >
    💜 Feedback ({feedbacks.length})
  </button>

  <div style={{ height: 8 }} />

  <button
    onClick={() => {
      setAba("sugestoes");
      setSelecionada(null);
      setInteracaoSelecionada(null);
    }}
    style={botaoAba(
      aba === "sugestoes",
      "#8b5cf6"
    )}
  >
    ✨ Sugestões ({sugestoes.length})
  </button>

  <div style={{ height: 8 }} />

  <button
    onClick={() => {
      setAba("duvidas");
      setSelecionada(null);
      setInteracaoSelecionada(null);
    }}
    style={botaoAba(
      aba === "duvidas",
      "#5b21b6"
    )}
  >
    ❓ Dúvidas ({duvidas.length})
  </button>
</div>
        </div>

        <div
          style={{
            maxHeight: "650px",
            overflowY: "auto",
          }}
        >
          {abaInteracao
  ? listaInteracoes.map((item) => (
      <button
        key={item.id}
        onClick={() => {
          setInteracaoSelecionada(item);
          setSelecionada(null);
        }}
        style={{
          width: "100%",
          textAlign: "left",
          marginBottom: 10,
          padding: 14,
          borderRadius: 12,
          border:
            interacaoSelecionada?.id === item.id
              ? "1px solid #E7C96F"
              : "1px solid rgba(255,255,255,.08)",
          background:
            interacaoSelecionada?.id === item.id
              ? "rgba(231,201,111,.15)"
              : "#1a0026",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        <strong>{item.nome_cliente}</strong>

        <br />

        <small
          style={{
            color: "#E7C96F",
          }}
        >
          {item.plano || "Assinante"}
        </small>

        {item.titulo_origem && (
          <>
            <br />
            <small style={{ color: "#aaa" }}>
              {item.titulo_origem}
            </small>
          </>
        )}
      </button>
    ))
  : lista.map((pergunta) => (
      <button
        key={pergunta.id}

              onClick={() => {
  setSelecionada(pergunta);
  carregarHistorico(pergunta.id);
}}
              style={{
                width: "100%",
                textAlign: "left",
                marginBottom: 10,
                padding: 14,
                borderRadius: 12,
                border:
                  selecionada?.id === pergunta.id
                    ? "1px solid #E7C96F"
                    : "1px solid rgba(255,255,255,.08)",
                background:
                  selecionada?.id === pergunta.id
                    ? "rgba(231,201,111,.15)"
                    : "#1a0026",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              <strong>
                {pergunta.nome_cliente}
              </strong>

              <br />

              <small
                style={{
                  color: "#E7C96F",
                }}
              >
                {pergunta.plano}
              </small>
            </button>
         ))}

        </div>
      </aside>
            <section
        style={{
          background: "#240032",
          borderRadius: 20,
          padding: 30,
          border: "1px solid rgba(231,201,111,.20)",
        }}
      >
       {abaInteracao ? (
  !interacaoSelecionada ? (
    <div
      style={{
        color: "#bbb",
        textAlign: "center",
        marginTop: 120,
      }}
    >
      <h2 style={{ color: "#E7C96F" }}>
        💬 Interações das Assinantes
      </h2>

      <p>
        Selecione uma interação para visualizar.
      </p>
    </div>
  ) : (
    <>
      <h2 style={{ color: "#E7C96F" }}>
        {interacaoSelecionada.nome_cliente}
      </h2>

      <p style={{ color: "#aaa" }}>
        {interacaoSelecionada.plano || "Assinante"}
        {" • "}
        {interacaoSelecionada.source_type === "mentoria"
          ? "Mentoria"
          : interacaoSelecionada.source_type}
      </p>

      {interacaoSelecionada.titulo_origem && (
        <p
          style={{
            color: "#E7C96F",
            marginTop: 8,
          }}
        >
          {interacaoSelecionada.titulo_origem}
        </p>
      )}

      <div
        style={{
          marginTop: 25,
          padding: 20,
          borderRadius: 16,
          background: "#1a0026",
          color: "#fff",
          lineHeight: 1.7,
        }}
      >
        <div
          style={{
            color: "#E7C96F",
            fontWeight: 700,
            marginBottom: 10,
            textTransform: "capitalize",
          }}
        >
          {interacaoSelecionada.interaction_type}
        </div>

        {interacaoSelecionada.message}
      </div>

      <small
        style={{
          display: "block",
          marginTop: 12,
          color: "#888",
        }}
      >
        {new Date(
          interacaoSelecionada.created_at
        ).toLocaleString("pt-BR")}
      </small>
    </>
  )
) : !selecionada ? (
          <div
            style={{
              color: "#bbb",
              textAlign: "center",
              marginTop: 120,
            }}
          >
            <h2 style={{ color: "#E7C96F" }}>
              🌹 Central da Cigana Estella
            </h2>

            <p>
              Selecione uma pergunta para iniciar o atendimento.
            </p>
          </div>
        ) : (
          <>
            <h2 style={{ color: "#E7C96F" }}>
              {selecionada.nome_cliente}
            </h2>

            <p style={{ color: "#aaa" }}>
              {selecionada.plano} • {selecionada.categoria}
            </p>

            <div
              style={{
                marginTop: 25,
                padding: 20,
                borderRadius: 16,
                background: "#1a0026",
                color: "#fff",
                lineHeight: 1.7,
              }}
            >
              {selecionada.pergunta}
            </div>
<div
  style={{
    marginTop: 25,
    padding: 20,
    borderRadius: 16,
    background: "#1a0026",
    border: "1px solid rgba(231,201,111,.15)",
  }}
>
  <h3
    style={{
      color: "#E7C96F",
      marginBottom: 20,
    }}
  >
    📜 Histórico do Atendimento
  </h3>

  {historico.length === 0 ? (
    <p style={{ color: "#888" }}>
      Ainda não há histórico para esta pergunta.
    </p>
  ) : (
    historico.map((item) => (
      <div
        key={item.id}
        style={{
          borderLeft: "3px solid #E7C96F",
          paddingLeft: 15,
          marginBottom: 18,
        }}
      >
        <div
          style={{
            color: "#E7C96F",
            fontSize: 13,
            marginBottom: 5,
          }}
        >
          {item.autor.toUpperCase()}
        </div>

        <div
          style={{
            color: "#fff",
            whiteSpace: "pre-wrap",
          }}
        >
          {item.mensagem}
        </div>

        <small style={{ color: "#888" }}>
          {new Date(item.created_at).toLocaleString("pt-BR")}
        </small>
      </div>
    ))
  )}
</div>
          <div
  style={{
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    marginTop: 25,
  }}
>
  <button
    onClick={() => setMostrarReformulacao(true)}
    style={botaoAcao("#7c3aed")}
  >
    ✍️ Reformular Pergunta
  </button>

 <button
  onClick={async () => {
    if (!selecionada) return;

    // Salva no histórico
    await fetch("/api/admin/exclusive-messages/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question_id: selecionada.id,
        autor: "admin",
        mensagem: "🎧 Direcionamento liberado pela Cigana Estella.",
      }),
    });

    // Atualiza o status da pergunta
    const response = await fetch("/api/admin/perguntas/status", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: selecionada.id,
        status: "Respondida em áudio",
      }),
    });

    if (!response.ok) {
      alert("Erro ao liberar o direcionamento.");
      return;
    }

    await carregarHistorico(selecionada.id);
    await carregarPerguntas();
    setSelecionada(null);
  }}
  style={botaoAcao("#E7C96F", "#1A0921")}
>
  🎧 Liberar Direcionamento
</button>

 <button
  onClick={excluirPergunta}
  style={botaoAcao("#8b0000")}
>
  🗑 Excluir Teste
</button>

</div>

{mostrarReformulacao && (
  <div
    style={{
      marginTop: 25,
      padding: 20,
      borderRadius: 16,
      border: "1px solid rgba(231,201,111,.20)",
      background: "#1a0026",
    }}
  >
    <h3 style={{ color: "#E7C96F" }}>
      ✍️ Solicitar Reformulação
    </h3>

    <textarea
      value={mensagem}
      onChange={(e) => setMensagem(e.target.value)}
      placeholder="Escreva a mensagem para a assinante..."
      style={{
        width: "100%",
        minHeight: 140,
        marginTop: 15,
        padding: 15,
        borderRadius: 12,
        background: "#120018",
        border: "1px solid rgba(231,201,111,.20)",
        color: "#fff",
      }}
    />

    <div
      style={{
        display: "flex",
        gap: 10,
        marginTop: 15,
      }}
    >
      <button
  onClick={enviarReformulacao}
  style={botaoAcao("#7c3aed")}
>
  Enviar
</button>

      <button
        onClick={() => setMostrarReformulacao(false)}
        style={botaoAcao("#444")}
      >
        Cancelar
      </button>
    </div>
  </div>
)}

          </>
        )}
      </section>
    </div>
  );
}

function botaoAba(
  ativo: boolean,
  cor: string
): CSSProperties {
  return {
    width: "100%",
    padding: "14px 18px",
    borderRadius: "14px",
    border: ativo
      ? `1px solid ${cor}`
      : "1px solid rgba(231,201,111,.18)",
    background: ativo
      ? cor
      : "transparent",
    color: "#fff",
    textAlign: "left",
    cursor: "pointer",
    fontWeight: 600,
    transition: ".25s",
  };
}

function botaoAcao(
  background: string,
  color = "#fff"
): React.CSSProperties {
  return {
    padding: "14px 22px",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    background,
    color,
    fontWeight: 700,
    transition: ".2s",
  };
}