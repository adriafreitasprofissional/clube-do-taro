"use client";

import { useState } from "react";

const AULAS = [
  {
    titulo: "1º DIA DO DESAFIO",
    video: "https://www.youtube.com/embed/q7uMTxtoVIw",
    imagem: "/desafio-pombagira/dia1.png",
  },
  {
    titulo: "2º DIA DO DESAFIO",
    video: "https://www.youtube.com/embed/iPXA35eE2iU",
    imagem: "/desafio-pombagira/dia2.png",
  },
  {
    titulo: "3º DIA — O Poder da Sua Pombogira",
    descricao:
      "Hoje você vai compreender como reconhecer sua força, sem medo e sem culpa.",
    dica:
      "Assista com calma e anote tudo que tocar seu coração.",
    imagem: "/desafio-pombagira/dia3.png",
    videos: [
      {
        titulo: "Parte 1 — CORES E ELEMENTOS",
        url: "https://www.youtube.com/embed/KvRLmUulqBc",
      },
      {
        titulo: "Parte 2 — OFERENDAS",
        url: "https://www.youtube.com/embed/PBSD6fFNCIw",
      },
    ],
    pdf: {
      titulo: "Material complementar da aula",
      url: "https://drive.google.com/file/d/1Si4XlrQv2awGN1SaXLQR3aV6WACE7-2z/view?usp=drive_link",
    },
  },
  {
    titulo: "4º DIA — O Espelho da Alma",
    descricao:
      "Hoje eu desafio você a aceitar a verdade e reconhecer a força que existe em sua própria história.",
    dica:
      "Assista com calma e permita-se refletir antes de seguir para a próxima etapa.",
    imagem: "/desafio-pombagira/dia4.png",
    videos: [
      {
        titulo: "Parte 1 — O ESPELHO DA ALMA",
        url: "https://www.youtube.com/embed/HHdTxnhscKQ",
      },
      {
        titulo: "Parte 2 — SIGA EM FRENTE — FAÇA ALGO POR VOCÊ!",
        url: "https://www.youtube.com/embed/t0N3JRIjYmg",
      },
    ],
    pdf: {
      titulo: "Material complementar da aula",
      url: "https://drive.google.com/file/d/1S8fmVU75SCtRKI8xSaPuV-uEKZxnBuLL/view?usp=sharing",
    },
  },
];

export default function CursoPombagira() {
  const [aulaAtiva, setAulaAtiva] = useState(0);
  const [audioAberto, setAudioAberto] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");

  function abrirAula(index: number) {
  const aula = AULAS[index];

  setAulaAtiva(index);

  if (aula.video) {
    setAudioUrl(aula.video);
  } else if (aula.videos?.[0]?.url) {
    setAudioUrl(aula.videos[0].url);
  } else {
    setAudioUrl("");
  }

  setAudioAberto(true);
}

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0b0b0f",
        color: "#fff",
      }}
    >
      <aside
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          width: "240px",
          background: "#5b0c0c",
          padding: "20px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
        }}
      >
        <h3 style={{ margin: "0 0 20px" }}>DESAFIO POMBOGIRA</h3>

        <a href="/" style={{ color: "#fff", textDecoration: "none" }}>
          🏠 Home
        </a>
        <a
          href="https://www.instagram.com/adriafreitastarologa"
          target="_blank"
          rel="noreferrer"
          style={{ color: "#fff", textDecoration: "none" }}
        >
          📸 Instagram
        </a>
        <a href="adriafreitasprofissional@gmail.com" style={{ color: "#fff", textDecoration: "none" }}>
          🎧 Suporte
        </a>
        <a href="https://cigana-desperta.lovable.app" style={{ color: "#fff", textDecoration: "none" }}>
          🔗 Curso Baralho Cigano
        </a>
        <a href="https://www.magiaoriente.com.br" style={{ color: "#fff", textDecoration: "none" }}>
          📱 App Clube do Tarô
        </a>
      </aside>

      <section 
  style={{
    marginLeft: "240px",
    minHeight: "100vh",
    paddingTop: "24px",
  }}
>
        <div
          style={{
            width: "100%",
            height: "260px",
            background: "#111",
            overflow: "hidden",
          }}
        >
          <img
            src="/desafio-pombagira/banner-desafio.png"
            alt="Desafio Ative o Poder da sua Pombagira"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>

        <div style={{ padding: "28px 20px 10px" }}>
  <h1 style={{ margin: 0, fontSize: "28px" }}>7 DIAS DE DESAFIOS</h1>
