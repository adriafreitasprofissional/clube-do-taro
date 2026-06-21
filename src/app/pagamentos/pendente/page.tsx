export default function PagamentoPendentePage() {
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
          boxShadow: "0 0 35px rgba(231,201,111,.08)",
        }}
      >
        <p
          style={{
            color: "#E7C96F",
            letterSpacing: "0.15em",
            fontSize: "12px",
            fontWeight: "bold",
            margin: "0 0 12px",
          }}
        >
          PAGAMENTO EM PROCESSAMENTO
        </p>

        <h1
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "42px",
            margin: "0 0 18px",
          }}
        >
          Estamos aguardando a confirmação
        </h1>

        <p
          style={{
            color: "rgba(255,255,255,.78)",
            lineHeight: 1.7,
            margin: 0,
          }}
        >
          Se você pagou por Pix, a confirmação costuma ser rápida. Se pagou
          com cartão, aguarde a aprovação da operadora. Assim que o pagamento
          for confirmado, seu acesso será liberado.
        </p>

        <a
          href="/"
          style={{
            display: "inline-block",
            marginTop: "28px",
            padding: "14px 22px",
            borderRadius: "12px",
            background: "#E7C96F",
            color: "#1a0026",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          VOLTAR PARA A VITRINE
        </a>
      </section>
    </main>
  );
}