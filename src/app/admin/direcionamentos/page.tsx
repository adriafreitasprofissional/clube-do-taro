"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Mensagem = {
  id: string;
  nome_cliente: string;
  categoria: string;
  pergunta: string;
};

export default function DirecionamentosPage() {
 const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [selecionada, setSelecionada] = useState<Mensagem | null>(null);

const [texto, setTexto] = useState("");
const [enviando, setEnviando] = useState(false);

async function solicitarEsclarecimento() {
  if (!selecionada || !texto.trim()) return;

  setEnviando(true);

  // 1. Envia a mensagem para a assinante
  const response = await fetch(
    "/api/admin/exclusive-messages/send",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question_id: selecionada.id,
        autor: "admin",
        mensagem: texto,
      }),
    }
  );

  if (!response.ok) {
    alert("Erro ao enviar a mensagem.");
    setEnviando(false);
    return;
  }

  // 2. Atualiza o status da pergunta
  const { error } = await supabase
    .from("exclusive_questions")
    .update({
      status: "Aguardando resposta da assinante",
    })
    .eq("id", selecionada.id);

  if (error) {
    alert(error.message);
    setEnviando(false);
    return;
  }

  alert("Solicitação enviada com sucesso!");

  setTexto("");
  setEnviando(false);

  carregarMensagens();
}
  
async function carregarMensagens() {
  const res = await fetch(
    "/api/admin/direcionamentos-exclusivos"
  );

  const data = await res.json();

  setMensagens(data);
}
useEffect(() => {
  carregarMensagens();
}, []);


  return (
    <div style={{ padding: "30px", color: "#fff" }}>
      <h1>🔮 Direcionamentos Exclusivos</h1>

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

<hr
  style={{
    borderColor: "rgba(231,201,111,.15)",
    margin: "25px 0",
  }}
/>

<h3>❓ Solicitar esclarecimento</h3>

<textarea
  value={texto}
  onChange={(e) => setTexto(e.target.value)}
  placeholder="Escreva uma mensagem para a assinante..."
  style={{
    width: "100%",
    minHeight: "120px",
    marginTop: "12px",
    padding: "12px",
    borderRadius: "12px",
    background: "#12001b",
    color: "#fff",
    border: "1px solid rgba(231,201,111,.25)",
    resize: "vertical",
  }}
/>

<button
  onClick={solicitarEsclarecimento}
  disabled={enviando}
  style={{
    marginTop: "16px",
    background: "#f4d46a",
    color: "#000",
    border: "none",
    borderRadius: "12px",
    padding: "12px 20px",
    cursor: "pointer",
    fontWeight: "bold",
  }}
>
  ❓ Enviar solicitação
</button>


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