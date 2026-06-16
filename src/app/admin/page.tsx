export default function AdminPage() {
  return (
    <div>
      <h1
        style={{
          color: "#f4d46a",
          marginBottom: "30px",
        }}
      >
        🔮 Administração Clube do Tarô
      </h1>

      <p
        style={{
          color: "#fff",
          opacity: 0.8,
          marginBottom: "30px",
        }}
      >
        Painel administrativo do Clube do Tarô
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(250px,1fr))",
          gap: "20px",
        }}
      >

        <a
  href="/admin/recados"
  style={card}
>
  📢 Recados
  <br />
  Publicar novidades
</a>

<a
  href="/admin/mensalidades"
  style={card}
>
  💳 Mensalidades
  <br />
  Controle financeiro
</a>

<a
  href="/admin/indicacoes"
  style={card}
>
  🎁 Indicações
  <br />
  Cupons e descontos
</a>

<a
  href="/admin/sorteios"
  style={card}
>
  🍀 Sorteios
  <br />
  Número da sorte
  
</a>
        <a
          href="/admin/assinantes"
          style={card}
        >
          👥 Assinantes
          <br />
          Gerenciar clientes
        </a>

        <div style={card}>
          🔮 Direcionamentos
          <br />
          Em desenvolvimento
        </div>

        <div style={card}>
          🎁 Benefícios
          <br />
          Em desenvolvimento
        </div>

        <div style={card}>
          🌟 Convites
          <br />
          Em desenvolvimento
        </div>
      </div>
    </div>
  );
}

const card = {
  background: "#240032",
  padding: "30px",
  borderRadius: "20px",
  border: "1px solid rgba(244,212,106,.15)",
  color: "#fff",
  textDecoration: "none",
};