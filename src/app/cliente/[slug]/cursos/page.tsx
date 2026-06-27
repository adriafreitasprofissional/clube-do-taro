"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function MeusCursosPage() {
  const { slug } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [liberado, setLiberado] = useState(false);

  useEffect(() => {
    async function verificar() {
      const { data } = await supabase
        .from("club_clients")
        .select("cursos_liberados")
        .eq("slug", slug)
        .single();

      if (!data?.cursos_liberados) {
        router.replace("/cursos");
        return;
      }

      setLiberado(true);
      setLoading(false);
    }

    verificar();
  }, [slug, router]);

  if (loading) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#0b0b0f",
          color: "#fff",
        }}
      >
        Verificando acesso...
      </main>
    );
  }

  if (!liberado) return null;

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

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",
            gap: 24,
            marginTop: 30,
          }}
        >
          <div
            style={{
              background: "#1a1a2e",
              borderRadius: 20,
              padding: 24,
            }}
          >
            <div style={{ fontSize: 42 }}>🌹</div>

            <h2>Portal do Poder da Sua Pombagira</h2>

            <p>Desafio completo de 7 dias.</p>

            <Link
              href="/cursos/pombagira"
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
        </div>
      </div>
    </main>
  );
}
