import Link from "next/link";

type Modulo = {
  titulo: string;
  descricao: string;
  icone: string;
  href?: string;
  destaque?: string;
};

const modulos: Modulo[] = [
  {
    titulo: "Pacientes",
    descricao:
      "Cadastro, histórico, acesso ao portal e acompanhamento das pacientes.",
    icone: "👩‍🦳",
    destaque: "EM AJUSTE",
  },
  {
    titulo: "Agenda",
    descricao:
      "Consultas, horários, bloqueios, remarcações e próximos atendimentos.",
    icone: "📅",
    destaque: "EM AJUSTE",
  },
  {
    titulo: "Atendimentos",
    descricao:
      "Sessões realizadas, registros terapêuticos, evolução e relatórios.",
    icone: "🌿",
    destaque: "EM AJUSTE",
  },
  {
    titulo: "Anamneses",
    descricao:
      "Formulários, histórico das respostas e informações iniciais da paciente.",
    icone: "📝",
    href: "/admin/terapia/anamneses",
    destaque: "ATIVO",
  },
  {
    titulo: "Quiz e Atividades",
    descricao:
      "Crie atividades personalizadas a partir das anotações das sessões.",
    icone: "🧩",
    destaque: "NOVO",
  },
  {
    titulo: "Mini Palestras",
    descricao:
      "Biblioteca de vídeos educativos e conteúdos indicados após as sessões.",
    icone: "🎥",
    href: "/admin/terapia/palestras",
    destaque: "ATIVO",
  },
  {
    titulo: "Financeiro",
    descricao:
      "Pacotes, sessões, recebimentos, vencimentos e histórico financeiro.",
    icone: "💳",
    destaque: "EM AJUSTE",
  },
  {
    titulo: "Evolução",
    descricao:
      "Acompanhamento de segurança, confiança, conforto e percepção de mudança.",
    icone: "📈",
    destaque: "EM BREVE",
  },
];

export default function TerapiaAdminPage() {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: "1280px",
        margin: "0 auto",
      }}
    >
      {/* TOPO */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "20px",
          flexWrap: "wrap",
          marginBottom: "34px",
        }}
      >
        <div>
          <Link
            href="/admin"
            style={{
              display: "inline-block",
              marginBottom: "16px",
              color: "#cbd69d",
              textDecoration: "none",
              fontSize: "13px",
              fontWeight: 700,
            }}
          >
            ← Central de Negócios
          </Link>

          <p
            style={{
              margin: 0,
              color: "#b7c28b",
              fontSize: "11px",
              fontWeight: 800,
              letterSpacing: "2.3px",
              textTransform: "uppercase",
            }}
          >
            Você está em
          </p>

          <h1
            style={{
              margin: "9px 0 7px",
              color: "#fff",
              fontSize: "clamp(30px, 5vw, 44px)",
              lineHeight: 1.1,
            }}
          >
            Terapia em Dia
          </h1>

          <p
            style={{
              margin: 0,
              maxWidth: "680px",
              color: "rgba(255,255,255,.62)",
              fontSize: "15px",
              lineHeight: 1.7,
            }}
          >
            Gestão dos atendimentos terapêuticos,
            pacientes, atividades e acompanhamento
            do processo.
          </p>
        </div>

        <div
          style={{
            padding: "10px 14px",
            borderRadius: "999px",
            border: "1px solid rgba(183,194,139,.3)",
            background: "rgba(92,108,61,.18)",
            color: "#cbd6a2",
            fontSize: "12px",
            fontWeight: 700,
          }}
        >
          🌿 Ambiente Terapia
        </div>
      </div>

      {/* RESUMO */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "12px",
          marginBottom: "32px",
        }}
      >
        {[
          ["Pacientes ativas", "—"],
          ["Próximos atendimentos", "—"],
          ["Atividades pendentes", "—"],
          ["Respostas recebidas", "—"],
        ].map(([label, valor]) => (
          <div
            key={label}
            style={{
              padding: "18px",
              borderRadius: "17px",
              border:
                "1px solid rgba(183,194,139,.16)",
              background:
                "linear-gradient(145deg, rgba(69,79,46,.26), rgba(28,32,21,.6))",
            }}
          >
            <div
              style={{
                color: "rgba(255,255,255,.55)",
                fontSize: "12px",
                marginBottom: "8px",
              }}
            >
              {label}
            </div>

            <div
              style={{
                color: "#fff",
                fontSize: "25px",
                fontWeight: 800,
              }}
            >
              {valor}
            </div>
          </div>
        ))}
      </div>

      {/* MÓDULOS */}
      <div style={{ marginBottom: "15px" }}>
        <p
          style={{
            margin: 0,
            color: "#b7c28b",
            fontSize: "11px",
            fontWeight: 800,
            letterSpacing: "2px",
            textTransform: "uppercase",
          }}
        >
          Gestão terapêutica
        </p>

        <h2
          style={{
            color: "#fff",
            margin: "7px 0 0",
            fontSize: "22px",
          }}
        >
          Ferramentas do Terapia em Dia
        </h2>
      </div>

      <section
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "15px",
        }}
      >
        {modulos.map((modulo) => {
          const card = (
            <div
              style={{
                minHeight: "190px",
                height: "100%",
                borderRadius: "20px",
                padding: "21px",
                border:
                  "1px solid rgba(183,194,139,.18)",
                background:
                  modulo.titulo === "Quiz e Atividades"
                    ? "linear-gradient(145deg, rgba(89,105,56,.75), rgba(38,45,27,.96))"
                    : "linear-gradient(145deg, rgba(61,70,42,.4), rgba(27,31,20,.88))",
                boxShadow:
                  "0 15px 35px rgba(0,0,0,.16)",
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
                    width: "44px",
                    height: "44px",
                    borderRadius: "14px",
                    background:
                      "rgba(255,255,255,.07)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "22px",
                  }}
                >
                  {modulo.icone}
                </div>

                {modulo.destaque && (
                  <span
                    style={{
                      padding: "5px 8px",
                      borderRadius: "999px",
                      background:
                        modulo.destaque === "NOVO"
                          ? "#aebe79"
                          : "rgba(255,255,255,.07)",
                      color:
                        modulo.destaque === "NOVO"
                          ? "#243018"
                          : "rgba(255,255,255,.6)",
                      fontSize: "9px",
                      fontWeight: 800,
                      letterSpacing: "1px",
                    }}
                  >
                    {modulo.destaque}
                  </span>
                )}
              </div>

              <h3
                style={{
                  margin: "17px 0 7px",
                  color: "#fff",
                  fontSize: "18px",
                }}
              >
                {modulo.titulo}
              </h3>

              <p
                style={{
                  margin: 0,
                  color: "rgba(255,255,255,.58)",
                  fontSize: "13px",
                  lineHeight: 1.6,
                  flex: 1,
                }}
              >
                {modulo.descricao}
              </p>

              <div
                style={{
                  marginTop: "16px",
                  color: modulo.href
                    ? "#cbd69d"
                    : "rgba(255,255,255,.35)",
                  fontSize: "12px",
                  fontWeight: 700,
                }}
              >
                {modulo.href
                  ? "Abrir ferramenta →"
                  : "Configuração em andamento"}
              </div>
            </div>
          );

          if (!modulo.href) {
            return (
              <div key={modulo.titulo}>
                {card}
              </div>
            );
          }

          return (
            <Link
              key={modulo.titulo}
              href={modulo.href}
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