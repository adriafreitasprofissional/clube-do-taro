export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#140B1D",
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <h1
        style={{
          color: "#D4AF37",
          fontSize: "48px",
          fontWeight: "bold",
        }}
      >
        CURSOS ÁDRIA FREITAS
      </h1>

      <p
        style={{
          fontSize: "22px",
          color: "#DDD",
        }}
      >
        Sua plataforma exclusiva de cursos.
      </p>

      <button
        style={{
          background: "#D4AF37",
          color: "#140B1D",
          border: "none",
          padding: "15px 35px",
          borderRadius: "12px",
          fontWeight: "bold",
          cursor: "pointer",
          fontSize: "18px",
        }}
      >
        Entrar
      </button>
    </main>
  );
}