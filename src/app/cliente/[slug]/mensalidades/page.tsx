"use client";

import { useMemo } from "react";

export default function MensalidadesPage() {
  const plano = "Diamante";
const tipoAssinatura = "mensal"; // mensal | anual
const valor = 97;
const statusAssinatura = "Ativo";
const membroDesde = "15/05/2026";
const vencimento = new Date("2026-06-20");

const dataFimAssinatura = new Date("2027-06-20");

  const diasRestantes = useMemo(() => {
    const hoje = new Date();

    const diff = Math.ceil(
      (vencimento.getTime() - hoje.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    return diff;
  }, []);

  const corStatus =
    diasRestantes < 0
      ? "#dc2626"
      : diasRestantes <= 2
      ? "#eab308"
      : "#16a34a";
const diasRestantesAnual = Math.ceil(
  (dataFimAssinatura.getTime() - new Date().getTime()) /
    (1000 * 60 * 60 * 24)
);
  const copiarPix = () => {
    navigator.clipboard.writeText(
      "contato@magiaoriente.com.br"
    );

    alert("PIX copiado!");
  };

  const abrirMercadoPago = () => {
    window.open(
      "https://link.mercadopago.com.br/SEULINK",
      "_blank"
    );
  };

  return (
    <div
      style={{
        padding: "30px",
        color: "#fff",
        maxWidth: "700px",
        margin: "0 auto",
      }}
    >
      <h1
        style={{
          fontSize: "28px",
          marginBottom: "30px",
        }}
      >
        💳 Minhas Mensalidades
      </h1>
<div
  style={{
    background: "#111827",
    border: "1px solid #374151",
    borderRadius: "16px",
    padding: "20px",
    marginBottom: "20px",
  }}
>
  <div
    style={{
      fontSize: "20px",
      fontWeight: "bold",
      marginBottom: "15px",
      color: "#facc15",
    }}
  >
    💎 Plano {plano}
  </div>

  <div
    style={{
      display: "grid",
      gap: "8px",
      fontSize: "15px",
    }}
  >
    <p>
      <strong>Tipo:</strong> Mensal
    </p>

    <p>
      <strong>Status:</strong>{" "}
      {statusAssinatura}
    </p>

    <p>
      <strong>Membro desde:</strong>{" "}
      {membroDesde}
    </p>

    <p>
      <strong>Valor:</strong>{" "}
      R$ {valor.toFixed(2)}
    </p>
  </div>
</div>

      <div
        style={{
          background: "#1a1a2e",
          border: "1px solid #333",
          borderRadius: "20px",
          padding: "30px",
        }}
      >
        {tipoAssinatura === "anual" ? (
  <>
    <h2
      style={{
        marginBottom: "15px",
      }}
    >
      👑 Plano {plano} Anual
    </h2>

    <p
      style={{
        opacity: 0.8,
      }}
    >
      Assinatura ativa até
    </p>

    <p
      style={{
        fontSize: "24px",
        fontWeight: "bold",
        marginTop: "10px",
      }}
    >
      {dataFimAssinatura.toLocaleDateString("pt-BR")}
    </p>

    <p
      style={{
        marginTop: "10px",
        color: "#facc15",
      }}
    >
      Faltam {diasRestantesAnual} dias
    </p>

    <button
      style={{
        width: "100%",
        padding: "16px",
        borderRadius: "12px",
        border: "none",
        background: "#16a34a",
        color: "#fff",
        marginTop: "25px",
        fontWeight: "bold",
      }}
    >
      ASSINATURA ATIVA
    </button>
  </>
) : (
  <>
  
        <h2
          style={{
            marginBottom: "10px",
          }}
        >
          Plano {plano}
        </h2>

        <p
          style={{
            fontSize: "32px",
            fontWeight: "bold",
            color: "#facc15",
          }}
        >
          R$ {valor.toFixed(2)}
        </p>

        <div
          style={{
            marginTop: "20px",
            marginBottom: "30px",
          }}
        >
          <p
            style={{
              opacity: 0.8,
            }}
          >
            Próximo vencimento
          </p>

          <p
            style={{
              fontSize: "18px",
              fontWeight: "bold",
            }}
          >
            {vencimento.toLocaleDateString("pt-BR")}
          </p>
        </div>

        <button
          style={{
            width: "100%",
            padding: "16px",
            border: "none",
            borderRadius: "12px",
            background: corStatus,
            color: "#fff",
            fontWeight: "bold",
            fontSize: "16px",
            marginBottom: "15px",
            cursor: "pointer",
          }}
        >
          PAGAR AGORA
        </button>

        <button
          onClick={copiarPix}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "12px",
            border: "none",
            marginBottom: "12px",
            background: "#2563eb",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          COPIAR PIX
        </button>

        <button
          onClick={abrirMercadoPago}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "12px",
            border: "none",
            marginBottom: "25px",
            background: "#06b6d4",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          PAGAR COM CARTÃO
        </button>

        <div
          style={{
            display: "grid",
            gap: "12px",
          }}
        >
          <button
            style={{
              padding: "14px",
              borderRadius: "12px",
              border: "1px solid #444",
              background: "#2d3748",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            📅 ALTERAR VENCIMENTO
          </button>

                    <button
            style={{
              padding: "14px",
              borderRadius: "12px",
              border: "1px solid #444",
              background: "#4c1d95",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            🌙 ME DÁ UM FÔLEGO?
          </button>
        </div>

      </>
    )}

      </div>
    </div>
  );
}