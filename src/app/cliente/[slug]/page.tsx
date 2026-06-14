
import { notFound } from "next/navigation";

const clientes: Record<
  string,
  {
    nome: string;
    plano: string;
  }
> = {
  gabi: {
    nome: "Gabi",
    plano: "Bronze",
  },

  nathali: {
    nome: "Nathali",
    plano: "Prata",
  },

  carolmorena: {
    nome: "Carol Morena",
    plano: "Ouro",
  },

  carolruiva: {
    nome: "Carol Ruiva",
    plano: "Diamante",
  },

  claudinho: {
    nome: "Claudinho",
    plano: "Bronze",
  },

  cris: {
    nome: "Cris",
    plano: "Diamante",
  },

  dani: {
    nome: "Dani",
    plano: "Bronze",
  },

  dorinha: {
    nome: "Dorinha",
    plano: "Diamante",
  },

  fefe: {
    nome: "Fefe",
    plano: "Bronze",
  },

  helena: {
    nome: "Helena",
    plano: "Diamante",
  },

  lilian: {
    nome: "Lilian",
    plano: "Diamante",
  },

  luana: {
    nome: "Luana",
    plano: "Bronze",
  },

  nena: {
    nome: "Nena",
    plano: "Bronze",
  },

  neide: {
    nome: "Neide",
    plano: "Ouro",
  },

  natalia: {
    nome: "Natalia",
    plano: "Bronze",
  },

  rejiane: {
    nome: "Rejiane",
    plano: "Bronze",
  },

  tamilly: {
    nome: "Tamilly",
    plano: "Ouro",
  },

  vivi: {
    nome: "Vivi",
    plano: "Diamante",
  },
};

export default async function ClientePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const cliente = clientes[slug];

  if (!cliente) {
    notFound();
  }

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
          Bem-vinda Guardiã {cliente.nome}
        </h1>

        <p
          style={{
            color: "#E7C96F",
            opacity: 0.7,
            marginBottom: "50px",
          }}
        >
          Plano {cliente.plano}
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
<div
  style={{
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    marginBottom: "30px",
  }}
>
  <a
    href="/admin"
    style={{
      background: "#f4d46a",
      color: "#000",
      padding: "12px 22px",
      borderRadius: "999px",
      textDecoration: "none",
      fontWeight: "bold",
    }}
  >
    ⚙️ Administração
  </a>

  <a
    href="https://mystic-lunar-flow.lovable.app/admin"
    target="_blank"
    style={{
      background: "#7d1bb5",
      color: "#fff",
      padding: "12px 22px",
      borderRadius: "999px",
      textDecoration: "none",
      fontWeight: "bold",
    }}
  >
    👑 Mentoria Diamante
  </a>
</div>
          <a
            
  href={`https://clube-do-taro-clientes.vercel.app/cliente/${slug}/index.html`}
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
  ✦ Julho 2026
</div>

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
  ✦ Agosto 2026
</div>

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
  ✦ Setembro 2026
</div>

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
  ✦ Outubro 2026
</div>

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
  ✦ Novembro 2026
</div>

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
  ✦ Dezembro 2026
</div>

<div
  style={{
    background: "rgba(0,0,0,0.2)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "20px",
    padding: "24px",
    color: "rgba(255,255,255,0.4)",
  }}
>
  ✦ Janeiro 2027
</div>
        </div>
      </div>
    </main>
  );
}