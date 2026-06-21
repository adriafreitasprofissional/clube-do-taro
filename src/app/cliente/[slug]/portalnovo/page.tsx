"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

/**
 * 🔮 MAPA DE CONTEÚDO (TODOS OS CLIENTES)
 * Aqui você só troca links no futuro, sem mexer no portal.
 */
const CONTEUDOS: Record<
  string,
  {
    nome: string;
    audio: string;
    pdf: string;
  }
> = {
  evelyn: {
    nome: "Evelyn",
    audio:
      "https://drive.google.com/file/d/1Wx4oWQZX8zTUzvywcWnUe9ofxeqVy_6H/preview",
    pdf: "https://drive.google.com/file/d/18kJceaXvQNOlB_GgxX4Ah2f0xoH_LAIs/view",
  },

  bianca: {
    nome: "Bianca",
    audio: "",
    pdf: "",
  },

  carolmorena: {
    nome: "Carol Morena",
    audio: "",
    pdf: "",
  },

  carolruiva: {
    nome: "Carol Ruiva",
    audio: "",
    pdf: "",
  },

  claudinho: {
    nome: "Claudinho",
    audio: "",
    pdf: "",
  },

  cris: {
    nome: "Cris",
    audio: "",
    pdf: "",
  },

  dani: {
    nome: "Dani",
    audio: "",
    pdf: "",
  },

  dorinha: {
    nome: "Dorinha",
    audio: "",
    pdf: "",
  },

  fefe: {
    nome: "Fefe",
    audio: "",
    pdf: "",
  },

  gabi: {
    nome: "Gabi",
    audio: "",
    pdf: "",
  },

  helena: {
    nome: "Helena",
    audio: "",
    pdf: "",
  },

  lilian: {
    nome: "Lilian",
    audio: "",
    pdf: "",
  },

  luana: {
    nome: "Luana",
    audio: "",
    pdf: "",
  },

  natalia: {
    nome: "Natalia",
    audio: "",
    pdf: "",
  },

  neide: {
    nome: "Neide",
    audio: "",
    pdf: "",
  },

  nathali: {
    nome: "Nathali",
    audio: "",
    pdf: "",
  },

  nena: {
    nome: "Nena",
    audio: "",
    pdf: "",
  },

  rejiane: {
    nome: "Rejiane",
    audio: "",
    pdf: "",
  },

  tamilly: {
    nome: "Tamilly",
    audio: "",
    pdf: "",
  },

  vivi: {
    nome: "Vivi",
    audio: "",
    pdf: "",
  },
};

export default function PortalNovoPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [cliente, setCliente] = useState<any>(null);
  const [audioAberto, setAudioAberto] = useState(false);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("club_clients")
        .select("nome, slug, plano, genero")
        .eq("slug", slug)
        .single();

      setCliente(data);
    }

    if (slug) load();
  }, [slug]);

  const conteudo = CONTEUDOS[slug];

  if (!cliente || !conteudo) {
    return (
      <main style={{ padding: 40, color: "#fff" }}>
        Conteúdo não encontrado.
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #4b0082 0%, #1a001a 35%, #080010 100%)",
        color: "#f4d46a",
        padding: "40px 20px",
      }}
    >
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <h1 style={{ textAlign: "center", marginBottom: 10 }}>
          🔮 {conteudo.nome}
        </h1>

        <p style={{ textAlign: "center", color: "#fff" }}>
          Portal de Direcionamento Espiritual
        </p>

        <div
          style={{
            marginTop: 40,
            padding: 30,
            borderRadius: 20,
            background: "rgba(0,0,0,.4)",
          }}
        >
          <h2>Junho - 4ª Semana</h2>

          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <button
              onClick={() => setAudioAberto(true)}
              style={{
                padding: 12,
                borderRadius: 20,
                background: "#7d1bb5",
                color: "#fff",
                border: "none",
              }}
            >
              🎧 Ouvir Direcionamento
            </button>

            <a
              href={conteudo.pdf}
              target="_blank"
              style={{
                padding: 12,
                borderRadius: 20,
                background: "#f4d46a",
                color: "#000",
                textDecoration: "none",
              }}
            >
              📥 PDF
            </a>
          </div>
        </div>
      </div>

      {audioAberto && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.85)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: 600,
              background: "#111",
              padding: 20,
              borderRadius: 20,
            }}
          >
            <iframe
              src={conteudo.audio}
              width="100%"
              height="140"
              allow="autoplay"
            />

            <button
              onClick={() => setAudioAberto(false)}
              style={{
                marginTop: 10,
                padding: 10,
                width: "100%",
              }}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </main>
  );
}