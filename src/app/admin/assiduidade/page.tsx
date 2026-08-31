import PainelAssiduidade from "../components/PainelAssiduidade";

export default function AssiduidadePage() {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: "1200px",
        paddingTop: "24px",
      }}
    >
      <p
        style={{
          margin: 0,
          color: "#E7C96F",
          fontSize: "13px",
          letterSpacing: "2px",
          textTransform: "uppercase",
        }}
      >
        Administração Clube do Tarô
      </p>

      <h1
        style={{
          marginTop: "14px",
          marginBottom: "14px",
          color: "#ffffff",
          fontSize: "38px",
        }}
      >
        Assiduidade
      </h1>

      <p
        style={{
          margin: 0,
          color: "rgba(255,255,255,0.68)",
          fontSize: "17px",
          lineHeight: 1.7,
          maxWidth: "760px",
        }}
      >
        Acompanhe o consumo dos Direcionamentos e identifique quem
        precisa de atenção.
      </p>

      <PainelAssiduidade />
    </div>
  );
}