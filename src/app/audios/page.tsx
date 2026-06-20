"use client";

export default function AudiosPage() {
  const anos = {
    2026: {
      esquerda: [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
      ],
      direita: [
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro",
      ],
    },
  };

  const estiloCard = {
    display: "block",
    background: "linear-gradient(180deg, #2b0a3d 0%, #1a0026 100%)",
    borderRadius: "24px",
    padding: "22px",
    marginBottom: "18px",
    textDecoration: "none",
    color: "#fff",
    border: "1px solid rgba(231,201,111,.25)",
    boxShadow: "0 0 20px rgba(231,201,111,.08)",
    transition: "all .3s ease",
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #2b0a3d 0%, #120018 42%, #07000d 100%)",
        padding: "40px 24px 80px",
        color: "#fff",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <a
          href="/"
          style={{
            color: "#E7C96F",
            textDecoration: "none",
            display: "inline-block",
            marginBottom: "34px",
            fontWeight: "bold",
          }}
        >
          ← Voltar para a Vitrine
        </a>

        <section
          style={{
            background:
              "linear-gradient(135deg, rgba(71,20,92,.82), rgba(22,4,38,.92))",
            border: "1px solid rgba(231,201,111,.28)",
            borderRadius: "32px",
            padding: "38px",
            boxShadow: "0 0 35px rgba(231,201,111,.08)",
            marginBottom: "38px",
          }}
        >
          <p
            style={{
              color: "#E7C96F",
              letterSpacing: "0.22em",
              fontSize: "12px",
              fontWeight: "bold",
              margin: "0 0 12px",
            }}
          >
            BIBLIOTECA SONORA
          </p>

          <h1
            style={{
              fontSize: "clamp(36px, 6vw, 58px)",
              color: "#fff",
              margin: "0 0 16px",
              fontFamily: "Georgia, serif",
            }}
          >
            🎧 Áudios do Mês
          </h1>

          <p
            style={{
              color: "rgba(255,255,255,.76)",
              maxWidth: "780px",
              lineHeight: "1.8",
              fontSize: "17px",
              margin: 0,
            }}
          >
            Meditações, ativações, direcionamentos espirituais, prosperidade,
            amor, proteção e desenvolvimento pessoal organizados por ano e mês
            para acompanhar sua jornada.
          </p>
        </section>

        {Object.entries(anos).map(([ano, dados]) => (
          <section
            key={ano}
            style={{
              background: "rgba(22,4,38,.72)",
              border: "1px solid rgba(231,201,111,.18)",
              borderRadius: "30px",
              padding: "30px",
              marginBottom: "30px",
            }}
          >
            <details open={ano === "2026"}>
              <summary
                style={{
                  cursor: "pointer",
                  color: "#E7C96F",
                  fontSize: "30px",
                  fontWeight: "bold",
                  fontFamily: "Georgia, serif",
                  marginBottom: "26px",
                }}
              >
                {ano}
              </summary>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  gap: "24px",
                  marginTop: "26px",
                }}
              >
                <div>
                  {dados.esquerda.map((mes) => (
                    <a
                      key={mes}
                      href="#"
                      style={estiloCard}
                    >
                      <div
                        style={{
                          fontSize: "17px",
                          fontWeight: "bold",
                        }}
                      >
                        🎧 {mes}
                      </div>

                      <div
                        style={{
                          marginTop: "10px",
                          color: "#E7C96F",
                          fontSize: "13px",
                          fontWeight: "bold",
                          letterSpacing: "0.04em",
                        }}
                      >
                        ACESSAR ÁUDIO →
                      </div>
                    </a>
                  ))}
                </div>

                <div>
                  {dados.direita.map((mes) => (
                    <a
                      key={mes}
                      href="#"
                      style={estiloCard}
                    >
                      <div
                        style={{
                          fontSize: "17px",
                          fontWeight: "bold",
                        }}
                      >
                        🎧 {mes}
                      </div>

                      <div
                        style={{
                          marginTop: "10px",
                          color: "#E7C96F",
                          fontSize: "13px",
                          fontWeight: "bold",
                          letterSpacing: "0.04em",
                        }}
                      >
                        ACESSAR ÁUDIO →
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </details>
          </section>
        ))}
      </div>
    </main>
  );
}