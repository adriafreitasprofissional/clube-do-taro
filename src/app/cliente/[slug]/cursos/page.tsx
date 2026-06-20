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
      .order("created_at", { ascending: false });

    if (data) {
      setCursos(data);
    }

    setLoading(false);
  }

  return (
    <div
      style={{
        padding: "30px",
        maxWidth: "1200px",
        margin: "0 auto",
        color: "#fff",
      }}
    >
      <h1
        style={{
          fontSize: "36px",
          marginBottom: "10px",
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
          marginBottom: "40px",
        }}
      >
        Cursos exclusivos, desenvolvimento espiritual,
        Umbanda, Tarot, Baralho Cigano e conhecimento
        ancestral.
      </p>

      {loading ? (
        <p>Carregando cursos...</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill,minmax(350px,1fr))",
            gap: "18px",
          }}
        >
          {cursos.map((curso) => (
            <div
              key={curso.id}
              style={{
                background: "#1a1a2e",
                borderRadius: "20px",
                overflow: "hidden",
                border:
                  "1px solid rgba(244,212,106,.15)",
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
                  }}
                />
              )}

              <div
                style={{
                  padding: "20px",
                }}
              >
                <h2
                  style={{
                    color: "#f4d46a",
                    marginBottom: "10px",
                  }}
                >
                  {curso.titulo}
                </h2>
                <p
                  style={{
                    opacity: 0.8,
                    marginBottom: "20px",
                  }}
                >
                  {curso.descricao}
                </p>

                {curso.valor_publico && (
                  <p>
                    💰 Valor Público: R${" "}
                    {Number(
                      curso.valor_publico
                    ).toFixed(2)}
                  </p>
                )}


                {curso.valor_assinante && (
                  <p
                    style={{
                      color: "#22c55e",
                      fontWeight: "bold",
                      marginBottom: "20px",
                    }}
                  >
                    ⭐ Assinante: R${" "}
                    {Number(
                      curso.valor_assinante
                    ).toFixed(2)}
                  </p>
                )}

    
    <a

    href={curso.link_assinante}
    target="_blank"

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

  <a
    href={curso.link_publico}
    target="_blank"

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
</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}