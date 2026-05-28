export default function ClientePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#1A001A",
        color: "white",
        padding: "60px 24px",
        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        <p
          style={{
            color: "#E7C96F",
            letterSpacing: "4px",
            fontSize: "12px",
            textTransform: "uppercase",
          }}
        >
          Portal do Assinante
        </p>

        <h1
          style={{
            fontSize: "58px",
            marginTop: "20px",
            marginBottom: "10px",
          }}
        >
          Bem-vinda Guardiã Gabi
        </h1>

        <p
          style={{
            color: "#E7C96F",
            opacity: 0.7,
            marginBottom: "50px",
          }}
        >
          Plano Bronze
        </p>

        <div
          style={{
            background: "#240024",
            border: "1px solid rgba(231,201,111,0.15)",
            borderRadius: "32px",
            padding: "40px",
          }}
        >
          <h2
            style={{
              fontSize: "42px",
              marginBottom: "16px",
            }}
          >
            Meus Direcionamentos
          </h2>

          <p
            style={{
              color: "rgba(255,255,255,0.65)",
              marginBottom: "40px",
            }}
          >
            Seus conteúdos espirituais liberados mês a mês.
          </p>

          {/* MAIO */}
          <a
            href="https://clube-do-taro-clientes.vercel.app/cliente/gabi/index.html"
            target="_blank"
            style={{
              display: "block",
              background: "#140014",
              border: "1px solid rgba(231,201,111,0.25)",
              borderRadius: "20px",
              padding: "24px",
              color: "white",
              textDecoration: "none",
              marginBottom: "16px",
            }}
          >
            ✦ Maio 2026
          </a>

          {/* JUNHO */}
          <div
            style={{
              background: "rgba(0,0,0,0.2)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "20px",
              padding: "24px",
              color: "rgba(255,255,255,0.4)",
              marginBottom: "16px",
            }}
          >
            ✦ Junho 2026
          </div>

          {/* JULHO */}
          <div
            style={{
              background: "rgba(0,0,0,0.2)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "20px",
              padding: "24px",
              color: "rgba(255,255,255,0.4)",
            }}
          >
            ✦ Julho 2026
          </div>

        </div>
      </div>
    </main>
  );
}