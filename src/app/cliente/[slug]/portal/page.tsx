"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function PortalPremium() {
  const params = useParams();
  const slug = params.slug as string;

const [ano2026, setAno2026] = useState(false);
const [ano2027, setAno2027] = useState(false);

const [maio, setMaio] = useState(false);
const [junho, setJunho] = useState(false);

const [audioAberto, setAudioAberto] = useState(false);
const [audioUrl, setAudioUrl] = useState("");

  const nomes: Record<string, string> = {
    gabi: "Gabriela",
    helena: "Helena",
    carolmorena: "Carol",
    carolruiva: "Carol",
    cris: "Cristiane",
    claudinho: "Claudinho",
    dani: "Dani",
    dorinha: "Dorinha",
    fefe: "Fernanda",
    lilian: "Lilian",
    luana: "Luana",
    natalia: "Natalia",
    nathali: "Nathali",
    neide: "Neide",
    rejiane: "Rejiane",
    tamilly: "Tamilly",
    vivi: "Viviane",
  };
const genero: Record<string, string> = {
  claudinho: "Guardião",
  dani: "Guardião",
  gabi: "Guardiã",
  helena: "Guardiã",
  carolmorena: "Guardiã",
  carolruiva: "Guardiã",
  cris: "Guardiã",
  dorinha: "Guardiã",
  fefe: "Guardiã",
  lilian: "Guardiã",
  luana: "Guardiã",
  natalia: "Guardiã",
  nathali: "Guardiã",
  neide: "Guardiã",
  rejiane: "Guardiã",
  tamilly: "Guardiã",
  vivi: "Guardiã",
};
const tituloGuardiao = genero[slug] || "Guardiã";

 const nome = nomes[slug] || "Guardiã";

const [clienteId, setClienteId] = useState("");
const [plano, setPlano] = useState("");

useEffect(() => {
  async function carregarCliente() {
    const { data, error } = await supabase
      .from("club_clients")
      .select("id, plano")
      .eq("slug", slug)
      .single();

    console.log("DATA:", data);
    console.log("ERRO:", error);

    if (data) {
      setClienteId(data.id);
      setPlano(data.plano);
      
    }
  }

  carregarCliente();
}, [slug]);

 function abrirAudio() {
  const url =
    `https://xzvraybpzukrfaxmtkch.supabase.co/storage/v1/object/public/clientes/${clienteId}/clube-do-taro/2026/maio/semana-1-${slug}-03-05.mp3`;

  setAudioUrl(url);
  setAudioAberto(true);
}
function baixarPdf() {
  const url =
    `https://xzvraybpzukrfaxmtkch.supabase.co/storage/v1/object/public/clientes/${clienteId}/clube-do-taro/2026/maio/semana-1-${slug}-03-05.pdf`;

  window.open(url, "_blank");
}
function abrirAudioJunho() {
  const url =
    `https://xzvraybpzukrfaxmtkch.supabase.co/storage/v1/object/public/clientes/${clienteId}/clube-do-taro/2026/junho/semana-1-${slug}-01-06.mp3`;

  setAudioUrl(url);
  setAudioAberto(true);
}

function baixarPdfJunho() {
  const url =
    `https://xzvraybpzukrfaxmtkch.supabase.co/storage/v1/object/public/clientes/${clienteId}/clube-do-taro/2026/junho/semana-1-${slug}-01-06.pdf`;

  window.open(url, "_blank");
}
const semanas = [
  { titulo: "1ª Semana", data: "03/05 a 10/05" },
  { titulo: "2ª Semana", data: "10/05 a 17/05" },
  { titulo: "3ª Semana", data: "17/05 a 24/05" },
  { titulo: "4ª Semana", data: "24/05 a 31/05" },
];

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
<div
style={{
maxWidth: "1100px",
margin: "0 auto",
}}
>
 <div
  style={{
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    marginBottom: "20px",
  }}
>
  <button
    onClick={() => (window.location.href = "/")}
    style={{
      background: "rgba(244,212,106,.12)",
      border: "1px solid rgba(244,212,106,.3)",
      color: "#f4d46a",
      padding: "10px 18px",
      borderRadius: "999px",
      cursor: "pointer",
    }}
  >
    🏠 Portal Principal
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
      padding: "10px 18px",
      borderRadius: "999px",
      cursor: "pointer",
    }}
  >
    🚪 Sair
  </button>
</div>
<div
  style={{
    textAlign: "center",
    marginBottom: "60px",
    position: "relative",
    zIndex: 2,
  }}
>
  <div
    style={{
      fontSize: "30px",
      marginBottom: "18px",
    }}
  >
    ✦ ✨ 🔮 ✨ ✦
  </div>

  <h1
    style={{
      fontSize: "70px",
      marginBottom: "15px",
      textShadow: "0 0 25px rgba(244,212,106,.25)",
    }}
  >
    🔮 Portal das Guardiãs e Guardiões
  </h1>

  <h2
    style={{
      color: "#fff",
      fontWeight: 400,
      marginBottom: "12px",
    }}
  >
    ✨ {tituloGuardiao} {nome} ✨
    
    Que os oráculos iluminem seus caminhos e revelem
