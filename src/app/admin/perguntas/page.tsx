"use client";

import { useEffect, useMemo, useState } from "react";

type Pergunta = {
  id: string;
  nome_cliente: string | null;
  plano: string | null;
  categoria: string | null;
  pergunta: string | null;
  status: string | null;
  created_at: string;
};

export default function Page() {
  const [perguntas, setPerguntas] = useState<Pergunta[]>([]);
  const [selecionada, setSelecionada] = useState<Pergunta | null>(null);
  const [busca, setBusca] = useState("");
  const [aba, setAba] = useState<"pendentes" | "respondidas">("pendentes");
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarPerguntas();
  }, []);

  async function carregarPerguntas() {
    setCarregando(true);

    try {
      const response = await fetch("/api/admin/perguntas");
      const data = await response.json();

      setPerguntas(Array.isArray(data) ? data : []);
    } finally {
      setCarregando(false);
    }
  }

  async function marcarComoRespondida() {
    if (!selecionada) return;

    const response = await fetch("/api/admin/perguntas/responder", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: selecionada.id,
      }),
    });

    if (!response.ok) {
      alert("Não foi possível atualizar a pergunta.");
      return;
    }

    const perguntaAtualizada = {
      ...selecionada,
      status: "Respondida",
    };

    setPerguntas((lista) =>
      lista.map((item) =>
        item.id === selecionada.id ? perguntaAtualizada : item
      )
    );

    setSelecionada(null);
    setAba("pendentes");
  }

  const pendentes = useMemo(
    () =>
      perguntas.filter(
        (pergunta) =>
          String(pergunta.status || "").toLowerCase() !== "respondida"
      ),
    [perguntas]
  );

  const respondidas = useMemo(
    () =>
      perguntas.filter(
        (pergunta) =>
          String(pergunta.status || "").toLowerCase() === "respondida"
      ),
    [perguntas]
  );

  const listaDaAba = aba === "pendentes" ? pendentes : respondidas;

  const perguntasFiltradas = listaDaAba.filter((pergunta) => {
    const termo = busca.toLowerCase().trim();

    if (!termo) return true;

    return (
      String(pergunta.nome_cliente || "").toLowerCase().includes(termo) ||
      String(pergunta.plano || "").toLowerCase().includes(termo) ||
      String(pergunta.categoria || "").toLowerCase().includes(termo) ||
      String(pergunta.pergunta || "").toLowerCase().includes(termo)
    );
  });

  function trocarAba(novaAba: "pendentes" | "respondidas") {
    setAba(novaAba);
    setBusca("");
    setSelecionada(null);
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "350px minmax(0, 1fr)",
        gap: "20px",
        minHeight: "620px",
      }}
    >
      <aside
        style={{
          border: "1px solid rgba(231, 201, 111, 0.22)",
          borderRadius: "16px",
          padding: "16px",
          background: "rgba(31, 0, 42, 0.55)",
        }}
      >
        <p
          style={{
            margin: "0 0 14px",
            color: "#E7C96F",
            fontWeight: 700,
            fontSize: "16px",
          }}
        >
          📩 Perguntas dos Assinantes
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "8px",
            marginBottom: "14px",
          }}
        >
          <button
            type="button"
            onClick={() => trocarAba("pendentes")}
            style={{
              border: "1px solid #E7C96F",
              borderRadius: "10px",
              padding: "10px 8px",
              cursor: "pointer",
              background: aba === "pendentes" ? "#E7C96F" : "transparent",
              color: aba === "pendentes" ? "#1A0921" : "#ffffff",
              fontWeight: 700,
            }}
          >
            Novas ({pendentes.length})
          </button>

          <button
            type="button"
            onClick={() => trocarAba("respondidas")}
            style={{
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "10px",
              padding: "10px 8px",
              cursor: "pointer",
              background:
                aba === "respondidas"
                  ? "rgba(231, 201, 111, 0.18)"
                  : "transparent",
              color: "#ffffff",
              fontWeight: 700,
            }}
          >
            Respondidas ({respondidas.length})
          </button>
        </div>

        <input
          type="text"
          placeholder={
            aba === "pendentes"
              ? "Buscar nas perguntas novas..."
              : "Buscar nas respondidas..."
          }
          value={busca}
          onChange={(event) => setBusca(event.target.value)}
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "11px",
            marginBottom: "14px",
            borderRadius: "10px",
            border: "1px solid rgba(231, 201, 111, 0.22)",
            background: "#120018",
            color: "#ffffff",
          }}
        />

        <div
          style={{
            maxHeight: "510px",
            overflowY: "auto",
            paddingRight: "4px",
          }}
        >
          {carregando ? (
            <p style={{ color: "rgba(255,255,255,0.65)" }}>
              Carregando perguntas...
            </p>
          ) : perguntasFiltradas.length === 0 ? (
            <p
              style={{
                color: "rgba(255,255,255,0.65)",
                lineHeight: 1.5,
              }}
            >
              {aba === "pendentes"
                ? "Nenhuma pergunta nova no momento."
                : "Nenhuma pergunta respondida encontrada."}
            </p>
          ) : (
            perguntasFiltradas.map((pergunta) => {
              const ativa = selecionada?.id === pergunta.id;

              return (
                <button
                  type="button"
                  key={pergunta.id}
                  onClick={() => setSelecionada(pergunta)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "12px",
                    cursor: "pointer",
                    borderRadius: "10px",
                    marginBottom: "8px",
                    background: ativa
                      ? "rgba(231, 201, 111, 0.16)"
                      : "rgba(255,255,255,0.025)",
                    border: ativa
                      ? "1px solid #E7C96F"
                      : "1px solid rgba(255,255,255,0.08)",
                    color: "#ffffff",
                  }}
                >
                  <strong style={{ display: "block", marginBottom: "5px" }}>
                    {pergunta.nome_cliente || "Assinante"}
                  </strong>

                  <span
                    style={{
                      display: "block",
                      color: "#E7C96F",
                      fontSize: "12px",
                      marginBottom: "4px",
                    }}
                  >
                    {pergunta.plano || "Plano não informado"} ·{" "}
                    {pergunta.categoria || "Sem categoria"}
                  </span>

                  <span
                    style={{
                      color: "rgba(255,255,255,0.62)",
                      fontSize: "12px",
                    }}
                  >
                    {new Date(pergunta.created_at).toLocaleDateString("pt-BR")}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </aside>

      <section
        style={{
          border: "1px solid rgba(231, 201, 111, 0.22)",
          borderRadius: "16px",
          padding: "28px",
          background: "rgba(31, 0, 42, 0.38)",
        }}
      >
        {!selecionada ? (
          <div style={{ color: "rgba(255,255,255,0.68)" }}>
            <p
              style={{
                color: "#E7C96F",
                fontSize: "13px",
                letterSpacing: "1.5px",
                textTransform: "uppercase",
              }}
            >
              Caixa de entrada
            </p>

            <h2 style={{ color: "#ffffff", marginTop: "10px" }}>
              {aba === "pendentes"
                ? "Selecione uma pergunta nova"
                : "Selecione uma pergunta respondida"}
            </h2>

            <p>
              As perguntas respondidas ficam separadas para sua lista principal
              mostrar apenas o que ainda precisa de atenção.
            </p>
          </div>
        ) : (
          <>
            <p
              style={{
                margin: 0,
                color: "#E7C96F",
                fontSize: "13px",
                letterSpacing: "1.5px",
                textTransform: "uppercase",
              }}
            >
              Pergunta de {selecionada.nome_cliente || "assinante"}
            </p>

            <h2 style={{ color: "#ffffff", margin: "12px 0 22px" }}>
              {selecionada.categoria || "Pergunta exclusiva"}
            </h2>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                marginBottom: "24px",
              }}
            >
              <span
                style={{
                  padding: "7px 10px",
                  borderRadius: "999px",
                  background: "rgba(231, 201, 111, 0.14)",
                  color: "#E7C96F",
                  fontSize: "13px",
                }}
              >
                Plano: {selecionada.plano || "Não informado"}
              </span>

              <span
                style={{
                  padding: "7px 10px",
                  borderRadius: "999px",
                  background: "rgba(255,255,255,0.08)",
                  color: "#ffffff",
                  fontSize: "13px",
                }}
              >
                {selecionada.status || "Pendente"}
              </span>
            </div>

            <div
              style={{
                borderTop: "1px solid rgba(255,255,255,0.12)",
                paddingTop: "22px",
                color: "#ffffff",
                fontSize: "17px",
                lineHeight: 1.75,
                whiteSpace: "pre-wrap",
              }}
            >
              {selecionada.pergunta}
            </div>

            {String(selecionada.status || "").toLowerCase() !==
              "respondida" && (
              <button
                type="button"
                onClick={marcarComoRespondida}
                style={{
                  marginTop: "30px",
                  padding: "13px 18px",
                  borderRadius: "10px",
                  border: "none",
                  cursor: "pointer",
                  background: "#E7C96F",
                  color: "#1A0921",
                  fontWeight: 800,
                }}
              >
                ✓ Marcar como respondida
              </button>
            )}
          </>
        )}
      </section>
    </div>
  );
}