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
];

export default function CursoPombagira() {
  const [aulaAtiva, setAulaAtiva] = useState(0);
  const [audioAberto, setAudioAberto] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");

  function abrirAula(index: number) {
    setAulaAtiva(index);
    setAudioUrl(AULAS[index].video);
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
              background: "#17171b",
              borderRadius: "18px",
              padding: "20px",
              boxSizing: "border-box",
              border: "1px solid #3a3a43",
            }}
          >
            <h2 style={{ marginTop: 0 }}>{AULAS[aulaAtiva].titulo}</h2>

            <iframe
              src={audioUrl}
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