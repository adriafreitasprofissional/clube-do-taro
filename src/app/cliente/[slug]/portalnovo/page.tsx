"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

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
    audio:
      "https://drive.google.com/file/d/1rH2rxxj64LsZIbAcjDXwoCAgxlnBvmqy/preview",
    pdf: "https://drive.google.com/file/d/1wSENHfWAJu8szOIshu0tpFx0HcdoVtxs/view",
  },
  carolmorena: {
    nome: "Carol Morena",
    audio:
      "https://drive.google.com/file/d/1QRpWB6NSy78EIPhKw1LWp1hXANiguHrM/preview",
    pdf: "https://drive.google.com/file/d/1zntmmB7YREXRhHdBq1rJuiIY2gaNomHn/view",
  },
  carolruiva: {
    nome: "Carol Ruiva",
    audio:
      "https://drive.google.com/file/d/1JujrMkief5np5TWCJC9v7NPGNsCaJH8t/preview",
    pdf: "https://drive.google.com/file/d/1xa2757gj8cuvEfZCYhMWOxDDIOfp86Up/view",
  },
  claudinho: {
    nome: "Claudinho",
    audio:
      "https://drive.google.com/file/d/16KSkZ96o1G6AC4kevuJ2v39w4WHKTtkD/preview",
    pdf: "https://drive.google.com/file/d/1gYPQsoJEsQubWpxegDFzKJr4HqioZ2X1/view",
  },
  cris: {
    nome: "Cris",
    audio:
      "https://drive.google.com/file/d/1c3NBP069JYwQACl93iSKoy5JbX6qMY6t/preview",
    pdf: "https://drive.google.com/file/d/1y7Xtz6NmyxJ2I83Q614w5X8lNs0K2FGr/view",
  },
  dani: {
    nome: "Dani",
    audio:
      "https://drive.google.com/file/d/13e79xfIAFMivPVR7e3TLyrF4Fv_JM4Hx/preview",
    pdf: "https://drive.google.com/file/d/1qQxXH3jzCePK8lpMT_e2L-YqfEAs32ke/view",
  },
  dorinha: {
    nome: "Dorinha",
    audio:
      "https://drive.google.com/file/d/1khXIkV35Erh-xpH3VasuYFxDwu0XZV_C/preview",
    pdf: "https://drive.google.com/file/d/1JNEN8Q1K9UW02PUamxxFVbOWdq6jLUPu/view",
  },
  fefe: {
    nome: "Fefe",
    audio:
      "https://drive.google.com/file/d/11uW-sRd82Y7ri24u3iGw0w7-EAZ0OImd/preview",
    pdf: "https://drive.google.com/file/d/16ExZutoWCZjwb8sZL82R2TwM3pz5BO0T/view",
  },
  gabi: {
    nome: "Gabi",
    audio:
      "https://drive.google.com/file/d/11L1qVrs8C1_qUz6B32P44XdidzuVTfTS/preview",
    pdf: "https://drive.google.com/file/d/1sstnMOJRbhgC9Dgk-WTn4aUunFfOEqgr/view",
  },
  helena: {
    nome: "Helena",
    audio:
      "https://drive.google.com/file/d/1ai2HUFJdii1gzwtJaWeTIKQY5oUamjmw/preview",
    pdf: "https://drive.google.com/file/d/1svWxVxRJcgXWofGOczIYgVEj9_yI1Nyf/view",
  },
  lilian: {
    nome: "Lilian",
    audio:
      "https://drive.google.com/file/d/1XzM5c0qwoPqcQl3ijWuz7TiaS4iljpMM/preview",
    pdf: "https://drive.google.com/file/d/1hRGwtIP3lg6ODNBk_Of2uMx3RuYz4Fl0/view",
  },
  luana: {
    nome: "Luana",
    audio:
      "https://drive.google.com/file/d/1XzM5c0qwoPqcQl3ijWuz7TiaS4iljpMM/preview",
    pdf: "https://drive.google.com/file/d/1hRGwtIP3lg6ODNBk_Of2uMx3RuYz4Fl0/view",
  },
  natalia: {
    nome: "Natalia",
    audio:
      "https://drive.google.com/file/d/1oMTU4IPpMYR7-2GdhRC2IyaQBI7ZNovT/preview",
    pdf: "https://drive.google.com/file/d/1Nk-U3ZoGOWickUromyi0FY9sYChlNoWO/view",
  },
  neide: {
    nome: "Neide",
    audio:
      "https://drive.google.com/file/d/1Dbuvl2mJu6c7UdVoSVd5Mzqvuh-dX-QM/preview",
    pdf: "https://drive.google.com/file/d/1r6cS6F9goA6Oh_Ubgzji7BDbvOZlNdjV/view",
  },
  nathali: {
    nome: "Nathali",
    audio:
      "https://drive.google.com/file/d/1ayZOL6lCR2cwy1Ef2zC75m2X3FEd4l86/preview",
    pdf: "https://drive.google.com/file/d/1uCqB3YxkXj2IVQzOIU8RFWSkzdaS37CZ/view",
  },
  nena: {
    nome: "Nena",
    audio:
      "https://drive.google.com/file/d/10u-hDHeqmjvb6ItF2pxDV5RMqrKP0CtY/preview",
    pdf: "https://drive.google.com/file/d/1oRpKHoEgrumpCTud4nDTm0G9eRcSWskX/view",
  },
  rejiane: {
    nome: "Rejiane",
    audio:
      "https://drive.google.com/file/d/1zRX3Pjj7Z9O0lfIRRMlP0Di7jPpoZeLx/preview",
    pdf: "https://drive.google.com/file/d/1qOG0nHek9PN_BOZUCcRrV5YR2p1QCdSZ/view",
  },
  tamilly: {
    nome: "Tamilly",
    audio:
      "https://drive.google.com/file/d/1LTD7r-ZRCGxyE1Bvvfs8VHS_YiwkplUM/preview",
    pdf: "https://drive.google.com/file/d/14dm-Pafs-kmHpTvnwjdGlTGRProoqH_R/view",
  },
  vivi: {
    nome: "Vivi",
    audio:
      "https://drive.google.com/file/d/1uOY-k_nnB70wYdeyZMymlL4pn9x_gI0S/preview",
    pdf: "https://drive.google.com/file/d/1HS4_ceSClB5TUTic61qdVH7fL0w_GFsO/view",
  },
};

