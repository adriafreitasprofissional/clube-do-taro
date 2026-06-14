"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

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

const [tituloGuardiao, setTituloGuardiao] =
  useState("Guardiã");

 const [nome, setNome] = useState("");

const [clienteId, setClienteId] = useState("");
const [plano, setPlano] = useState("");

const [dataInicio, setDataInicio] = useState("");

useEffect(() => {
  async function carregarCliente() {
    const { data, error } = await supabase
      .from("club_clients")
     .select("id, plano, data_inicio, nome, slug, genero")
      .eq("slug", slug)
      .single();

    console.log("DATA:", data);
    console.log("ERRO:", error);

   if (data) {
  setClienteId(data.id);
  setPlano(data.plano);
  setDataInicio(data.data_inicio);
  
 
  setNome(
    data.slug.charAt(0).toUpperCase() +
    data.slug.slice(1)
  );
console.log("GENERO:", data.genero);
  setTituloGuardiao(
    data.genero === "homem"
      ? "Guardião"
      : "Guardiã"
  );
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
function abrirAudioJunho(semana: string, arquivo: string) {
  console.log("clienteId:", clienteId);
  console.log("slug:", slug);
  console.log("semana:", semana);
  console.log("arquivo:", arquivo);

  const url =
    `https://xzvraybpzukrfaxmtkch.supabase.co/storage/v1/object/public/clientes/${clienteId}/clube-do-taro/2026/junho/${semana}-${slug}-${arquivo}.mp3`;

  console.log("URL FINAL:", url);

  setAudioUrl(url);
  setAudioAberto(true);
}

function baixarPdfJunho(semana: string, arquivo: string) {
  const url =
    `https://xzvraybpzukrfaxmtkch.supabase.co/storage/v1/object/public/clientes/${clienteId}/clube-do-taro/2026/junho/${semana}-${slug}-${arquivo}.pdf`;

  window.open(url, "_blank");
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

  const { error } = await supabase
    .from("exclusive_questions")
    .insert({
      nome_cliente: nome,
      email_cliente: slug,
      categoria,
      pergunta,
    });

  if (error) {
    alert(error.message);
    console.error(error);
    return;
  }

  alert("Pergunta enviada com sucesso!");

  setCategoria("");
  setPergunta("");
  setDirecionamentoAberto(false);
}

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
    data: "29/06 a 30/06",
    semana: "semana-5",
    arquivo: "29-06",
  },
];
const mostrarMaio =
  !dataInicio || new Date(dataInicio) <= new Date("2026-05-31");

const semanasJunhoFiltradas = semanasJunho.filter((semana) => {
  if (!dataInicio) return true;

  const inicio = new Date(dataInicio);

  const datas: Record<string, string> = {
    "semana-1": "2026-06-01",
    "semana-2": "2026-06-08",
    "semana-3": "2026-06-15",
    "semana-4": "2026-06-22",
    "semana-5": "2026-06-29",
  };

  return inicio <= new Date(datas[semana.semana]);
});
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
   justifyContent: "flex-start",
    gap: "12px",
    marginBottom: "20px",
    paddingLeft: "20px"
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

 <div
  style={{
    textAlign: "center",
    marginBottom: "15px",
  }}
>
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

  <p
    style={{
      color: "#fff",
      opacity: 0.85,
      fontSize: "18px",
    }}
  >
    Que os oráculos iluminem seus caminhos e revelem as respostas que sua alma precisa neste momento.
  </p>

</div>
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
{plano?.toLowerCase() === "diamante" && (
    <a
      href="SEU_LINK_DE_MENTORIA"
      target="_blank"
      style={{
        padding: "12px 30px",
        fontWeight: "bold",
        borderRadius: "999px",
        background:
          "linear-gradient(180deg,#7d1bb5,#5b0c8c)",
        color: "#fff",
        textDecoration: "none",
      }}
    >
      👑 Mentoria Diamante
    </a>
  )}
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
  style={{
    background: "rgba(25,0,35,.75)",
    borderRadius: "36px",
    padding: "50px",
    border: "1px solid rgba(244,212,106,.2)",
  }}
></div>

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
  <div
    style={{
      display: "grid",
      gap: "18px",
    }}
  >
    {semanasJunhoFiltradas.map((semana) => (
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
            onClick={() =>
              abrirAudioJunho(
                semana.semana,
                semana.arquivo
              )
            }
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
            onClick={() =>
              baixarPdfJunho(
                semana.semana,
                semana.arquivo
              )
            }
            style={{
              background:
                "rgba(244,212,106,.12)",
              border:
                "1px solid rgba(244,212,106,.25)",
              color: "#f4d46a",
              padding: "12px 22px",
              borderRadius: "999px",
            }}
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
      <h2
        style={{
          color: "#f4d46a",
          marginBottom: "20px",
        }}
      >
        🔮 Direcionamento Exclusivo
      </h2>

      <p style={{ color: "#fff" }}>
        Escolha a área da sua pergunta.
      </p>
<select
  value={categoria}
  onChange={(e) => setCategoria(e.target.value)}
  style={{
    width: "100%",
    padding: "14px",
    borderRadius: "12px",
    marginTop: "20px",
    marginBottom: "20px",
    background: "#2a0738",
    color: "#f4d46a",
    border: "1px solid rgba(244,212,106,.25)",
    outline: "none",
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
  onChange={(e) => setPergunta(e.target.value)}
  placeholder="Digite sua pergunta para a Cigana Estella..."
  rows={6}
  style={{
    width: "100%",
    padding: "15px",
    borderRadius: "12px",
    marginBottom: "20px",
    background: "#2a0738",
    color: "#fff",
    border: "1px solid rgba(244,212,106,.25)",
    outline: "none",
  }}
/>
      <button
  onClick={enviarPergunta}
  style={{
    marginTop: "20px",
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
    marginTop: "20px",
    background: "#5b0c8c",
    border: "none",
    color: "#fff",
    padding: "12px 20px",
    borderRadius: "999px",
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