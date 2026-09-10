import Link from "next/link";

type Negocio = {
  nome: string;
  descricao: string;
  icone: string;
  href?: string;
  status?: string;
  destaque?: boolean;
};

const negocios: Negocio[] = [
  {
    nome: "Terapia em Dia",
    descricao:
      "Pacientes, agenda, atendimentos, anamneses, atividades, quizzes, mini palestras e acompanhamento.",
    icone: "🌿",
    href: "/admin/terapia",
    status: "ATIVO",
    destaque: true,
  },
  {
    nome: "Clube do Tarô",
    descricao:
      "Assinantes, direcionamentos, atendimentos, mentorias, conteúdos e gestão do Clube.",
    icone: "🔮",
    href: "/admin/assinantes",
    status: "ATIVO",
  },
  {
    nome: "Cursos",
    descricao:
      "Alunos, cursos, liberações, conteúdos, mentorias e acompanhamento.",
    icone: "🎓",
    href: "/admin/gestao-cursos",
    status: "ATIVO",
  },
  {
    nome: "Biblioteca Ádria Freitas",
    descricao:
      "Livros, publicações, conteúdos digitais e materiais da autora.",
    icone: "📚",
    status: "EM ORGANIZAÇÃO",
  },
  {
    nome: "Lojas",
    descricao:
      "Loja Mística e Loja Artística: produtos, parceiros, grimórios, esculturas, artes e encomendas.",
    icone: "🛍️",
    status: "EM PREPARAÇÃO",
  },
];

export default function AdminPage() {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: "1280px",
        margin: "0 auto",
      }}
    >
      {/* CABEÇALHO */}
      <div
        style={{
          marginBottom: "38px",
        }}
      >
        <p
          style={{
            margin: 0,
            color: "#b7c28b",
            fontSize: "11px",
            fontWeight: 800,
            letterSpacing: "2.5px",
            textTransform: "uppercase",
          }}
        >
          Administração Geral
        </p>

        <h1
          style={{
            margin: "10px 0 8px",
            color: "#ffffff",
            fontSize: "clamp(32px, 5vw, 46px)",
            lineHeight: 1.1,
          }}
        >
          Central de Negócios
        </h1>

        <p
          style={{
            margin: 0,
            maxWidth: "720px",
            color: "rgba(255,255,255,.62)",
            fontSize: "16px",
            lineHeight: 1.7,
          }}
        >
          Escolha o ambiente que deseja administrar.
        </p>
      </div>

      {/* CARDS */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "18px",
        }}
      >
        {negocios.map((negocio) => {
          const card = (
            <div
              style={{
                height: "100%",
                minHeight: "215px",
                padding: "24px",
                borderRadius: "22px",
                border: negocio.destaque
                  ? "1px solid rgba(183,194,139,.46)"
                  : "1px solid rgba(183,194,139,.18)",
                background: negocio.destaque
                  ? "linear-gradient(145deg, rgba(89,105,56,.80), rgba(37,43,26,.97))"
                  : "linear-gradient(145deg, rgba(61,70,42,.42), rgba(27,31,20,.90))",
                boxShadow:
                  "0 18px 40px rgba(0,0,0,.18)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "15px",
                    background: "rgba(255,255,255,.07)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "24px",
                  }}
                >
                  {negocio.icone}
                </div>

                {negocio.status && (
                  <span
                    style={{
                      padding: "6px 9px",
                      borderRadius: "999px",
                      background: negocio.destaque
                        ? "#b8c68a"
                        : "rgba(255,255,255,.07)",
                      color: negocio.destaque
                        ? "#263019"
                        : "rgba(255,255,255,.58)",
                      fontSize: "9px",
                      fontWeight: 800,
                      letterSpacing: "1px",
                    }}
                  >
                    {negocio.status}
                  </span>
                )}
              </div>

              <h2
                style={{
                  margin: "22px 0 8px",
                  color: "#fff",
                  fontSize: "21px",
                }}
              >
                {negocio.nome}
              </h2>

              <p
                style={{
                  margin: 0,
                  color: "rgba(255,255,255,.60)",
                  fontSize: "14px",
                  lineHeight: 1.65,
                  flex: 1,
                }}
              >
                {negocio.descricao}
              </p>

              <div
                style={{
                  marginTop: "20px",
                  color: negocio.href
                    ? "#cbd69d"
                    : "rgba(255,255,255,.34)",
                  fontSize: "13px",
                  fontWeight: 700,
                }}
              >
                {negocio.href
                  ? "Entrar no ambiente →"
                  : "Em preparação"}
              </div>
            </div>
          );

          if (!negocio.href) {
            return (
              <div key={negocio.nome}>
                {card}
              </div>
            );
          }

          return (
            <Link
              key={negocio.nome}
              href={negocio.href}
              style={{
                textDecoration: "none",
              }}
            >
              {card}
            </Link>
          );
        })}
      </section>
    </div>
  );
}