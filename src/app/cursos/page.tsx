"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Course = {
  id: string;
  titulo: string;
  descricao: string;
  imagem_url: string;
  link_compra?: string;
  link_publico?: string;
  link_assinante?: string;
  valor_publico?: number;
  valor_assinante?: number;
};

export default function CursosPage() {
  const [cursos, setCursos] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarCursos();
  }, []);

  async function carregarCursos() {
    const { data } = await supabase
      .from("courses")
      .select("*")
      .eq("published", true)
      .order("ordem", { ascending: true });

    if (data) {
      setCursos(data);
    }

    setLoading(false);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0b0b0f",
        color: "#fff",
        padding: "48px 30px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
          textAlign: "left",
        }}
      >
        <h1
          style={{
            fontSize: "36px",
            margin: "0 0 10px",
            color: "#f4d46a",
          }}
        >
          🎓 Portal de Cursos Ádria Freitas
        </h1>

        <a
          href="/"
          style={{
            display: "inline-block",
            marginBottom: "25px",
            color: "#f4d46a",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          ← Voltar para a Vitrine
        </a>

        <p
          style={{
            opacity: 0.8,
            margin: "0 0 40px",
          }}
        >
          Cursos exclusivos, desenvolvimento espiritual, Umbanda, Tarô,
          Baralho Cigano e conhecimento ancestral.
        </p>

        {loading ? (
          <p>Carregando cursos...</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(280px, 320px))",
              gap: "24px",
              justifyContent: "start",
              alignItems: "start",
            }}
          >
            {cursos.map((curso) => (
              <article
                key={curso.id}
                style={{
                  background: "#1a1a2e",
                  borderRadius: "20px",
                  overflow: "hidden",
                  border: "1px solid rgba(244,212,106,.15)",
                }}
              >
                {curso.imagem_url && (
                  <img
                    src={curso.imagem_url}
                    alt={curso.titulo}
                    style={{
                      width: "100%",
                      height: "220px",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                )}

                <div style={{ padding: "20px" }}>
                  <h2
                    style={{
                      color: "#f4d46a",
                      margin: "0 0 10px",
                      fontSize: "18px",
                    }}
                  >
                    {curso.titulo}
                  </h2>

                  <p
                    style={{
                      opacity: 0.8,
                      margin: "0 0 20px",
                      lineHeight: 1.5,
                    }}
                  >
                    {curso.descricao}
                  </p>

                  {curso.valor_publico != null && (
                    <p style={{ margin: "0 0 10px" }}>
                      💰 Valor Público: R${" "}
                      {Number(curso.valor_publico).toFixed(2)}
                    </p>
                  )}

                  {curso.valor_assinante != null && (
                    <p
                      style={{
                        color: "#22c55e",
                        fontWeight: "bold",
                        margin: "0 0 20px",
                      }}
                    >
                      ⭐ Assinante: R${" "}
                      {Number(curso.valor_assinante).toFixed(2)}
                    </p>
                  )}

                  {curso.link_assinante ? (
                    <a
                      href={curso.link_assinante}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: "block",
                        textAlign: "center",
                        background: "#8b1e3f",
                        color: "#fff",
                        padding: "14px",
                        borderRadius: "12px",
                        textDecoration: "none",
                        fontWeight: "bold",
                        marginTop: "15px",
                      }}
                    >
                      💎 SOU ASSINANTE • R$ 27,20
                    </a>
                  ) : (
                    <div
                      style={{
                        textAlign: "center",
                        background: "rgba(139,30,63,.35)",
                        color: "#ddd",
                        padding: "14px",
                        borderRadius: "12px",
                        fontWeight: "bold",
                        marginTop: "15px",
                      }}
                    >
                      💎 OFERTA PARA ASSINANTES — EM BREVE
                    </div>
                  )}

                  {curso.link_publico ? (
                    <a
                      href={curso.link_publico}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: "block",
                        textAlign: "center",
                        background: "#f1dd23",
                        color: "#1a1a2e",
                        padding: "14px",
                        borderRadius: "12px",
                        textDecoration: "none",
                        fontWeight: "bold",
                        marginTop: "15px",
                      }}
                    >
                      🌍 NÃO SOU ASSINANTE • R$ 47,00
                    </a>
                  ) : (
                    <div
                      style={{
                        textAlign: "center",
                        background: "rgba(241,221,35,.28)",
                        color: "#f4d46a",
                        padding: "14px",
                        borderRadius: "12px",
                        fontWeight: "bold",
                        marginTop: "15px",
                      }}
                    >
                      🌍 INSCRIÇÕES EM BREVE
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}