</div>

       <div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, 340px)",
    gap: "32px",
    justifyContent: "flex-start",
    alignItems: "start",
    padding: "20px 20px 50px",
  }}
>
          {AULAS.map((aula, index) => (
  <article
    key={aula.titulo}
    onClick={() => abrirAula(index)}
  style={{
    width: "340px",
    height: "480px",
    background: "#1a1a1f",
    borderRadius: "18px",
    overflow: "hidden",
    cursor: "pointer",
    position: "relative",
  }}
>

  
  {/* BANNER DO MÓDULO (clicável inteiro) */}
  <img
    src={aula.imagem}
    alt={aula.titulo}
    style={{
      width: "100%",
      height: "100%",
      objectFit: "cover",
      display: "block",
    }}
  />

  {/* TEXTO EM CIMA DO CARD */}
  <div
    style={{
      position: "absolute",
      bottom: 0,
      width: "100%",
      padding: "14px",
      background: "linear-gradient(to top, rgba(0,0,0,.85), transparent)",
    }}
  >
    <h3 style={{ margin: 0, color: "#fff" }}>{aula.titulo}</h3>
  </div>
</article>
          ))}
        </div>
      </section>

{audioAberto && (

  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,.82)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 100,
      padding: "20px",
    }}
  >
    <div
      style={{
        width: "860px",
        maxWidth: "100%",
        maxHeight: "90vh",
        overflowY: "auto",
        background: "#17171b",
        borderRadius: "18px",
        padding: "20px",
        boxSizing: "border-box",
        border: "1px solid #3a3a43",
      }}
    >
      <h2 style={{ marginTop: 0 }}>
        {AULAS[aulaAtiva].titulo}
      </h2>

      {AULAS[aulaAtiva].descricao && (
        <p
          style={{
            color: "#f5e9c8",
            lineHeight: 1.6,
            background: "#101014",
            padding: "14px",
            borderRadius: "12px",
          }}
        >
          {AULAS[aulaAtiva].descricao}
        </p>
      )}

      {AULAS[aulaAtiva].dica && (
        <div
          style={{
            marginTop: "14px",
            marginBottom: "18px",
            padding: "14px",
            borderRadius: "12px",
            background: "rgba(125,27,181,.18)",
            border: "1px solid rgba(198,126,255,.35)",
            color: "#f1dcff",
            lineHeight: 1.6,
          }}
        >
          <strong style={{ color: "#f4d46a" }}>
            ✦ Dica da Guardiã
          </strong>
          <br />
          {AULAS[aulaAtiva].dica}
        </div>
      )}

      {AULAS[aulaAtiva].video && (
        <iframe
          src={AULAS[aulaAtiva].video}
          title={AULAS[aulaAtiva].titulo}
          width="100%"
          height="480"
          style={{
            border: "none",
            borderRadius: "12px",
            background: "#000",
          }}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      )}

      {AULAS[aulaAtiva].videos?.map((video) => (
        <div key={video.url} style={{ marginTop: "20px" }}>
          <p
            style={{
              color: "#f4d46a",
              fontWeight: "bold",
              marginBottom: "10px",
            }}
          >
            ▶ {video.titulo}
          </p>

          <iframe
            src={video.url}
            title={video.titulo}
            width="100%"
            height="480"
            style={{
              border: "none",
              borderRadius: "12px",
              background: "#000",
            }}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        </div>
      ))}

      {AULAS[aulaAtiva].pdf?.url && (
        <a
          href={AULAS[aulaAtiva].pdf.url}
          target="_blank"
          rel="noreferrer"
          style={{
            display: "block",
            marginTop: "20px",
            padding: "14px",
            background: "rgba(244,212,106,.12)",
            border: "1px solid rgba(244,212,106,.45)",
            borderRadius: "12px",
            color: "#f4d46a",
            textDecoration: "none",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          📄 {AULAS[aulaAtiva].pdf.titulo}
        </a>
      )}

      <button
        onClick={() => setAudioAberto(false)}
        style={{
          marginTop: "16px",
          width: "100%",
          padding: "12px",
          background: "#7d1bb5",
          color: "#fff",
          border: "none",
          borderRadius: "10px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        Fechar aula
      </button>
    </div>
  </div>
)}
</main>
);
}