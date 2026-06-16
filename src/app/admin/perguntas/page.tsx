"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [perguntas, setPerguntas] = useState<any[]>([]);
  const [selecionada, setSelecionada] = useState<any>(null);

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
        <h2>Perguntas</h2>

        {perguntas.map((pergunta) => (
          <div
            key={pergunta.id}
            onClick={() => setSelecionada(pergunta)}
            style={{
              padding: "12px",
              cursor: "pointer",
              borderBottom: "1px solid #222",
            }}
          >
            <strong>
              {pergunta.nome_cliente}
            </strong>

            <br />

            {pergunta.categoria}
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
          <p>Selecione uma pergunta.</p>
        ) : (
          <>
            <h2>
              {selecionada.nome_cliente}
            </h2>

            <p>
              <strong>Categoria:</strong>{" "}
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
          </>
        )}
      </div>
    </div>
  );
}