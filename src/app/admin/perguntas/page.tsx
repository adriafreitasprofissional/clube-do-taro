"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [perguntas, setPerguntas] = useState<any[]>([]);
  const [selecionada, setSelecionada] = useState<any>(null);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    carregarPerguntas();
  }, []);

  async function carregarPerguntas() {
    const response = await fetch(
      "/api/admin/perguntas"
    );

    const data = await response.json();

    setPerguntas(data);
  }

  async function marcarComoRespondida() {
    if (!selecionada) return;

    await fetch(
      "/api/admin/perguntas/responder",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          id: selecionada.id,
        }),
      }
    );

    await carregarPerguntas();

    setSelecionada({
      ...selecionada,
      status: "Respondida",
    });
  }

  const perguntasFiltradas = perguntas.filter(
    (pergunta) => {
      const termo = busca.toLowerCase();

      return (
        String(pergunta.nome_cliente || "")
          .toLowerCase()
          .includes(termo) ||
        String(pergunta.categoria || "")
          .toLowerCase()
          .includes(termo) ||
        String(pergunta.pergunta || "")
          .toLowerCase()
          .includes(termo)
      );
    }
  );

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "350px 1fr",
        gap: "20px",
      }}
    >
      <div
        style={{
          border: "1px solid #333",
          borderRadius: "12px",
          padding: "16px",
        }}
      >
        <h2>
          Perguntas ({perguntasFiltradas.length})
        </h2>

        <input
          type="text"
          placeholder="Buscar..."
          value={busca}
          onChange={(e) =>
            setBusca(e.target.value)
          }
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
            borderRadius: "8px",
            border: "1px solid #333",
            background: "#111",
            color: "#fff",
          }}
        />

        {perguntasFiltradas.map((pergunta) => (
          <div
            key={pergunta.id}
            onClick={() =>
              setSelecionada(pergunta)
            }
            style={{
              padding: "12px",
              cursor: "pointer",
              borderBottom:
                "1px solid #222",
              borderRadius: "8px",
              marginBottom: "8px",
              background:
                selecionada?.id ===
                pergunta.id
                  ? "#2a1d00"
                  : "transparent",
              border:
                selecionada?.id ===
                pergunta.id
                  ? "1px solid #f4d46a"
                  : "1px solid transparent",
            }}
          >
            <strong>
              {pergunta.nome_cliente}
            </strong>

            <br />

            {pergunta.categoria}

            <br />

            <small>
              {new Date(
                pergunta.created_at
              ).toLocaleDateString(
                "pt-BR"
              )}
            </small>

            <br />

            <small>
              Status: {pergunta.status}
            </small>
          </div>
        ))}
      </div>

      <div
        style={{
          border: "1px solid #333",
          borderRadius: "12px",
          padding: "16px",
        }}
      >
        {!selecionada ? (
          <p>
            Selecione uma pergunta.
          </p>
        ) : (
          <>
            <h2>
              {selecionada.nome_cliente}
            </h2>

            <p>
              <strong>
                Categoria:
              </strong>{" "}
              {selecionada.categoria}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {selecionada.status}
            </p>

            <hr />

            <p>
              {selecionada.pergunta}
            </p>

            {selecionada.status !==
              "Respondida" && (
              <button
                onClick={
                  marcarComoRespondida
                }
                style={{
                  marginTop: "20px",
                  padding:
                    "12px 18px",
                  borderRadius:
                    "8px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                ✓ Marcar como Respondida
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}