/*
  COLE AQUI OS LINKS QUE VOCÊ JÁ TEM.

  Cada áudio precisa ser o link do ARQUIVO MP3, terminando em /preview.
  Cada PDF precisa ser o link do PDF, terminando em /view.
*/
const AUDIOS_JUNHO: Record<string, Record<string, string>> = {
  cris: {
    "semana-1": "",
    "semana-2": "",
    "semana-3": "",
    "semana-4":
      "https://drive.google.com/file/d/1c3NBP069JYwQACl93iSKoy5JbX6qMY6t/preview",
    "semana-5": "",
  },
};

const PDFS_JUNHO: Record<string, Record<string, string>> = {
  cris: {
    "semana-1": "",
    "semana-2": "",
    "semana-3": "",
    "semana-4":
      "https://drive.google.com/file/d/1y7Xtz6NmyxJ2I83Q614w5X8lNs0K2FGr/view",
    "semana-5": "",
  },
};

export default function PortalPremium() {
  const params = useParams();
  const slug = params.slug as string;

  const [ano2026, setAno2026] = useState(false);
  const [maio, setMaio] = useState(false);
  const [junho, setJunho] = useState(false);

  const [audioAberto, setAudioAberto] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");

  const [direcionamentoAberto, setDirecionamentoAberto] = useState(false);
  const [categoria, setCategoria] = useState("");
  const [pergunta, setPergunta] = useState("");

  const [tituloGuardiao, setTituloGuardiao] = useState("Guardiã");
  const [nome, setNome] = useState("");
  const [plano, setPlano] = useState("");
  const [dataInicio, setDataInicio] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function carregarCliente() {
      setLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from("club_clients")
          .select("plano, data_inicio, nome, slug, genero")
          .eq("slug", slug)
          .maybeSingle();
        if (error) throw new Error(error.message);

        if (data) {
          setPlano(data.plano || "");
          setDataInicio(data.data_inicio);
          setNome(
            data.nome ||
              `${data.slug.charAt(0).toUpperCase()}${data.slug.slice(1)}`
          );
          setTituloGuardiao(data.genero === "homem" ? "Guardião" : "Guardiã");
        }
      } catch (err: any) {
        setError(err.message || "Erro ao carregar dados do cliente.");
      } finally {
        setLoading(false);
      }
    }

    if (slug) carregarCliente();
  }, [slug]);

  const mostrarMaio = dataInicio
    ? new Date(dataInicio) <= new Date("2026-05-31")
    : true;

  const semanas = [
    { titulo: "1ª Semana", data: "03/05 a 10/05" },
    { titulo: "2ª Semana", data: "10/05 a 17/05" },
    { titulo: "3ª Semana", data: "17/05 a 24/05" },
    { titulo: "4ª Semana", data: "24/05 a 31/05" },
  ];

  const semanasJunho = [
    {
      titulo: "1ª Semana",
      data: "01/06 a 07/06",
      semana: "semana-1",
      arquivo: "01-06",
    },
    {
      titulo: "2ª Semana",
      data: "08/06 a 14/06",
      semana: "semana-2",
      arquivo: "08-06",
    },
    {
      titulo: "3ª Semana",
      data: "15/06 a 21/06",
      semana: "semana-3",
      arquivo: "15-06",
      direcionamentoExclusivo: true,
    },
    {
      titulo: "4ª Semana",
      data: "22/06 a 28/06",
      semana: "semana-4",
      arquivo: "22-06",
    },
    {
      titulo: "5ª Semana",
      data: "28/06 a 30/06",
      semana: "semana-5",
      arquivo: "28-06",
    },
  ];

  const semanasJunhoFiltradas = semanasJunho.filter((semana) => {
    if (!dataInicio) return true;

    const inicio = new Date(dataInicio);
    const datas: Record<string, string> = {
      "semana-1": "2026-06-01",
      "semana-2": "2026-06-08",
      "semana-3": "2026-06-15",
      "semana-4": "2026-06-22",
      "semana-5": "2026-06-28",
    };

    return inicio <= new Date(datas[semana.semana]);
  });

  function abrirAudioMaio() {
    const conteudo = CONTEUDOS[slug];

    if (!conteudo?.audio) {
      alert("Áudio ainda não disponível para este portal.");
      return;
    }

    setAudioUrl(conteudo.audio);
    setAudioAberto(true);
  }

  function baixarPdfMaio() {
    const conteudo = CONTEUDOS[slug];

    if (!conteudo?.pdf) {
      alert("PDF ainda não disponível para este portal.");
      return;
    }

    window.open(conteudo.pdf, "_blank", "noopener,noreferrer");
  }

  function abrirAudioJunho(semana: string) {
    const url = AUDIOS_JUNHO[slug]?.[semana];

    if (!url) {
      alert("Áudio desta semana ainda não está disponível.");
      return;
    }

    setAudioUrl(url);
    setAudioAberto(true);
  }

  function baixarPdfJunho(semana: string) {
    const url = PDFS_JUNHO[slug]?.[semana];

    if (!url) {
      alert("PDF desta semana ainda não está disponível.");
      return;
    }

    window.open(url, "_blank", "noopener,noreferrer");
  }

  async function enviarPergunta() {
    if (!categoria) {
      alert("Escolha uma área.");
      return;
    }

    if (!pergunta.trim()) {
      alert("Digite sua pergunta.");
      return;
    }

    const { error } = await supabase.from("exclusive_questions").insert({
      nome_cliente: nome,
      email_cliente: slug,
      categoria,
      pergunta,
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Pergunta enviada com sucesso!");
    setCategoria("");
    setPergunta("");
    setDirecionamentoAberto(false);
  }

  const botaoAudio = {
    background: "linear-gradient(180deg,#7d1bb5,#5b0c8c)",
    border: "none",
    color: "#fff",
    padding: "12px 22px",
    borderRadius: "999px",
    cursor: "pointer",
  };

  const botaoPdf = {
    background: "rgba(244,212,106,.12)",
    border: "1px solid rgba(244,212,106,.25)",
    color: "#f4d46a",
    padding: "12px 22px",
    borderRadius: "999px",
    cursor: "pointer",
  };

  if (loading) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background:
            "radial-gradient(circle at top, #4b0082 0%, #1a001a 35%, #080010 100%)",
          color: "#f4d46a",
          padding: "40px 20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <p style={{ fontSize: "24px" }}>Carregando dados do cliente...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background:
            "radial-gradient(circle at top, #4b0082 0%, #1a001a 35%, #080010 100%)",
          color: "#f4d46a",
          padding: "40px 20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <p style={{ fontSize: "24px", color: "red" }}>Erro: {error}</p>
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
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
            marginBottom: "20px",
            padding: "0 20px",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              color: "#f4d46a",
              fontWeight: 800,
              fontSize: "16px",
              letterSpacing: ".5px",
            }}
          >
            ✨ Portal da Guardiã
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() =>
                (window.location.href = `/cliente/${slug}/mensalidades`)
              }
              style={{
                background: "rgba(244,212,106,.12)",
                border: "1px solid rgba(244,212,106,.3)",
                color: "#f4d46a",
                padding: "10px 16px",
                borderRadius: "999px",
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              💳 Meus Pagamentos
            </button>

            <button
              onClick={() => (window.location.href = "/minha-area")}
              style={{
                background: "#d4af37",
                border: "none",
                color: "#1a001a",
                padding: "10px 16px",
                borderRadius: "999px",
                cursor: "pointer",
                fontWeight: 800,
              }}
            >
              📚 Meus Cursos
            </button>

            <button
              onClick={() => {
                localStorage.clear();
                window.location.href = "/login";
              }}
              style={{
                background: "#5b0c8c",
                border: "none",
                color: "#fff",
                padding: "10px 16px",
                borderRadius: "999px",
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              🚪 Sair
            </button>
          </div>
        </div>

        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <div style={{ fontSize: "30px", marginBottom: "18px" }}>
            ✦ ✨ 🔮 ✨ ✦
          </div>

          <div
            style={{
              color: "#f4d46a",
              fontSize: "52px",
              marginBottom: "10px",
            }}
          >
            {tituloGuardiao}
          </div>

          <div
            style={{
              color: "#fff",
              fontSize: "38px",
              fontWeight: "bold",
              marginBottom: "20px",
            }}
          >
            {nome}
          </div>

          <p style={{ color: "#fff", opacity: 0.85, fontSize: "18px" }}>
            Que os oráculos iluminem seus caminhos e revelem as respostas que
            sua alma precisa neste momento.
          </p>

          <div
            style={{
              display: "inline-block",
              padding: "12px 30px",
              minWidth: "180px",
              fontWeight: "bold",
              borderRadius: "999px",
              background: "rgba(244,212,106,.12)",
              border: "1px solid rgba(244,212,106,.3)",
              marginBottom: "18px",
            }}
          >
            🔮 Plano {plano}
          </div>
        </div>

        <div
          style={{
            background: "rgba(25,0,35,.75)",
            borderRadius: "36px",
            padding: "50px",
            border: "1px solid rgba(244,212,106,.2)",
          }}
        >
          <div
            onClick={() => setAno2026(!ano2026)}
            style={{
              padding: "24px",
              borderRadius: "24px",
              border: "1px solid rgba(244,212,106,.2)",
              background: "#140014",
              cursor: "pointer",
              marginBottom: "15px",
            }}
          >
            {ano2026 ? "▼" : "▶"} Ano 2026
          </div>

          {ano2026 && (
            <div style={{ marginLeft: "20px" }}>
              {mostrarMaio && (
                <>
                  <div
                    onClick={() => setMaio(!maio)}
                    style={{
                      padding: "20px",
                      borderRadius: "18px",
                      background: "rgba(244,212,106,.08)",
                      cursor: "pointer",
                      marginBottom: "15px",
                    }}
                  >
                    {maio ? "▼" : "▶"} Maio 2026
                  </div>

                  {maio && (
                    <div style={{ display: "grid", gap: "18px" }}>
                      {semanas.map((semana) => (
                        <div
                          key={semana.titulo}
                          style={{
                            background:
                              "linear-gradient(180deg,#2a0738 0%, #1a001f 100%)",
                            border: "1px solid rgba(244,212,106,.15)",
                            borderRadius: "24px",
                            padding: "24px",
                          }}
                        >
                          <div style={{ fontSize: "26px", marginBottom: "10px" }}>
                            ✦ {semana.titulo}
                          </div>

                          <div
                            style={{
                              color: "rgba(255,255,255,.65)",
                              marginBottom: "20px",
                            }}
                          >
                            {semana.data}
                          </div>

                          <div
                            style={{
                              display: "flex",
                              gap: "12px",
                              flexWrap: "wrap",
                            }}
                          >
                            <button onClick={abrirAudioMaio} style={botaoAudio}>
                              🎧 Ouvir Direcionamento
                            </button>

                            <button onClick={baixarPdfMaio} style={botaoPdf}>
                              📥 Baixar Leitura Completa
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              <div
                onClick={() => setJunho(!junho)}
                style={{
                  padding: "20px",
                  borderRadius: "18px",
                  background: "rgba(244,212,106,.08)",
                  cursor: "pointer",
                  marginBottom: "15px",
                  marginTop: "15px",
                }}
              >
                {junho ? "▼" : "▶"} Junho 2026
              </div>

              {junho && (
                <div style={{ display: "grid", gap: "18px" }}>
                  {semanasJunhoFiltradas.map((semana) => (
                    <div
                      key={semana.titulo}
                      style={{
                        background:
                          "linear-gradient(180deg,#2a0738 0%, #1a001f 100%)",
                        border: "1px solid rgba(244,212,106,.15)",
                        borderRadius: "24px",
                        padding: "24px",
                      }}
                    >
                      <div style={{ fontSize: "26px", marginBottom: "10px" }}>
                        ✦ {semana.titulo}
                      </div>

                      <div
                        style={{
                          color: "rgba(255,255,255,.65)",
                          marginBottom: "20px",
                        }}
                      >
                        {semana.data}
                      </div>

                      <div
                        style={{
                          display: "flex",
                          gap: "12px",
                          flexWrap: "wrap",
                        }}
                      >
                        <button
                          onClick={() => abrirAudioJunho(semana.semana)}
                          style={botaoAudio}
                        >
                          🎧 Ouvir Direcionamento
                        </button>

                        <button
                          onClick={() => baixarPdfJunho(semana.semana)}
                          style={botaoPdf}
                        >
                          📥 Baixar Leitura Completa
                        </button>

                        {semana.direcionamentoExclusivo && (
                          <button
                            onClick={() => setDirecionamentoAberto(true)}
                            style={{
                              background: "#7d1bb5",
                              border: "none",
                              color: "#fff",
                              padding: "12px 22px",
                              borderRadius: "999px",
                              cursor: "pointer",
                            }}
                          >
                            🔮 Direcionamento Exclusivo
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {direcionamentoAberto && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.85)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "#1a001f",
              borderRadius: "24px",
              padding: "30px",
              width: "650px",
              maxWidth: "95%",
              border: "1px solid rgba(244,212,106,.25)",
            }}
          >
            <h2 style={{ color: "#f4d46a", marginBottom: "20px" }}>
              🔮 Direcionamento Exclusivo
            </h2>

            <p style={{ color: "#fff" }}>Escolha a área da sua pergunta.</p>

            <select
              value={categoria}
              onChange={(event) => setCategoria(event.target.value)}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "12px",
                marginTop: "20px",
                marginBottom: "20px",
                background: "#2a0738",
                color: "#f4d46a",
                border: "1px solid rgba(244,212,106,.25)",
              }}
            >
              <option value="">Escolha o tema do seu direcionamento...</option>
              <option value="Amor">❤️ Amor</option>
              <option value="Trabalho">💰 Trabalho</option>
              <option value="Saúde">🌿 Saúde</option>
              <option value="Espiritualidade">✨ Espiritualidade</option>
              <option value="Relacionamentos">👨‍👩‍👧 Relacionamentos</option>
              <option value="Emocional">🧠 Emocional</option>
            </select>

            <textarea
              value={pergunta}
              onChange={(event) => setPergunta(event.target.value)}
              placeholder="Digite sua pergunta..."
              rows={6}
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "15px",
                borderRadius: "12px",
                marginBottom: "20px",
                background: "#2a0738",
                color: "#fff",
                border: "1px solid rgba(244,212,106,.25)",
              }}
            />

            <button
              onClick={enviarPergunta}
              style={{
                marginRight: "12px",
                background: "#7d1bb5",
                border: "none",
                color: "#fff",
                padding: "12px 20px",
                borderRadius: "999px",
                cursor: "pointer",
              }}
            >
              ✨ Enviar Pergunta
            </button>

            <button
              onClick={() => setDirecionamentoAberto(false)}
              style={{
                background: "#5b0c8c",
                border: "none",
                color: "#fff",
                padding: "12px 20px",
                borderRadius: "999px",
                cursor: "pointer",
              }}
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {audioAberto && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.85)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            padding: "20px",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "620px",
              background: "linear-gradient(145deg, #1a1a1b 0%, #161718 52%, #0a0b0c 100%)",
              border: "1px solid rgba(244,212,106,.45)",
              borderRadius: "22px",
              padding: "24px",
              boxSizing: "border-box",
            }}
          >
            <h3
              style={{
                margin: "0 0 18px",
                color: "#b48af8",
                fontSize: "22px",
              }}
            >
              🎧 Direcionamento da Semana
            </h3>

            <iframe
  src={audioUrl}
  title="Direcionamento da Semana"
  width="100%"
  height="140"
  style={{
    display: "block",
    border: "1px solid rgba(255,255,255,.08)",
    borderRadius: "16px",
    background:
      "linear-gradient(145deg, #4b4b4d 0%, #2f3033 48%, #202124 100%)",
    boxShadow:
      "inset 0 1px 0 rgb(255, 255, 255), 0 10px 25px rgba(0,0,0,.35)",
  }}
  allow="autoplay"
/>

            <button
              onClick={() => {
                setAudioAberto(false);
                setAudioUrl("");
              }}
              style={{
                marginTop: "18px",
                background: "#400e91",
                color: "#ffffff",
                border: "none",
                borderRadius: "999px",
                padding: "12px 20px",
                cursor: "pointer",
                fontWeight: 700,
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