as respostas que sua alma precisa neste momento.
  </h2>

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

  <p
    style={{
      color: "#fff",
      opacity: 0.8,
      letterSpacing: "1px",
    }}
  >
    Clube do Tarô Premium
    Seu espaço exclusivo para acessar direcionamentos,
leituras, áudios e conteúdos especiais.
  </p>
</div>

    <div
      style={{
        background: "rgba(25,0,35,.75)",
        borderRadius: "36px",
        padding: "50px",
        border: "1px solid rgba(244,212,106,.2)",
      }}
    >
      <h2
        style={{
          fontSize: "42px",
          marginBottom: "20px",
        }}
      >
        Direcionamentos Exclusivos
      </h2>

      <p
        style={{
          color: "#fff",
          opacity: 0.7,
          marginBottom: "40px",
        }}
      >
        Seus conteúdos espirituais serão carregados automaticamente.
      </p>

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
        <div style={{ marginLeft: "30px" }}>
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
  <div
    style={{
      display: "grid",
      gap: "18px",
    }}
  >
    {semanas.map((semana) => (
      <div
        key={semana.titulo}
        style={{
          background:
            "linear-gradient(180deg,#2a0738 0%, #1a001f 100%)",
          border:
            "1px solid rgba(244,212,106,.15)",
          borderRadius: "24px",
          padding: "24px",
        }}
        

                >
                  <div
                    style={{
                      fontSize: "26px",
                      marginBottom: "10px",
                    }}
                  >
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
    onClick={abrirAudio}
    style={{
      background:
        "linear-gradient(180deg,#7d1bb5,#5b0c8c)",
      border: "none",
      color: "#fff",
      padding: "12px 22px",
      borderRadius: "999px",
    }}
  >
    🎧 Ouvir Direcionamento
  </button>

  <button
  onClick={baixarPdf}
  style={{
    background: "rgba(244,212,106,.12)",
    border: "1px solid rgba(244,212,106,.25)",
    color: "#f4d46a",
    padding: "12px 22px",
    borderRadius: "999px",
  }}
>
  📥 Baixar Leitura Completa
</button>
</div>
             
                </div>
))}
</div>
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
  <div
    style={{
      background: "linear-gradient(180deg,#2a0738 0%, #1a001f 100%)",
      border: "1px solid rgba(244,212,106,.15)",
      borderRadius: "24px",
      padding: "24px",
      marginBottom: "15px",
    }}
  >
    <div
      style={{
        fontSize: "26px",
        marginBottom: "10px",
      }}
    >
      ✦ 1ª Semana
    </div>

    <div
      style={{
        color: "rgba(255,255,255,.65)",
        marginBottom: "20px",
      }}
    >
      01/06 a 07/06
    </div>

    <div
      style={{
        display: "flex",
        gap: "12px",
        flexWrap: "wrap",
      }}
    >
      <button
        onClick={abrirAudioJunho}
        style={{
          background: "linear-gradient(180deg,#7d1bb5,#5b0c8c)",
          border: "none",
          color: "#fff",
          padding: "12px 22px",
          borderRadius: "999px",
        }}
      >
        🎧 Ouvir Direcionamento
      </button>

      <button
        onClick={baixarPdfJunho}
        style={{
          background: "rgba(244,212,106,.12)",
          border: "1px solid rgba(244,212,106,.25)",
          color: "#f4d46a",
          padding: "12px 22px",
          borderRadius: "999px",
        }}
      >
        📥 Baixar Leitura Completa
      </button>
    </div>
  </div>
)}

</div>
)}

      <div
        onClick={() => setAno2027(!ano2027)}
        style={{
          padding: "24px",
          borderRadius: "24px",
          border: "1px solid rgba(244,212,106,.2)",
          background: "#140014",
          cursor: "pointer",
          marginTop: "20px",
        }}
      >
        {ano2027 ? "▼" : "▶"} Ano 2027
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
      zIndex: 9999,
    }}
  >
    <div
      style={{
        background: "#1a001f",
        borderRadius: "24px",
        padding: "30px",
        width: "500px",
        maxWidth: "90%",
        border: "1px solid rgba(244,212,106,.25)",
      }}
    >
      <h2
  style={{
    color: "#f4d46a",
    marginBottom: "20px",
  }}
>
  🔮 Direcionamento da Semana
</h2>

<audio
  controls
  autoPlay
  src={audioUrl}
  style={{
    width: "100%",
  }}
/>

      <button
        onClick={() => setAudioAberto(false)}
        style={{
          marginTop: "20px",
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
</main>
);
}