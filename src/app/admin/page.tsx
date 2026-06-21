export default function AdminPage() {
  return (
    <div
      style={{
        maxWidth: "760px",
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
        Bem-vinda ao seu painel
      </h1>

      <p
        style={{
          margin: 0,
          color: "rgba(255,255,255,0.68)",
          fontSize: "17px",
          lineHeight: 1.7,
        }}
      >
        Escolha uma opção no menu lateral para gerenciar assinantes,
        perguntas, recados, conteúdos e as atividades do Clube do Tarô.
      </p>
    </div>
  );
}