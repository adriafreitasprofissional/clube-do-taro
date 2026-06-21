"use client";

import { useState } from "react";

export default function TesteCheckoutPage() {
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  async function abrirCheckout() {
    setCarregando(true);
    setErro("");

    try {
      const resposta = await fetch(
        "/api/pagamentos/infinitepay/criar-link",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            produtoId: "pombogira_publico",
          }),
        }
      );

      const dados = await resposta.json();

      if (!resposta.ok || !dados.url) {
        throw new Error(dados.error || "Não foi possível abrir o checkout.");
      }

      window.location.href = dados.url;
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Ocorreu um erro ao abrir o checkout."
      );
      setCarregando(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "24px",
        background:
          "radial-gradient(circle at top, #2b0a3d 0%, #120018 42%, #07000d 100%)",
        color: "#fff",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: "650px",
          padding: "42px",
          borderRadius: "30px",
          border: "1px solid rgba(231,201,111,.28)",
          background: "rgba(22,4,38,.88)",
          textAlign: "center",
        }}
      >
        <p
          style={{
            color: "#E7C96F",
            letterSpacing: "0.15em",
            fontSize: "12px",
            fontWeight: "bold",
          }}
        >
          TESTE DE CHECKOUT
        </p>

        <h1
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "42px",
            margin: "14px 0",
          }}
        >
          Portal do Poder da Sua Pombogira
        </h1>

        <p style={{ color: "rgba(255,255,255,.78)", lineHeight: 1.7 }}>
          Valor de teste: R$ 47,00
        </p>

        <button
          type="button"
          onClick={abrirCheckout}
          disabled={carregando}
          style={{
            marginTop: "24px",
            padding: "15px 24px",
            border: "none",
            borderRadius: "12px",
            background: "#E7C96F",
            color: "#1a0026",
            fontWeight: "bold",
            cursor: carregando ? "wait" : "pointer",
          }}
        >
          {carregando ? "ABRINDO CHECKOUT..." : "TESTAR CHECKOUT"}
        </button>

        {erro && (
          <p style={{ marginTop: "18px", color: "#ff9ca8" }}>{erro}</p>
        )}
      </section>
    </main>
  );
}