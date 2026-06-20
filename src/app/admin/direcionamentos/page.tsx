"use client";

import { useState } from "react";

type Mensagem = {
  id: string;
  nome_cliente: string;
  categoria: string;
  pergunta: string;
};

export default function DirecionamentosPage() {
  const [mensagens] = useState<Mensagem[]>([]);
  const [selecionada, setSelecionada] = useState<Mensagem | null>(null);

  return (
    <div style={{ padding: "30px", color: "#fff" }}>
      <h1>📩 Direcionamentos</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "350px 1fr",
          gap: "20px",
          marginTop: "24px",
        }}
      >
        <div>
          {mensagens.length === 0 ? (
            <p style={{ opacity: 0.7 }}>Nenhum direcionamento recebido ainda.</p>
          ) : (
            mensagens.map((msg) => (
              <button
                key={msg.id}
                onClick={() => setSelecionada(msg)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  marginBottom: "10px",
                  padding: "16px",
                  borderRadius: "12px",
                  border: "1px solid rgba(231,201,111,.25)",
                  background: "#1a0026",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                <strong>{msg.nome_cliente}</strong>
                <br />
                <span style={{ opacity: 0.75 }}>{msg.categoria}</span>
              </button>
            ))
          )}
        </div>

        <div
          style={{
            minHeight: "260px",
            padding: "24px",
            borderRadius: "16px",
            border: "1px solid rgba(231,201,111,.25)",
            background: "#1a0026",
          }}
        >
          {selecionada ? (
            <>
              <h2>{selecionada.nome_cliente}</h2>

              <p>
                <strong>Categoria:</strong> {selecionada.categoria}
              </p>

              <p>{selecionada.pergunta}</p>
            </>
          ) : (
            <p style={{ opacity: 0.7 }}>
              Selecione um direcionamento para visualizar.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}