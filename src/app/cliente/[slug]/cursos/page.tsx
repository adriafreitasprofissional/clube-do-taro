"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export default function MeusCursosPage() {
  const { slug } = useParams();

  const cursos = [
    {
      titulo: "Portal do Poder da Sua Pombagira",
      descricao: "Desafio completo de 7 dias.",
      href: "/cursos/pombagira",
      emoji: "🌹",
    },
    {
      titulo: "Desafio 7 Dias — Energia",
      descricao: "Renovação energética.",
      href: "/cursos/energia",
      emoji: "✨",
    },
  ];

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0b0b0f",
        color: "#fff",
        padding: "40px",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        <Link
          href={`/cliente/${slug}`}
          style={{
            color: "#f4d46a",
            textDecoration: "none",
            fontWeight: 700,
          }}
        >
          ← Voltar ao Portal
        </Link>

        <h1
          style={{
            marginTop: 20,
            color: "#f4d46a",
            fontSize: 34,
          }}
        >
          📚 Meus Cursos
        </h1>

        <p
          style={{
            opacity: .8,
            marginBottom: 35,
          }}
        >
          Aqui estão todos os cursos liberados para sua conta.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",
            gap: 24,
          }}
        >
          {cursos.map((curso) => (
            <div
              key={curso.href}
              style={{
                background: "#1a1a2e",
                borderRadius: 20,
                padding: 24,
                border: "1px solid rgba(244,212,106,.15)",
              }}
            >
              <div
                style={{
                  fontSize: 42,
                  marginBottom: 15,
                }}
              >
                {curso.emoji}
              </div>

              <h2>{curso.titulo}</h2>

              <p
                style={{
                  opacity: .8,
                }}
              >
                {curso.descricao}
              </p>

              <Link
                href={curso.href}
                style={{
                  display: "inline-block",
                  marginTop: 20,
                  background: "#d4af37",
                  color: "#1a001a",
                  padding: "12px 22px",
                  borderRadius: 12,
                  textDecoration: "none",
                  fontWeight: 700,
                }}
              >
                Entrar no curso →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}