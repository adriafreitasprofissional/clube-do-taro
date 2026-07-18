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

export default function AtendimentoPage() {
  const [perguntas, setPerguntas] = useState<Pergunta[]>([]);
  const [selecionada, setSelecionada] = useState<Pergunta | null>(null);

  const [mostrarReformulacao, setMostrarReformulacao] = useState(false);
const [mensagem, setMensagem] = useState("");
const [historico, setHistorico] = useState<any[]>([]);
  const [aba, setAba] = useState<
    "novas" | "aguardando" | "prontas" | "liberadas"
  >("novas");

  useEffect(() => {
    carregarPerguntas();
  }, []);

  async function carregarPerguntas() {
    const response = await fetch("/api/admin/perguntas");
    const data = await response.json();

    setPerguntas(Array.isArray(data) ? data : []);
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

  const aguardando = useMemo(
    () =>
      perguntas.filter(
        (p) =>
          p.status ===
          "Aguardando resposta da assinante"
      ),
    [perguntas]
  );

  const prontas = useMemo(
    () =>
      perguntas.filter(
        (p) =>
          p.status ===
          "Pronta para atendimento"
      ),
    [perguntas]
  );

  const liberadas = useMemo(
    () =>
      perguntas.filter(
        (p) =>
          p.status === "Liberado"
      ),
    [perguntas]
  );

  const lista =
    aba === "novas"
      ? novas
      : aba === "aguardando"
      ? aguardando
      : aba === "prontas"
      ? prontas
      : liberadas;

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
              "#d32f2f"
            )}
          >
            🔴 Novas ({novas.length})
          </button>

          <button
            onClick={() => setAba("aguardando")}
            style={botaoAba(
              aba === "aguardando",
              "#ff9800"
            )}
          >
            🟠 Aguardando Cliente ({aguardando.length})
          </button>

          <button
            onClick={() => setAba("prontas")}
            style={botaoAba(
              aba === "prontas",
              "#7b1fa2"
            )}
          >
            🟣 Prontas ({prontas.length})
          </button>

          <button
            onClick={() => setAba("liberadas")}
            style={botaoAba(
              aba === "liberadas",
              "#2e7d32"
            )}
          >
            🟢 Liberadas ({liberadas.length})
          </button>
        </div>

        <div
          style={{
            maxHeight: "650px",
            overflowY: "auto",
          }}
        >
          {lista.map((pergunta) => (
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
        {!selecionada ? (
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

  <button style={botaoAcao("#E7C96F", "#1A0921")}>
    🎙 Liberar Direcionamento
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